import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import DocumentList from './components/DocumentList';
import DocumentViewer from './components/DocumentViewer';
import ChatInterface from './components/ChatInterface';
import AIModelSelector from './components/AIModelSelector';
import Spline from '@splinetool/react-spline/next';
import SubscriptionPlans from './components/SubscriptionPlans';
import LoginRegister from './components/LoginRegister';
import Form from './components/Form';
import ForgotPassword from './components/ForgotPassword';
import SplitContainer from './components/SplitContainer'; // Assuming SplitContainer is available as a reusable component
import { useStore } from './store/useStore';
import { AuthProvider } from './auth/AuthContext';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

// Utility function for API calls with error handling
async function apiFetch(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `API error: ${res.status}`);
    }
    return await res.json();
  } catch (e: any) {
    throw new Error(e.message || 'Network error');
  }
}

const AnimatedRoutes = () => {
  const location = useLocation();
  const { theme } = useStore();

  return (
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className={`text-4xl font-bold text-center mb-3 gradient-text transition-colors duration-300
                ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
              >
                Document Management & AI Analysis
              </h1>
              <p className={`text-center max-w-2xl mx-auto transition-colors duration-300
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Upload your documents, analyze them with AI, and get intelligent insights through our advanced summarization and chat features.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-12"
            >
              <FileUploader />
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-1 space-y-6"
              >
                <div className={`rounded-3xl shadow-lg p-6 border transition-colors duration-300
                  ${theme === 'dark' 
                    ? 'bg-dark-200 border-dark-100 text-gray-100' 
                    : 'bg-white border-gray-200 text-gray-900'}`}
                >
                  <h2 className={`text-xl font-semibold mb-4 transition-colors duration-300
                    ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
                  >
                    Your Documents
                  </h2>
                  <DocumentList />
                </div>
                
                <div className={`rounded-xl shadow-lg p-6 border transition-colors duration-300
                  ${theme === 'dark' 
                    ? 'bg-dark-200 border-dark-100 text-gray-100' 
                    : 'bg-white border-gray-200 text-gray-900'}`}
                >
                  <AIModelSelector />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-2 grid grid-cols-1 gap-8"
              >
                <SplitContainer direction="vertical" minSizes={[200, 200]} initialSizes={[500, 300]}>
                  <div className={`transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-200 text-gray-100' : 'bg-white text-gray-900'}`}
                       style={{ height: '100%', minHeight: 200, overflow: 'auto' }}>
                    <DocumentViewer />
                  </div>
                  <div className={`transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-200 text-gray-100' : 'bg-white text-gray-900'}`}
                       style={{ height: '100%', minHeight: 200, overflow: 'auto' }}>
                    <ChatInterface />
                  </div>
                </SplitContainer>
              </motion.div>
            </div>
          </motion.div>
        } />
        <Route path="/subscription" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <SubscriptionPlans />
          </motion.div>
        } />
        <Route path="/login" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Form />
          </motion.div>
        } />
        <Route path="/register" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Form />
          </motion.div>
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const {theme } = useStore();
  useEffect(() => {
    document.documentElement.classList.add('transition-colors');
    document.body.classList.add('transition-colors');
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  return (
    <BrowserRouter
    future={{
      v7_relativeSplatPath: true,
    }}>
      <AuthProvider>
        <div className={`relative min-h-screen transition-all duration-300 ease-in-out 
          ${theme === 'dark' 
            ? 'bg-gradient-to-b from-dark-300 to-dark-500 text-gray-100' 
            : 'bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900'}`}
        >
          <div className="relative z-10">
            <Header />
            
            <main className="container mx-auto px-4 py-8">
              <AnimatedRoutes />
            </main>
            
            <footer className={`border-t py-6 mt-12 transition-colors duration-300
              ${theme === 'dark' 
                ? 'bg-dark-300 border-dark-100 text-gray-500' 
                : 'bg-gray-100 border-gray-200 text-gray-600'}`}
            >
              <div className="container mx-auto px-4 text-center text-sm">
                <p> 2025 DataMind. All rights reserved.</p>
                <p className="mt-2">Secure document management with advanced AI capabilities.</p>
              </div>
            </footer>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;