import { Box, Flex, Stack, Container, Spinner } from '@chakra-ui/react';
import Image from 'next/image';
import socialmedia from '../../assets/imgs/socialmedia3.gif'
import SwitchForm from '../../components/auth/SwitchForm';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import Page from '../../components/metatag/Metatag'

export default function login() {
  const userSelector = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const url = "http://localhost:3000" + router.pathname;

  // useEffect(() => {
  //   setIsLoading(true);
  // }, []);

  useEffect(() => {
    if (userSelector?.id) {
      // setIsLoading(true);
      router.push("/home");
    } else {
      setIsLoading(false);
    }
  }, [userSelector?.id]);

  return (
    <Page title={"ChicStory"} description={"Login or Register Chicstory"}
      url={url} type="website">
      <Flex minH={'100vh'} align={'center'} justify={'center'} bg='#F7FAFC' >
        {isLoading ?
          <>
            <Spinner thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl' /> &nbsp; loading...
          </>
          :
          <>
            <Container display='flex' margin='30px' padding='13px' alignItems={'center'} justifyContent={'center'} w={'935px'} maxW={'935px'} h={'550px'} >
              {/* ---------- gambar sebelah form login / register ----------  */}
              <Box width={'500px'} height={'500px'} className='social-img' marginRight='10px' >
                <Image src={socialmedia} alt="Story" />
              </Box>
              {/* ---------- switch form dari component/auth/SwitchForm.jsx untuk merubah form login dan register ----------  */}
              <Stack minW={'350px'} minH={'520px'}>
                <SwitchForm />
              </Stack>
            </Container>
          </>
        }
      </Flex>
    </Page>
  )
}

// kasih loading terus di kasih then habis selesai loading false
