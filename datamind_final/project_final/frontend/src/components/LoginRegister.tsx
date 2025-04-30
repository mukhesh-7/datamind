import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, X, CheckCircle, AlertCircle } from 'lucide-react';

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

      setNotification({
        message: result.message,
        type: result.success ? 'success' : 'error',
        show: true
      });

      if (result.success) {
        setTimeout(() => {
          navigate('/');
        }, 1500);
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

  const formVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 20,
      transition: {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.5
      }
    }
  };

  return (
    <StyledWrapper>
      <AnimatePresence mode="wait">
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
        >
          <div className="flex-column p">
            <label>{isLogin ? 'Login' : 'Create Account'}</label>
          </div>
          
          {!isLogin && (
            <>
              <div className="flex-column">
                <label>Username </label>
              </div>
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
            </>
          )}

          <div className="flex-column mt-2">
            <label>Email </label>
          </div>
          <div className="inputForm">
            <svg height={20} viewBox="0 0 32 32" width={20} xmlns="http://www.w3.org/2000/svg">
              <g id="Layer_3" data-name="Layer 3">
                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
              </g>
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
          <div className="flex-column">
            <label>Password </label>
          </div>
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
          {isLogin && ( // Only show these options for login
            <div className="flex-row">
              <div>
                <input type="radio" />
                <label> Remember me </label>
              </div>
              <span className="span">Forgot password?</span>
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
            
            <button className="btn google">
              <svg version="1.1" width={20} id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style={{enableBackground: 'new 0 0 512 512'}} xmlSpace="preserve">
                <path style={{fill: '#FBBB00'}} d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
        	c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
        	C103.821,274.792,107.225,292.797,113.47,309.408z" />
                <path style={{fill: '#518EF8'}} d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
        	c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
        	c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z" />
                <path style={{fill: '#28B446'}} d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
        	c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
        	c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z" />
                <path style={{fill: '#F14336'}} d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
        	c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
        	C318.115,0,375.068,22.126,419.404,58.936z" />
              </svg>
              Google</button><button className="btn apple">
              <svg version="1.1" height={20} width={20} id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22.773 22.773" style={{enableBackground: 'new 0 0 22.773 22.773'}} xmlSpace="preserve">
                <g>
                  <g>
                    <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z" />
                    <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z" />
                  </g>
                </g>
              </svg>
              Apple
            </button>
          </div>
        </motion.form>
      </AnimatePresence>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #121212;

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

  ::placeholder {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    color: #aaa;
  }

  .form button {
    align-self: flex-end;
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
    background: none;
    border: none;
    padding: 0;
    color: currentColor;
    opacity: 0.7;
    cursor: pointer;
    transition: opacity 0.2s;
    margin-left: auto;

    &:hover {
      opacity: 1;
    }
  }

  .button-submit {
    width: 100%;
    align-self: center;
  }
`;

export default Form;