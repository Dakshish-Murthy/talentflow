import { Job } from '../types';
import { api } from './api';

export const jobsService = {
  async getJobs(params?: { page?: number; pageSize?: number; search?: string; status?: string }) {
    const response = await api.getJobs(params);
    return response;
  },

  async createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await api.createJob(jobData);
    return response;
  },

  async updateJob(id: string, updates: Partial<Job>) {
    const response = await api.updateJob(id, updates);
    return response;
  },

  async reorderJobs(fromOrder: number, toOrder: number) {
    const response = await api.reorderJobs(fromOrder, toOrder);
    return response;
  },

  async getJobById(id: string) {
    // Get all jobs and filter
    const response = await api.getJobs();
    const job = response.data.find((j: Job) => j.id === id);
    if (!job) throw new Error('Job not found');
    return job;
  }
};