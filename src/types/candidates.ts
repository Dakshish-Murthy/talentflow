export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
  jobId: string;
  jobTitle?: string; // Add this
  appliedDate: string;
  experience?: string; // Add this
  location?: string; // Add this
  skills?: string[]; // Add this
  resume?: string;
  notes?: string;
  coverLetter?: string;
}