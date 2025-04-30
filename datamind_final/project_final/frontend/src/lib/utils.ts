import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileTypeIcon(fileType: string): string {
  const type = fileType.toLowerCase();
  
  if (type.includes('pdf')) return 'file-text';
  if (type.includes('doc') || type.includes('word')) return 'file-text';
  if (type.includes('txt') || type.includes('text')) return 'file-text';
  
  return 'file';
}