import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, File, FileText, FileCode } from 'lucide-react';
import { useStore } from '../store/useStore';
import Button from './ui/Button';

const FileUploader: React.FC = () => {
  const { addDocument } = useStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      // Directly upload the file using addDocument
      addDocument(file);
      // Logging for debug
      console.log('File uploaded:', file);
    });
  }, [addDocument]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    }
  });

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-6 w-6 text-primary-400" />;
    if (type.includes('doc')) return <FileText className="h-6 w-6 text-primary-400" />;
    if (type.includes('txt')) return <FileCode className="h-6 w-6 text-primary-400" />;
    return <File className="h-6 w-6 text-primary-400" />;
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive ? 'border-primary-500 bg-primary-500/10 shadow-glow' : 
          'border-dark-100 hover:border-primary-500/100'
        } ${
          isDragAccept ? 'border-green-500 bg-green-500/10' : ''
        } ${
          isDragReject ? 'border-red-500 bg-red-500/10' : ''
        }`}
      >
        <input {...getInputProps()} />
        
        <motion.div 
          className="flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/80 to-accent-600/30 flex items-center justify-center border border-primary-600/100">
            <Upload className="h-8 w-8 text-primary-400" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white">
              {isDragActive ? 'Drop your files here' : 'Upload your documents'}
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Drag and drop your PDF, Word, or text files
            </p>
          </div>
          
          <div className="flex gap-2 mt-2 shadow-glow rounded-full">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              leftIcon={<File className="h-4 w-4" />}
            >
              Browse files
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-4 rounded-full">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {getFileIcon('pdf')}
              <span>PDF</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {getFileIcon('doc')}
              <span>DOCX</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {getFileIcon('txt')}
              <span>TXT</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FileUploader;