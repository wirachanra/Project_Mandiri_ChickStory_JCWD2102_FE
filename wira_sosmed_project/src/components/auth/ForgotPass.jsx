import {
  Button, Modal, Link, ModalBody, ModalHeader, Text,
  ModalContent, ModalCloseButton, ModalOverlay, FormControl,
  FormLabel, Input, Box, useToast
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import qs from 'qs';
import { useFormik } from "formik";
import { axiosInstance } from '../../lib/api';

export default function ForgotPass() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async () => {
      const { email } = formik.values
      try {
        let body = {
          email: email,
        }

        await axiosInstance.post("/user/sendResetPass", qs.stringify(body))
        toast({
          title: `Success send link`,
          title: `We have send link for reset password to your email`,
          status: "success",
          isClosable: true,
        })
      } catch (err) {
        console.log(err);
      }
      formik.setSubmitting(false)
      formik.resetForm('comment_post', "")
    }
  })

  return (
    <>
      <Link onClick={onOpen} color={'blue.400'} style={{ textDecoration: 'none' }} fontWeight='semibold'>Forgot Password?</Link>
      <Modal
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Trouble Logging In?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              {/* <Text>{formik.values.email}</Text> */}
              <FormLabel>Enter your email and we'll send you a link to get back into your account.</FormLabel>
              <Input placeholder='user@email.com'
                onChange={(event) =>
                  formik.setFieldValue("email", event.target.value)} mt={'10px'} maxLength={'40'} />
            </FormControl>
            <Box mt={'17px'}>
              <Button colorScheme='blue' mr={3}
                onClick={
                  () => {
                    async function submit() {
                      await formik.handleSubmit();
                      onClose();
                    }
                    submit()
                  }}
                disabled={formik.values.email.length > 9 ? false : true} >
                Send Link
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}