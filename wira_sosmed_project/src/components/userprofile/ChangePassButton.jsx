import { Button, useToast } from '@chakra-ui/react'
import qs from 'qs';
import { useFormik } from "formik";
import { axiosInstance } from '../../lib/api';

export default function ChangePassButton(props) {
 const { getEmail } = props
 const toast = useToast();

 const formik = useFormik({
  initialValues: {
   email: getEmail,
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
  }
 })
 return (
  <>
   <Button colorScheme='black' onClick={formik.handleSubmit}
    fontWeight='bold' className="linkModal" variant='link' style={{ textDecoration: "none" }}>
    Send  Link to Email
   </Button>
  </>
 )
}