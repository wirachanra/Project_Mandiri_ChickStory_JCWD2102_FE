import {
  Flex, Box, Text, Avatar, Input, Textarea, Select, Modal, ModalCloseButton,
  ModalOverlay, ModalHeader, ModalBody, useDisclosure,
  FormControl, Button, useToast, Link, FormLabel, FormHelperText, ModalContent
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { userEdit } from '../../redux/action/userEdit';
import { axiosInstance } from '../../lib/api';
import ModalProfPicture from './ModalProfPict';
import * as Yup from "yup";
import qs from 'qs';
import ChangePassButton from './ChangePassButton';

export default function UserProfile() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedFile, setSelectedFile] = useState(null)
  const toast = useToast();
  const dispatch = useDispatch()
  const autoRender = useSelector((state) => state.automateRendering)
  const inputFileRef = useRef(null);
  const router = useRouter();
  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const userSelector = useSelector((state) => (state.auth))
  const image = userSelector.image_url;

  const formik = useFormik({
    initialValues: {
      full_name: `${userSelector.full_name}`,
      username: `${userSelector.username}`,
      phone_no: `${userSelector.phone_no}`,
      website: `${userSelector.web}`,
      gender: `${userSelector.gender}`,
      bio: `${userSelector.bio}`,
      id: userSelector.id,
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Username is required"),
      full_name: Yup.string().required("full name is required"),
    }),
    validateOnChange: false,
    onSubmit: async () => {
      // dispatch(userEdit(values, formik.setSubmitting))
      const { full_name, username, phone_no, website, gender, bio } = formik.values
      try {
        let body = {
          full_name: full_name,
          username: username,
          phone_no: phone_no,
          web: website,
          gender: gender,
          bio: bio,
        };
        const res = await axiosInstance.patch(`/user/${userSelector.id}`, qs.stringify(body));
        dispatch({
          type: "AUTH_LOGIN",
          payload: res.data.user
        })
        toast({
          title: "Profile update success",
          status: "success",
          isClosable: true,
        })
        // dispatch({
        //   type: "FETCH_RENDER",
        //   payload: { value: !autoRender.value }
        // })
      } catch (err) {
        console.log(err);
        toast({
          title: "Username has been taken",
          status: "error",
          isClosable: true,
        })
      }
    }
  })


  return (
    <Flex wrap={'wrap'} alignContent='center' justifyContent='center' maxW='800px' bg='#ffffff' borderWidth='1px' borderRadius="3" >
      <Box h='80px' w='330px' mt='15px'>
        <Box display='flex' mt='10px'>
          <Avatar
            src={`http://${userSelector.image_url}`}
          />
          <Box ml='15px'>
            <Text fontWeight='bold' fontSize='lg'>
              {userSelector.username}
            </Text>
            <Link onClick={onOpen} style={{ textDecoration: 'none' }}>
              <Text color={'blue.400'}
                fontWeight='semibold'>Change profile picture</Text>
            </Link>
            <Modal isOpen={isOpen} onClose={onClose} size='md'>
              <ModalOverlay />
              <ModalProfPicture onClose={onClose} />
            </Modal>
          </Box>
        </Box >
      </Box >
      <Box h='0px' w='330px'></Box>

      {/* -------------------- Full Name -------------------- */}
      <Box w='330px' mt='10px'>
        <Text fontWeight='bold' my='7px'>
          Name
        </Text>
      </Box>
      <Box w='330px' mt='10px'>
        {/* {formik.values.full_name} */}
        <FormControl isInvalid={formik.errors.full_name}>
          <Input type='text'
            defaultValue={userSelector.full_name}
            onChange={(event) => formik.setFieldValue("full_name", event.target.value)}></Input>
          <FormHelperText color='red'>{formik.errors.full_name}</FormHelperText>
        </FormControl>
        <Text fontSize='xs' color='#919191'>
          Help people find your account using a name that people recognize about you: whether your full name, nickname, or business name.
        </Text>
      </Box>

      {/* -------------------- Username -------------------- */}
      <Box w='330px' mt='10px'>
        <Text fontWeight='bold' my='7px'>
          Username
        </Text>
      </Box>
      <Box w='330px' mt='10px'>
        <FormControl isInvalid={formik.errors.username}>
          <Input type='text' defaultValue={userSelector.username}
            onChange={(event) => formik.setFieldValue("username", event.target.value)}></Input>
          <FormHelperText color='red'>{formik.errors.username}</FormHelperText>
        </FormControl>
      </Box>

      {/* -------------------- Website -------------------- */}
      <Box w='330px' mt='10px'>
        <Text fontWeight='bold' my='7px'>
          Website
        </Text>
      </Box>
      <Box w='330px' mt='10px'>
        <FormControl isInvalid={formik.errors.website}>
          <Input type='text' placeholder='website' defaultValue={userSelector.web}
            onChange={(event) => formik.setFieldValue("website", event.target.value)}></Input>
        </FormControl>
      </Box>

      {/* -------------------- Biodata -------------------- */}
      <Box w='330px' mt='10px'>
        <Text fontWeight='bold' my='7px'>
          Bio
        </Text>
      </Box>
      <Box w='330px' mt='10px'>
        <FormControl isInvalid={formik.errors.bio}>
          <Textarea type='text' placeholder='Bio' defaultValue={userSelector.bio}
            onChange={(event) => formik.setFieldValue("bio", event.target.value)}></Textarea>
        </FormControl>
        <Text fontSize='sm' color='#919191' fontWeight='bold' mt='10px'>
          PERSONAL INFORMATION
        </Text>
        <Text fontSize='xs' color='#919191'>
          Provide your personal information, even if the account is used for business, pets or other things. It will not be part of your public profile.
        </Text>
      </Box>

      <Box w='330px' mt='10px'>
        <Text fontWeight='bold' my='7px'>
          E-mail
        </Text>
      </Box>
      <Box w='330px' mt='10px'>
        <FormControl>
          <Input type='text' disabled defaultValue={userSelector.email}></Input>
        </FormControl>
      </Box>

      <Box w='330px' mt='10px'>
        <Text fontWeight='bold' my='7px'>
          Phone Number
        </Text>
      </Box>
      <Box w='330px' mt='10px'>
        <FormControl isInvalid={formik.errors.phone_no}>
          <Input type='number' maxLength='12' placeholder='Phone Number' defaultValue={userSelector.phone_no}
            onChange={(event) => formik.setFieldValue("phone_no", event.target.value)}></Input>
          <FormHelperText color='red'>{formik.errors.phone_no}</FormHelperText>
        </FormControl>
      </Box>

      <Box w='330px' mt='10px'>
        <Text fontWeight='bold' my='7px'>
          Gender
        </Text>
      </Box>
      <Box w='330px' mt='10px'>
        <FormControl isInvalid={formik.errors.gender}>
          <Select onChange={(event) => formik.setFieldValue("gender", event.target.value)} defaultValue={userSelector.gender}>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
            <option value='Other'>Other</option>
          </Select>
        </FormControl>
      </Box>

      <Box w='330px' mt='10px'>
        <Text fontWeight='bold' my='7px'>
          Change Password
        </Text>
      </Box>
      <Box w='330px' mt='10px'>
        <ChangePassButton
          getEmail={userSelector.email} />
      </Box>

      <Box w='330px' mt='10px' mb='15px'>
      </Box>
      <Box w='330px' mt='10px' mb='15px'>
        <FormControl>
          <Button colorScheme='twitter' onClick={() => {
            async function submit() {
              await formik.handleSubmit();
              // toast({
              //   title: "Profile update success",
              //   status: "success",
              //   isClosable: true,
              // })
            }
            submit()
          }}
          // disabled={
          //   formik.values.full_name != userSelector.full_name ? false : true}
          // formik.values.username == userSelector.username ||
          // formik.values.phone_no == userSelector.phone_no
          // formik.values.username.match(userSelector.username) ||
          // formik.values.phone_no.match(userSelector.phone_no) ||
          // formik.values.website.match(userSelector.website) ||
          // formik.values.gender.match(userSelector.gender) ||
          // formik.values.bio.match(userSelector.bio) ? true : false}
          > Submit</Button>
        </FormControl>
      </Box>
    </Flex >
  )
}