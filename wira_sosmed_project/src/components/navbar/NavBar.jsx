import {
  Box, Flex, Avatar, HStack, Button, Menu, MenuButton, MenuList, MenuItem,
  MenuDivider, Text, Icon, useDisclosure, Link, Modal, ModalOverlay
} from '@chakra-ui/react';
import LinkNext from 'next/link';
import { AiFillBell, AiFillSetting, AiOutlineBell, AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BsChatLeftDotsFill, BsChatLeftDots } from "react-icons/bs";
import { BiAddToQueue, BiHelpCircle } from "react-icons/bi";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5"
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import logo from '../../assets/imgs/ChicStory.png'
import logo2 from '../../assets/imgs/chicstorylogonav.png'
import AddContent from '../addcontent/AddContent';
import jsCookie from "js-cookie";
import auth_types from "../../redux/reducers/auth/type";
import { useRouter } from 'next/router';
import { axiosInstance } from "../../lib/api"
import qs from "qs";
// const Links = ['Dashboard', 'Projects', 'Team'];

export default function NavBar() {
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.auth)
  const router = useRouter();

  // -------------------- Untuk Logout -------------------- //
  function btnlogout() {
    async function updateStat() {
      let body = {
        online_status: false,
      }
      await axiosInstance.patch("/user/" + userSelector.id, qs.stringify(body))
    }
    updateStat()
    jsCookie.remove("auth_token");
    dispatch({
      type: auth_types.AUTH_LOGOUT
    })
    router.push("/")
  }

  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Box bg='#ffffff' borderBottomWidth='2px' px={4} className='topnavbar' zIndex={111}>
        <Flex h='60px' alignItems={'center'} justifyContent={'space-between'} px='10px'>
          <Link href="/home">
            <HStack spacing={3} alignItems={'center'}>
              <Box pt='8px'> <Image src={logo2} alt={'Chicstory'} height={'45px'} width={'45px'} /> </Box>
              <Box pt='10px' className='navbar-logo'> <Image src={logo} alt={'Chicstory'} height={'45px'} width={'168px'} /> </Box>
            </HStack>
          </Link>
          <Flex alignItems={'center'}>
            <LinkNext href="/home">
              <Button background='white' mr='8px'>
                <Icon boxSize='7' as={router.pathname == '/home' ? AiFillHome : AiOutlineHome} />
              </Button>
            </LinkNext>

            {/* -------------------- When user verified status is invalid the button will be hidden -------------------- */}
            {userSelector.verified_status == false ? <></> : <>
              <Link onClick={onOpen}>
                <Button background='white' mr='8px'>
                  <Icon boxSize='7' as={BiAddToQueue} />
                </Button>
              </Link>
              <Modal isOpen={isOpen} onClose={onClose} size='4xl'>
                <ModalOverlay />
                <AddContent onClose={onClose} />
              </Modal>
              <Button background='white' mr='8px'>
                <Icon boxSize='7' as={BsChatLeftDots} />
              </Button>
              <Button background='white' mr='15px'>
                <Icon boxSize='7' as={AiOutlineBell} />
              </Button>
            </>}

            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={`http://${userSelector.image_url}`}
                />
              </MenuButton>
              <MenuList>
                <LinkNext href="/contentuser">
                  <MenuItem> <Avatar
                    size={'sm'}
                    src={`http://${userSelector.image_url}`}
                  /> <Text ml='10px' fontWeight='bold'>{userSelector.username}</Text></MenuItem>
                </LinkNext>
                <MenuDivider />
                <LinkNext href="/profile">
                  <MenuItem><Icon boxSize='6' as={router.pathname == "/profile" ? AiFillSetting : IoSettingsOutline} /><Text ml='10px'>Setting</Text></MenuItem>
                </LinkNext>
                <MenuItem><Icon boxSize='6' as={BiHelpCircle} /><Text ml='10px'>Help</Text></MenuItem>
                <MenuDivider />
                <MenuItem onClick={btnlogout}><Icon boxSize='6' as={IoLogOutOutline} /><Text ml='10px'>Log Out</Text></MenuItem>
                {/* nanti ganti js remove ke auth_token buakn auth_user */}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}