import {
  Box, Flex, Text, Divider, Button, Icon, Tooltip, useDisclosure, ModalFooter
  , useToast, Modal, ModalBody, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, Input, Stack, FormControl, FormHelperText, Link
} from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { IoIosSave } from "react-icons/io";
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from "../../../../lib/api";
import { useFormik } from "formik";
import qs from 'qs';
import * as Yup from "yup";

export default function CommentPost(props) {
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
  const { cmUsername, cmDate, cmComment, cmPostId, cmUserId, cmId, cmNumComment } = props
  const userSelector = useSelector((state) => state.auth)
  const autoRender = useSelector((state) => state.automateRendering)
  const dispatch = useDispatch()
  const toast = useToast();
  const [editInput, setEditInput] = useState(false)

  // -------------------- Delete Comment Post -------------------- //
  async function deleteComment() {
    try {
      let body = {
        number_of_comments: cmNumComment - 1,
      }
      await axiosInstance.delete("/comment/" + cmId)
      await axiosInstance.patch("/post/" + cmPostId, qs.stringify(body))
      dispatch({
        type: "FETCH_RENDER",
        payload: { value: !autoRender.value }
      })
      toast({
        title: "Succes",
        description: "Succes deleting Comment",
        status: "success",
        isClosable: true,
      })
    } catch (err) {
      console.log(err);
    }
  }
  // -------------------- Edit Comment Post -------------------- //
  const formik = useFormik({
    initialValues: {
      comment_post: `${cmComment}`,
    },
    validationSchema: Yup.object().shape({
      comment_post: Yup.string().required("Edit Comment is required")
    }),
    validateOnChange: false,
    onSubmit: async () => {
      const { comment_post } = formik.values
      try {
        let body = {
          comment_post,
        }
        await axiosInstance.patch("/comment/" + cmId, qs.stringify(body)).then(() => {
          setEditInput(false)
          dispatch({
            type: "FETCH_RENDER",
            payload: { value: !autoRender.value }
          })
          toast({
            title: `Comment has been edit`,
            status: "success",
            isClosable: true,
          })
        })
      } catch (err) {
        console.log(err);
      }
    }
  })

  return (
    <>
      <Divider />
      <Box display='flex' justifyContent='space-between'>
        <Box>
          <Flex>
            <Link href={'/contentuser/' + cmUserId} style={{ textDecoration: "none" }}>
              <Text fontWeight='bold' textColor='gray.800' fontSize='sm' className='linkModal'>
                {cmUsername}
              </Text>
            </Link>

            &nbsp;
            <Text fontWeight='semibold' fontSize='sm' textColor='gray.800'>{moment(cmDate).format('DD-MMMM-YYYY')}</Text>
          </Flex>
          <Text fontWeight='semibold' fontSize='xs' mt='-8px' textColor='gray.400'>{moment(cmDate).fromNow()}</Text>

          <Box w='390px'>
            {!editInput ?
              <Text fontWeight='semibold' fontSize='sm' textColor='gray.600'>
                {cmComment}
              </Text> :
              <FormControl isInvalid={formik.errors.comment_post}>
                {/* <Text>{formik.values.comment_post}</Text> */}
                <Input size='sm' mb='5px' type='text' maxLength='300'
                  onChange={(event) =>
                    formik.setFieldValue("comment_post", event.target.value)}
                  defaultValue={cmComment} />
                <FormHelperText color="red">
                  {formik.errors.comment_post}
                </FormHelperText>
              </FormControl>
            }
          </Box>
        </Box>

        <Box mt='5px'>
          {userSelector.id == cmUserId ?
            !editInput ?
              <>
                <Tooltip label='Edit Comment' fontSize='sm' >
                  <Button variant='link' color='#EF5B0C' mr='5px' my='5px' size='sm' onClick={() => setEditInput(true)}>
                    <Icon boxSize={4} as={FaEdit} />
                  </Button>
                </Tooltip>
                <Tooltip label='Delete Comment' fontSize='sm' >
                  <Button variant='link' color='#395B64' size='sm' onClick={onOpenDelete}>
                    <Icon boxSize={4} as={FaTrashAlt} />
                  </Button>
                </Tooltip>
              </> :
              <>
                <Tooltip label='Save' fontSize='sm' >
                  <Button variant='link' colorScheme='green' mr='5px' my='5px' size='sm'
                    onClick=
                    {() => {
                      async function submit() {
                        await formik.handleSubmit();
                      }
                      submit()
                    }}>
                    <Icon boxSize={5} as={IoIosSave} />
                  </Button>
                </Tooltip>
                <Tooltip label='Cancel' fontSize='sm' >
                  <Button variant='link' colorScheme='red' size='sm' onClick={() => setEditInput(false)}>
                    <Icon boxSize={5} as={IoCloseSharp} />
                  </Button>
                </Tooltip>
              </>
            :
            null
          }
          <Modal isOpen={isOpenDelete} onClose={onCloseDelete} size='xs'>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete Comment</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box justifyContent={'space-between'}>
                  <Text>Are you sure want to delete this comment?</Text>
                </Box>
              </ModalBody>
              <ModalFooter pt='5px'>
                <Button colorScheme='blue' mr={3} onClick={onCloseDelete}>
                  Close
                </Button>
                <Button mr={3} colorScheme='red' onClick={() => {
                  async function submit() {
                    await deleteComment();
                    onCloseDelete();
                  }
                  submit()
                }}>
                  Delete
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    </>
  );
};
