import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  fetchJobs,
  createJob,
  updateJob,
  reorderJobs,
  setFilters,
  setPagination,
  setCurrentJob,
  optimisticReorder,
  rollbackReorder,
} from '../store/slices/jobsSlice';
import { Job } from '../types';

export const useJobs = () => {
  const dispatch = useAppDispatch();
  const { jobs, currentJob, loading, error, pagination, filters } = useAppSelector(
    (state) => state.jobs
  );

  const loadJobs = useCallback((params?: any) => {
    return dispatch(fetchJobs(params));
  }, [dispatch]);

  const addJob = useCallback((jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    return dispatch(createJob(jobData));
  }, [dispatch]);

  const editJob = useCallback((id: string, updates: Partial<Job>) => {
    return dispatch(updateJob({ id, updates }));
  }, [dispatch]);

  const archiveJob = useCallback((id: string) => {
    return dispatch(updateJob({ id, updates: { status: 'archived' as const } }));
  }, [dispatch]);

  const activateJob = useCallback((id: string) => {
    return dispatch(updateJob({ id, updates: { status: 'active' as const } }));
  }, [dispatch]);

  const handleReorder = useCallback(async (fromOrder: number, toOrder: number) => {
    const originalJobs = [...jobs];
    
    // Optimistic update
    dispatch(optimisticReorder({ fromOrder, toOrder }));
    
    try {
      await dispatch(reorderJobs({ fromOrder, toOrder })).unwrap();
    } catch (error) {
      // Rollback on failure
      dispatch(rollbackReorder(originalJobs));
      throw error;
    }
  }, [dispatch, jobs]);

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const updatePagination = useCallback((newPagination: Partial<typeof pagination>) => {
    dispatch(setPagination(newPagination));
  }, [dispatch]);

  const selectJob = useCallback((job: Job | null) => {
    dispatch(setCurrentJob(job));
  }, [dispatch]);

  // Helper method to get active jobs
  const getActiveJobs = useCallback(() => {
    return jobs.filter(job => job.status === 'active');
  }, [jobs]);

  return {
    // State
    jobs,
    currentJob,
    loading,
    error,
    pagination,
    filters,
    
    // Computed values
    activeJobs: getActiveJobs(),
    
    // Actions
    loadJobs,
    addJob,
    editJob,
    archiveJob,
    activateJob,
    handleReorder,
    updateFilters,
    updatePagination,
    selectJob,
  };
};