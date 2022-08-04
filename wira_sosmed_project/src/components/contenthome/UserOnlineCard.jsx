import { Box, Avatar, AvatarBadge, Heading, Text } from "@chakra-ui/react"
// const socketConnection = io("http://localhost:2000")
import NextLink from 'next/link';
import { axiosInstance } from "../../lib/api";
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";

export default function UserOnlineCard() {
  const router = useRouter()
  const [scrollBehavior, setScrollBehavior] = useState('inside')

  const [contentUser, setContentUser] = useState([])
  // ---------- fetching user online ---------- // 
  async function fetchUserOnline() {
    try {
      axiosInstance.post("/user/getUser")
        .then((res) => {
          const temp = res.data.result
          setContentUser(temp)
          console.log(temp)

          // console.log(temp[0].User)
          // console.log(contentUser);
        })
    } catch (err) {
      console.log(err)
    }
  };

  const renderUserOnline = () => {
    return contentUser.map((val, index) => {
      return (
        <><Text hidden>{index}</Text>
          <NextLink href={'/contentuser/' + val.id} style={{ textDecoration: "none" }}>
            <Box display='flex' mt='10px' borderLeftRadius='full' p='5px' sx={
              val.online_status ? { _hover: { cursor: "pointer", background: "#C4DFAA" }, } :
                { _hover: { cursor: "pointer", background: "#F0EBE3" }, }}>
              <Avatar
                src={`http://` + val.image_url}
              ><AvatarBadge boxSize='1em' bg={val.online_status ? 'green.500' : 'grey'} /></Avatar>
              <Box ml='15px'>
                <Text fontWeight='bold'>
                  {val.username}
                </Text>
                <Text>
                  {val.full_name}
                </Text>
              </Box>
            </Box>
          </NextLink>
        </>

      )
    })
  }

  useEffect(() => {
    fetchUserOnline()
    console.log(contentUser);
  }, [router.isReady])

  return (
    // ---------- form User yang sedang Online ---------- //
    <Box id='homeOnlineUser' ml={'20px'} p='20px' boxShadow='md' bg='#ffffff' borderWidth='1px' borderRadius="3" h={'500px'} w={'300px'}>
      {/* ---------- Head Form ---------- */}
      <Box>
        <Heading fontSize={"1xl"} color={'#4A5568'}>See who is online</Heading>
      </Box>

      {/* ---------- User Photo and Username ---------- */}
      <Box mt='10px' h='430px' className="scrollBox">

        {renderUserOnline()}

      </Box>
    </Box>
  )
}