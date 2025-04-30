export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
    fontSize: 'small' | 'medium' | 'large';
  };
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  lastModified: Date;
  content?: string;
  summary?: string;
  userId: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Cohere' | 'Nemontron' | 'AssemblyAI'| 'Google'| 'Meta' | 'HuggingFace'| 'Mistral';
  capabilities: ('summarization' | 'chat' | 'grammar')[];
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  documentId?: string;
}