import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, User } from 'lucide-react';
import Button from './ui/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, setUser } = useAuth();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Close the dropdown when user logs in or out
    if (isAuthenticated) {
      setIsDropdownOpen(false);
    }
  }, [isAuthenticated, user]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          const updatedUser = { ...user, profilePicture: reader.result as string };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);

          // Refresh the page
          setTimeout(() => window.location.reload(), 0);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="bg-gray-500 border border-cyan-200 backdrop-brightness-150 py-2 px-4 mt-7 mx-6 rounded-full shadow-glow shadow-blue-600 backdrop-blur-lg bg-opacity-30">
      <div className="flex items-center justify-between">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center mr-4 shadow-glow-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-white flex items-center">
            DataMind
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              BETA
            </span>
          </h1>
        </motion.div>

        <div className="flex items-center space-x-5 mt-2 my-2">
          <Button size="sm" className="text-white bg-none px-2 py-1 rounded-full shadow-md hover:bg-primary-600" onClick={() => handleNavigation('/')}>Home</Button>
          {/* <Button size="sm" className="text-white px-3 py-1 my-2-1 rounded-full bg-none shadow-md hover:bg-primary-600 transition-colors duration-300 text-sm" onClick={() => handleNavigation('/register')}>Register</Button> */}
          <Button size="sm" className="bg-none px-2 py-2 rounded-full shadow-md hover:bg-primary-600" onClick={() => handleNavigation('/subscription')}>Upgrade</Button>

          <div className="relative">
            <button
              className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center focus:outline-none"
              onClick={toggleDropdown}
            >
              {isAuthenticated && user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <User className="h-6 w-6 text-gray-700" />
              )}
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-dark-200 text-white rounded-lg shadow-lg border border-dark-100 z-50"
              >
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 border-b border-dark-100">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <button
                      className="w-full text-left text-sm px-4 py-2 hover:bg-primary-600/20"
                      onClick={() => handleNavigation('/subscription')}
                    >
                      Manage Subscriptions
                    </button>
                    <button
                      className="w-full text-left text-sm px-4 py-2 hover:bg-primary-600/20"
                      onClick={() => alert('Subscription refreshed!')}
                    >
                      Refresh Subscription Plan
                    </button>
                    <button
                      className="w-full text-left text-sm px-4 py-2 hover:bg-primary-600/20"
                      onClick={() => alert('Support is on the way!')}
                    >
                      Support
                    </button>
                    <label htmlFor="profile-picture-upload" className="w-full text-left text-sm px-4 py-2 hover:bg-primary-600/20 cursor-pointer">
                      Change Profile Picture
                    </label>
                    <input
                      type="file"
                      id="profile-picture-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                    <button
                      className="w-full text-left text-sm px-4 py-2 hover:bg-primary-600/20"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    className="w-full text-left text-sm px-4 py-2 hover:bg-primary-600/20"
                    onClick={() => handleNavigation('/login')}
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;