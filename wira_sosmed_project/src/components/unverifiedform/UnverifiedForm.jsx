import { Box, Button, Heading, Text, Flex, Spinner, useToast } from '@chakra-ui/react'
import Image from 'next/image';
import imgemail from '../../assets/imgs/emailsend.gif'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { axiosInstance } from '../../lib/api';
import qs from 'qs';

export default function UnverifiedForm() {
  const userSelector = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (!userSelector?.id) {
      // setIsLoading(true);
      router.push("/home");
    } else {
      setIsLoading(false);
    }
  }, [userSelector?.id]);

  // ---------- Resend Verification email ---------- //
  function resendEmail() {
    try {
      let body = {
        id: userSelector.id,
        username: userSelector.username,
        email: userSelector.email
      }
      console.log(body);
      axiosInstance.post("/user/resendVerification", qs.stringify(body))

      toast({
        title: "Succes re-send email",
        description: "Check your email for verification",
        status: "success",
        isClosable: true,
      })
    } catch (err) {
      console.log(err)
    }
  };

  return (
    // {/* // ---------- Unverified Form ---------- // 
    <>
      {
        isLoading ?
          <>
            < Spinner thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl' /> &nbsp; loading...
          </>
          :
          <>
            <Box align='center'>
              {/* ---------- Heading ---------- */}
              <Heading> Verify Your Account</Heading>
              {/* <Text>Check your email & click the link to activate your Account</Text> */}
              {/* <Text>In order to start using your ChickStory account, you need to confirm your email address</Text> */}
              <Text mt='15px'>Welcome to ChicStory, Before we get started, please confirm your email address or resend the email verification.</Text>
              <Box maxW='320px' maxH='320px'>
                <Image src={imgemail}></Image>
              </Box>
              <Button colorScheme='twitter' mt={'15px'} onClick={() => resendEmail()}>Resend Email</Button>
            </Box>
          </>
      }
    </>

  )
}