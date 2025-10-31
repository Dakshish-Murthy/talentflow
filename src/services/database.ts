import Dexie, { Table } from 'dexie';
import { Job, Candidate, Assessment, AssessmentResponse } from '../types';

export class TalentFlowDB extends Dexie {
  jobs!: Table<Job, string>;
  candidates!: Table<Candidate, string>;
  assessments!: Table<Assessment, string>;
  responses!: Table<AssessmentResponse, string>;

  constructor() {
    super('TalentFlowDB');
    this.version(3).stores({
      jobs: 'id, slug, status, order, company, location',
      candidates: 'id, email, stage, jobId, name, appliedDate',
      assessments: 'id, jobId, title',
      responses: 'id, assessmentId, candidateId, submittedAt'
    });
  }

  // Helper methods
  async getJobCandidates(jobId: string): Promise<Candidate[]> {
    return this.candidates.where('jobId').equals(jobId).toArray();
  }

  async getCandidateByEmail(email: string): Promise<Candidate | undefined> {
    return this.candidates.where('email').equals(email).first();
  }

  async getActiveJobs(): Promise<Job[]> {
    return this.jobs.where('status').equals('active').sortBy('order');
  }

  async getJobsByStatus(status: string): Promise<Job[]> {
    return this.jobs.where('status').equals(status).sortBy('order');
  }
}

export const db = new TalentFlowDB();

// Initialize database on app start
db.on('populate', async () => {
  console.log('Database is being populated');
});

// Handle database errors
db.open().catch((error: Error) => {
  console.error('Database error:', error);
});