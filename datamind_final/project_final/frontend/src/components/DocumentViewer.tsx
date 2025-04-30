import React, { useEffect, useState } from 'react';
import { FileText, Download, Copy, Pencil, Sparkles, FileCode, File as FilePdf } from 'lucide-react';
import { useStore } from '../store/useStore';
import Button from './ui/Button';
import { formatFileSize } from '../lib/utils';
import { getDocumentDescription, summarizeDocument } from '../lib/api'; // Import the getDocumentDescription function

const DocumentViewer: React.FC = () => {
  const { currentDocument, isProcessing, selectedModel } = useStore();
  const [description, setDescription] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Generate short description after document upload
  useEffect(() => {
    if (currentDocument) {
      setDescription(null);
      setSummary(null);
      const genDescription = async () => {
        setIsSummarizing(true);
        // Call a new API endpoint for description (overview), not summary
        const desc = await getDocumentDescription(currentDocument.id); // <-- This should call the backend's description endpoint
        setDescription(desc || 'No description available.');
        setIsSummarizing(false);
      };
      genDescription();
    } else {
      setDescription(null);
      setSummary(null);
    }
  }, [currentDocument]);

  const handleSummarize = async () => {
    if (!currentDocument || !selectedModel) return;
    setIsSummarizing(true);
    // Call the summary endpoint for a detailed summary
    const result = await summarizeDocument(currentDocument.id, selectedModel.id === '1' ? 'groq' : 'hf');
    setSummary(result || 'No summary available.');
    setIsSummarizing(false);
  };

  const getFileIcon = (type: string) => {
    if (type?.includes('pdf')) return <FilePdf className="h-5 w-5 text-primary-400" />;
    if (type?.includes('doc')) return <FileText className="h-5 w-5 text-primary-400" />;
    if (type?.includes('txt')) return <FileCode className="h-5 w-5 text-primary-400" />;
    return <FileText className="h-5 w-5 text-primary-400" />;
  };

  if (!currentDocument) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-dark-200 rounded-xl border border-dark-100">
        <FileText className="h-16 w-16 text-gray-700 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">
          No document selected
        </h3>
        <p className="text-gray-400 max-w-md">
          Select a document from the list or upload a new one to view its contents and analyze it.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full bg-dark-200 rounded-3xl shadow-lg border border-dark-100 overflow-hidden min-h-[700px] resize both"
      style={{ resize: 'both', minHeight: 700, minWidth: 400, maxWidth: '100vw', maxHeight: '100vh', overflow: 'auto' }}
    >
      <div className="flex items-center justify-between p-4 border-b border-dark-100">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-dark-100 flex items-center justify-center mr-3 border border-dark-100">
            {getFileIcon(currentDocument.type)}
          </div>
          <div>
            <h3 className="font-medium text-white">
              {currentDocument.name}
            </h3>
            <p className="text-xs text-gray-400">
              {formatFileSize(currentDocument.size)} • {currentDocument.type}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Copy className="h-4 w-4" />}
          >
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Download
          </Button>
        </div>
      </div>
      {/* Short Description */}
      <div className="px-6 pt-4 pb-2">
        <span className="block text-primary-400 text-sm font-semibold mb-1">Overview</span>
        <div className="text-gray-300 text-sm bg-dark-300 rounded p-3 border border-dark-100">
          {isSummarizing && !summary ? 'Generating overview...' : (description ? description.split(/\r?\n/).slice(0,3).join('\n') : '')}
        </div>
      </div>
      {/* Summarized Content */}
      {summary && (
        <div className="px-4 pt-4 pb-4">
          <span className="block text-primary-400 text-sm font-semibold mb-1">Summary</span>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-6">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-dark-100 border-t-primary-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-300">Processing document...</p>
          </div>
        ) : (
          summary && (
            <div className="max-w-none">
              <pre
                className="whitespace-pre-wrap font-sans text-gray-300 p-4 bg-dark-300 rounded-lg border border-dark-100 min-h-[160px] max-h-[1080px] overflow-y-auto"
              >
                {summary}
              </pre>
            </div>
          )
        )}
      </div>
      <div className="p-4 border-t border-dark-100">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="hover:bg-blue-500 rounded-full"
            leftIcon={<Sparkles className="h-4 w-4" />}
            onClick={handleSummarize}
            disabled={isSummarizing || isProcessing}
          >
            {isSummarizing ? 'Summarizing...' : 'Summarize'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;