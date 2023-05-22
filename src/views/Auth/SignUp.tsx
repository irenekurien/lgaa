import React, { useContext, useState } from 'react';
import { Input, Button } from 'components';
import { AuthContext } from 'context';

type params = {
  closeOverlay: () => void
}

const SignInUp = ({closeOverlay}: params) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isSignIn, setIsSignIn] = useState(true);


    const { login } = useContext(AuthContext);

    const handleSignUp = () => {
        login()
        closeOverlay()
    };
  
    return (
      <div className="overlay">
        <div className="overlay-content">
          <h2 className="text-2xl font-bold mb-4">{isSignIn ? "Sign In" : "Sign Up"}</h2>
          {!isSignIn && <Input
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mb-4"
          />}
          <Input
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mb-4"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleSignUp} className="w-full">
          {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
          <Button onClick={() => setIsSignIn(!isSignIn)} className="w-full" variant='text'>
          {isSignIn ? "Sign Up" : "Sign In"}
          </Button>
        </div>
      </div>
    );
  };
  
  export { SignInUp };
  