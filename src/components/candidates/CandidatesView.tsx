import React, { useState, useEffect } from 'react';
import { useCandidates } from '../../hooks/useCandidates';
import CandidatesList from './CandidatesList';
import KanbanBoard from './KanbanBoard';
import CandidateFilters from './CandidateFilters';

const CandidatesView: React.FC = () => {
  const { 
    candidates, 
    loadCandidates, 
    filters, 
    pagination,
    loading 
  } = useCandidates();

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load candidates when component mounts
  useEffect(() => {
    const loadInitialCandidates = async () => {
      await loadCandidates({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: filters.search,
        stage: filters.stage,
      });
      setIsInitialLoad(false);
    };
    
    loadInitialCandidates();
  }, []); // Empty dependency array - only run on mount

  // Load candidates when filters change (including debounced search)
  useEffect(() => {
    if (!isInitialLoad) {
      loadCandidates({
        page: 1, // Reset to first page when filters change
        pageSize: pagination.pageSize,
        search: filters.search,
        stage: filters.stage,
      });
    }
  }, [filters.search, filters.stage, isInitialLoad, loadCandidates, pagination.pageSize]); // Watch both search and stage filters

  if (isInitialLoad) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading candidates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
            <p className="text-gray-600 mt-1">Manage and review candidate applications</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{candidates.length}</div>
            <div className="text-sm text-gray-500">Total Candidates</div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <CandidateFilters />
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 mr-3">View:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  viewMode === 'kanban'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  <span>Board</span>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span>List</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Loading indicator for subsequent loads */}
        {loading && !isInitialLoad && (
          <div className="flex items-center justify-center py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm text-gray-600">Updating results...</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      {viewMode === 'kanban' ? (
        <KanbanBoard candidates={candidates} />
      ) : (
        <CandidatesList candidates={candidates} />
      )}
    </div>
  );
};

export default CandidatesView;