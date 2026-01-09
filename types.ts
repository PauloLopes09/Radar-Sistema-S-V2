
export interface Institution {
  id: string;
  name: string;
  state: string;
  initials: string;
  url: string;
  status: 'online' | 'offline' | 'unknown';
  lastChecked?: string;
  lastResults?: Opportunity[];
}

export interface Opportunity {
  id: string;
  title: string;
  date: string;
  description: string;
  link: string;
  institution: string;
  isNew?: boolean;
}

export interface AnalysisResult {
  summary: string;
  fitScore: number; // 0-100
  pros: string[];
  cons: string[];
  recommendation: string;
}
