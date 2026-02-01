
export enum VerificationStatus {
  SUPPORTED = 'Scientifically Supported',
  PARTIAL = 'Partially Supported',
  NOT_SUPPORTED = 'Not Supported',
  INSUFFICIENT_EVIDENCE = 'Insufficient Evidence'
}

export interface VerificationResult {
  claim: string;
  classification: VerificationStatus;
  ingredients: string[];
  scientificExplanation: string;
  potentialRisks: string;
  alternatives: string[];
  confidenceScore: number;
}

export interface HistoryItem extends VerificationResult {
  id: string;
  timestamp: number;
}
