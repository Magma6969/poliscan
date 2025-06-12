// Risk weights for different data categories
export const RISK_WEIGHTS = {
  // Sensitive Data (Highest Risk)
  financial: 1.0,
  health: 1.0,
  biometric: 1.0,
  governmentId: 1.0,
  preciseLocation: 1.0,
  racialEthnic: 1.0,
  politicalOpinions: 1.0,
  religiousBeliefs: 1.0,
  sexualOrientation: 1.0,
  tradeUnionMembership: 1.0,
  geneticData: 1.0,
  
  // Personal Identifiers (High Risk)
  fullName: 0.8,
  email: 0.8,
  phone: 0.8,
  address: 0.8,
  ipAddress: 0.8,
  deviceId: 0.8,
  accountCredentials: 0.8,
  
  // Behavioral Data (Medium Risk)
  browsingHistory: 0.6,
  searchHistory: 0.6,
  purchaseHistory: 0.6,
  appUsage: 0.6,
  interactionData: 0.6,
  preferences: 0.6,
  
  // Diagnostic/Technical Data (Low Risk)
  crashReports: 0.3,
  performanceData: 0.3,
  diagnosticLogs: 0.3,
  systemActivity: 0.3,
  errorReports: 0.3
} as const;

export type DataCategory = keyof typeof RISK_WEIGHTS;

export interface DataCollectionItem {
  type: string;
  purpose: string;
  category: DataCategory;
  retentionPeriod?: string;
  sharedWithThirdParties: boolean;
  securityMeasures: string[];
}

export interface RiskAssessmentResult {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    dataSensitivity: number;
    collectionContext: number;
    storageSecurity: number;
    dataSharing: number;
    userControls: number;
  };
  recommendations: string[];
}

/**
 * Calculate risk score based on data collection items
 */
export function calculateRiskScore(items: DataCollectionItem[]): RiskAssessmentResult {
  if (!items || items.length === 0) {
    return {
      score: 0,
      level: 'low',
      factors: {
        dataSensitivity: 0,
        collectionContext: 0,
        storageSecurity: 0,
        dataSharing: 0,
        userControls: 0
      },
      recommendations: []
    };
  }

  // Calculate base risk from data categories
  const dataSensitivity = calculateDataSensitivityScore(items);
  
  // Calculate other risk factors
  const collectionContext = calculateCollectionContextScore(items);
  const storageSecurity = calculateStorageSecurityScore(items);
  const dataSharing = calculateDataSharingScore(items);
  const userControls = calculateUserControlsScore(items);

  // Calculate weighted score (0-100)
  const score = Math.min(
    100,
    Math.round(
      (dataSensitivity * 0.4) +
      (collectionContext * 0.2) +
      (storageSecurity * 0.2) +
      (dataSharing * 0.15) +
      (userControls * 0.05)
    )
  );

  // Determine risk level
  let level: RiskAssessmentResult['level'] = 'low';
  if (score >= 75) level = 'critical';
  else if (score >= 50) level = 'high';
  else if (score >= 25) level = 'medium';

  // Generate recommendations
  const recommendations = generateRecommendations({
    score,
    dataSensitivity,
    collectionContext,
    storageSecurity,
    dataSharing,
    userControls,
    items
  });

  return {
    score,
    level,
    factors: {
      dataSensitivity,
      collectionContext,
      storageSecurity,
      dataSharing,
      userControls
    },
    recommendations
  };
}

function calculateDataSensitivityScore(items: DataCollectionItem[]): number {
  let totalScore = 0;
  let maxPossibleScore = 0;

  items.forEach(item => {
    const weight = RISK_WEIGHTS[item.category as DataCategory] || 0.5;
    totalScore += weight * 100;
    maxPossibleScore += 100;
  });

  return maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
}

function calculateCollectionContextScore(items: DataCollectionItem[]): number {
  // Evaluate purpose limitation and necessity
  const purposes = new Set(items.map(item => item.purpose));
  const hasVaguePurposes = Array.from(purposes).some(
    p => p.toLowerCase().includes('improve') || 
         p.toLowerCase().includes('enhance') ||
         p.toLowerCase().includes('personalize')
  );

  // Check if consent is explicitly mentioned
  const hasExplicitConsent = items.some(item => 
    item.purpose.toLowerCase().includes('consent') ||
    item.purpose.toLowerCase().includes('agreement')
  );

  // Check data minimization
  const hasMinimization = items.every(item => 
    item.purpose && 
    item.purpose.length > 0 &&
    !item.purpose.toLowerCase().includes('all data')
  );

  let score = 50; // Neutral starting point
  if (hasVaguePurposes) score += 20;
  if (!hasExplicitConsent) score += 15;
  if (!hasMinimization) score += 15;

  return Math.min(100, score);
}

