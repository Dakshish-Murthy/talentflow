import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Candidate } from '../../types';

interface KanbanCandidateCardProps {
  candidate: Candidate & {
    jobTitle?: string;
    experience?: string;
    location?: string;
    skills?: string[];
  };
  stageColor?: string;
  isDragging?: boolean;
}

const KanbanCandidateCard: React.FC<KanbanCandidateCardProps> = ({ 
  candidate, 
  stageColor = 'from-blue-500 to-cyan-500',
  isDragging = false
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
    transition: isSortableDragging ? 'transform 200ms ease, opacity 200ms ease' : transition,
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const cardClasses = `
    bg-white rounded-2xl border border-gray-200 p-4 transition-all duration-300 ease-out
    shadow-sm hover:shadow-lg cursor-grab active:cursor-grabbing
    ${isSortableDragging || isDragging ? 
      'opacity-60 scale-95 rotate-2 shadow-2xl z-50' : 
      'hover:scale-105 hover:-translate-y-1'
    }
    relative overflow-hidden
  `;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cardClasses}
    >
      {/* Background Glow Effect */}
      {(isSortableDragging || isDragging) && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
      )}
      
      {/* Animated Border */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stageColor} opacity-0 hover:opacity-5 transition-opacity duration-300`}></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${stageColor} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
              {candidate.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm truncate">{candidate.name}</h4>
              <p className="text-xs text-gray-500 truncate">{candidate.email}</p>
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg font-medium">
          {formatDate(candidate.appliedDate)}
        </span>
      </div>

      {/* Job Info */}
      {candidate.jobTitle && (
        <div className="mb-3 relative z-10">
          <p className="text-xs font-semibold text-gray-700 truncate">{candidate.jobTitle}</p>
          {(candidate.location || candidate.experience) && (
            <div className="flex items-center space-x-3 mt-1">
              {candidate.location && (
                <span className="text-xs text-gray-500 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {candidate.location}
                </span>
              )}
              {candidate.experience && (
                <span className="text-xs text-gray-500">• {candidate.experience}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Skills */}
      {candidate.skills && candidate.skills.length > 0 && (
        <div className="mb-3 relative z-10">
          <div className="flex flex-wrap gap-1">
            {candidate.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="inline-block bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs px-2 py-1 rounded-lg border border-gray-200 font-medium transition-all duration-200 hover:scale-105"
              >
                {skill}
              </span>
            ))}
            {candidate.skills.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-lg border border-gray-200">
                +{candidate.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-500 font-medium">Drag to move</div>
        </div>
        <div className="flex space-x-1">
          <button className="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200 hover:scale-110">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button className="p-1 text-gray-400 hover:text-green-500 transition-colors duration-200 hover:scale-110">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hover Effect Line */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
    </div>
  );
};

export default KanbanCandidateCard;