import { Flex, Spinner } from "@chakra-ui/react";
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from "next/router";

export default function Home() {
  const userSelector = useSelector((state) => state.auth);
  const router = useRouter();

    useEffect(() => {
    if (userSelector?.id) {
      router.push("/home");
    } else {
      router.push("/auth");
    }
  }, [userSelector?.id]);
  
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      id="background-image">
        <Spinner thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size='xl'/> &nbsp; Loading . . .
    </Flex>
  );
}
