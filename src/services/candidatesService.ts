import { Candidate } from '../types';
import { api } from './api';

export const candidatesService = {
  async getCandidates(params?: { page?: number; pageSize?: number; search?: string; stage?: string }) {
    const response = await api.getCandidates(params);
    return response;
  },

  async createCandidate(candidateData: Omit<Candidate, 'id' | 'appliedDate' | 'notes'>) {
    const response = await api.createCandidate(candidateData);
    return response;
  },

  async updateCandidate(id: string, updates: Partial<Candidate>) {
    const response = await api.updateCandidate(id, updates);
    return response;
  },

  async getCandidateById(id: string) {
    const response = await api.getCandidates();
    const candidate = response.data.find((c: Candidate) => c.id === id);
    if (!candidate) throw new Error('Candidate not found');
    return candidate;
  },

  async getCandidateTimeline(candidateId: string) {
    const response = await api.getCandidateTimeline(candidateId);
    return response;
  }
};