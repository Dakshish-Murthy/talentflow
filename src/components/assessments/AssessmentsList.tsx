import React from 'react';
import { Link } from 'react-router-dom';
import { useAssessmentsList } from '../../hooks/useAssessmentsList';
import LoadingSpinner from '../common/LoadingSpinner';

const AssessmentsList: React.FC = () => {
  const { activeJobs, assessmentsMap, loading, refreshAssessments } = useAssessmentsList();

  const handleRefresh = async () => {
    await refreshAssessments();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Assessments
            </h1>
            <p className="mt-2 text-lg text-gray-600 max-w-2xl">
              Create and manage assessments for your job positions
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <Link
              to="/jobs"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View All Jobs
            </Link>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-soft">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Active Jobs</h2>
              <span className="text-sm text-gray-500">
                {activeJobs.length} job{activeJobs.length !== 1 ? 's' : ''} found
              </span>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" />
                <p className="mt-3 text-gray-600">Loading assessments...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeJobs.map((job) => {
                  const hasAssessment = !!assessmentsMap[job.id];
                  return (
                    <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <p className="text-gray-600 text-sm">{job.company} • {job.location}</p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            hasAssessment 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {hasAssessment ? 'Assessment Created' : 'No Assessment'}
                          </span>
                          {job.tags?.slice(0, 3).map((tag: string, index: number) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Link
                          to={`/assessments/${job.id}`}
                          className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                            hasAssessment
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {hasAssessment ? 'Edit Assessment' : 'Create Assessment'}
                        </Link>
                        <Link
                          to={`/jobs/${job.id}`}
                          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          View Job
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && activeJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active jobs</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                  Create your first job posting to start building assessments.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Job
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentsList;