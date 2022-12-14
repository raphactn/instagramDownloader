import {
  Button,
  Input,
  Flex,
  Center,
  SimpleGrid,
  Container,
  Image,
  Spinner,
  Box,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ListResultsServices } from "../services/ListResultsServices";
import Nav from "../components/Navbar";
import { BsCameraVideo, BsImages } from "react-icons/bs";

export default function Home({ data, error, typeMedia }: any) {
  const [url, setUrl] = useState("");
  const [urlVideo, setUrlVideo] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);
  const [dataPage, setDataPage] = useState([]);
  const router = useRouter();
  const toast: any = useToast();

  const handleGetMedia = () => {
    if (url !== "" || urlVideo !== "") {
      setLoadingPage(true);
      setDataPage([]);
      router.replace({
        query: {
          url: url ? url : urlVideo,
          type: url ? "image" : "video",
        },
      });
      setUrl("")
      setUrlVideo("")
    }
  };

  useEffect(() => {
    if (error) {
      return toast({
        title: "Erro ao trazer media, tente novamente mais tarde :(",
        status: "error",
        isClosable: true,
      });
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setLoadingPage(false);
      setDataPage(data);
    }
  }, [data]);

  const downloadImage = (url: string, name: string) => {
    fetch(url)
      .then((resp) => resp.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => alert("An error sorry"));
  };

  return (
    <div>
      <Head>
        <title>Instagram - Tools</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <Nav />
      <Container maxW="1000px">
        <Tabs variant="enclosed" mt={10}>
          <TabList justifyContent={"center"}>
            <Tab>
              <BsImages fontSize={"30px"} />
            </Tab>
            <Tab>
              <BsCameraVideo fontSize={"30px"} />
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Center gap={2}>
                <Input
                value={url}
                  placeholder="Adicione a URL da imagem aqui ou link do perfil"
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button variant={"outline"} onClick={handleGetMedia}>
                  Buscar
                </Button>
              </Center>
            </TabPanel>
            <TabPanel>
              <Center gap={2}>
                <Input
                value={urlVideo}
                  placeholder="Adicione a URL do video"
                  onChange={(e) => setUrlVideo(e.target.value)}
                />
                <Button variant={"outline"} onClick={handleGetMedia}>
                  Buscar
                </Button>
              </Center>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Center mt={50} flexDirection="column" gap={2}>
          {dataPage ? (
            <SimpleGrid columns={{base: 1, md: 4}} spacing={10} mb={10}>
              {dataPage?.map((item: string, i: number) => (
                <Box key={i}>
                  <Flex direction="column">
                    {typeMedia === "image" ? (
                      <Image
                        borderTopEndRadius={"md"}
                        borderTopStartRadius={"md"}
                        crossOrigin="anonymous"
                        src={`https://cors-anywhere.herokuapp.com/${item}`}
                        width={400}
                      />
                    ) : (
                      <video crossOrigin="anonymous" controls={true} autoPlay={false}>
                        <source
                          src={`https://cors-anywhere.herokuapp.com/${item}`}
                          type="video/mp4"
                        />
                      </video>
                    )}
                    <Button
                      borderTopEndRadius={0}
                      borderTopStartRadius={0}
                      onClick={() =>
                        downloadImage(
                          `https://cors-anywhere.herokuapp.com/${item}`,
                          `media.${typeMedia === 'image' ? 'png' : 'mp4'}`
                        )
                      }
                    >
                     {typeMedia === 'image' ? 'Baixar imagem' : 'Baixar video'}
                    </Button>
                  </Flex>
                </Box>
              ))}
            </SimpleGrid>
          ) : null}
          {loadingPage ? <Spinner /> : null}
        </Center>
      </Container>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const data = ctx.query.url ? ctx.query.url : "";
  const type = ctx.query.type ? ctx.query.type : "";

  if (data !== "") {
    const { result, error, typeMedia } = await ListResultsServices({
      data,
      type,
    });
    return {
      props: {
        data: result,
        error,
        typeMedia,
      },
    };
  }
  return {
    props: {},
  };
};
