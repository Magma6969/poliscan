// Import PDF.js with types
import * as pdfjsLib from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

// Set worker path for PDF.js
// In a create-react-app setup, we'll use the CDN version of the worker
const pdfjsWorker = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
// @ts-ignore - GlobalWorkerOptions is not in the type definitions but exists at runtime
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface TextItemWithStr extends TextItem {
  str: string;
}

/**
 * Extracts text content from a PDF file
 * @param file - The PDF file to extract text from
 * @returns A promise that resolves to the extracted text
 * @throws {Error} If text extraction fails
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument(typedArray);
    const pdfDocument = await loadingTask.promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      
            // Safely extract text from page items
      const pageText = textContent.items
        .filter((item): item is TextItem => 'str' in item)
        .map((item) => (item as TextItem).str)
        .filter(Boolean) // Remove any empty strings
        .join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to extract text from PDF: ${error.message}`
        : 'An unknown error occurred while extracting text from PDF'
    );
  }
};
