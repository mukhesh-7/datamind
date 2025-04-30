// src/auth/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleOAuthConsent } from './google_oauth'; // Corrected import path
import { resetPassword } from './authService'; // Import resetPassword function

interface LoginProps {
  setIsAuthenticated: (auth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: string }>({ message: "", type: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    if (credentials.email === "test@example.com" && credentials.password === "password") {
      localStorage.setItem("auth", "true");
      setIsAuthenticated(true);
      navigate("/dashboard");
    } else {
      alert("Invalid credentials!");
    }
  };

  const handleGoogleSignIn = () => {
    handleOAuthConsent();
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true); // Show the reset password UI
    setNotification({ message: "", type: "" }); // Clear any previous notifications
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setNotification({ message: "Please enter your email address.", type: "error" });
      return;
    }

    try {
      const response = await resetPassword(resetEmail);
      setNotification({ message: response.message, type: "success" });
      setShowForgotPassword(false); // Return to the login UI after success
    } catch (error) {
      setNotification({ message: "Failed to send reset email. Please try again.", type: "error" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-lg">
        {notification.message && (
          <div className={`notification ${notification.type} mb-4`}>
            <p>{notification.message}</p>
          </div>
        )}
        {!showForgotPassword ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border p-2 w-full mb-2"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border p-2 w-full mb-4"
              onChange={handleChange}
            />
            <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 w-full">
              Login
            </button>
            <button onClick={handleGoogleSignIn} className="bg-red-600 text-white px-4 py-2 w-full mt-2">
              Sign in with Google
            </button>
            <p className="mt-4 text-sm">
              <span className="text-blue-600 cursor-pointer" onClick={handleForgotPassword}>
                Forgot password?
              </span>
            </p>
            <p className="mt-4 text-sm">
              Don't have an account?{" "}
              <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/register")}>
                Register
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Reset your password</h2>
            <p className="text-sm mb-4">
              Enter your email address and we will send you instructions to reset your password.
            </p>
            <input
              type="email"
              placeholder="Email address"
              className="border p-2 w-full mb-4"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <button onClick={handleResetPassword} className="bg-green-600 text-white px-4 py-2 w-full">
              Continue
            </button>
            <button onClick={() => setShowForgotPassword(false)} className="mt-4 text-blue-600 cursor-pointer">
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;