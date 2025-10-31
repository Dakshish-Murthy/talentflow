export const LOGIN_CREDENTIALS = {
  hr: [
    { email: 'hr@talentflow.com', password: 'hr123', name: 'HR Manager' },
    { email: 'admin@talentflow.com', password: 'admin123', name: 'Admin User' },
    { email: 'recruiter@company.com', password: 'recruiter123', name: 'Recruiter' }
  ],
  candidate: [
    { email: 'candidate@talentflow.com', password: 'candidate123', name: 'Demo Candidate' },
    { email: 'john.doe@email.com', password: 'john123', name: 'John Doe' },
    { email: 'sarah.wilson@email.com', password: 'sarah123', name: 'Sarah Wilson' },
    { email: 'demo@candidate.com', password: 'demo123', name: 'Demo User' }
  ]
} as const;

export const APP_CONFIG = {
  name: 'TalentFlow',
  version: '1.0.0',
  description: 'Enterprise Hiring Platform',
  features: {
    aiMatching: true,
    assessments: true,
    analytics: true,
    collaboration: true
  }
} as const;

export const ROUTES = {
  HR: {
    DASHBOARD: '/jobs',
    CANDIDATES: '/candidates',
    ASSESSMENTS: '/assessments'
  },
  CANDIDATE: {
    DASHBOARD: '/candidate-dashboard',
    JOBS: '/jobs',
    APPLICATIONS: '/applications'
  }
} as const;