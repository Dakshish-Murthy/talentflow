import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Candidate } from '../../types';

interface SortableCandidateCardProps {
  candidate: Candidate;
  stageBadgeColor: string;
  stageLabel: string;
  isDragging?: boolean;
  isDragOver?: boolean;
}

const SortableCandidateCard: React.FC<SortableCandidateCardProps> = ({ 
  candidate, 
  stageBadgeColor, 
  stageLabel,
  isDragging = false,
  isDragOver = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isSortableDragging ? 'transform 200ms ease' : transition,
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const cardClasses = `
    sortable-candidate
    bg-white px-6 py-4 transition-all duration-200 
    ${isDragging ? 'cursor-grabbing opacity-60 scale-95' : 'cursor-grab hover:bg-gray-50'} 
    ${isDragOver ? 'border-l-4 border-blue-500 bg-blue-25 transform scale-105' : ''}
    ${isSortableDragging ? 'shadow-xl z-50 rotate-2' : 'shadow-sm hover:shadow-md'}
    relative
  `;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cardClasses}
    >
      {/* Glow effect when dragging */}
      {isDragging && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg pointer-events-none"></div>
      )}
      
      {/* Drag handle indicator */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex flex-col space-y-1">
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Candidate Info */}
        <div className="flex items-center space-x-4 flex-1">
          <div className={`
            relative w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold 
            shadow-lg transition-all duration-200
            ${isDragging ? 'scale-110' : ''}
            ${candidate.stage === 'applied' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : ''}
            ${candidate.stage === 'screen' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : ''}
            ${candidate.stage === 'tech' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
            ${candidate.stage === 'offer' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}
            ${candidate.stage === 'hired' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : ''}
            ${candidate.stage === 'rejected' ? 'bg-gradient-to-r from-red-500 to-pink-500' : ''}
          `}>
            {candidate.name.charAt(0).toUpperCase()}
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-1">
              <h4 className="text-sm font-semibold text-gray-900 truncate">{candidate.name}</h4>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${stageBadgeColor} transition-all duration-200 ${isDragging ? 'scale-105' : ''}`}>
                {stageLabel}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate mb-1">{candidate.email}</p>
            {candidate.jobTitle && (
              <p className="text-xs text-gray-400">{candidate.jobTitle}</p>
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-sm text-gray-500">Applied</p>
            <p className="text-xs text-gray-400 font-medium">{formatDate(candidate.appliedDate)}</p>
          </div>
          
          {/* Drag Handle */}
          <div className={`
            flex items-center space-x-2 text-gray-400 transition-all duration-200
            ${isDragging ? 'text-blue-500 scale-110' : ''}
          `}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
            <span className="text-xs font-medium">Drag</span>
          </div>
        </div>
      </div>

      {/* Skills (if available) */}
      {candidate.skills && candidate.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {candidate.skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="inline-block bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs px-2 py-1 rounded border border-gray-200 transition-all duration-200 hover:scale-105"
            >
              {skill}
            </span>
          ))}
          {candidate.skills.length > 4 && (
            <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded border border-gray-200">
              +{candidate.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Progress bar for stage visualization */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
        <div 
          className={`
            h-1 rounded-full transition-all duration-500
            ${candidate.stage === 'applied' ? 'bg-blue-500 w-1/6' : ''}
            ${candidate.stage === 'screen' ? 'bg-yellow-500 w-2/6' : ''}
            ${candidate.stage === 'tech' ? 'bg-purple-500 w-3/6' : ''}
            ${candidate.stage === 'offer' ? 'bg-green-500 w-5/6' : ''}
            ${candidate.stage === 'hired' ? 'bg-emerald-500 w-full' : ''}
            ${candidate.stage === 'rejected' ? 'bg-red-500 w-full' : ''}
          `}
        ></div>
      </div>
    </div>
  );
};

export default SortableCandidateCard;