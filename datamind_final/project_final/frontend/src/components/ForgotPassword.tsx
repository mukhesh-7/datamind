import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState({ message: '', type: 'success', show: false });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setNotification({
        message: 'Please enter your email address.',
        type: 'error',
        show: true
      });
      return;
    }

    try {
      // Simulate sending a password reset email
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setNotification({
        message: 'Password reset instructions have been sent to your email.',
        type: 'success',
        show: true
      });
    } catch (error) {
      setNotification({
        message: 'Failed to send password reset instructions. Please try again later.',
        type: 'error',
        show: true
      });
    }
  };

  return (
    <StyledWrapper>
      <motion.form 
        className="form shadow-glow"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex-text-center mb-2  font-semibold">
          <label>
            Reset Password
          </label>
        </div>
        <label className="text-neutral-500 font-semibold mb-2"> 
            Enter your email address to receive password reset instructions.
          </label>
        <div className="flex-column mt-2">
          <label>Email </label>
          <div className="inputForm my-3">
            <input
              type="email"
              className="input"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="button-submit shadow-glow">
          Continue
        </button>
        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
      </motion.form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #1f1f1f;
    padding: 30px;
    width: 450px;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    will-change: transform, opacity;
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }

  .flex-column > label {
    color: #f1f1f1;
    font-weight: 600;
  }

  .inputForm {
    border: 1.5px solid #333;
    border-radius: 10px;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    transition: 0.2s ease-in-out;
    background-color: #2b2b2b;
    position: relative;
  }

  .input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 100%;
    height: 100%;
    background-color: #2b2b2b;
    color: #f1f1f1;
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #2d79f3;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: #2d79f3;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .notification {
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    color: white;
  }

  .notification.success {
    background-color: #28a745;
  }

  .notification.error {
    background-color: #dc3545;
  }
`;

export default ForgotPassword;