import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Check, Sparkles, Brain } from 'lucide-react';
import { useStore } from '../store/useStore';
import { AIModel } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';

const AIModelSelector: React.FC = () => {
  const { availableModels, selectedModel, setSelectedModel } = useStore();

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4 text-white flex items-center">
        <Brain className="h-5 w-5 mr-3 text-primary-400" />
        Select AI Model
      </h2>
      <div className="space-y-3">
        {availableModels.map((model) => (
          <motion.div
            key={model.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all ${
                selectedModel?.id === model.id 
                  ? 'gradient-border bg-primary-500/10' 
                  : 'border border-dark-100 hover:border-primary-500/30'
              }`}
              onClick={() => setSelectedModel(model)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                      selectedModel?.id === model.id 
                        ? 'bg-gradient-to-br from-primary-500 to-accent-600' 
                        : 'bg-dark-100 border border-dark-100'
                    }`}>
                      {selectedModel?.id === model.id ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-primary-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{model.name}</h3>
                      <p className="text-xs text-gray-400">{model.provider}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mt-3 mb-3">
                  {model.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {model.capabilities.map((capability) => (
                    <span 
                      key={capability}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/30"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      {capability.charAt(0).toUpperCase() + capability.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIModelSelector;