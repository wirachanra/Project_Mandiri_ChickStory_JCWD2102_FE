import {
  Button, ModalBody, ModalHeader,
  ModalContent, ModalCloseButton, FormControl,
  FormLabel, Input, Box, Textarea, useToast, Image
} from '@chakra-ui/react'
import { useFormik } from "formik";
import { useState, useRef, useEffect } from 'react';
import { axiosInstance } from '../../lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import qs from 'qs'
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import uploadLoading from '../../assets/imgs/uploading.gif'
import NextImage from 'next/image'


export default function AddContent(props) {
  const { onClose } = props
  const userSelector = useSelector((state) => state.auth)
  const autoRender = useSelector((state) => state.automateRendering)
  const dispatch = useDispatch()
  const [selectedFile, setSelectedFile] = useState(null)
  const inputFileRef = useRef(null)
  const target = useRef(null)
  const router = useRouter();
  const toast = useToast()
  const [imageShow, setImageShow] = useState(null)

  // const uploader = new Uploader({
  //   // Get production API keys from Upload.io
  //   apiKey: "free"
  // });

  const formik = useFormik({
    initialValues: {
      caption: "",
      location: ""
    },
    onSubmit: async () => {
      const formData = new FormData();
      const { caption, location } = formik.values

      try {
        // ---------- form data for add to Post table ---------- //
        formData.append("caption", caption)
        formData.append("location", location)
        formData.append("user_id", userSelector.id)
        formData.append("image", selectedFile)

        // ---------- body for edit or increase the total post in database ---------- //
        let body = {
          total_post: userSelector.total_post + 1,
        }
        console.log(userSelector.total_post);

        await axiosInstance.patch("/user/" + userSelector.id, qs.stringify(body))
        await axiosInstance.post("/post", formData).then(() => {
          dispatch({
            type: "FETCH_RENDER",
            payload: { value: !autoRender.value }
          })

          toast({
            title: `Post has been added`,
            status: "success",
            isClosable: true,
          })
        })
      } catch (err) {
        console.log(err);
        toast({
          title: 'ERROR',
          status: "error",
          isClosable: true,
        })
      }
    }
  })


  const handleFile = (event) => {
    setSelectedFile(event.target.files[0])
    const uploaded = event.target.files[0];
    setImageShow(URL.createObjectURL(uploaded))
    // console.log(event.target.files[0]);
  }

  return (
    <>
      <ModalContent>
        <ModalHeader>Create new post</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>

          <Box display='flex' flexWrap='wrap' justifyContent='space-evenly'>
            {/* <UploadButton uploader={uploader}
              options={{ multi: true }}
              onComplete={files => console.log(files)}>
              {({ onClick }) =>
                <button onClick={onClick}>
                  Upload a file...
                </button>
              }
            </UploadButton> */}
            <Box minW='400px' minH='300px' >
              <FormControl>
                <FormLabel> Image </FormLabel>
                <Box>
                  <Box w='400px' h='300px' rounded='lg' >
                    {imageShow !==
                      <NextImage src={uploadLoading} rounded='lg' />
                      && <Image src={imageShow} objectFit='cover' w='400px' h='300px' rounded='lg' />}
                  </Box>
                  <Input type='file' onChange={handleFile} hidden
                    accept={"image/png, image/jpg, image/jpeg"} ref={inputFileRef} />
                  <Button background='#72FFFF' mt='5px' size='sm' onClick={() => inputFileRef.current.click()} >Upload Image</Button>
                  <Button size='sm' mt='5px' ml='5px' background='#FFB4B4' onClick={() => {
                    setImageShow(null)
                    setSelectedFile(null)
                  }}>Cancel</Button>
                </Box>
              </FormControl>
            </Box>

            <Box mt='10px'>
              <FormControl>
                <FormLabel>Caption</FormLabel>
                <Textarea placeholder='Write a caption . . .' maxLength='2000' w='400px' h='180px'
                  onChange={(e) => {
                    formik.setFieldValue("caption", e.target.value)
                  }} />
              </FormControl>

              <FormControl mt='10px'>
                <FormLabel>Location</FormLabel>
                <Input placeholder='Location' maxLength='2000' w='400px'
                  onChange={(e) => {
                    formik.setFieldValue("location", e.target.value)
                  }} />
              </FormControl>
              <Box mt={'17px'} justifyContent='flex-end'>
                <Button mr={3} colorScheme='twitter' disabled={imageShow == null ? true : false} onClick=
                  {() => {
                    async function submit() {
                      await formik.handleSubmit();
                      onClose();
                    }
                    submit()
                  }}>
                  Create Post
                </Button>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent >
    </>
  )
}