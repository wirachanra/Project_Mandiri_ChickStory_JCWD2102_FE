import {
  Box, Text, Stack, Heading, Button, InputGroup, Icon, FormHelperText, Progress,
  InputRightAddon, FormControl, FormLabel, Input
} from '@chakra-ui/react';
import { useState } from 'react';
import Image from 'next/image';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import logogambar from '../../assets/imgs/ChicStorylogo.png'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { axiosInstance } from "../../lib/api"
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import qs from 'qs';

export default function ChangePassForm() {
  const [passwordView, setPasswordView] = useState(false);
  const [passwordViewRep, setPasswordViewRep] = useState(false);
  const userSelector = useSelector((state) => state.auth)
  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      password: "",
      repassword: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string().required("Password is required")
        .min(8, 'Password should be of minimum 8 characters length')
        .matches(/\w*[a-z]\w*/, "Must contain min 8 Characters, UPPERCASE, lowercase, number and special character") // lower
        .matches(/\w*[A-Z]\w*/, "Must contain min 8 Characters, UPPERCASE, lowercase, number and special character") // upper
        .matches(/\d/, "Must contain min 8 Characters, UPPERCASE, lowercase, number and special character") //must have number
        .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, "Must contain min 8 Characters, UPPERCASE, lowercase, number and special character"), //special char
      repassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Confirm password is required'),
    }),
    validateOnChange: false,
    onSubmit: async () => {
      const { password } = formik.values
      const { restoken } = router.query
      try {
        let body = {
          password: password,
        };
        const res = await axiosInstance.patch(`/user/changePassword/${restoken}`, qs.stringify(body));
        console.log(res);
        console.log(restoken);

        router.push('/')
      } catch (err) {
        console.log(err);
      }
    },
  })

  return (
    <>
      {/* ---------- Change Password form ---------- */}
      <Stack display='flex' minH='450px' maxW={'500px'} justifyContent={'center'} boxShadow='md' bg='#ffffff' borderWidth='1px' borderRadius="3">
        <Box align={"center"} m={'30px'} mb={'0px'}>
          <Image src={logogambar} alt={'Story'} height={'100px'} width={'100px'} />
        </Box>

        {/* ---------- Head Change Password Tittle ---------- */}
        <Stack display='flex' align={"center"} mt={'10px'} mb={'0'}>
          <Heading fontSize={"2xl"} color={'#4A5568'}>Change Password</Heading>
          <Text>Input your new Password</Text>
        </Stack>

        <Stack align={"center"}>
          <Box m={'20px'} width={'300px'}>
            {/* ---------- Password Input ---------- */}
            <FormControl id="password" marginTop={'20px'} mb={'7px'} isInvalid={formik.errors.password}>
              <InputGroup >
                <Input required className="inputPass" maxLength={'30'}
                  type={passwordView ? "text" : "password"}
                  onChange={(event) =>
                    formik.setFieldValue("password", event.target.value)}
                />
                <FormLabel className="labelPass">&nbsp; Password &nbsp;</FormLabel>
                <InputRightAddon>
                  <Icon
                    fontSize="xl"
                    onClick={() => setPasswordView(!passwordView)}
                    as={passwordView ? IoMdEye : IoMdEyeOff}
                    sx={{ _hover: { cursor: "pointer" } }}
                  />
                </InputRightAddon>
              </InputGroup>
              {formik.values.password.length > 7 && formik.values.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/) ?
                <><Progress value={100} size='xs' colorScheme='green' />
                  <Text fontWeight='semibold' color='green'>Strong</Text></> :
                (formik.values.password.length > 5 && formik.values.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])/) ?
                  <><Progress value={75} size='xs' colorScheme='yellow' />
                    <Text fontWeight='semibold' color='#dbe300'>Medium</Text></> :
                  (formik.values.password.length > 4 && formik.values.password.match(/^(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/) ?
                    <><Progress value={50} size='xs' colorScheme='red' />
                      <Text fontWeight='semibold' color='orange'>Weak</Text></> :
                    (formik.values.password.length > 0 && formik.values.password.match(/^(?=.*[a-z])/) ?
                      <><Progress value={25} size='xs' colorScheme='red' />
                        <Text fontWeight='semibold' color='red'>Very weak</Text></> : <></>)))}
              <FormHelperText color='red'>{formik.errors.password}</FormHelperText>
            </FormControl>

            {/* ---------- Sec Password Input ---------- */}
            <FormControl id="repassword" marginTop={'20px'} isInvalid={formik.errors.repassword}>
              <InputGroup >
                <Input required className="inputRePass" maxLength={'30'}
                  type={passwordViewRep ? "text" : "password"}
                  onChange={(event) =>
                    formik.setFieldValue("repassword", event.target.value)}
                />
                <FormLabel className="labelRePass">&nbsp; Repeat Password &nbsp;</FormLabel>
                <InputRightAddon>
                  <Icon
                    fontSize="xl"
                    onClick={() => setPasswordViewRep(!passwordViewRep)}
                    as={passwordViewRep ? IoMdEye : IoMdEyeOff}
                    sx={{ _hover: { cursor: "pointer" } }}
                  />
                </InputRightAddon>
              </InputGroup>
              <FormHelperText color='red'>{formik.errors.repassword}</FormHelperText>
            </FormControl>
          </Box>
        </Stack>
        <Box>
          <Button onClick={formik.handleSubmit} colorScheme='twitter' mb={'20px'} ml={'20px'}>Change Password</Button>
          {/* bgColor='#33bbff' */}
        </Box>
      </Stack>
    </>
  )
}