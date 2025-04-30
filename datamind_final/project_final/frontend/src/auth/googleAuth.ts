import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

const CLIENT_ID = "1071489933676-kmm2c4h6i5rtoitg3vvl86ag4385vs3b.apps.googleusercontent.com";

export const useGoogleAuth = (onSuccess: (userData: any) => void) => {
  return useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const user = {
          id: userInfo.data.sub,
          name: userInfo.data.name,
          email: userInfo.data.email,
          picture: userInfo.data.picture,
          preferences: {
            theme: 'dark',
            fontSize: 'medium'
          }
        };

        // Store user data
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Store auth success message
        sessionStorage.setItem('authSuccess', JSON.stringify({
          message: 'Google Sign-in successful! Welcome ' + user.name,
          show: true
        }));

        onSuccess(user);
      } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error);
      throw error;
    }
  });
};

let isGoogleInitialized = false;

interface GoogleInitOptions {
  client_id: string;
  auto_select?: boolean;
  callback: (response: { credential: string }) => void;
  context?: 'signin' | 'signup' | 'use';
  use_fedcm_for_prompt?: boolean;
}

export const initGoogleAuth = async (): Promise<void> => {
  if (isGoogleInitialized) return;

  return new Promise((resolve, reject) => {
    const initializeGoogle = () => {
      const initOptions: GoogleInitOptions = {
        client_id: CLIENT_ID,
        auto_select: false, // Prevent auto-selection
        callback: (response: { credential: string }) => {
          if (response.credential) {
            try {
              const userInfo = decodeJwtToken(response.credential);
              const user = {
                id: userInfo.sub,
                name: userInfo.name,
                email: userInfo.email,
                imageUrl: userInfo.picture,
                preferences: {
                  theme: 'dark',
                  fontSize: 'medium'
                }
              };
              
              localStorage.setItem('user', JSON.stringify(user));
              localStorage.setItem('isAuthenticated', 'true');
              
              // Add success message to storage for Form component to display
              sessionStorage.setItem('authSuccess', JSON.stringify({
                message: 'Google Sign-in successful! Welcome ' + userInfo.name,
                show: true
              }));
              
              resolve();
            } catch (error) {
              reject(error);
            }
          }
        }
      };

      try {
        window.google.accounts.id.initialize(initOptions);
        
        // Explicitly render the button if element exists
        const buttonElement = document.getElementById('googleButton');
        if (buttonElement) {
          window.google.accounts.id.renderButton(buttonElement, {
            type: 'standard',
            theme: 'filled_black',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
          });
        }
        isGoogleInitialized = true;
        resolve();
      } catch (error) {
        console.error('Google initialization error:', error);
        reject(error);
      }
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      script.onerror = reject;
      document.head.appendChild(script);
    } else {
      initializeGoogle();
    }
  });
};

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

function decodeJwtToken(token: string): GoogleUser {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error('Failed to decode JWT token');
  }
}

export const signInWithGoogle = async () => {
  try {
    await initGoogleAuth();
    
    // Directly trigger the consent screen
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback to manual OAuth flow if prompt doesn't work
        const auth2 = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: 'email profile',
          callback: (response: any) => {
            if (response.access_token) {
              // Handle successful sign in
              console.log('OAuth successful');
            }
          },
        });
        auth2.requestAccessToken();
      }
    });
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export const signOutGoogle = async () => {
  try {
    // Handle the sign-out process here
  } catch (error) {
    console.error("Google sign-out error:", error);
    throw error;
  }
};

// Add type declaration for google accounts
declare global {
  interface Window {
    google: any;
  }
}

