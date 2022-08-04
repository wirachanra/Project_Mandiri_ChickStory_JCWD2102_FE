import { Box, Text, Link } from '@chakra-ui/react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useState } from 'react'

export default function SwitchForm() {
  const [changeForm, setChangeFrom] = useState(true)

  return (
    <>
      {/* ---------- menampilkan login form / register form => jika kondisi changeform="true" maka tampil loginform jika "false" maka tampil register form ---------- */}
      {changeForm ? <LoginForm /> : <RegisterForm />}

      {/* ---------- menampilkan box switchform button untuk menampikan form login dan register dengan kondisi yang sama dengan diatas ---------- */}
      <Box borderWidth='1px' borderRadius="3" p={'15px'} display='flex' m={'30px'} maxW={'350px'} justifyContent={'center'} bg='white' boxShadow='md'>
        {changeForm ?
          <>
            <Text>Don't have an account?&nbsp;</Text>
            <Link color={'blue.400'} style={{ textDecoration: 'none' }} fontWeight='semibold'
              onClick={() => setChangeFrom(false)}>Sign Up</Link>
          </>
          :
          <>
            <Text>Have an account?&nbsp;</Text>
            <Link color={'blue.400'} style={{ textDecoration: 'none' }} fontWeight='semibold'
              onClick={() => setChangeFrom(true)}>Log in</Link>
          </>
        }
      </Box>
    </>
  )
} 