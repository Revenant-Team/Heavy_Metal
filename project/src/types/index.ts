export interface HMPIData {
  sampleId: string;
  location: string;
  latitude: number;
  longitude: number;
  lead: number;
  chromium: number;
  arsenic: number;
  hmpiScore?: number;
  riskLevel?: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export interface RegionData {
  name: string;
  hmpiScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  coordinates: [number, number];
}

export interface ContaminationSource {
  type: string;
  confidence: number;
  description: string;
  icon: string;
}

export interface TrendData {
  month: string;
  value: number;
}