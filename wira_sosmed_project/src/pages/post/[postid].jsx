import { Flex, Box, Text, Heading, Avatar, Spinner, Center, Button } from '@chakra-ui/react'
import NavBar from '../../components/navbar/NavBar'
import ContentCard from '../../components/contenthome/contentCard/ContentCard'
import UnverifiedForm from '../../components/unverifiedform/UnverifiedForm'
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import Page from '../../components/metatag/Metatag';
import { useDispatch, useSelector } from 'react-redux'
import jsCookie from "js-cookie";

export default function post({ postData }) {
  const router = useRouter()
  const userSelector = useSelector((state) => state.auth)
  // const { postid } = router.query

  // const url = "http://localhost:3000/" + router.pathname;
  console.log(postData);
  let like = false;
  const check = postData.Likes.find((a) => {
    return a.user_id == userSelector.id
  })
  if (!check) {
    like = false
  } else { like = true }
  const url = "http://localhost:3000" + router.pathname;
  return (
    <Page title={"Chicstory post from " + postData.User?.username}
      description={postData?.caption} image={`https://${postData?.image_url}`}
      url={url} type="website">
      <NavBar />
      <Flex flexWrap={'wrap'} minH={'80vh'} minW='480px' justifyContent={'center'} padding={'30px'} bg='#F7FAFC'>
        <Box>
          <ContentCard
            username={postData.User?.username}
            avatarImg={'http://' + postData.User?.image_url}
            caption={postData?.caption}
            createdDate={postData?.createdAt}
            imageUrl={postData?.image_url}
            location={postData?.location}
            numberOfLikes={postData?.number_of_likes}
            numberOfComments={postData?.number_of_comments}
            id={postData?.id}
            idUserLike={like}
            idUserPost={postData.User?.id}
          />
        </Box>
      </Flex>
    </Page>
  )
}

// SSR
export async function getServerSideProps(context) {
  const { postid } = context.params
  const res = await axios.get(`http://localhost:2000/post/postId/${postid}`)
  console.log(res);
  return {
    props: {
      postData: res.data.result[0]
    },
  }
}
