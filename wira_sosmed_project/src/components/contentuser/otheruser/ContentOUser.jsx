import {
    Box, Avatar, Text, Button, Icon, Center, Tabs,
    TabList, Tab, TabPanels, TabPanel, Flex, Spinner
} from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link';
import img1 from '../../../assets/imgs/test.jpg'
import img2 from '../../../assets/imgs/test2.jpg'
import socialmedia from '../../../assets/imgs/socialmedia2.gif'
import { FaComment } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { useSelector } from 'react-redux'
import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import { AiOutlineAppstore } from 'react-icons/ai'
import GridContentOuser from './GridContentOUser';
import { axiosInstance } from "../../../lib/api"
import { useRouter } from 'next/router';

export default function ContentOuser() {
    const router = useRouter()
    const userSelector = useSelector((state) => state.auth)
    const [contentList, setContentList] = useState([])
    const [dataUser, setDataUser] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingPage, setIsLoadingPage] = useState(true)
    const [page, setPage] = useState(2)

    async function getDataUser() {
        const { userid } = router.query
        if (userid == userSelector.id) {
            router.push("/contentuser")
        } else {
            const res = await axiosInstance.post("/user/getUserId/" + userid)
            setDataUser(res.data.result[0])
            console.log(res.data);
        }

        // console.log(res.data.result[0].username);
        // axiosInstance.post("/user/getUserId/" + router.query.userid).then((res) => {
        //     setDataUser(res)

        //     console.log(res.data.result);
        // })
        // const gettingUser = getUser.data.result
        // console.log();
    }

    function fetchContentList() {
        setTimeout(() => {
            axiosInstance.get("/post/user/" + router.query.userid)
                .then((res) => {
                    setContentList(res.data.result)

                    const temp = res.data.result
                    const tempUser = res.data.result[0].User
                    // console.log(temp)
                    // console.log(temp[0].User)
                    // console.log(tempUser.username)
                    // console.log(router.query.userid)
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
        const req = await axiosInstance.get(`/post/user/${router.query.userid}?page=${page}&limit=${9}`)
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
                <GridContentOuser key={index}
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
    //     // }, [contentList]);
    // }, []);

    useEffect(() => {
        if (router.isReady) {
            fetchContentList()
            getDataUser()
            setPage(2);
            setIsLoadingPage(false);
        }
    }, [router.isReady])


    return (
        <>
            {isLoadingPage ?
                <Flex minH={'100vh'} align={'center'} justify={'center'} bg='#F7FAFC' >
                    <Spinner thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl' /> &nbsp; loading...
                </Flex>
                :
                <Box maxW='965px'>
                    <Box display='flex' maxW='930px' mx='10px' my='10px' >
                        <Center maxW='200px' ml='50px'>
                            <Avatar size='2xl' src={`http://${dataUser.image_url}`} />
                        </Center>
                        <Box minW='260px' ml='50px'>
                            <Box display='flex' >
                                <Text fontSize='2xl' fontWeight='bold' >{dataUser.username}</Text>
                            </Box>
                            <Box display='flex'>
                                <Text fontWeight='semibold' color='#525252' my='15px'>{!dataUser.total_post ? 0 : dataUser.total_post} Post</Text>
                                <Text fontWeight='semibold' color='#525252' ml='30px' my='15px'>88 Followers</Text>
                                <Text fontWeight='semibold' color='#525252' ml='30px' my='15px'>88 Following</Text>
                            </Box>
                            <Text fontWeight='semibold' color='#525252'>{dataUser.full_name}</Text>
                            <Text fontWeight='semibold' color='#525252'>{dataUser.bio}</Text>
                            <Text fontWeight='semibold' color='#525252'>{dataUser.web} </Text>
                        </Box>
                    </Box>

                    <Tabs align='center' my='20px'>
                        <TabList>
                            <Tab><Icon boxSize={5} as={AiOutlineAppstore} /> &nbsp; Post</Tab>
                            <Tab isDisabled><Icon boxSize={4} as={FaBookmark} />&nbsp; Saved</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Flex flexWrap='wrap' alignContent='center' justifyContent='center'>
                                    {renderContentList()}
                                    {/* yang dibawah jangan di hapus supaya tampilan tidak berantakan dikarenakan justify content center danresponsive */}
                                    <Box minW='146px' h='0px' className='contentuser'></Box>
                                    <Box minW='146px' h='0px' className='contentuser'></Box>
                                    <Box minW='146px' h='0px' className='contentuser'></Box>
                                </Flex>
                                <Button onClick={loadMore}>load more</Button>

                            </TabPanel>
                            {/* <TabPanel>
                        <p>two!</p>
                    </TabPanel> */}
                        </TabPanels>
                    </Tabs>
                </Box >
            }
        </>
    )
}