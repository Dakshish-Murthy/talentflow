import { useState, useEffect, useCallback } from 'react';
import { useJobs } from './useJobs';
import { useAssessments } from './useAssessments';

export const useAssessmentsList = () => {
  const { activeJobs, loadJobs, jobs } = useJobs();
  const { loadAssessment } = useAssessments();
  
  const [assessmentsMap, setAssessmentsMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const initializeAssessments = useCallback(async () => {
    setLoading(true);
    
    try {
      let jobsToUse = activeJobs;
      
      // If no active jobs, load them first
      if (activeJobs.length === 0) {
        await loadJobs({ status: 'active', pageSize: 100 });
        // After loading, use the jobs from Redux state
        jobsToUse = jobs.filter(job => job.status === 'active');
      }

      // If we still don't have active jobs after loading, exit
      if (jobsToUse.length === 0) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      // Load assessments for all active jobs in parallel
      const assessmentPromises = jobsToUse.map(async (job) => {
        try {
          const result = await loadAssessment(job.id);
          // The result could be the assessment object or the action payload
          const assessment = result?.payload || result;
          return { jobId: job.id, assessment };
        } catch (error) {
          console.log(`No assessment found for job ${job.id}`);
          return { jobId: job.id, assessment: null };
        }
      });

      const results = await Promise.all(assessmentPromises);
      
      const newAssessmentsMap: Record<string, any> = {};
      results.forEach(result => {
        if (result.assessment) {
          newAssessmentsMap[result.jobId] = result.assessment;
        }
      });
      
      setAssessmentsMap(newAssessmentsMap);
      setInitialized(true);
    } catch (error) {
      console.error('Failed to initialize assessments:', error);
    } finally {
      setLoading(false);
    }
  }, [activeJobs, loadJobs, loadAssessment, jobs]);

  useEffect(() => {
    if (!initialized) {
      initializeAssessments();
    }
  }, [initializeAssessments, initialized]);

  const refreshAssessments = useCallback(async () => {
    setInitialized(false);
    await initializeAssessments();
  }, [initializeAssessments]);

  return {
    activeJobs,
    assessmentsMap,
    loading,
    refreshAssessments,
  };
};