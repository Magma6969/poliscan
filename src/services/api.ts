import axios, { AxiosResponse } from 'axios';
import type { AnalysisResult as AnalysisResultType, DataCollectionItem } from '../types/analysis';
import { 
  RISK_WEIGHTS, 
  RISK_LEVELS, 
  calculateRiskScore, 
  mapToDataCollectionItems 
} from '../utils/riskAssessment';

// Type for API response data collection items
type ApiDataCollectionItem = {
  type: string;
  purpose: string;
  category: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number;
  sharedWithThirdParties: boolean;
  securityMeasures: string[];
  [key: string]: any;
};

// Type for the enhanced analysis result
type ApiAnalysisResult = Omit<AnalysisResultType, 'data_collection' | 'risk_level' | 'risk_factors' | 'recommendations' | 'raw_analysis'> & {
  data_collection: ApiDataCollectionItem[];
  risk_score: number; // Ensure risk_score is required
  risk_level: { // Ensure risk_level is required with all its properties
    level: 'low' | 'medium' | 'high' | 'critical';
    color: string;
    label: string;
    description: string;
  };
  risk_factors: { // Ensure risk_factors is required with all its properties
    data_sensitivity: number;
    collection_context: number;
    storage_security: number;
    data_sharing: number;
    user_controls: number;
  };
  recommendations: string[]; // Ensure recommendations is required and always an array
  raw_analysis: any; // Ensure raw_analysis is always defined
  [key: string]: any; // Allow additional properties
};

// Helper function to convert DataCollectionItem to ApiDataCollectionItem
function toApiDataCollectionItem(item: DataCollectionItem): ApiDataCollectionItem {
  const { type, purpose, category, risk, risk_score, ...rest } = item;
  return {
    type,
    purpose,
    category,
    risk,
    risk_score,
    ...rest
  };
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://poliscan-backend-production.up.railway.app';
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';
const HUGGINGFACE_API_KEY = process.env.REACT_APP_HUGGINGFACE_API_KEY;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(HUGGINGFACE_API_KEY ? { 'Authorization': `Bearer ${HUGGINGFACE_API_KEY}` } : {}),
  },
});

// Add a request interceptor to include the auth token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

interface AnalysisResult {
  risk_score: number;
  risk_level: {
    level: 'low' | 'medium' | 'high' | 'critical';
    color: string;
    label: string;
    description: string;
  };
  data_collection: Array<{
    type: string;
    purpose: string;
    category: string;
    risk: 'low' | 'medium' | 'high' | 'critical';
    risk_score: number;
    recommendations?: string[];
  }>;
  risk_factors: {
    data_sensitivity: number;
    collection_context: number;
    storage_security: number;
    data_sharing: number;
    user_controls: number;
  };
  recommendations: string[];
  raw_analysis: any;
}

// Analysis API
export const analyzePolicy = async (text: string): Promise<AnalysisResult> => {
  try {
    const response = await api.post('/analyze', { text });
    return enhanceAnalysisWithRiskAssessment(response.data);
  } catch (error) {
    console.error('Error analyzing policy:', error);
    throw error;
  }
};

export const analyzePolicyFromUrl = async (url: string): Promise<AnalysisResult> => {
  try {
    const response = await api.post('/analyze/url', { url });
    return enhanceAnalysisWithRiskAssessment(response.data);
  } catch (error) {
    console.error('Error analyzing policy from URL:', error);
    throw error;
  }
};

export const analyzePolicyFromPdf = async (file: File): Promise<AnalysisResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/analyze/pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return enhanceAnalysisWithRiskAssessment(response.data);
  } catch (error) {
    console.error('Error analyzing PDF policy:', error);
    throw error;
  }
};

