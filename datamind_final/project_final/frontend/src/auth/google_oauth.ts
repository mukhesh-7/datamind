import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const client_id = "1071489933676-kmm2c4h6i5rtoitg3vvl86ag4385vs3b.apps.googleusercontent.com"; // Insert your Google Client ID here
const client_secret = "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"; // Insert your Google Client Secret here
const redirect_uris = ["http://localhost:8000"]; // Ensure this matches your OAuth redirect URI

const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

export const getGoogleAuthURL = () => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  });
  return authUrl;
};

export const getGoogleUser = async (code: string) => {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });
  const userInfo = await oauth2.userinfo.get();
  return userInfo.data;
};

// Function to handle OAuth consent screen and redirect
export const handleOAuthConsent = () => {
  const authUrl = getGoogleAuthURL();
  window.location.href = authUrl;
};

// Ensure Google API script is loaded
declare global {
  interface Window {
    gapi: any;
  }
}

export const initGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    const loadGapiAndInit = () => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2
          .init({
            client_id: client_id,
            scope: 'email profile',
            prompt: 'select_account'
          })
          .then(resolve, reject);
      });
    };

    if (window.gapi) {
      loadGapiAndInit();
    } else {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = loadGapiAndInit;
      script.onerror = reject;
      document.head.appendChild(script);
    }
  });
};

