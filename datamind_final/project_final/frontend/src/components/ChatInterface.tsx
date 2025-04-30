import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Trash, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import Button from './ui/Button';

const ChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const { chatMessages, addChatMessage, clearChatMessages, currentDocument, selectedModel, chatWithDocument } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentDocument || !selectedModel) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date(),
      documentId: currentDocument.id
    };
    
    addChatMessage(userMessage);
    setMessage('');
    
    // Call backend for AI response
    const aiResponseText = await chatWithDocument(
      currentDocument.id,
      userMessage.content,
      selectedModel.id === '1' ? 'gemini' : 'langchain'
    );
    const aiResponse = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: aiResponseText || 'No response from AI.',
      timestamp: new Date(),
      documentId: currentDocument.id
    };
    
    addChatMessage(aiResponse);
  };

  return (
    <div className="flex flex-col h-full bg-dark-200 rounded-xl shadow-lg border border-dark-100 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-dark-100">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center mr-2">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-medium text-white">
            Chat with {selectedModel?.name || 'AI Assistant'}
          </h3>
          {selectedModel && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              {selectedModel.provider}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Trash className="h-4 w-4" />}
          onClick={clearChatMessages}
          className="text-gray-500"
        >
          Clear
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-300">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="w-16 h-16 rounded-full bg-dark-100 flex items-center justify-center mb-4 border border-dark-100">
              <Bot className="h-8 w-8 text-gray-600" />
            </div>
            <p className="max-w-md text-gray-400">
              {currentDocument 
                ? `Ask questions about "${currentDocument.name}" and I'll help you understand it.` 
                : "Select a document to start chatting with the AI assistant."}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`flex max-w-[80%] ${
                    msg.role === 'user' 
                      ? 'flex-row-reverse' 
                      : 'flex-row'
                  }`}
                >
                  <div 
                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      msg.role === 'user'
                        ? 'bg-primary-500/20 text-primary-400 ml-2 border border-primary-500/30'
                        : 'bg-dark-100 text-gray-400 mr-2 border border-dark-100'
                    }`}
                  >
                    {msg.role === 'user' 
                      ? <User className="h-4 w-4" /> 
                      : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <div 
                    className={`p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                        : 'bg-dark-100 text-gray-200 border border-dark-100'
                    }`}
                  >
                    <p className="text-sm rounded-e-full">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        )}
      </div>
      
      <div className="p-4 border-t border-dark-100">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={currentDocument ? "Ask about this document..." : "Select a document first..."}
            disabled={!currentDocument}
            className="flex-1 rounded-md border border-dark-100 bg-dark-300 px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 text-white"
          />
          <Button
            type="submit"
            disabled={!message.trim() || !currentDocument}
            rightIcon={<Send className="h-4 w-4" />}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;