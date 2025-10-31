import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';
import SearchBar from '../common/SearchBar';
import LoadingSpinner from '../common/LoadingSpinner';

const JobsBoard: React.FC = () => {
  const { jobs, loading, pagination, filters, loadJobs, updateFilters } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadJobs({
      page: pagination.page,
      pageSize: pagination.pageSize,
      search: filters.search,
      status: 'active', // Only show active jobs to candidates
    });
  }, [pagination.page, pagination.pageSize, filters.search]);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    updateFilters({ search });
  };

  const activeJobs = jobs.filter(job => job.status === 'active');

  // Enhanced job data with more details
  const enhancedJobs = activeJobs.map(job => ({
    ...job,
    company: job.company || 'TalentFlow Partner',
    location: job.location || 'Remote',
    salary: job.salary || '$80,000 - $120,000',
    description: job.description || 'We are looking for a talented professional to join our team. This position offers great growth opportunities and a competitive compensation package.',
    tags: job.tags || ['Full-time', 'Remote', 'Tech']
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Discover Your Next Opportunity
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect role that matches your skills and career aspirations
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search jobs by title, company, skills, or location..."
            className="w-full"
          />
        </div>

        {/* Results Info */}
        {!loading && enhancedJobs.length > 0 && (
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{enhancedJobs.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{pagination.total}</span> available positions
            </p>
          </div>
        )}

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enhancedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && enhancedJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {filters.search 
                ? 'Try adjusting your search terms to find what you are looking for.'
                : 'There are currently no active job openings matching your criteria.'
              }
            </p>
            {filters.search && (
              <button
                onClick={() => handleSearch('')}
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-150"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const JobCard: React.FC<{ job: any }> = ({ job }) => {
  const getSalaryColor = (salary: string) => {
    if (salary.includes('$120k') || salary.includes('$130k') || salary.includes('$150k') || salary.includes('$160k')) 
      return 'from-green-500 to-emerald-500';
    if (salary.includes('$100k') || salary.includes('$110k')) 
      return 'from-blue-500 to-cyan-500';
    if (salary.includes('$80k')) 
      return 'from-purple-500 to-pink-500';
    return 'from-gray-500 to-gray-700';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 shadow-soft hover:shadow-xl hover:border-gray-300/60 transition-all duration-300 group">
      {/* Company Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
          {job.company?.charAt(0) || 'T'}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2">
            {job.title}
          </h3>
          <p className="text-gray-600">{job.company}</p>
        </div>
      </div>

      {/* Location & Salary */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </div>
        {job.salary && (
          <div className={`inline-flex items-center px-3 py-1 rounded-lg bg-gradient-to-r ${getSalaryColor(job.salary)} text-white text-sm font-medium`}>
            💰 {job.salary}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {job.tags.slice(0, 3).map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
              +{job.tags.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm line-clamp-3 mb-6">
        {job.description}
      </p>

      {/* Actions */}
      <div className="flex space-x-3">
        <Link
          to={`/jobs/${job.id}`}
          className="flex-1 text-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
        >
          View Details
        </Link>
        <Link
          to={`/application/${job.id}`}
          className="flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
        >
          Apply Now
        </Link>
      </div>

      {/* Featured Badge */}
      {job.tags?.includes('featured') && (
        <div className="absolute -top-2 -right-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
            ⭐ Featured
          </span>
        </div>
      )}
    </div>
  );
};

export default JobsBoard;