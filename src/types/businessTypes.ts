export type BusinessSector = 
  | "retail"
  | "technology"
  | "manufacturing"
  | "services"
  | "food";

export interface BusinessTemplate {
  id: string;
  name: string;
  sector: BusinessSector;
  template: string; // Base64 encoded Excel template
}

export interface ChatMessage {
  id: number;
  text: string;
  timestamp: Date;
  sent: boolean;
  type?: 'question' | 'response' | 'system';
}