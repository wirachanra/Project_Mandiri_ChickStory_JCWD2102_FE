import { Flex, Box, Link, Image, Button, Text, Heading, Spinner } from '@chakra-ui/react'
import NextImage from 'next/image'
import { useRouter } from 'next/router'
import imagenf from '../assets/imgs/404.gif'
import Page from '../components/metatag/Metatag'


const NotFound = () => {
 const router = useRouter()
 const url = "http://localhost:3000" + router.pathname;

 return (
  <Page title={"404 Page Not Found"} description={"Page not found"}
   url={url} type="website">
   <Flex flexWrap={'wrap'} minH={'80vh'} minW='480px' justifyContent={'center'} >
    <Box display='flex' top={0} justifyContent={'center'} >
     <Box position='absolute' zIndex={2} mt='30px' textAlign='center' boxShadow='md' p='6' rounded='md' bg='white' backdropContrast='30%'>
      <Heading >Sorry the page 'NOT FOUND'</Heading>
      <Text >The link you followed probably broken or the page has been removed</Text>
     </Box>
     <Link href='/' mt='530px' style={{ textDecoration: 'none' }} position='absolute' zIndex={2}>
      <Button colorScheme='twitter'>Back To Home</Button>
     </Link>
     <NextImage src={imagenf} position='absolute' />

    </Box>
   </Flex>
  </Page>

 )

}

export default NotFound