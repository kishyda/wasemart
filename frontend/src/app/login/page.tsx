"use client";

import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const login = useGoogleLogin({
    onSuccess: codeResponse => console.log(codeResponse),
    flow: 'auth-code',
  });

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={() => login()}>Login with Google</button>
    </div>
  );
}
