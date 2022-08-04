import {
  Button, ModalBody, ModalHeader,
  ModalContent, ModalCloseButton, FormControl,
  FormLabel, Input, Box, Textarea, useToast, Image
} from '@chakra-ui/react'
import { useFormik } from "formik";
import { useState, useRef, useEffect } from 'react';
import { axiosInstance } from '../../../lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import qs from 'qs'

export default function EditContent(props) {
  const { captionEd, locationEd, imageUrlEd, idEd, onClose } = props;
  const [selectedFile, setSelectedFile] = useState(null)
  const autoRender = useSelector((state) => state.automateRendering)
  const router = useRouter();
  const dispatch = useDispatch()
  const userSelector = useSelector((state) => state.auth)
  const toast = useToast()
  const inputFileRef = useRef(null)

  const formik = useFormik({
    initialValues: {
      caption: `${captionEd}`,
      location: `${locationEd}`
    },
    onSubmit: async () => {
      // const formData = new FormData();
      const { caption, location } = formik.values

      // formData.append("caption", caption)
      // formData.append("location", location)
      try {
        let body = {
          caption,
          location
        }

        await axiosInstance.patch("/post/" + idEd, qs.stringify(body)).then(() => {
          dispatch({
            type: "FETCH_RENDER",
            payload: { value: !autoRender.value }
          })
          toast({
            title: `Post has been edit`,
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
  }

  return (
    <>
      <ModalContent>
        <ModalHeader>Edit Content</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box display='flex' flexWrap='wrap' justifyContent='space-evenly'>

            <Box maxW='400px' maxH='350px' objectFit='fill'>
              <Image src={`http://${imageUrlEd}`} w='400px' h='350px' objectFit='cover' rounded={5} />
            </Box>

            <Box mt='10px'>
              <FormControl>
                <FormLabel>Caption {formik.values.caption}</FormLabel>
                <Textarea placeholder='Write a caption . . .' maxLength='2000' w='400px' h='150px'
                  onChange={(e) => {
                    formik.setFieldValue("caption", e.target.value)
                  }} defaultValue={captionEd} />
              </FormControl>

              <FormControl mt='10px'>
                <FormLabel>Location</FormLabel>
                <Input placeholder='Location' maxLength='2000' w='400px'
                  onChange={(e) => {
                    formik.setFieldValue("location", e.target.value)
                  }} defaultValue={locationEd} />
              </FormControl>
              <Box mt={'17px'} justifyContent='flex-end'>
                <Button mr={3} colorScheme='twitter' onClick=
                  {() => {
                    async function submit() {
                      await formik.handleSubmit();
                      onClose();
                    }
                    submit()
                  }}>
                  Edit Post
                </Button>
              </Box>
            </Box>
          </Box>

        </ModalBody>
      </ModalContent>
    </>
  )
}