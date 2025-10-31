import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  fetchAssessment,
  createAssessment,
  updateAssessment,
  submitResponse,
  setCurrentAssessment,
  updateCurrentAssessment,
  setCurrentResponse,
  updateCurrentResponse,
  updateResponseAnswer,
  togglePreviewMode,
  setValidationError,
  clearValidationError,
  clearAllValidationErrors,
  clearError,
  addSection,
  updateSection,
  removeSection,
  addQuestion,
  updateQuestion,
  removeQuestion,
} from '../store/slices/assessmentsSlice';
import { Assessment, AssessmentResponse } from '../types';

export const useAssessments = () => {
  const dispatch = useAppDispatch();
  const { 
    currentAssessment, 
    currentResponse, 
    loading, 
    error, 
    previewMode,
    validationErrors 
  } = useAppSelector((state) => state.assessments);

  const loadAssessment = useCallback((jobId: string) => {
    return dispatch(fetchAssessment(jobId));
  }, [dispatch]);

  const createNewAssessment = useCallback((jobId: string, title: string) => {
    return dispatch(createAssessment({ 
      jobId, 
      assessmentData: { 
        title,
        description: '',
        sections: []
      } 
    }));
  }, [dispatch]);

  const saveCurrentAssessment = useCallback(() => {
    if (!currentAssessment) return Promise.reject(new Error('No assessment to save'));
    
    return dispatch(updateAssessment({
      jobId: currentAssessment.jobId,
      assessmentData: currentAssessment
    }));
  }, [dispatch, currentAssessment]);

  const handleUpdateAssessment = useCallback((updates: Partial<Assessment>) => {
    dispatch(updateCurrentAssessment(updates));
  }, [dispatch]);

  const handleSubmitResponse = useCallback((assessmentId: string, response: any) => {
    return dispatch(submitResponse({ assessmentId, response }));
  }, [dispatch]);

  const handleSetCurrentResponse = useCallback((response: AssessmentResponse | null) => {
    dispatch(setCurrentResponse(response));
  }, [dispatch]);

  const handleUpdateResponse = useCallback((updates: Partial<AssessmentResponse>) => {
    dispatch(updateCurrentResponse(updates));
  }, [dispatch]);

  const handleUpdateResponseAnswer = useCallback((questionId: string, answer: any) => {
    dispatch(updateResponseAnswer({ questionId, answer }));
  }, [dispatch]);

  const handleTogglePreviewMode = useCallback(() => {
    dispatch(togglePreviewMode());
  }, [dispatch]);

  const handleSetValidationError = useCallback((questionId: string, error: string) => {
    dispatch(setValidationError({ questionId, error }));
  }, [dispatch]);

  const handleClearValidationError = useCallback((questionId: string) => {
    dispatch(clearValidationError(questionId));
  }, [dispatch]);

  const handleClearAllValidationErrors = useCallback(() => {
    dispatch(clearAllValidationErrors());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Section management
  const handleAddSection = useCallback((section: any) => {
    dispatch(addSection({ section }));
  }, [dispatch]);

  const handleUpdateSection = useCallback((sectionId: string, updates: any) => {
    dispatch(updateSection({ sectionId, updates }));
  }, [dispatch]);

  const handleRemoveSection = useCallback((sectionId: string) => {
    dispatch(removeSection(sectionId));
  }, [dispatch]);

  // Question management
  const handleAddQuestion = useCallback((sectionId: string, question: any) => {
    dispatch(addQuestion({ sectionId, question }));
  }, [dispatch]);

  const handleUpdateQuestion = useCallback((sectionId: string, questionId: string, updates: any) => {
    dispatch(updateQuestion({ sectionId, questionId, updates }));
  }, [dispatch]);

  const handleRemoveQuestion = useCallback((sectionId: string, questionId: string) => {
    dispatch(removeQuestion({ sectionId, questionId }));
  }, [dispatch]);

  return {
    // State
    currentAssessment,
    currentResponse,
    loading,
    error,
    previewMode,
    validationErrors,
    
    // Actions
    loadAssessment,
    createNewAssessment,
    saveCurrentAssessment,
    handleUpdateAssessment,
    handleSubmitResponse,
    handleSetCurrentResponse,
    handleUpdateResponse,
    handleUpdateResponseAnswer,
    togglePreviewMode: handleTogglePreviewMode,
    handleSetValidationError,
    handleClearValidationError,
    handleClearAllValidationErrors,
    clearError: handleClearError,
    setCurrentAssessment: handleSetCurrentResponse,
    
    // Section management
    handleAddSection,
    handleUpdateSection,
    handleRemoveSection,
    
    // Question management
    handleAddQuestion,
    handleUpdateQuestion,
    handleRemoveQuestion,
  };
};