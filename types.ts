
export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

export interface MentorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  corrections?: Correction[];
  overallFeedback?: string;
  timestamp: number;
}

export enum Topic {
  Business = 'Business',
  Mindset = 'Mindset',
  Leadership = 'Leadership',
  Productivity = 'Productivity',
  General = 'General'
}
