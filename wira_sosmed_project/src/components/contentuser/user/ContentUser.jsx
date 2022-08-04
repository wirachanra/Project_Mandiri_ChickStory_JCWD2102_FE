import {
    Box, Avatar, Text, Button, Icon, Center, Tabs,
    TabList, Tab, TabPanels, TabPanel, Flex
} from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link';
import img1 from '../../../assets/imgs/test.jpg'
import img2 from '../../../assets/imgs/test2.jpg'
import socialmedia from '../../../assets/imgs/socialmedia2.gif'
import { FaComment, FaRegHeart } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import { AiOutlineAppstore } from 'react-icons/ai'
import GridContentUser from './GridContentUser';
import { axiosInstance } from "../../../lib/api"
import InfiniteScroll from 'react-infinite-scroller';

export default function ContentUser() {
    const autoRender = useSelector((state) => state.automateRendering)
    const userSelector = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [contentList, setContentList] = useState([])
    const [contentListLiked, setContentListLiked] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(2)

    function fetchContentList() {
        setTimeout(() => {
            axiosInstance.get("/post/user/" + userSelector.id)
                .then((res) => {
                    setContentList(res.data.result)
                    const temp = res.data.result
                    console.log(temp)
                    console.log(temp[0].User)
                })
                .catch((err) => {
                    // alert(err)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }, 2000)
    };

    const loadMore = async () => {
        const req = await axiosInstance.get(`/post/user/${userSelector.id}?page=${page}&limit=${9}`)
        const newPost = req.data.result
        if (newPost.length != 0) {
            setPage(page + 1)
            setContentList([...contentList, ...newPost])
        }
        console.log(page);
        console.log(req.data.result);
        // console.log(contentList.length);
    };

    // console.log(contentList);
    const renderContentList = () => {
        // return Object.values(contentList).map((val) => {
        return contentList.map((val, index) => {
            return (
                <GridContentUser key={index}
                    username={val.User?.username}
                    caption={val.caption}
                    createdDate={val.createdAt}
                    imageUrl={val.image_url}
                    location={val.location}
                    numberOfLikes={val.number_of_likes}
                    numberOfComment={val.number_of_comments}
                    id={val.id}
                />
            )
        })
    }

    // useEffect(() => {
    //     fetchContentList()
    // }, []);

    useEffect(() => {
        fetchContentList()
        setPage(2);
        // }, [contentList]);
    }, [autoRender.value]);

    // ----------- fetching content we like -----------//
    function fetchContentListLiked() {
        setTimeout(() => {
            axiosInstance.get("/like/user/" + userSelector.id)
                .then((res) => {
                    setContentListLiked(res.data.result)
                    const temp = res.data.result
                    console.log(temp)
                    console.log(temp[0].User)
                })
                .catch((err) => {
                    // alert(err)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }, 2000)
    };

    const renderContentListLike = () => {
        // return Object.values(contentList).map((val) => {
        return contentListLiked.map((val, index) => {
            return (
                <GridContentUser key={index}
                    username={val.User?.username}
                    caption={val.Post?.caption}
                    createdDate={val.Post?.createdAt}
                    imageUrl={val.Post?.image_url}
                    location={val.Post?.location}
                    numberOfLikes={val.Post?.number_of_likes}
                    numberOfComment={val.Post?.number_of_comments}
                    id={val.post_id}
                />
            )
        })
    }
    useEffect(() => {
        fetchContentListLiked()
        setPage(2);
        // }, [contentList]);
    }, [autoRender.value]);

    return (
        <Box maxW='965px'>
            <Box display='flex' maxW='930px' mx='10px' my='10px' >
                <Center maxW='200px' ml='50px'>
                    <Avatar size='2xl' src={`http://${userSelector.image_url}`} />
                </Center>
                <Box minW='260px' ml='50px'>
                    <Box display='flex' >
                        <Text fontSize='2xl' fontWeight='bold' >{userSelector.username}</Text>
                        <Link href='/profile'>
                            <Button size='xs' colorScheme='linkedin' mx='10px' mt='6px' >Edit Profile</Button>
                        </Link>
                    </Box>
                    <Box display='flex'>
                        <Text fontWeight='semibold' color='#525252' my='15px'>{!userSelector.total_post ? 0 : userSelector.total_post} Post</Text>
                        <Text fontWeight='semibold' color='#525252' ml='30px' my='15px'>88 Followers</Text>
                        <Text fontWeight='semibold' color='#525252' ml='30px' my='15px'>88 Following</Text>
                    </Box>
                    <Text fontWeight='semibold' color='#525252'>{userSelector.full_name}</Text>
                    <Text fontWeight='semibold' color='#525252'>{userSelector.bio}</Text>
                    <Text fontWeight='semibold' color='#525252'>{userSelector.web}</Text>
                </Box>
            </Box>

            <Tabs align='center' my='20px'>
                <TabList>
                    <Tab><Icon boxSize={5} as={AiOutlineAppstore} /> &nbsp; Post</Tab>
                    <Tab><Icon boxSize={4} as={FaRegHeart} />&nbsp; Liked</Tab>
                    <Tab isDisabled><Icon boxSize={4} as={FaBookmark} />&nbsp; Saved</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Flex flexWrap='wrap' onScroll={loadMore} alignContent='center' justifyContent='center'>
                            {/* <InfiniteScroll
                                pageStart={page}
                                loadMore={loadMore}
                                hasMore={true}
                            // loader={<div className="loader" key={0}>Loading ...</div>}
                            > */}
                            {/* {renderContentList()} */}
                            {renderContentList()}
                            {/* </InfiniteScroll> */}
                            {/* yang dibawah jangan di hapus supaya tampilan tidak berantakan dikarenakan justify content center danresponsive */}
                            <Box minW='146px' h='0px' className='contentuser'></Box>
                            <Box minW='146px' h='0px' className='contentuser'></Box>
                            <Box minW='146px' h='0px' className='contentuser'></Box>
                        </Flex>
                        <Button onClick={loadMore}>load more</Button>

                    </TabPanel>
                    <TabPanel>
                        <Flex flexWrap='wrap' onScroll={loadMore} alignContent='center' justifyContent='center'>
                            {renderContentListLike()}
                            {/* yang dibawah jangan di hapus supaya tampilan tidak berantakan dikarenakan justify content center danresponsive */}
                            <Box minW='146px' h='0px' className='contentuser'></Box>
                            <Box minW='146px' h='0px' className='contentuser'></Box>
                            <Box minW='146px' h='0px' className='contentuser'></Box>
                        </Flex>
                    </TabPanel>
                    {/* <TabPanel>
                        <p>Save</p>
                    </TabPanel> */}
                </TabPanels>
            </Tabs>


        </Box >
    )
}