// Enhance raw analysis with risk assessment
function enhanceAnalysisWithRiskAssessment(rawAnalysis: any): ApiAnalysisResult {
  // Map the raw analysis to our data model with default values
  const dataCollectionItems = mapToDataCollectionItems(rawAnalysis).map(item => {
    // Extract the base properties we want to ensure exist
    const baseItem = {
      type: item.type || 'unknown',
      purpose: item.purpose || 'Not specified',
      category: item.category || 'other',
      risk: 'medium' as const,
      risk_score: 0,
      sharedWithThirdParties: false,
      securityMeasures: [] as string[],
    };

    // Create the final item with defaults and override with any existing values
    return {
      ...baseItem,
      ...item,
      // Ensure arrays are properly initialized
      securityMeasures: item.securityMeasures || []
    } as ApiDataCollectionItem;
  });
  
  // Convert to DataCollectionItem array for risk calculation
  const riskItems = dataCollectionItems.map(item => ({
    ...item,
    sharedWithThirdParties: item.sharedWithThirdParties ?? false,
    securityMeasures: item.securityMeasures ?? []
  } as DataCollectionItem));
  
  // Calculate risk score and get assessment
  const riskAssessment = calculateRiskScore(riskItems);
  
  // Get risk level details
  const riskLevel = Object.entries(RISK_LEVELS).find(([_, level]) => 
    riskAssessment.score >= level.min && riskAssessment.score <= level.max
  )?.[1] || RISK_LEVELS.low;

  // Ensure risk_score is always a number
  const finalRiskScore = typeof riskAssessment.score === 'number' ? riskAssessment.score : 0;
  
  // Ensure risk_level is always defined with all required properties
  const riskLevelInfo = {
    level: riskAssessment.level || 'medium',
    color: riskLevel?.color || '#FFA500', // Orange as fallback color
    label: riskLevel?.label || 'Medium Risk',
    description: riskLevel?.description || 'Moderate privacy risk detected.'
  };
  
  // Ensure risk_factors is always defined with all required properties
  const riskFactors = {
    data_sensitivity: riskAssessment.factors?.dataSensitivity || 0,
    collection_context: riskAssessment.factors?.collectionContext || 0,
    storage_security: riskAssessment.factors?.storageSecurity || 0,
    data_sharing: riskAssessment.factors?.dataSharing || 0,
    user_controls: riskAssessment.factors?.userControls || 0
  };
  
  // Ensure raw_analysis is always defined
  const rawAnalysisData = rawAnalysis || {};
  
  // Return the enhanced analysis result
  const result: ApiAnalysisResult = {
    ...rawAnalysisData,
    data_collection: dataCollectionItems,
    risk_score: finalRiskScore,
    risk_level: riskLevelInfo,
    risk_factors: riskFactors,
    recommendations: riskAssessment.recommendations || [],
    raw_analysis: rawAnalysisData // Ensure raw_analysis is always defined
  };
  
  return result;
}

// Mock analysis for development
export const mockAnalyzePolicy = async (text: string): Promise<AnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = {
        risk_score: Math.floor(Math.random() * 100),
        data_collection: [
          { 
            type: 'Location Data', 
            purpose: 'Provide location-based services',
            category: 'preciseLocation',
            sharedWithThirdParties: true,
            securityMeasures: ['Encryption in transit']
          },
          { 
            type: 'Email Address', 
            purpose: 'Account creation and communication',
            category: 'email',
            sharedWithThirdParties: false,
            securityMeasures: ['Hashed storage', 'Access controls']
          },
          { 
            type: 'Usage Data', 
            purpose: 'Improve our services',
            category: 'appUsage',
            sharedWithThirdParties: true,
            securityMeasures: ['Anonymization', 'Aggregation']
          },
        ],
      };
      
      resolve(enhanceAnalysisWithRiskAssessment(mockData));
    }, 1500);
  });
};

const getPurposeForLabel = (label: string): string => {
  const purposes: Record<string, string> = {
    'data collection': 'Collecting user information',
    'data sharing': 'Sharing data with third parties',
    'data retention': 'Storing user data',
    'user rights': 'User rights and controls',
    'cookies': 'Using cookies and tracking technologies',
    'third-party services': 'Integrating with third-party services',
    'security measures': 'Protecting user data',
    'international transfers': 'Transferring data internationally'
  };
  
  return purposes[label] || 'General data processing';
};

// Helper function to get explanation for a label and score
const getExplanationForLabel = (label: string, score: number): string => {
  const explanations: Record<string, string> = {
    'data collection': `The policy ${score > 0.7 ? 'extensively collects' : score > 0.4 ? 'collects' : 'minimally collects'} user data.`,
    'data sharing': `Data is ${score > 0.7 ? 'widely shared' : score > 0.4 ? 'shared' : 'rarely shared'} with third parties.`,
    'data retention': `User data is ${score > 0.7 ? 'stored indefinitely' : score > 0.4 ? 'retained for extended periods' : 'kept only as long as necessary'}.`,
    'user rights': `Users have ${score > 0.7 ? 'limited' : score > 0.4 ? 'some' : 'strong'} control over their data.`,
    'cookies': `The site uses ${score > 0.7 ? 'extensive tracking' : score > 0.4 ? 'some tracking' : 'minimal tracking'} technologies.`,
    'third-party services': `The policy involves ${score > 0.7 ? 'many' : score > 0.4 ? 'some' : 'few'} third-party services.`,
    'security measures': `Data security is ${score > 0.7 ? 'minimally' : score > 0.4 ? 'adequately' : 'strongly'} addressed.`,
    'international transfers': `Data is ${score > 0.7 ? 'frequently' : score > 0.4 ? 'sometimes' : 'rarely'} transferred internationally.`
  };
  
  return explanations[label] || 'This aspect is addressed in the policy.';
};

// Helper function to get top concerns
const getTopConcerns = (labels: string[], scores: number[], count: number): string[] => {
  const indexedScores = labels.map((label, index) => ({
    label,
    score: scores[index]
  }));
  
  return indexedScores
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(item => item.label);
};
