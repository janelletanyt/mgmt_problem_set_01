export type ScreenType = 'chatbot' | 'marketplace' | 'explorer';

export type SolutionType = 'Software' | 'Hardware' | 'Hybrid Agent';

export type PricingModel = 'subscription' | 'one-time';

export interface AgentListing {
  id: string;
  name: string;
  tagline: string;
  vendorName: string;
  type: SolutionType;
  industry: string;
  targetRoles: string[];
  yearsFunctioning: number;
  basedIn: string;
  clients: string[];
  certifications: string[];
  pricingModel: PricingModel;
  pricingAmount: string;
  billingPeriod?: string; // e.g. "/ month" or "fixed license"
  rating: number;
  reviewCount: number;
  description: string;
  coreCapabilities: string[];
  problemSolved: string;
  demoTitle: string;
  demoDuration: string;
  demoHighlights: string[];
  isFeatured?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickOptions?: string[];
  category?: 'persona' | 'software_type' | 'role_industry' | 'problem_statement' | 'completed';
}

export interface UserAssessment {
  userType: 'buyer' | 'seller' | null;
  softwareInterest: string;
  industry: string;
  role: string;
  problemStatement: string;
  desiredOutcome: string;
}
