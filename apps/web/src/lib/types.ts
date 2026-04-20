export interface Condition {
  name: string;
  probability: number;
  reason?: string;
}

export interface ExtractedData {
  age?: number;
  symptoms: string[];
  duration?: string;
  location?: string;
  medicalHistory?: string[];
  conditions: Condition[];
  readyToSearch?: boolean;
}

export type ExtractionStatus =
  | "gathering"
  | "extracting"
  | "searching"
  | "complete";

export interface TrialData {
  nctId: string;
  title: string;
  relevanceScore: number;
  matchReasons: string[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  trials?: TrialData[];
  extractedData?: ExtractedData;
}
