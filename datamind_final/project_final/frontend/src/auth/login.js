import React from 'react';
import { handleOAuthConsent } from './google_oauth';

const Login = () => {
  const handleGoogleSignIn = () => {
    handleOAuthConsent();
  };

  return (
    <div>
      <button onClick={handleGoogleSignIn}>Google</button>
    </div>
  );
};

export default Login;