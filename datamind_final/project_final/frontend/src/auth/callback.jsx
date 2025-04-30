import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getGoogleUser } from './google_oauth';

const Callback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoogleUser = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      if (code) {
        const user = await getGoogleUser(code);
        console.log(user);
        // Handle user login/signup with the retrieved user information
        // Redirect to home page or dashboard after successful login/signup
        navigate('/home'); // Adjust the path as needed
      }
    };

    fetchGoogleUser();
  }, [location, navigate]);

  return <div>
    Loading...
    </div>
};

export default Callback;
