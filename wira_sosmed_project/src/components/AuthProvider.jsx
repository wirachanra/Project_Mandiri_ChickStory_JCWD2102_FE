import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Flex } from '@chakra-ui/react';
import loading from '../assets/imgs/loading.gif'
import socialmedia from '../assets/imgs/socialmedia2.gif'
import Image from 'next/image';
import jsCookie from "js-cookie";
import auth_types from "../redux/reducers/auth/type";
import { axiosInstance } from "../lib/api";
import { Spinner } from '@chakra-ui/react'

function AuthProvider({ children }) {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const autoRender = useSelector((state) => state.automateRendering)
  const dispatch = useDispatch();

  useEffect(() => {

    const fetchdata = async () => {
      const userToken = jsCookie.get("auth_token")

      if (userToken) {
        const userResponse = await axiosInstance.get("user/refresh-token", {
          headers: {
            authorization: userToken
          }
        })
        dispatch({
          type: auth_types.AUTH_LOGIN,
          payload: userResponse.data.result.user,
        })
      }
      setIsAuthChecked(true)
    }
    // // const savedUserData = localStorage.getItem("user_data")
    const savedUserData = jsCookie.get("user_data");

    if (savedUserData) {
      const parsedUserData = JSON.parse(savedUserData);

      dispatch({
        type: auth_types.AUTH_LOGIN,
        payload: parsedUserData,
      });
    }
    fetchdata()
  }
    , [autoRender]);

  // if (!isAuthChecked) return <Flex minH={'100vh'} align={'center'} justify={'center'}>
  //   {/* <Image src={socialmedia} alt="Story"/> */}
  //   <Spinner thickness='4px'
  //     speed='0.65s'
  //     emptyColor='gray.200'
  //     color='blue.500'
  //     size='xl' /> &nbsp; loading. . .
  // </Flex>;

  return children;
};

export default AuthProvider;
