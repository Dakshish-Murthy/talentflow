export interface Job {
  id: string;
  title: string;
  slug: string;
  description?: string;
  company?: string;
  location?: string;
  salary?: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  brandLogo?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
  jobId: string;
  jobTitle?: string;
  appliedDate: Date | string;
  location?: string;
  experience?: string;
  skills?: string[];
  notes: Note[];
  resume?: string;
}

export interface Note {
  id: string;
  author: string;
  content: string;
  timestamp: Date | string;
  mentions: string[];
  createdAt?: Date | string; // Add createdAt for backward compatibility
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description: string;
  sections: Section[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file';
  question: string;
  required?: boolean;
  options?: string[];
  correctAnswer?: string | string[];
  maxLength?: number;
  min?: number;
  max?: number;
  conditionalLogic?: ConditionalLogic; // Add conditional logic
  validationRules?: ValidationRule[];
}

export interface ConditionalLogic {
  dependsOn: string;
  condition: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
  value: any;
}

export interface ValidationRule {
  type: 'required' | 'min-length' | 'max-length' | 'pattern' | 'min' | 'max';
  value?: any;
  message: string;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  candidateId: string;
  responses: QuestionResponse[];
  submittedAt: Date | string;
  score?: number;
}

export interface QuestionResponse {
  questionId: string;
  answer: string | string[] | number | File;
}

export interface TimelineEvent {
  id: string;
  type: 'stage_change' | 'note' | 'assessment' | 'interview';
  timestamp: Date | string;
  stage?: Candidate['stage'];
  description?: string;
  author?: string;
  content?: string;
}

// Add assessment form state interface
export interface AssessmentFormState {
  currentResponse: AssessmentResponse | null;
  validationErrors: Record<string, string>;
}