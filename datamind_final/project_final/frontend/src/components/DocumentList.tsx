import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, Clock, Calendar, FileCode, File as FilePdf } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatFileSize } from '../lib/utils';
import { Card } from './ui/Card';
import Button from './ui/Button';

const DocumentList: React.FC = () => {
  const { sessionDocuments, removeDocument, setCurrentDocument, currentDocument } = useStore();

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FilePdf className="h-5 w-5 text-primary-400" />;
    if (type.includes('doc')) return <FileText className="h-5 w-5 text-primary-400" />;
    if (type.includes('txt')) return <FileCode className="h-5 w-5 text-primary-400" />;
    return <FileText className="h-5 w-5 text-primary-400" />;
  };

  if (sessionDocuments.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No documents uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <AnimatePresence>
        {sessionDocuments.map((document) => (
          <motion.div
            key={document.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card 
              className={`cursor-pointer h-full transition-all${
                currentDocument?.id === document.id 
                  ? 'gradient-border bg-primary-500/10' 
                  : 'hover:border-primary-500/30 border border-dark-100'
              }`}
              onClick={() => setCurrentDocument(document)}
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-dark-100 flex items-center justify-center mr-3 border border-dark-100">
                      {getFileIcon(document.type)}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-medium text-white truncate max-w-[180px]">
                        {document.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(document.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-500 p-1 h-auto"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card selection
                      removeDocument(document.id);
                      // If the deleted document is currently selected, deselect it
                      if (currentDocument?.id === document.id) {
                        setCurrentDocument(null);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-dark-100 text-xs text-gray-500">
                  <div className="flex items-center mb-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Uploaded: {document.uploadDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Modified: {document.lastModified.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default DocumentList;