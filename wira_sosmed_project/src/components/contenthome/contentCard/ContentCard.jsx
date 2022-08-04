import {
  Box, Avatar, Text, Icon, Button, Input, Image, Menu, MenuItem, ModalContent,
  MenuList, MenuButton, useDisclosure, useToast, Link, Modal, ModalOverlay, ModalHeader, ModalCloseButton, ModalBody,
  InputGroup, InputRightElement, Divider, FormControl, Flex, Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Portal
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaRegHeart, FaShareAlt, FaRegComment, FaRegBookmark, FaBookmark, FaRegPaperPlane, FaTrashAlt } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon, TwitterShareButton, TwitterIcon } from "react-share";
import WhoLike from './likes/likes';
import moment from 'moment';
import nextImage from 'next/image';
import NextLink from 'next/link';
import { axiosInstance } from '../../../lib/api';
import EditContent from './EditContent';
import qs from 'qs';
import { useFormik } from "formik";
import * as Yup from "yup";
import CommentPost from './comment';
import { useRouter } from 'next/router';

// Modal.setAppElement("#__next")

function ContentCard(props) {
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
  const { isOpen: isOpenLike, onOpen: onOpenLike, onClose: onCloseLike } = useDisclosure()
  const { isOpen: isOpenShare, onOpen: onOpenShare, onClose: onCloseShare } = useDisclosure()
  // const { isOpen: isOpenPost, onOpen: onOpenPost, onClose: onClosePost } = useDisclosure()
  const { username, avatarImg, location, caption, createdDate, numberOfLikes, numberOfComments, imageUrl, id, idUserLike, idUserPost } = props;
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth)
  const autoRender = useSelector((state) => state.automateRendering)
  const [comments, setComments] = useState([]);
  const [whoLikePost, setWhoLikePost] = useState([])
  const [numLikes, setNumLikes] = useState(numberOfLikes)
  // const [numComments, setNumComments] = useState(numberOfComments)
  const [displayCommentInput, setDisplayCommentInput] = useState(false);
  const [displayLikeInput, setDisplayLikeInput] = useState(idUserLike)
  const [displaySaveInput, setDisplaySaveInput] = useState(false)
  const [scrollBehavior, setScrollBehavior] = useState('inside')
  const [startComment, setStartComment] = useState(2)
  const [linkCopy, setLinkCopy] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  // async function linkForCopy() {
  //   setCopied(true)
  // }

  // -------------------- Delete Post Content -------------------- //
  async function deletePost() {
    try {
      // ---------- body for edit or decrement the total post in database ---------- //
      let body = {
        total_post: userSelector.total_post - 1,
      }
      // console.log(userSelector.total_post);

      await axiosInstance.patch("/user/" + userSelector.id, qs.stringify(body))
      await axiosInstance.delete("/post/" + id)
      dispatch({
        type: "FETCH_RENDER",
        payload: { value: !autoRender.value }
      })

      toast({
        title: "Succes",
        description: "Succes deleting Post",
        status: "success",
        isClosable: true,
      })
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: err.toString(),
        status: "error",
        isClosable: true,
      })
    }
  }

  // -------------------- Like Post Content -------------------- //
  // ---------- Add and Delete Like ---------- //
  const handleLikeInput = async () => {
    // if (!idUserLike) {
    if (!displayLikeInput) {
      setNumLikes(numLikes + 1)
      setDisplayLikeInput(true)
      try {
        let body = {
          number_of_likes: numLikes + 1,
        }
        let body2 = {
          user_id: userSelector.id,
          post_id: id
        }

        await axiosInstance.patch('/post/' + id, qs.stringify(body))
        await axiosInstance.post('/like', qs.stringify(body2))
        dispatch({
          type: "FETCH_RENDER",
          payload: { value: !autoRender.value }
        })
      } catch (err) {
        console.log(err);
      }
    } else {
      setNumLikes(numLikes - 1)
      setDisplayLikeInput(false)
      try {
        let body = {
          number_of_likes: numLikes - 1,
        }
        await axiosInstance.patch('/post/' + id, qs.stringify(body))
        await axiosInstance.delete(`/like/user/${userSelector.id}/post/${id}`)
        dispatch({
          type: "FETCH_RENDER",
          payload: { value: !autoRender.value }
        })
      } catch (err) {
        console.log(err);
      }
    }
  };

  // ---------- Fetching who Like Content Post ---------- //
  async function fetchWhoLikePost() {
    try {
      axiosInstance.get("/like/post/" + id)
        .then((res) => {
          setWhoLikePost(res.data.result)
          const temp = res.data.result
          console.log(temp)

          // console.log(temp[0].User)
        })
    } catch (err) {
      console.log(err)
    }
  };

  const renderWhoLikePost = () => {
    return whoLikePost.map((val, index) => {
      return (
        <WhoLike key={index}
          slImg_Url={val.User?.image_url}
          slUsername={val.User?.username}
          slFullname={val.User?.full_name}
          slUserId={val.User?.id}
        />
      )
    })
  }

  useEffect(() => {
    fetchWhoLikePost()
  }, [autoRender]);

  // -------------------- Comment Post Content -------------------- //
  // ---------- Add Comment ---------- //
  const formik = useFormik({
    initialValues: {
      comment_post: "",
    },
    onSubmit: async () => {
      const { comment_post } = formik.values
      try {
        let body = {
          comment_post: comment_post,
          user_id: userSelector.id,
          post_id: id
        }
        let body2 = {
          number_of_comments: numberOfComments + 1,
        }
        // setNumComments(numComments + 1)
        await axiosInstance.patch("/post/" + id, qs.stringify(body2))
        await axiosInstance.post("/comment", qs.stringify(body))
        dispatch({
          type: "FETCH_RENDER",
          payload: { value: !autoRender.value }
        })
        toast({
          title: `Comment send`,
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

  // ---------- Fetching Comments ---------- //
  async function fetchCommentPost() {
    try {
      // axiosInstance.get(`/comment/post/${id}?page=${startComment}&limit=${5}`)
      axiosInstance.get(`/comment/post/${id}`)
        .then((res) => {
          setComments(res.data.result)
          const temp = res.data.result
          // console.log(temp)
        })
    } catch (err) {
      console.log(err)
    }
  };

  const loadMore = async () => {
    const req = await axiosInstance.get(`/comment/post/${id}?page=${startComment}&limit=${5}`)
    const OldComment = req.data.result
    setStartComment(startComment + 1)
    setComments([...comments, ...OldComment])
    // console.log(startComment);
    console.log(startComment)
    console.log(comments.length)
    console.log(req.data.result);
    // console.log(comments.length);
  }

  const renderCommentPost = () => {
    return comments.map((val, index) => {
      return (
        <CommentPost key={index}
          cmUsername={val.User?.username}
          cmDate={val.createdAt}
          cmComment={val.comment_post}
          cmUserId={val.user_id}
          cmPostId={val.post_id}
          cmId={val.id}
          cmNumComment={val.Post?.number_of_comments}
        />
      )
    })
  }

  useEffect(() => {
    fetchCommentPost()
    setStartComment(2)

  }, [autoRender]);

  useEffect(() => {
    fetchWhoLikePost()
    setNumLikes(numberOfLikes)
    setDisplayLikeInput(idUserLike)
    fetchCommentPost()
  }, [idUserLike]);

  return (
    <Box borderWidth="1px" bg='#ffffff' boxShadow='md' borderRadius="lg" maxW="lg" paddingY="2" marginY="0" mb='15px'>
      {/* ---------- Card Header ---------- */}
      <Box paddingX="3" paddingBottom="2" justifyContent='space-between' display="flex" alignItems="center">
        <Box display='flex'>
          <Avatar src={avatarImg} size="md" />
          <Box marginLeft="2">
            <Link href={'/contentuser/' + idUserPost} style={{ textDecoration: "none" }}>
              <Text fontSize="md" fontWeight="bold" className='linkModal'>
                {username}
              </Text>
            </Link>
            <Text fontSize="sm" color="GrayText">
              {/* {location}, {moment(createdDate).fromNow()} */}
              {location}, {moment(createdDate).format('DD-MM-YYYY')}
            </Text>
          </Box>
        </Box>

        {/* ---------- Set condition where the post owned by the user login ---------- */}
        {userSelector.username == username ?
          <Box>
            <Menu>
              <MenuButton cursor={'pointer'}>
                <Icon boxSize={6} as={BsThreeDotsVertical} />
              </MenuButton>
              <MenuList>
                {/* ---------- edit post ---------- */}
                <MenuItem onClick={onOpenEdit}>Edit Post</MenuItem>
                <Modal isOpen={isOpenEdit} onClose={onCloseEdit} size='4xl'>
                  <ModalOverlay />
                  <EditContent
                    imageUrlEd={imageUrl}
                    captionEd={caption}
                    locationEd={location}
                    idEd={id}
                    onClose={onCloseEdit}
                  />
                </Modal>
                {/* ---------- Delete post ---------- */}
                {/* <MenuItem onClick={() => deletePost()}>Delete Post</MenuItem> */}
                <MenuItem onClick={onOpenDelete}>Delete Post</MenuItem>
                <Modal isOpen={isOpenDelete} onClose={onCloseDelete} size='xs'>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Delete Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                      <Box justifyContent={'space-between'}>
                        <Text>Are you sure want to delete this post?</Text>
                      </Box>
                      <Box mt='10px' display='flex' justifyContent='flex-end'>
                        <Button mr={3} colorScheme='red' onClick={() => {
                          async function submit() {
                            await deletePost();
                            onCloseDelete();
                          }
                          submit()
                        }}>
                          Delete
                        </Button>
                      </Box>
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </MenuList>
            </Menu>
          </Box> :
          <></>
        }
      </Box>

      {/* ---------- Card Media/Content ---------- */}
      <NextLink href={`/post/[postid]?postid=${id}`} as={`/post/${id}`}>
        {/* <Link onClick={onOpenPost}> */}
        <Image src={`http://${imageUrl}`} minH='300px' />
      </NextLink>
      {/* {router.query.postid && ( */}
      {/* <Modal isOpen={isOpenPost} onClose={onClosePost} scrollBehavior={scrollBehavior} size='xs'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={'center'}>Post</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            Testing
          </ModalBody>
        </ModalContent>
      </Modal> */}
      {/* )} */}


      {/* ---------- Action Buttons ---------- */}
      <Box display='flex' justifyContent='space-between'>
        <Box paddingX="3" paddingY="2" display="flex" alignItems="center">
          {/* ----- Like icon -----  */}
          <Icon boxSize={6} onClick={() => handleLikeInput()} as={displayLikeInput ? FcLike : FaRegHeart} sx={{ _hover: { cursor: "pointer", }, }} />

          {/* ----- Comment icon -----  */}
          <Icon
            onClick={() => setDisplayCommentInput(true)}
            marginLeft="4"
            boxSize={6}
            as={FaRegComment}
            sx={{
              _hover: {
                cursor: "pointer",
              },
            }} />
          {/* ----- share icon -----  */}
          <Popover >
            <PopoverTrigger>
              <Button variant='link' colorScheme='black'><Icon boxSize={5} marginLeft="4" as={FaRegPaperPlane} sx={{ _hover: { cursor: "pointer", }, }} /></Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader fontWeight='bold'>Share the Content</PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody size='xl'>
                  <Flex>
                    <Box mx='7px'>
                      <Tooltip hasArrow label='Facebook' bg='#3b5998' shouldWrapChildren mt='3'>
                        <FacebookShareButton url={`https://vast-actors-dress-182-3-41-240.loca.lt/post/${id}`}>
                          <FacebookIcon size={40} round={true} />
                        </FacebookShareButton>
                      </Tooltip>
                    </Box>
                    <Tooltip hasArrow label='WhatsApp' bg='#4FCE5D' shouldWrapChildren mt='3'>
                      <Box mx='7px'>
                        <WhatsappShareButton url={`https://vast-actors-dress-182-3-41-240.loca.lt/post/${id}`}>
                          <WhatsappIcon size={40} round={true} />
                        </WhatsappShareButton>
                      </Box>
                    </Tooltip>
                    <Tooltip hasArrow label='Twitter' bg='#1DA1F2' shouldWrapChildren mt='3'>
                      <Box mx='7px'>
                        <TwitterShareButton url={`https://vast-actors-dress-182-3-41-240.loca.lt/post/${id}`}>
                          <TwitterIcon size={40} round={true} />
                        </TwitterShareButton>
                      </Box>
                    </Tooltip>
                    <Tooltip hasArrow label='Copy link' shouldWrapChildren mt='3'>
                      <Box mx='7px'>
                        <Button
                          background='#DCD7C9'
                          rounded='full'
                          padding={4}
                          onClick={() => {
                            navigator.clipboard.writeText(`https://vast-actors-dress-182-3-41-240.loca.lt/post/${id}`)
                            setLinkCopy(true)
                            toast({
                              title: "Link Copied",
                              status: "success",
                              isClosable: true,
                            })
                          }}
                        > <Icon boxSize={4} as={FaShareAlt} /> &nbsp;Copy Link</Button>
                      </Box>
                    </Tooltip>
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </Box >
        <Box paddingX="3" paddingY="2" display="flex" alignItems="center">
          {/* ----- Saved icon -----  */}
          {displaySaveInput ?
            <Icon boxSize={6} onClick={() => setDisplaySaveInput(false)} as={FaBookmark} sx={{ _hover: { cursor: "pointer", }, }} />
            :
            <Icon boxSize={6} onClick={() => setDisplaySaveInput(true)} as={FaRegBookmark} sx={{ _hover: { cursor: "pointer", }, }} />
          }
        </Box>
      </Box>

      {/* ---------- Like Count ---------- */}
      <Box paddingX="3">
        <Text fontWeight="bold" fontSize='md' textColor='gray.500'>
          <Link className='linkModal' onClick={onOpenLike} style={{ textDecoration: 'none' }}>
            {numLikes?.toLocaleString()} likes
          </Link>
        </Text>
        <Text fontWeight="bold" fontSize='xs' textColor='gray.500'>
          {moment(createdDate).fromNow()}
        </Text>
      </Box>
      <Modal isOpen={isOpenLike} onClose={onCloseLike} scrollBehavior={scrollBehavior} size='xs'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={'center'}>Likes</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            {renderWhoLikePost()}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* ---------- Caption ---------- */}
      <Box paddingX="3">
        <Text fontSize="md" fontWeight="bold" className='linkModal'>
          <Link href={'/contentuser/' + idUserPost} style={{ textDecoration: "none" }}>
            {username}
          </Link>
        </Text>
        <Text display="inline">{caption}</Text>
      </Box>

      {/* ---------- Comment Section ---------- */}
      <Box paddingX="3" marginTop="4">

        <Text fontSize='sm' fontWeight="bold" marginBottom="2" textColor='gray.500'>
          {!displayCommentInput ?
            <Link className='linkModal' onClick={() => setDisplayCommentInput(true)} style={{ textDecoration: 'none' }}>
              See {numberOfComments?.toLocaleString()} Comments
            </Link>
            :
            <Link className='linkModal' onClick={() => setDisplayCommentInput(false)} style={{ textDecoration: 'none' }}>
              Close {numberOfComments?.toLocaleString()} Comments
            </Link>
          }
        </Text>
        {!displayCommentInput ?
          null :
          <>
            <Box mb='5px'>
              {renderCommentPost()}
            </Box>
            <Button size='xs' mb='5px' onClick={loadMore}>
              See More Comments
            </Button>
          </>
        }
      </Box>

      <Divider />
      <FormControl>
        {/* <Text>{formik.values.comment_post}</Text> */}
        <InputGroup size='sm'>
          <Input id='inputComment'
            onChange={(event) =>
              formik.setFieldValue("comment_post", event.target.value)}
            focusBorderColor='none'
            border='0'
            maxLength='300'
            pr='4.5rem'
            type='text'
            value={formik.values.comment_post}
            placeholder='Add Comment'
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' variant='ghost'
              onClick={formik.handleSubmit}
              disabled={formik.values.comment_post.length > 0 ? false : true} >
              Send
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
    </Box >
  );
};

export default ContentCard;
