// src/auth/Register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleOAuthConsent } from './google_oauth';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    localStorage.setItem("registeredUser", JSON.stringify(user));
    alert("Registration successful! Redirecting to login.");
    navigate("/login");
  };

  const handleGoogleSignUp = () => {
    handleOAuthConsent();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input type="email" name="email" placeholder="Email" className="border p-2 w-full mb-2" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" className="border p-2 w-full mb-4" onChange={handleChange} />
        <button onClick={handleRegister} className="bg-green-600 text-white px-4 py-2 w-full mb-4">Register</button>
        <button onClick={handleGoogleSignUp} className="bg-red-600 text-white px-4 py-2 w-full">Sign up with Google</button>
      </div>
    </div>
  );
};

export default Register;
