import { create } from 'zustand';
import { User, Document, ChatMessage, AIModel } from '../types';

interface AppState {
  user: User | null;
  documents: Document[];
  sessionDocuments: Document[]; // Track only documents uploaded in this session
  currentDocument: Document | null;
  chatMessages: ChatMessage[];
  availableModels: AIModel[];
  selectedModel: AIModel | null;
  theme: 'light' | 'dark';
  isProcessing: boolean;

  // Actions
  setUser: (user: User | null) => void;
  addDocument: (file: File) => Promise<void>;
  removeDocument: (documentId: string) => void;
  setCurrentDocument: (document: Document | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;
  setSelectedModel: (model: AIModel | null) => Promise<void>;
  toggleTheme: () => void;
  setIsProcessing: (isProcessing: boolean) => void;
  fetchDocuments: () => Promise<void>;
  fetchChatHistory: (documentId: string) => Promise<void>;
  summarizeDocument: (documentId: string, model: string) => Promise<string | undefined>;
  chatWithDocument: (documentId: string, query: string, model: string) => Promise<string | undefined>;
}

// Mock data for initial state
const mockModels: AIModel[] = [
  {
    id: '1',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    capabilities: ['summarization', 'chat', 'grammar'],
    description: 'Advanced language model with strong capabilities across all tasks.'
  },
  {
    id: '2',
    name: 'Mistral-7b',
    provider: 'Mistral',
    capabilities: ['summarization', 'chat'],
    description: 'Excellent for nuanced understanding and detailed responses.'
  }
];
const defaultUser: User = {
  id: '00000000-0000-0000-0000-000000000000', // valid UUID for testing
  name: 'User',
  email: 'datamind@gmail.com',
  preferences: {
    theme: 'light',
    fontSize: 'medium'
  }
};

export const useStore = create<AppState>((set, get) => ({
  user: defaultUser,
  documents: [],
  sessionDocuments: [], // Track only documents uploaded in this session
  currentDocument: null,
  chatMessages: [],
  availableModels: mockModels,
  selectedModel: mockModels[0],
  theme: 'dark',
  isProcessing: false,

  setUser: (user: User | null) => set({ user }),

  addDocument: async (file: File): Promise<void> => {
    set({ isProcessing: true });
    const user: User | null = get().user;
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('user_id', user?.id || '');
    let backendUrl: string = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) backendUrl = 'http://localhost:8000';
    backendUrl = backendUrl.replace(/\/$/, '');
    try {
      const response: Response = await fetch(`${backendUrl}/upload/`, {
        method: 'POST',
        body: formData
      });
      let result: any = {};
      try {
        result = await response.json();
      } catch (jsonErr: any) {
        result = { message: 'Server error or invalid response', error: jsonErr };
      }
      set({ isProcessing: false });
      if (result.document) {
        set((state: AppState) => ({
          sessionDocuments: [...state.sessionDocuments, {
            ...result.document,
            uploadDate: result.document.created_at ? new Date(result.document.created_at) : new Date(),
            lastModified: result.document.created_at ? new Date(result.document.created_at) : new Date(),
          }],
          currentDocument: result.document
        }));
      }
      if (result.message && !result.document) {
        alert(result.message);
      }
    } catch (err: any) {
      set({ isProcessing: false });
      alert('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  },

  removeDocument: (documentId: string) => set((state: AppState) => ({
    sessionDocuments: state.sessionDocuments.filter(doc => doc.id !== documentId),
    currentDocument: state.currentDocument?.id === documentId ? null : state.currentDocument
  })),

  setCurrentDocument: (document: Document | null) => set({ currentDocument: document }),

  addChatMessage: (message: ChatMessage) => set((state: AppState) => ({
    chatMessages: [...state.chatMessages, message]
  })),

  clearChatMessages: () => set({ chatMessages: [] }),

  setSelectedModel: async (model: AIModel | null): Promise<void> => {
    if (!model) return;
    set({ selectedModel: model });
    const user: User | null = get().user;
    let backendUrl: string = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) backendUrl = 'http://localhost:8000';
    if (user) {
      await fetch(`${backendUrl}/supabase/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          summarizer_model: model.id,
          chatbot_model: model.id
        })
      });
    }
  },

  toggleTheme: () => set((state: AppState) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),

  setIsProcessing: (isProcessing: boolean) => set({ isProcessing }),

  fetchDocuments: async (): Promise<void> => {
    // Do not fetch previous documents on session start
    set({ documents: [] });
    // Only sessionDocuments will be used in the UI
  },

  fetchChatHistory: async (documentId: string): Promise<void> => {
    let backendUrl: string = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) backendUrl = 'http://localhost:8000';
    try {
      const response: Response = await fetch(`${backendUrl}/supabase/chatHistory?document_id=${documentId}`);
      let result: any = {};
      try {
        result = await response.json();
      } catch (jsonErr: any) {
        result = { message: 'Server error or invalid response', error: jsonErr };
      }
      if (result.chat_history) {
        set({ chatMessages: result.chat_history });
      }
      if (result.message) {
        alert(result.message);
      }
    } catch (err: any) {
      alert('Failed to fetch chat history: ' + (err instanceof Error ? err.message : String(err)));
    }
  },

  summarizeDocument: async (documentId: string, model: string): Promise<string | undefined> => {
    let backendUrl: string = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) backendUrl = 'http://localhost:8000';
    try {
      const formData = new FormData();
      formData.append('document_id', documentId);
      formData.append('model', model);
      const response: Response = await fetch(`${backendUrl}/summarize/`, {
        method: 'POST',
        body: formData
      });
      let result: any = {};
      try {
        result = await response.json();
      } catch (jsonErr: any) {
        result = { message: 'Server error or invalid response', error: jsonErr };
      }
      if (result.summary) {
        return result.summary;
      }
      if (result.message) {
        alert(result.message);
      }
    } catch (err: any) {
      alert('Failed to summarize document: ' + (err instanceof Error ? err.message : String(err)));
    }
  },

  chatWithDocument: async (documentId: string, query: string, model: string): Promise<string | undefined> => {
    let backendUrl: string = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) backendUrl = 'http://localhost:8000';
    try {
      const formData = new FormData();
      formData.append('document_id', documentId);
      formData.append('query', query);
      formData.append('model', model);
      const response: Response = await fetch(`${backendUrl}/chat/`, {
        method: 'POST',
        body: formData
      });
      let result: any = {};
      try {
        result = await response.json();
      } catch (jsonErr: any) {
        result = { message: 'Server error or invalid response', error: jsonErr };
      }
      if (result.response) {
        return result.response;
      }
      if (result.message) {
        alert(result.message);
      }
    } catch (err: any) {
      alert('Failed to chat with document: ' + (err instanceof Error ? err.message : String(err)));
    }
  },
}));