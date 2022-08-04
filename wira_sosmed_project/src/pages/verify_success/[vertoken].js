import { Flex, Box, Button, Icon, Container, Text, FormControl, Input, Link,Spinner } from '@chakra-ui/react'
import { AiFillBell, AiOutlineBell, AiOutlineHome, AiFillHome } from "react-icons/ai";
import Image from 'next/image'
import invalidToken from '../../assets/imgs/invalid.gif'
import testing from '../../assets/imgs/verifieduser.gif'
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import { userVerified } from '../../redux/action/userVerified';
import { axiosInstance } from "../../lib/api"
import { useRouter } from 'next/router';

export default function verify_success() {
  const [verified, setVerified] = useState(false)
  const router = useRouter()
  const { vertoken } = router.query

  useEffect(() => {
   async function updateVer(){
    console.log(vertoken);
    const res= await axiosInstance.patch("/user/verify/"+ vertoken)
    if(res.data) {
     const success = res.data.success
     console.log(success)
     setVerified(success)
    }
   }
   updateVer()
  }, [router.isReady])

 // const dispatch = useDispatch();
 // const userSelector = useSelector((state) => state.auth);
 // const router = useRouter();
 // const formik = useFormik({
 //  initialValues: {
 //   verified_status: 1,
 //   id: userSelector.id,
 //  },
 //  onSubmit: (values) => {
 //   dispatch(userVerified(values, formik.setSubmitting))
 //  }
 // })

 // useEffect(() => {
 //  if (userSelector.verified_status == 1) {
 //   router.push("/home");
 //  }
 // }, [userSelector.verified_status]);

 return (
  <Flex flexWrap={'wrap'} minH={'80vh'} minW='480px' justifyContent={'center'} padding={'30px'}>
   {router.isReady ? 
   <Container align='center'>
    {verified? 
     <>
     <Text fontSize='3xl'>Your Account has been verified!</Text>
    <Box boxSize='md'>
     <Image src={testing} />
    </Box>
    
    <Box>
      <Link href='/home'>
     <Button colorScheme='green' > <Icon boxSize='6' as={AiOutlineHome} mr='5px' /> 
     <Text style={{textDecoration:"none"}}>Back To Home
      </Text> </Button>
      </Link>
    </Box>
     </> 
     : 
     <>
     <Image src={invalidToken}/>
     <Text fontSize='5xl'>Invalid Token</Text>
     <Link href='/' style={{textDecoration:"none"}}>
     <Button colorScheme='green' href='/home'> <Icon boxSize='6' as={AiOutlineHome} mr='5px' /> 
     <Text >Back To Home</Text> </Button>
     </Link>
     </>
    }
    
   </Container>
   :
    <>
    < Spinner thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl' /> &nbsp; loading...
    </>
    }
   
  </Flex>
 )
}