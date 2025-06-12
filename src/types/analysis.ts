import { DataCollectionItem as RiskAssessmentDataCollectionItem } from '../utils/riskAssessment';

// Re-export the DataCollectionItem from riskAssessment
// and extend it with additional properties used in the application
export interface DataCollectionItem extends RiskAssessmentDataCollectionItem {
  risk: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number;
  explanation?: string;
  recommendations?: string[];
  [key: string]: any; // Allow additional properties
}

export interface AnalysisResult {
  risk_score?: number;
  risk_level?: {
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
    [key: string]: any;
  }>;
  risk_factors?: {
    data_sensitivity: number;
    collection_context: number;
    storage_security: number;
    data_sharing: number;
    user_controls: number;
  };
  recommendations?: string[];
  raw_analysis?: any;
  summary?: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}
