"use client"

import { useGoogleLogin } from '@react-oauth/google';


export default function page() {
    const login = useGoogleLogin({
      onSuccess: codeResponse => console.log(codeResponse),
      flow: 'auth-code',
    });
    return (
        <button onClick={() => login()}>Sign in with Google 🚀</button>
    )
}
