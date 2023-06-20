import React, { useState } from 'react';
import { Input, Button } from 'components';
import { axiosInstance, updateAuthorizationHeader } from 'config';
import { toast } from 'react-toastify';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

type params = {
  closeOverlay: () => void
  isSignedIn: (x: boolean) => void
}

const SignInUp = ({ closeOverlay, isSignedIn }: params) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isSignIn, setIsSignIn] = useState(true);

  NProgress.configure({
    template: "<div role='bar' class='bar'><div class='peg'></div></div>"
  });

  const login = async () => {

    try {
      NProgress.start();

      const res = await axiosInstance.post('login', {
        username, password
      })
      if(res.status === 200)  {
        NProgress.done();
        toast.success("Login Successfull", { autoClose: 2000 })
      }
      localStorage.setItem("token", res.data.token)
      updateAuthorizationHeader(res.data.token)
      // updateAuthorizationHeader(localStorage.getItem('token'))

      const sessionsRes = await axiosInstance.get('sessions');
      console.log(JSON.stringify(sessionsRes.data))
      localStorage.setItem('session', JSON.stringify(sessionsRes.data))
      isSignedIn(true)
    }
    catch(e)  {
      toast.error("Login Unsuccessfull", { autoClose: 2000})
    }
  }

  const signup = async () => {
    const res = await axiosInstance.post('signup', {
      name, username, password
    })
    if(res.status === 200)  {
      toast.success("SignUp successfull, Please login", { autoClose: 2000 })
    }
  }

  const handleSignUp = () => {
    if(isSignIn)  {
      login()
    } else {
      signup()
    }
    closeOverlay()
  };

  return (
    <div className="overlay">
      <div className="overlay-content rounded-md w-1/4 p-8">
        <h2 className="text-2xl font-bold mb-4">{isSignIn ? "Sign In" : "Sign Up"}</h2>
        {!isSignIn && <Input
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="mb-4"
          fullWidth
        />}
        <Input
          label="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="mb-4"
          fullWidth
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-4"
          fullWidth
        />
        <Button onClick={handleSignUp} className="w-full mb-4">
          {isSignIn ? "Sign In" : "Sign Up"}
        </Button>
        <div className='flex flex-col m-2 items-center'>
          <div className='flex mx-2 items-start'>
            <p className='text-sm'>Don't have an account?</p>
            <Button onClick={() => setIsSignIn(!isSignIn)} className="" color='black' variant='text'>
              {isSignIn ? "Sign Up" : "Sign In"}
            </Button>
          </div>
          <Button onClick={closeOverlay} className="mt-5" color='danger' variant='outlined'>
            Cancel
          </Button>
        </div>

      </div>
    </div>
  );
};

export { SignInUp };
