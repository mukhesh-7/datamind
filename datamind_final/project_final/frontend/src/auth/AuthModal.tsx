import React, { useState } from 'react';
import { login, register } from './authService';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ message: "", type: "" });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await register(email, password);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        <h2 className="text-xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full p-2 border rounded mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-2 border rounded mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)} // Toggle between login and register panels
          className="mt-3 text-blue-500"
        >
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
        <button onClick={onClose} className="mt-3 block text-gray-600">Close</button>
      </div>
    </div>
  );
};

export default AuthModal;