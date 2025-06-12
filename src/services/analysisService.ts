import { 
  calculateRiskScore, 
  mapToDataCollectionItems, 
  RISK_LEVELS,
  RISK_WEIGHTS,
  type RiskAssessmentResult,
  type DataCollectionItem,
  type DataCategory
} from '../utils/riskAssessment';

export interface AnalysisResult {
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
    category: DataCategory;
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
  summary?: string;
}

// Enhance raw analysis with risk assessment
function enhanceAnalysisWithRiskAssessment(rawAnalysis: any): AnalysisResult {
  // Map the raw analysis to our data model
  const dataCollectionItems = mapToDataCollectionItems(rawAnalysis);
  
  // Calculate risk score and get assessment
  const riskAssessment = calculateRiskScore(dataCollectionItems);
  
  // Get risk level details
  const riskLevel = Object.entries(RISK_LEVELS).find(([_, level]) => 
    riskAssessment.score >= level.min && riskAssessment.score <= level.max
  )?.[1] || RISK_LEVELS.low;

  // Format the response
  return {
    risk_score: riskAssessment.score,
    risk_level: {
      level: riskAssessment.level,
      color: riskLevel.color,
      label: riskLevel.label,
      description: riskLevel.description,
    },
    data_collection: dataCollectionItems.map((item: DataCollectionItem) => {
      const itemRisk = Object.entries(RISK_LEVELS).find(([_, level]) => 
        (RISK_WEIGHTS[item.category as keyof typeof RISK_WEIGHTS] * 100) >= level.min && 
        (RISK_WEIGHTS[item.category as keyof typeof RISK_WEIGHTS] * 100) <= level.max
      )?.[0] as 'low' | 'medium' | 'high' | 'critical' || 'medium';
      
      return {
        type: item.type,
        purpose: item.purpose,
        category: item.category,
        risk: itemRisk,
        risk_score: Math.round(RISK_WEIGHTS[item.category as keyof typeof RISK_WEIGHTS] * 100),
      };
    }),
    risk_factors: {
      data_sensitivity: riskAssessment.factors.dataSensitivity,
      collection_context: riskAssessment.factors.collectionContext,
      storage_security: riskAssessment.factors.storageSecurity,
      data_sharing: riskAssessment.factors.dataSharing,
      user_controls: riskAssessment.factors.userControls,
    },
    recommendations: riskAssessment.recommendations,
    raw_analysis: rawAnalysis,
  };
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

// Export the service functions
export const analysisService = {
  enhanceAnalysisWithRiskAssessment,
  mockAnalyzePolicy
};

export default analysisService;
