import React from 'react';
import { Link } from 'react-router-dom';

const MyApplications: React.FC = () => {
  // Mock data - in a real app, this would come from the backend
  const applications = [
    {
      id: '1',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp Inc',
      status: 'Under Review',
      date: '2024-01-15',
      statusColor: 'bg-blue-100 text-blue-800',
      jobId: 'job-1'
    },
    {
      id: '2', 
      jobTitle: 'Full Stack Engineer',
      company: 'StartupXYZ',
      status: 'Interview Scheduled',
      date: '2024-01-12',
      statusColor: 'bg-green-100 text-green-800',
      jobId: 'job-2'
    },
    {
      id: '3',
      jobTitle: 'UI/UX Designer',
      company: 'DesignStudio',
      status: 'Assessment',
      date: '2024-01-10',
      statusColor: 'bg-purple-100 text-purple-800',
      jobId: 'job-3'
    }
  ];

  const stats = {
    total: applications.length,
    interviews: applications.filter(app => app.status === 'Interview Scheduled').length,
    underReview: applications.filter(app => app.status === 'Under Review').length,
    assessments: applications.filter(app => app.status === 'Assessment').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            My Applications
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track the status of your job applications and next steps
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-soft text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-soft text-center">
            <div className="text-2xl font-bold text-green-600">{stats.interviews}</div>
            <div className="text-sm text-gray-600">Interviews</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-soft text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.underReview}</div>
            <div className="text-sm text-gray-600">Under Review</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-soft text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.assessments}</div>
            <div className="text-sm text-gray-600">Assessments</div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-soft">
          {applications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {applications.map((application) => (
                <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900">{application.jobTitle}</h3>
                      <p className="text-gray-600">{application.company}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Applied {new Date(application.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${application.statusColor}`}>
                        {application.status}
                      </span>
                      <div className="flex space-x-2">
                        <Link
                          to={`/jobs/${application.jobId}`}
                          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                        >
                          View Job
                        </Link>
                        {application.status === 'Assessment' && (
                          <Link
                            to={`/assessment/${application.jobId}`}
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-150"
                          >
                            Take Assessment
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                Start your job search and apply to positions that match your skills.
              </p>
              <Link
                to="/browse-jobs"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Jobs
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;