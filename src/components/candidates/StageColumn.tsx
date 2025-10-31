import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Candidate } from '../../types';
import KanbanCandidateCard from './KanbanCandidateCard';

// Create enhanced candidate interface locally
interface EnhancedCandidate extends Candidate {
  jobTitle?: string;
  experience?: string;
  location?: string;
  skills?: string[];
}

interface StageColumnProps {
  stage: Candidate['stage'];
  candidates: EnhancedCandidate[];
  stageLabel: string;
  stageColor: string;
  stageGradient: string;
  stageDescription: string;
  isDragOver?: boolean;
}

const StageColumn: React.FC<StageColumnProps> = ({
  stage,
  candidates,
  stageLabel,
  stageColor,
  stageGradient,
  stageDescription,
  isDragOver = false
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: stage,
  });

  const columnClasses = `
    flex-shrink-0 w-80 transform transition-all duration-300 ease-out
    ${isOver ? 'scale-105' : 'scale-100'}
    ${isDragOver ? 'animate-pulse-slow' : ''}
  `;

  const headerClasses = `
    relative overflow-hidden rounded-2xl p-6 mb-4 transition-all duration-300
    ${stageGradient} border border-white/50 shadow-lg
    ${isOver ? 'shadow-2xl' : 'shadow-lg'}
  `;

  return (
    <div className={columnClasses}>
      <div 
        id={stage}
        ref={setNodeRef}
        className="h-full"
      >
        {/* Column Header */}
        <div className={headerClasses}>
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          
          {/* Header Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${stageColor} shadow-lg`}></div>
                <h3 className="font-bold text-gray-900 text-lg">{stageLabel}</h3>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-white/80 text-gray-700 shadow-sm border border-white/50">
                {candidates.length}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">{stageDescription}</p>
            
            {/* Progress bar */}
            <div className="mt-4 w-full bg-white/50 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${stageColor} transition-all duration-1000 ease-out`}
                style={{ 
                  width: `${Math.max(10, (candidates.length / 10) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Candidates List */}
        <div 
          className={`
            min-h-[500px] max-h-[600px] overflow-y-auto rounded-2xl transition-all duration-300
            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
            ${isOver ? 'bg-blue-25 border-2 border-dashed border-blue-300' : 'bg-white/60 border border-white/20'}
            backdrop-blur-sm shadow-soft p-4
          `}
        >
          <SortableContext items={candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {candidates.length === 0 ? (
              <div className={`
                text-center py-12 rounded-xl border-2 border-dashed transition-all duration-300
                ${isOver ? 'border-blue-300 bg-blue-50 scale-105' : 'border-gray-300 bg-white/50'}
              `}>
                <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No candidates</p>
                <p className="text-gray-400 text-sm mt-2">Drop candidates here</p>
                
                {/* Animated drop hint */}
                {isOver && (
                  <div className="mt-4 flex justify-center">
                    <div className="w-6 h-6 bg-blue-500 rounded-full animate-bounce"></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {candidates.map((candidate) => (
                  <KanbanCandidateCard 
                    key={candidate.id} 
                    candidate={candidate}
                    stageColor={stageColor}
                  />
                ))}
              </div>
            )}
          </SortableContext>
        </div>

        {/* Add Candidate Button */}
        <button className={`
          w-full mt-4 p-4 rounded-2xl border-2 border-dashed transition-all duration-300
          hover:scale-105 hover:shadow-lg group
          ${isOver ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-white/60 hover:border-gray-400'}
        `}>
          <div className="flex items-center justify-center space-x-2 text-gray-500 group-hover:text-gray-700">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">Add Candidate</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default StageColumn;