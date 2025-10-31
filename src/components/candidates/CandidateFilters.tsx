import React, { useState, useEffect } from 'react';
import { useCandidates } from '../../hooks/useCandidates';
import { useDebounce } from '../../hooks/useDebounce';

const CandidateFilters: React.FC = () => {
  const { filters, updateFilters } = useCandidates();
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay

  // Update the global filter when debounced search term changes
  useEffect(() => {
    updateFilters({ search: debouncedSearchTerm });
  }, [debouncedSearchTerm, updateFilters]);

  const stages = [
    { value: '', label: 'All Stages' },
    { value: 'applied', label: 'Applied' },
    { value: 'screen', label: 'Screening' },
    { value: 'tech', label: 'Technical' },
    { value: 'offer', label: 'Offer' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ stage: e.target.value });
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Stage Filter */}
      <div className="w-48">
        <select
          value={filters.stage}
          onChange={handleStageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        >
          {stages.map((stage) => (
            <option key={stage.value} value={stage.value}>
              {stage.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CandidateFilters;