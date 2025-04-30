import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

// Get document overview/description (not summary)
export async function getDocumentDescription(documentId: string): Promise<string> {
  try {
    const res = await axios.get(`${BASE_URL}/summarize/description/${documentId}`);
    return res.data.description || '';
  } catch (e: any) {
    return 'No description available.';
  }
}

// Get document summary (detailed)
export async function summarizeDocument(documentId: string, provider: string): Promise<string> {
  try {
    const res = await axios.post(`${BASE_URL}/summarize`, new URLSearchParams({
      document_id: documentId,
      model: provider,
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return res.data.summary || '';
  } catch (e: any) {
    return 'No summary available.';
  }
}
