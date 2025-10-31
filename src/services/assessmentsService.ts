import { Assessment, AssessmentResponse } from '../types';
import { api } from './api';

export const assessmentsService = {
  async getAssessment(jobId: string) {
    try {
      const response = await api.getAssessment(jobId);
      return response;
    } catch (error) {
      // Return null if assessment doesn't exist
      return null;
    }
  },

  async createAssessment(jobId: string, assessmentData: Partial<Assessment>) {
    const response = await api.createAssessment(jobId, assessmentData);
    return response;
  },

  async updateAssessment(jobId: string, assessmentData: Partial<Assessment>) {
    const response = await api.updateAssessment(jobId, assessmentData);
    return response;
  },

  async submitAssessment(assessmentId: string, responses: any) {
    const response = await api.submitAssessment(assessmentId, responses);
    return response;
  },

  async saveAssessment(assessment: Assessment) {
    const response = await api.saveAssessment(assessment);
    return response;
  }
};