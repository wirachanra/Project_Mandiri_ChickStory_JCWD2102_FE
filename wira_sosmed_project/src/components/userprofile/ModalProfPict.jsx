import {
 Button, ModalBody, ModalHeader,
 ModalContent, ModalCloseButton, ModalOverlay, FormControl,
 FormLabel, Input, Box, useToast, Image
} from '@chakra-ui/react'
import { useFormik } from "formik";
import { useState, useRef } from 'react';
import { axiosInstance } from '../../lib/api';
import { useDispatch, useSelector } from 'react-redux'
import NextImage from 'next/image'
import uploadLoading from '../../assets/imgs/test.jpg'

export default function ModalProfPicture(props) {
 const { onClose } = props
 const dispatch = useDispatch()
 const autoRender = useSelector((state) => state.automateRendering)
 const [selectedFile, setSelectedFile] = useState(null);
 const [imageShow, setImageShow] = useState(null)
 const userSelector = useSelector((state) => (state.auth))

 const toast = useToast();

 const inputFileRef = useRef(null);

 const handleFile = (event) => {
  setSelectedFile(event.target.files[0]);
  const uploaded = event.target.files[0];
  setImageShow(URL.createObjectURL(uploaded))
 };

 const formik = useFormik({
  initialValues: {
  },
  onSubmit: async () => {
   const formData = new FormData();
   formData.append("image", selectedFile);

   try {
    await axiosInstance.patch("/user/uploadProfile/" + userSelector.id, formData).then(() => {
     dispatch({
      type: "FETCH_RENDER",
      payload: { value: !autoRender.value }
     })
     toast({
      title: "Profile Picture changed",
      status: "success",
      isClosable: true,
     });
    })
   } catch (err) {
    console.log(err);

    toast({
     title: "Error",
     status: "error",
     isClosable: true,
    });
   }
  }
 })

 return (
  <>
   <ModalContent>
    <ModalHeader>Add Photo</ModalHeader>
    <ModalCloseButton />
    <ModalBody pb={6} align='center'>
     <Box minW='400px' minH='300px' justifyContent='center'>
      <FormControl >
       {imageShow !==
        < NextImage src={uploadLoading} rounded='lg' w='300px' h='300px' />
        && <Image src={imageShow} objectFit='cover' w='300px' h='300px' rounded='full' />}
       <Input type='file' onChange={handleFile} hidden
        accept={"image/png, image/jpg, image/jpeg"} ref={inputFileRef} />
       <Button background='#72FFFF' mt='5px' size='sm' onClick={() => inputFileRef.current.click()} >Upload Image</Button>
       <Button size='sm' mt='5px' ml='5px' background='#FFB4B4' onClick={() => setImageShow(null)}>Cancel</Button>
      </FormControl>
      <FormControl align={"right"}>
       <Button colorScheme={"green"} disabled={imageShow == null ? true : false} onClick=
        {() => {
         async function submit() {
          await formik.handleSubmit();
          onClose();
         }
         submit()
        }}>
        Submit
       </Button>
      </FormControl>
     </Box>
    </ModalBody>
   </ModalContent>
  </>
 )
}