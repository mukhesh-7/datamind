import React from 'react';
import { handleOAuthConsent } from './google_oauth';

const Signup = () => {
  const handleGoogleSignUp = () => {
    handleOAuthConsent();
  };

  return (
    <div>
      {/* ...existing code... */}
      <button onClick={handleGoogleSignUp}>Sign up with Google</button>
      {/* ...existing code... */}
    </div>
  );
};

export default Signup;