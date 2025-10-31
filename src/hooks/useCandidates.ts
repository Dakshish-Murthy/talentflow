import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  fetchCandidates,
  updateCandidate,
  addCandidateNote,
  fetchCandidateTimeline,
  setFilters,
  setPagination,
  setCurrentCandidate,
  optimisticStageChange,
  rollbackStageChange,
} from '../store/slices/candidatesSlice';
import { Candidate, Note } from '../types';
import { candidatesService } from '../services/candidatesService';

export const useCandidates = () => {
  const dispatch = useAppDispatch();
  const { candidates, currentCandidate, loading, error, pagination, filters } = useAppSelector(
    (state) => state.candidates
  );

  const loadCandidates = useCallback((params?: any) => {
    return dispatch(fetchCandidates(params));
  }, [dispatch]);

  // Add the missing loadCandidate function
  const loadCandidate = useCallback(async (candidateId: string) => {
    try {
      const candidate = await candidatesService.getCandidateById(candidateId);
      dispatch(setCurrentCandidate(candidate));
      return candidate;
    } catch (error) {
      console.error('Failed to load candidate:', error);
      throw error;
    }
  }, [dispatch]);

  const updateCandidateStage = useCallback(async (candidateId: string, newStage: Candidate['stage']) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const oldStage = candidate.stage;
    
    // Optimistic update
    dispatch(optimisticStageChange({ candidateId, newStage }));
    
    try {
      await dispatch(updateCandidate({ id: candidateId, updates: { stage: newStage } })).unwrap();
    } catch (error) {
      // Rollback on failure
      dispatch(rollbackStageChange({ candidateId, oldStage }));
      throw error;
    }
  }, [dispatch, candidates]);

  const addNote = useCallback((candidateId: string, note: Omit<Note, 'id' | 'createdAt'>) => {
    return dispatch(addCandidateNote({ candidateId, note }));
  }, [dispatch]);

  const createCandidate = useCallback(async (candidateData: Omit<Candidate, 'id' | 'appliedDate' | 'notes'>) => {
    const response = await candidatesService.createCandidate(candidateData);
    return response;
  }, []);

  const loadTimeline = useCallback((candidateId: string) => {
    return dispatch(fetchCandidateTimeline(candidateId));
  }, [dispatch]);

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const updatePagination = useCallback((newPagination: Partial<typeof pagination>) => {
    dispatch(setPagination(newPagination));
  }, [dispatch]);

  const selectCandidate = useCallback((candidate: Candidate | null) => {
    dispatch(setCurrentCandidate(candidate));
  }, [dispatch]);

  return {
    // State
    candidates,
    currentCandidate,
    loading,
    error,
    pagination,
    filters,
    
    // Actions
    loadCandidates,
    loadCandidate, // Add the missing function
    updateCandidateStage,
    addNote,
    createCandidate,
    loadTimeline,
    updateFilters,
    updatePagination,
    selectCandidate,
  };
};