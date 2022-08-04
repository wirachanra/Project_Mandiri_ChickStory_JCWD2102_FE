import {
        Flex, Box, Text, Icon, Center, Grid, GridItem, Img
} from '@chakra-ui/react'
import Images from 'next/image'
import img1 from '../../../assets/imgs/test.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { FaComment } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import NextLink from 'next/link';

export default function GridContentUser(props) {
        const { username, imageUrl, location, caption, createdDate, numberOfLikes, numberOfComment, id } = props;
        const userSelector = useSelector((state) => state.auth)

        return (
                <>
                        {!imageUrl ? <></> :
                                <>
                                        <NextLink href={`/post/${id}`}>
                                                < Box minW='146px' minH='146px' bg='#ffffff' className='contentuser' borderWidth='1px'>
                                                        <Images objectFit='cover' className='content-img' alt="Story" src={`http://${imageUrl}`} width={300} height={300} />
                                                        <Box display='flex' flexWrap='wrap' className='contentlikecoment'>
                                                                <Center><Icon boxSize='4' as={AiFillHeart} /> <Text fontWeight='bold' className='p' mx='5px'> {numberOfLikes?.toLocaleString()}</Text></Center>
                                                                <Center><Icon boxSize='4' as={FaComment} /> <Text fontWeight='bold' className='p' mx='5px'> {numberOfComment?.toLocaleString()}</Text></Center>
                                                        </Box>
                                                </Box>
                                        </NextLink>
                                </>
                        }

                </>
        )
}