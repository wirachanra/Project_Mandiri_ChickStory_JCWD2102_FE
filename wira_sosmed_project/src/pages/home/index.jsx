import { Flex, Box, Text, Heading, Avatar, Spinner, Center, Button } from '@chakra-ui/react'
import NavBar from '../../components/navbar/NavBar'
import ContentCard from '../../components/contenthome/contentCard/ContentCard'
import UnverifiedForm from '../../components/unverifiedform/UnverifiedForm'
import UserOnlineCard from '../../components/contenthome/UserOnlineCard'
import Link from 'next/link';
import { axiosInstance } from "../../lib/api"
import qs from "qs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import jsCookie from "js-cookie";
import InfiniteScroll from 'react-infinite-scroller';
import Page from '../../components/metatag/Metatag'

export default function home() {
  const router = useRouter()
  const isInitialMount = useRef(true)
  const userSelector = useSelector((state) => state.auth)
  const autoRender = useSelector((state) => state.automateRendering)
  const [contentList, setContentList] = useState([])
  const [rendering, setRendering] = useState()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPost, setIsLoadingPost] = useState(true)
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2)
  const url = "http://localhost:3000" + router.pathname;

  const fetchContentList = async () => {
    setTimeout(() => {
      axiosInstance.get(`/post`)
        .then((res) => {
          const temp = res.data.result
          setContentList(temp)
          // setContentList((contentList) => [...contentList, ...newPost])
          console.log(res)
          // console.log(temp[0].User)
        })
        .catch((err) => {
          // alert(err)
        })
        .finally(() => {
          setIsLoadingPost(false)
        })
    }, 2000)
  };

  const loadMore = async () => {
    const req = await axiosInstance.get(`/post?page=${page}&limit=${5}`)
    const newPost = req.data.result
    if (newPost.length != 0) {
      setPage(page + 1)
      setContentList([...contentList, ...newPost])
    }
    // console.log(page);
    // console.log(req.data.result);
    // console.log(contentList.length);
  };

  // console.log(contentList);
  const renderContentList = () => {
    // return Object.values(contentList).map((val) => {

    return contentList.map((val, index) => {
      let like = false
      const check = val.Likes.find((a) => {
        return a.user_id == userSelector.id
      })
      if (!check) {
        like = false
      } else { like = true }

      // console.log(check);
      // console.log(like);
      return (
        <ContentCard key={index}
          username={val.User?.username}
          avatarImg={'http://' + val.User?.image_url}
          caption={val.caption}
          createdDate={val.createdAt}
          imageUrl={val.image_url}
          location={val.location}
          numberOfLikes={val.number_of_likes}
          numberOfComments={val.number_of_comments}
          id={val.id}
          idUserLike={like}
          idUserPost={val.User?.id}
        />

      )
    })
  }

  useEffect(() => {
    fetchContentList()

    // console.log("test render " + autoRender.value);
    // alert(postSelector.value)
  }, []);

  useEffect(() => {
    // console.log("change render " + autoRender.value);

    fetchContentList()
    setPage(2);

  }, [autoRender.value]);


  useEffect(() => {
    async function updateStat() {
      let body = {
        online_status: true,
      }
      await axiosInstance.patch("/user/" + userSelector.id, qs.stringify(body))
    }
    updateStat()
  }, [])

  useEffect(() => {
    setIsLoading(true);
    const renderValue = autoRender.value
    // jsCookie.set("auto_render", renderValue);
  }, []);

  useEffect(() => {
    if (!userSelector?.id) {
      // setIsLoading(true);
      router.push("/auth");
    } else {
      setIsLoading(false);
    }
  }, [userSelector?.id]);

  return (

    <>
      {isLoading ?
        <Flex minH={'100vh'} align={'center'} justify={'center'} bg='#F7FAFC' >
          <Spinner thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl' /> &nbsp; loading...
        </Flex>
        :
        <>
          <Page title={"Home"} description={""} image={""}
            url={url} type="website">
            <NavBar />
            <Flex flexWrap={'wrap'} minH={'80vh'} minW='480px' justifyContent={'center'} padding={'30px'} bg='#F7FAFC'>
              {userSelector.verified_status == 0 ?
                // {/* ---------- UnverifiedForm untuk user yang belum verifikasi ---------- */}
                <Flex justifyContent='space-around' wrap={'wrap'} maxW={'550px'}>
                  <UnverifiedForm />
                </Flex> :
                // {/* ---------- isi home setelah user sudah terverifikasi melalui email terdapat content card dan Useronline ---------- */}
                <>
                  <Flex justifyContent='space-around' wrap={'wrap'} maxW={'550px'}>
                    {
                      isLoadingPost ?
                        <Box borderWidth="1px" bg='#ffffff' borderRadius="lg" w="lg" paddingY="2" marginY="0" mb='15px'>
                          <Spinner />
                        </Box>
                        :
                        <>
                          <InfiniteScroll
                            pageStart={page}
                            loadMore={loadMore}
                            hasMore={true || false}
                          // loader={<div className="loader" key={0}>Loading ...</div>}
                          >
                            {renderContentList()}
                          </InfiniteScroll>
                          {/* <Button onClick={() => loadMore()}>Load More</Button> */}
                        </>
                    }
                  </Flex>
                  <UserOnlineCard />
                </>
              }
            </Flex>
          </Page>
        </>}
    </>
  )
}