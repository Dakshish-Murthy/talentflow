import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAssessments } from '../../hooks/useAssessments';
import { useJobs } from '../../hooks/useJobs';
import SectionEditor from './SectionEditor';
import AssessmentPreview from './AssessmentPreview';
import LoadingSpinner from '../common/LoadingSpinner';

const AssessmentBuilder: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs } = useJobs();
  const {
    currentAssessment,
    loading,
    previewMode,
    loadAssessment,
    createNewAssessment,
    handleUpdateAssessment,
    saveCurrentAssessment,
    togglePreviewMode,
  } = useAssessments();

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadAssessment(jobId);
    }
  }, [jobId, loadAssessment]);

  const job = jobs.find(j => j.id === jobId);

  const handleCreateNewAssessment = () => {
    if (job) {
      createNewAssessment(job.id, `Assessment - ${job.title}`);
    }
  };

  const handleSave = async () => {
    if (!currentAssessment) return;

    setIsSaving(true);
    try {
      await saveCurrentAssessment();
      // Show success message
    } catch (error) {
      console.error('Failed to save assessment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Job not found</h3>
        <p className="text-gray-500 mt-2">The job associated with this assessment could not be found.</p>
      </div>
    );
  }

  if (!currentAssessment) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No assessment found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new assessment for this job.
        </p>
        <div className="mt-6">
          <button
            onClick={handleCreateNewAssessment}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assessment Builder</h1>
            <p className="text-gray-600">Building assessment for: {job.title}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePreviewMode}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Assessment'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {previewMode ? (
          <AssessmentPreview assessment={currentAssessment} />
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Builder Panel */}
            <div className="flex-1 overflow-y-auto">
              <SectionEditor assessment={currentAssessment} />
            </div>
            
            {/* Live Preview Panel */}
            <div className="flex-1 border-l border-gray-200 overflow-y-auto">
              <AssessmentPreview assessment={currentAssessment} isLivePreview />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentBuilder;