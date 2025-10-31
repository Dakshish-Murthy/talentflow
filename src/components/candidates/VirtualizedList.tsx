import React from 'react';
import { Candidate } from '../../types';
import CandidateCard from './CandidateCard';

interface VirtualizedListProps {
  candidates: Candidate[];
  height: number;
  itemHeight: number;
}

const VirtualizedList: React.FC<VirtualizedListProps> = ({
  candidates,
  height,
  itemHeight,
}) => {
  // Simple non-virtualized version for now
  // In a real app, you might want to implement virtualization
  // or use a different library compatible with React 19

  if (candidates.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div style={{ height, overflowY: 'auto' }}>
      {candidates.map((candidate) => (
        <div key={candidate.id} style={{ height: itemHeight }}>
          <CandidateCard candidate={candidate} />
        </div>
      ))}
    </div>
  );
};

export default VirtualizedList;