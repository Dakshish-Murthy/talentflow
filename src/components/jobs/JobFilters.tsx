import React from 'react';
import SearchBar from '../common/SearchBar';

interface JobFiltersProps {
  searchValue: string;
  statusValue: string;
  onSearch: (search: string) => void;
  onStatusChange: (status: string) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  searchValue,
  statusValue,
  onSearch,
  onStatusChange,
}) => {
  const popularTags = ['React', 'Remote', 'Frontend', 'Full Stack', 'Node.js', 'Python', 'AWS', 'UI/UX'];

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {(searchValue || statusValue) && (
          <button
            onClick={() => {
              onSearch('');
              onStatusChange('');
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search Jobs
        </label>
        <SearchBar
          onSearch={onSearch}
          placeholder="Search jobs by title, company, or keywords..."
          className="w-full"
        />
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="space-y-2">
          {['active', 'archived'].map((status) => (
            <label key={status} className="flex items-center">
              <input
                type="radio"
                name="status"
                value={status}
                checked={statusValue === status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">
                {status}
              </span>
            </label>
          ))}
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value=""
              checked={statusValue === ''}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">All Status</span>
          </label>
        </div>
      </div>

      {/* Popular Tags */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Popular Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Use search and filters to find the perfect job match quickly.
        </p>
      </div>
    </div>
  );
};

export default JobFilters;