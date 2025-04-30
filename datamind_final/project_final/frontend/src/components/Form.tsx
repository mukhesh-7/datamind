import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, X, CheckCircle, AlertCircle } from 'lucide-react';
import { signInWithGoogle, useGoogleAuth } from '../auth/googleAuth';

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
}

const Form = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [errors, setErrors] = useState<FormErrors>({});
  const [notification, setNotification] = useState({ message: '', type: 'success' as 'success' | 'error', show: false });
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push(`At least ${minLength} characters`);
    if (!hasUpper) errors.push('One uppercase letter');
    if (!hasLower) errors.push('One lowercase letter');
    if (!hasNumber) errors.push('One number');
    if (!hasSpecial) errors.push('One special character');

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    // Form validation
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin && !formData.username) newErrors.username = 'Username is required';

    // Password validation for signup
    if (!isLogin) {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        newErrors.password = `Password must contain: ${passwordErrors.join(', ')}`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const result = isLogin
        ? await login(formData.email, formData.password)
        : await signup(formData.username, formData.email, formData.password);

      if (result.success) {
        setNotification({
          message: result.message,
          type: 'success',
          show: true
        });

        // Delay navigation until animation completes
        await new Promise(resolve => setTimeout(resolve, 400));
        navigate('/', { 
          replace: true,
          state: { animate: true }
        });
      } else {
        setNotification({
          message: result.message,
          type: 'error',
          show: true
        });
      }
    } catch (error) {
      setNotification({
        message: 'An error occurred',
        type: 'error',
        show: true
      });
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: ''
    });
    setErrors({});
    setShowPassword(false);
  };

  const formVariants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      y: 20
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: -10,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }
    }
  };

  const toggleForm = () => {
    resetForm();
    setIsLogin(!isLogin);
  };

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const renderError = (field: keyof FormErrors) => {
    return errors[field] ? (
      <span className="text-red-500 text-xs mt-1">{errors[field]}</span>
    ) : null;
  };

  const loginWithGoogle = useGoogleAuth((userData) => {
    setNotification({
      message: `Welcome ${userData.name}!`,
      type: 'success',
      show: true
    });

    setTimeout(() => {
      navigate('/');
    }, 2000);
  });

  const handleGoogleSignUp = async () => {
    try {
      setNotification({
        message: 'Connecting to Google...',
        type: 'success',
        show: true
      });

      await loginWithGoogle();
    } catch (error) {
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to sign in with Google',
        type: 'error',
        show: true
      });
      console.error('Google sign-in error:', error);
    }
  };

  const handleForgotPassword = async () => {
    const email = formData.email;
    if (!email) {
      setNotification({
        message: 'Please enter your email address to reset your password.',
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
      <AnimatePresence mode="wait" onExitComplete={() => {
        // Clean up after exit animation
        if (!isLogin) {
          resetForm();
        }
      }}>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`notification ${notification.type}`}
          >
            <div className="notification-content">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{notification.message}</span>
              <button
                onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                className="close-button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        <motion.form 
          className="form shadow-glow"
          key={isLogin ? 'login' : 'signup'}
          variants={formVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onSubmit={handleSubmit}
          layoutId="auth-form"
          transition={{
            layout: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
          }}
        >
          <div className="flex-column">
            <label>{isLogin ? 'Login' : 'Create Account'}</label>
          </div>
          
          {!isLogin && (
            <div className="flex-column mt-2">
              <label>Username </label>
              <div className="inputForm">
                <svg height={20} viewBox="0 0 24 24" width={20} xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#aaa"/>
                </svg>
                <input
                  type="text"
                  name="username"
                  className="input"
                  placeholder="Enter your Username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              {renderError('username')}
            </div>
          )}

          <div className="flex-column mt-2">
            <label>Email </label>
            <div className="inputForm">
              <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg">
                <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
              </svg>
              <input
                type="email"
                name="email"
                className="input"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            {renderError('email')}
          </div>

          <div className="flex-column mt-2">
            <label>Password </label>
            <div className="inputForm">
              <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg">
                <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input"
                placeholder="Enter your Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                onClick={togglePasswordVisibility}
                className="password-toggle"
                type="button"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {renderError('password')}
          </div>

          {isLogin && (
            <div className="flex-row">
              <div>
                <input type="radio" />
                <label> Remember me </label>
              </div>
              <span className="span" onClick={() => navigate('/forgot-password')}>Forgot password?</span>
            </div>
          )}

          <button type="submit" className="button-submit shadow-glow">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
          <p className="p">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="span" onClick={toggleForm}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </span>
          </p>
          {isLogin ? (
            <p className="p line mt-3">Or Login with</p>
          ) : (
            <p className="p line mt-3">Continue with</p>
          )}
          <div className="flex-row">
            <button 
              type="button"
              className="btn google" 
              onClick={handleGoogleSignUp}
            >
              <svg version="1.1" width={20} id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style={{enableBackground: 'new 0 0 512 512'}} xmlSpace="preserve">
                <path style={{fill: '#FBBB00'}} d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456C103.821,274.792,107.225,292.797,113.47,309.408z" />
                <path style={{fill: '#518EF8'}} d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z" />
                <path style={{fill: '#28B446'}} d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z" />
                <path style={{fill: '#F14336'}} d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0C318.115,0,375.068,22.126,419.404,58.936z" />
              </svg>
              Google
            </button>
          </div>
        </motion.form>
      </AnimatePresence>
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
    padding-right: 40px; /* Add space for the eye icon */
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #2d79f3;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }

  .flex-row > div > label {
    font-size: 14px;
    color: #f1f1f1;
    font-weight: 400;
  }

  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
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

  .p {
    text-align: center;
    color: #f1f1f1;
    font-size: 14px;
    margin: 5px 0;
  }

  .btn {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    border: 1px solid #333;
    background-color: #2b2b2b;
    color: #f1f1f1;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .btn:hover {
    border: 1px solid #2d79f3;
  }

  .password-toggle {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s ease-in-out;
    z-index: 1;
  }

  .password-toggle:hover {
    opacity: 0.8;
  }

  .password-toggle:focus {
    outline: none;
  }

  .text-red-500 {
    color: #ef4444;
    display: block;
    margin-top: 0.25rem;
    font-size: 0.75rem;
  }

  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    min-width: 300px;
  }

  .notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .notification.success .notification-content {
    background-color: rgba(34, 197, 94, 0.9);
    color: white;
  }

  .notification.error .notification-content {
    background-color: rgba(239, 68, 68, 0.9);
    color: white;
  }

  .close-button {
    margin-left: auto;
    transition: opacity 0.2s;
    cursor: pointer;
    opacity: 1;
    color: currentColor;
    padding: 0;
    border: none;
    background: none;
  }

  .close-button:hover {
    opacity: 0.7;
  }
`;

export default Form;