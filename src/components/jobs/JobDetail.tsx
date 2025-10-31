import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Job } from '../../types';
import { useJobs } from '../../hooks/useJobs';
import { useAppSelector } from '../../hooks/redux';
import LoadingSpinner from '../common/LoadingSpinner';

const JobDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs, loadJobs, loading } = useJobs();
  const { user } = useAppSelector((state) => state.auth);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (jobs.length === 0) {
      loadJobs();
    }
  }, [jobs.length, loadJobs]);

  useEffect(() => {
    if (jobId && jobs.length > 0) {
      const foundJob = jobs.find(j => j.id === jobId);
      setJob(foundJob || null);
    }
  }, [jobId, jobs]);

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
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Job not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The job you're looking for doesn't exist.
        </p>
        <Link
          to={user?.role === 'hr' ? "/jobs" : "/jobs"}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={user?.role === 'hr' ? "/jobs" : "/jobs"}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Jobs
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{job.title}</h1>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            job.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {job.status}
        </span>
      </div>

      {/* Job Details */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            {job.brandLogo && (
              <img
                className="h-16 w-16 rounded-lg object-cover"
                src={job.brandLogo}
                alt="Company Logo"
              />
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">TalentFlow Inc.</h2>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </div>
                {job.salary && (
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {job.salary}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {job.tags.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="px-6 py-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Job Description</h3>
          <div className="prose prose-blue max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {job.description || 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Meta Information */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <div className="text-sm text-gray-500">
            <p>Job ID: {job.id}</p>
            <p>Slug: {job.slug}</p>
            <p>Last updated: {new Date(job.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Link
          to={user?.role === 'hr' ? "/jobs" : "/jobs"}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Jobs
        </Link>
        
        {user?.role === 'hr' ? (
          <>
            <Link
              to={`/candidates`}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Candidates
            </Link>
            <Link
              to={`/assessments/${job.id}`}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Manage Assessment
            </Link>
          </>
        ) : (
          job.status === 'active' && (
            <Link
              to={`/application/${job.id}`}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Now
            </Link>
          )
        )}
      </div>

      {/* HR Only Sections */}
      {user?.role === 'hr' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">HR Management</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              to={`/candidates`}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
            >
              <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span className="font-medium text-gray-900">View Candidates</span>
              <span className="text-sm text-gray-500">Manage applications</span>
            </Link>
            
            <Link
              to={`/assessments/${job.id}`}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
            >
              <svg className="h-8 w-8 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium text-gray-900">Assessment</span>
              <span className="text-sm text-gray-500">Create & manage tests</span>
            </Link>
            
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg text-center">
              <svg className="h-8 w-8 text-purple-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium text-gray-900">Analytics</span>
              <span className="text-sm text-gray-500">View job metrics</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;