import NavBar from '../../components/navbar/NavBar'
import { Flex, Spinner } from '@chakra-ui/react'
import ContentUser from '../../components/contentuser/user/ContentUser'
import UnverifiedForm from '../../components/unverifiedform/UnverifiedForm'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import Page from '../../components/metatag/Metatag'

export default function userProfile() {
  const userSelector = useSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const url = "http://localhost:3000" + router.pathname;

  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (!userSelector?.id) {
      // setIsLoading(true);
      router.push("/auth");
    } else {
      setIsLoading(false);
    }
  }, [userSelector?.id]);

  return (
    <>
      <Page title={userSelector.username + " profile"} description={"all content from " + userSelector.username}
        url={url} type="website">
        {isLoading ?
          <Flex minH={'100vh'} align={'center'} justify={'center'} bg='#F7FAFC' >
            <Spinner thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl' /> &nbsp; loading...
          </Flex>
          :
          <>
            <NavBar />
            <Flex flexWrap='wrap' minH={'88vh'} minW='480px' justifyContent={'center'} padding={'30px'} bg='#F7FAFC'>
              {userSelector.verified_status == false ?
                <UnverifiedForm /> :
                <ContentUser />}
            </Flex>
          </>}
      </Page>
    </>
  )
}