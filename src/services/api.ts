import { Job, Candidate, Assessment, AssessmentResponse } from '../types';
import { db } from './database';
import { seedDatabase } from '../data/seed';

const API_BASE = '/api';

const simulateLatency = (min: number = 200, max: number = 1200) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

const simulateError = (errorRate: number = 0.1) => Math.random() < errorRate;

// Initialize database with seed data
const initializeDatabase = async () => {
  try {
    const jobCount = await db.jobs.count();
    if (jobCount === 0) {
      console.log('Initializing database with seed data...');
      await seedDatabase();
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

export const api = {
  // Jobs endpoints
  async getJobs(params: any = {}) {
    await simulateLatency();
    await initializeDatabase();
    
    if (simulateError(0.05)) throw new Error('Failed to fetch jobs');
    
    try {
      let jobs = await db.jobs.orderBy('order').toArray();
      
      // Apply filters
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        jobs = jobs.filter(job => 
          job.title.toLowerCase().includes(searchLower) ||
          // Remove company from search
          job.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      if (params.status) {
        jobs = jobs.filter(job => job.status === params.status);
      }
      
      // Apply pagination
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedJobs = jobs.slice(startIndex, endIndex);
      
      return {
        data: paginatedJobs,
        total: jobs.length,
        page,
        pageSize,
        totalPages: Math.ceil(jobs.length / pageSize),
      };
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw new Error('Failed to fetch jobs');
    }
  },

  async createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) {
    await simulateLatency();
    await initializeDatabase();
    
    if (simulateError(0.1)) throw new Error('Failed to create job');
    
    try {
      // Get the highest order to place new job at the top
      const jobs = await db.jobs.orderBy('order').toArray();
      const maxOrder = jobs.length > 0 ? Math.max(...jobs.map(j => j.order)) : 0;
      
      const newJob: Job = {
        ...jobData,
        id: `job-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        order: maxOrder + 1,
      };
      
      await db.jobs.add(newJob);
      return newJob;
    } catch (error) {
      console.error('Error creating job:', error);
      throw new Error('Failed to create job');
    }
  },

  async updateJob(id: string, updates: Partial<Job>) {
    await simulateLatency();
    
    if (simulateError(0.1)) throw new Error('Failed to update job');
    
    try {
      const existingJob = await db.jobs.get(id);
      if (!existingJob) throw new Error('Job not found');
      
      const updatedJob = {
        ...existingJob,
        ...updates,
        updatedAt: new Date(),
      };
      
      await db.jobs.update(id, updatedJob);
      return updatedJob;
    } catch (error) {
      console.error('Error updating job:', error);
      throw new Error('Failed to update job');
    }
  },

  async reorderJobs(fromOrder: number, toOrder: number) {
    await simulateLatency();
    
    if (simulateError(0.1)) throw new Error('Reorder failed');
    
    try {
      const jobs = await db.jobs.orderBy('order').toArray();
      const fromIndex = jobs.findIndex(job => job.order === fromOrder);
      const toIndex = jobs.findIndex(job => job.order === toOrder);
      
      if (fromIndex === -1 || toIndex === -1) {
        throw new Error('Invalid reorder operation');
      }
      
      const [movedJob] = jobs.splice(fromIndex, 1);
      jobs.splice(toIndex, 0, movedJob);
      
      // Update orders in transaction
      await db.transaction('rw', db.jobs, async () => {
        for (let i = 0; i < jobs.length; i++) {
          await db.jobs.update(jobs[i].id, { order: i + 1 });
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error reordering jobs:', error);
      throw new Error('Failed to reorder jobs');
    }
  },

  // Candidates endpoints
  async getCandidates(params: any = {}) {
    await simulateLatency();
    await initializeDatabase();
    
    if (simulateError(0.05)) throw new Error('Failed to fetch candidates');
    
    try {
      let candidates = await db.candidates.toArray();
      
      // Apply filters
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        candidates = candidates.filter(candidate => 
          candidate.name.toLowerCase().includes(searchLower) ||
          candidate.email.toLowerCase().includes(searchLower)
        );
      }
      
      if (params.stage) {
        candidates = candidates.filter(candidate => candidate.stage === params.stage);
      }
      
      // Apply pagination
      const page = params.page || 1;
      const pageSize = params.pageSize || 50;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedCandidates = candidates.slice(startIndex, endIndex);
      
      return {
        data: paginatedCandidates,
        total: candidates.length,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw new Error('Failed to fetch candidates');
    }
  },

  async createCandidate(candidateData: Omit<Candidate, 'id' | 'appliedDate' | 'notes'>) {
    await simulateLatency();
    
    if (simulateError(0.1)) throw new Error('Failed to create candidate');
    
    try {
      const newCandidate: Candidate = {
        ...candidateData,
        id: `candidate-${Date.now()}`,
        appliedDate: new Date(),
        notes: [],
      };
      
      await db.candidates.add(newCandidate);
      return newCandidate;
    } catch (error) {
      console.error('Error creating candidate:', error);
      throw new Error('Failed to create candidate');
    }
  },

  async updateCandidate(id: string, updates: Partial<Candidate>) {
    await simulateLatency();
    
    if (simulateError(0.1)) throw new Error('Failed to update candidate');
    
    try {
      const existingCandidate = await db.candidates.get(id);
      if (!existingCandidate) throw new Error('Candidate not found');
      
      const updatedCandidate = {
        ...existingCandidate,
        ...updates,
      };
      
      await db.candidates.update(id, updatedCandidate);
      return updatedCandidate;
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw new Error('Failed to update candidate');
    }
  },

  async getCandidateTimeline(candidateId: string) {
    await simulateLatency();
    
    if (simulateError(0.05)) throw new Error('Failed to fetch candidate timeline');
    
    try {
      const candidate = await db.candidates.get(candidateId);
      if (!candidate) throw new Error('Candidate not found');
      
      // Generate timeline from candidate data and notes
      const timeline = [
        {
          id: 'applied',
          type: 'stage_change' as const,
          stage: 'applied' as const,
          timestamp: candidate.appliedDate,
          description: `Applied for ${candidate.jobTitle || 'the position'}`,
        },
        ...(candidate.notes || []).map(note => ({
          id: note.id,
          type: 'note' as const,
          timestamp: note.timestamp,
          author: note.author,
          content: note.content,
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      return timeline;
    } catch (error) {
      console.error('Error fetching candidate timeline:', error);
      throw new Error('Failed to fetch candidate timeline');
    }
  },

  // Assessment endpoints
  async getAssessment(jobId: string) {
    await simulateLatency();
    await initializeDatabase();
    
    if (simulateError(0.05)) {
      // Return null instead of throwing error for non-existent assessments
      return null;
    }
    
    try {
      const assessment = await db.assessments.where('jobId').equals(jobId).first();
      return assessment || null;
    } catch (error) {
      console.error('Error fetching assessment:', error);
      return null;
    }
  },

  async createAssessment(jobId: string, assessmentData: Partial<Assessment>) {
    await simulateLatency();
    
    if (simulateError(0.1)) throw new Error('Failed to create assessment');
    
    try {
      // Remove existing assessment for this job
      await db.assessments.where('jobId').equals(jobId).delete();
      
      const newAssessment: Assessment = {
        id: `assessment-${Date.now()}`,
        jobId,
        title: assessmentData.title || 'Untitled Assessment',
        description: assessmentData.description || '',
        sections: assessmentData.sections || [],
        ...assessmentData,
      };
      
      await db.assessments.add(newAssessment);
      return newAssessment;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw new Error('Failed to create assessment');
    }
  },

  async updateAssessment(jobId: string, assessmentData: Partial<Assessment>) {
    await simulateLatency();
    
    if (simulateError(0.1)) throw new Error('Failed to update assessment');
    
    try {
      const existingAssessment = await db.assessments.where('jobId').equals(jobId).first();
      
      if (!existingAssessment) {
        // Create new assessment if it doesn't exist
        return this.createAssessment(jobId, assessmentData);
      }
      
      const updatedAssessment = {
        ...existingAssessment,
        ...assessmentData,
      };
      
      await db.assessments.update(existingAssessment.id, updatedAssessment);
      return updatedAssessment;
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw new Error('Failed to update assessment');
    }
  },

  async submitAssessment(assessmentId: string, responseData: any) {
    await simulateLatency();
    
    if (simulateError(0.1)) throw new Error('Failed to submit assessment');
    
    try {
      const newResponse: AssessmentResponse = {
        id: `response-${Date.now()}`,
        assessmentId,
        candidateId: responseData.candidateId || `candidate-${Date.now()}`,
        responses: responseData.responses || [],
        submittedAt: new Date(),
      };
      
      await db.responses.add(newResponse);
      return newResponse;
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw new Error('Failed to submit assessment');
    }
  },

  // Add missing method that was referenced in assessmentsService
  async saveAssessment(assessment: Assessment) {
    return this.updateAssessment(assessment.jobId, assessment);
  },
};