function calculateStorageSecurityScore(items: DataCollectionItem[]): number {
  // Check security measures
  const hasEncryption = items.some(item => 
    item.securityMeasures.some(measure => 
      measure.toLowerCase().includes('encrypt')
    )
  );

  const hasAccessControls = items.some(item =>
    item.securityMeasures.some(measure =>
      measure.toLowerCase().includes('access') ||
      measure.toLowerCase().includes('authentication')
    )
  );

  // Check retention periods
  const hasIndefiniteRetention = items.some(item => 
    item.retentionPeriod && 
    (item.retentionPeriod.toLowerCase().includes('indefinite') ||
     item.retentionPeriod.toLowerCase().includes('forever') ||
     item.retentionPeriod.toLowerCase().includes('retained'))
  );

  let score = 50; // Neutral starting point
  if (!hasEncryption) score += 30;
  if (!hasAccessControls) score += 20;
  if (hasIndefiniteRetention) score += 20;

  return Math.min(100, score);
}

function calculateDataSharingScore(items: DataCollectionItem[]): number {
  // Check if data is shared with third parties
  const sharesWithThirdParties = items.some(item => item.sharedWithThirdParties);
  
  // Check international transfers
  const hasInternationalTransfers = items.some(item => 
    item.securityMeasures.some(measure => 
      measure.toLowerCase().includes('international') ||
      measure.toLowerCase().includes('transfer')
    )
  );

  // Check if data is aggregated/anonymized
  const hasAggregation = items.some(item =>
    item.securityMeasures.some(measure =>
      measure.toLowerCase().includes('aggregate') ||
      measure.toLowerCase().includes('anonymize') ||
      measure.toLowerCase().includes('pseudonymize')
    )
  );

  let score = 30; // Start lower as sharing is generally higher risk
  if (sharesWithThirdParties) score += 40;
  if (hasInternationalTransfers) score += 20;
  if (!hasAggregation) score += 10;

  return Math.min(100, score);
}

function calculateUserControlsScore(items: DataCollectionItem[]): number {
  // Check for user control options
  const hasAccessRights = items.some(item =>
    item.securityMeasures.some(measure =>
      measure.toLowerCase().includes('access') ||
      measure.toLowerCase().includes('download')
    )
  );

  const hasDeletionRights = items.some(item =>
    item.securityMeasures.some(measure =>
      measure.toLowerCase().includes('delete') ||
      measure.toLowerCase().includes('erasure')
    )
  );

  const hasOptOut = items.some(item =>
    item.securityMeasures.some(measure =>
      measure.toLowerCase().includes('opt') ||
      measure.toLowerCase().includes('preference')
    )
  );

  let score = 70; // Start higher as we're looking for presence of controls
  if (!hasAccessRights) score -= 20;
  if (!hasDeletionRights) score -= 20;
  if (!hasOptOut) score -= 10;

  return Math.max(0, score);
}

function generateRecommendations(params: {
  score: number;
  dataSensitivity: number;
  collectionContext: number;
  storageSecurity: number;
  dataSharing: number;
  userControls: number;
  items: DataCollectionItem[];
}): string[] {
  const recommendations: string[] = [];
  const { score, dataSensitivity, storageSecurity, dataSharing, userControls } = params;

  // General recommendations based on score
  if (score >= 75) {
    recommendations.push("⚠️ Critical: This privacy policy indicates significant privacy risks. Consider consulting with a privacy professional.");
  } else if (score >= 50) {
    recommendations.push("🔍 High Risk: This privacy policy has concerning elements. Review carefully before proceeding.");
  }

  // Data sensitivity recommendations
  if (dataSensitivity > 70) {
    recommendations.push("🔒 High sensitivity data detected: Consider if all collected data is necessary for the service's functionality.");
  }

  // Storage and security recommendations
  if (storageSecurity > 70) {
    recommendations.push("⚠️ Security concerns: The policy indicates potential security vulnerabilities in data storage and handling.");
  }

  // Data sharing recommendations
  if (dataSharing > 70) {
    recommendations.push("🌐 Extensive data sharing: Your data may be shared with multiple third parties. Review the 'Third-Party Sharing' section carefully.");
  }

  // User control recommendations
  if (userControls < 40) {
    recommendations.push("🛡️ Limited user controls: The policy provides limited options for controlling your data. Consider requesting additional controls from the service provider.");
  }

  // Check for specific high-risk data types
  const highRiskItems = params.items.filter(item => 
    ['financial', 'health', 'biometric', 'governmentId'].includes(item.category)
  );
  
  if (highRiskItems.length > 0) {
    const types = [...new Set(highRiskItems.map(item => item.type))].join(', ');
    recommendations.push(`⚠️ Sensitive data collection detected: ${types}. Ensure you understand why this data is being collected.`);
  }

  // Check for international transfers
  const hasInternationalTransfer = params.items.some(item => 
    item.securityMeasures.some(m => 
      m.toLowerCase().includes('international') || 
      m.toLowerCase().includes('transfer')
    )
  );
  
  if (hasInternationalTransfer) {
    recommendations.push("🌍 International data transfers detected: Your data may be transferred to and processed in countries with different data protection laws.");
  }

  return recommendations;
}

