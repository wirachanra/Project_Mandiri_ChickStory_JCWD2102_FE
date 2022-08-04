import NavBar from '../../components/navbar/NavBar'
import { Flex, Spinner } from '@chakra-ui/react'
import UserProfile from '../../components/userprofile/UserProfile'
import UnverifiedForm from '../../components/unverifiedform/UnverifiedForm'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from "react";
import Page from '../../components/metatag/Metatag'

export default function userProfile() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const url = "http://localhost:3000" + router.pathname;

    useEffect(() => {
        setIsLoading(true);
    }, []);

    useEffect(() => {
        if (!userSelector?.id) {
            // setIsLoading(true);
            router.push("/auth");
        } else {
            setIsLoading(false);
        }
    }, [userSelector?.id]);
    const userSelector = useSelector((state) => state.auth)
    return (
        <>
            <Page title={"Setting Profile"} description={"Setting Profile"}
                url={url} type="website">
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
                        <NavBar />
                        <Flex flexWrap={'wrap'} minH={'80vh'} minW='480px' justifyContent={'center'} padding={'30px'} bg='#F7FAFC'>
                            {userSelector.verified_status == false ?
                                <UnverifiedForm /> :
                                <UserProfile />
                            }
                        </Flex>
                    </>}
            </Page>
        </>
    )
}