// Helper function to map raw analysis to our data model
export const mapToDataCollectionItems = (rawData: any): DataCollectionItem[] => {
  if (!rawData || !rawData.data_collection) return [];
  
  return rawData.data_collection.map((item: any) => ({
    type: item.type || item.data_type || 'Unknown',
    purpose: item.purpose || 'Not specified',
    category: mapToDataCategory(item.type || item.data_type),
    retentionPeriod: item.retention_period || item.retentionPeriod,
    sharedWithThirdParties: item.shared_with_third_parties || item.sharedWithThirdParties || false,
    securityMeasures: item.security_measures || item.securityMeasures || [],
    risk: item.risk || 'medium',
    risk_score: item.risk_score || 0,
    explanation: item.explanation || '',
    recommendations: item.recommendations || []
  }));
}

function mapToDataCategory(dataType: string): DataCategory {
  const lowerType = (dataType || '').toLowerCase();
  
  // Sensitive Data
  if (/(financial|bank|credit|payment|transaction)/i.test(lowerType)) return 'financial';
  if (/(health|medical|prescription|diagnos)/i.test(lowerType)) return 'health';
  if (/(biometric|fingerprint|face|voice|retina)/i.test(lowerType)) return 'biometric';
  if (/(ssn|social security|passport|drivers? ?license|government["\s-]?id)/i.test(lowerType)) return 'governmentId';
  if (/(precise|exact|gps|geolocation)/i.test(lowerType)) return 'preciseLocation';
  if (/(race|ethnic|religion|belief|political|union|sexual|orientation)/i.test(lowerType)) {
    if (/(race|ethnic)/i.test(lowerType)) return 'racialEthnic';
    if (/(political|election)/i.test(lowerType)) return 'politicalOpinions';
    if (/(religion|belief|caste)/i.test(lowerType)) return 'religiousBeliefs';
    if (/(union|labor)/i.test(lowerType)) return 'tradeUnionMembership';
    if (/(sexual|orientation|lgbtq)/i.test(lowerType)) return 'sexualOrientation';
  }
  if (/(genetic|dna|rna)/i.test(lowerType)) return 'geneticData';
  
  // Personal Identifiers
  if (/(name|fullname|first[\s-]?name|last[\s-]?name)/i.test(lowerType)) return 'fullName';
  if (/(email|e-?mail|e ?mail)/i.test(lowerType)) return 'email';
  if (/(phone|mobile|cell|telephone)/i.test(lowerType)) return 'phone';
  if (/(address|street|city|state|zip|postal|country)/i.test(lowerType)) return 'address';
  if (/(ip\s*address|ipv4|ipv6|internet protocol)/i.test(lowerType)) return 'ipAddress';
  if (/(device[\s-]?id|advertising[\s-]?id|idfa|gaid)/i.test(lowerType)) return 'deviceId';
  if (/(username|login|password|credential|auth)/i.test(lowerType)) return 'accountCredentials';
  
  // Behavioral Data
  if (/(brows(?:ing)?[\s-]?history|visited|urls?|websites?)/i.test(lowerType)) return 'browsingHistory';
  if (/(search[\s-]?history|queries|searches)/i.test(lowerType)) return 'searchHistory';
  if (/(purchase[\s-]?history|transactions?|orders?)/i.test(lowerType)) return 'purchaseHistory';
  if (/(app[\s-]?usage|screen[\s-]?time|time[\s-]?spent)/i.test(lowerType)) return 'appUsage';
  if (/(interaction|click|tap|scroll|hover|engagement)/i.test(lowerType)) return 'interactionData';
  if (/(preference|setting|option|choice)/i.test(lowerType)) return 'preferences';
  
  // Diagnostic/Technical Data
  if (/(crash|error|exception|bug|failure)/i.test(lowerType)) return 'crashReports';
  if (/(performance|speed|latency|load[\s-]?time)/i.test(lowerType)) return 'performanceData';
  if (/(log|record|audit|diagnostic|debug)/i.test(lowerType)) return 'diagnosticLogs';
  if (/(system|device|hardware|os|version|model)/i.test(lowerType)) return 'systemActivity';
  
  // Default to medium risk if we can't categorize
  return 'preferences';
}

// Risk level definitions
export const RISK_LEVELS = {
  low: {
    min: 0,
    max: 39,
    color: 'green.400',
    label: 'Low Risk',
    description: 'Minimal privacy concerns. Standard data collection with good security practices.'
  },
  medium: {
    min: 40,
    max: 69,
    color: 'yellow.400',
    label: 'Medium Risk',
    description: 'Moderate privacy concerns. Review data collection practices and sharing policies.'
  },
  high: {
    min: 70,
    max: 89,
    color: 'orange.400',
    label: 'High Risk',
    description: 'Significant privacy concerns. Exercise caution and review the policy carefully.'
  },
  critical: {
    min: 90,
    max: 100,
    color: 'red.500',
    label: 'Critical Risk',
    description: 'Severe privacy concerns. Consider avoiding this service or consulting a privacy professional.'
  }
} as const;
