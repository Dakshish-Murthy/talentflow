import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Candidate } from '../../types';
import { useCandidates } from '../../hooks/useCandidates';
import SortableCandidateCard from './SortableCandidateCard';

interface CandidatesListProps {
  candidates?: Candidate[];
}

const CandidatesList: React.FC<CandidatesListProps> = ({ candidates: propCandidates }) => {
  const { 
    candidates: hookCandidates, 
    updateCandidateStage,
    loading 
  } = useCandidates();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Use prop candidates if provided, otherwise use hook candidates
  const candidates = propCandidates || hookCandidates;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    document.body.style.cursor = 'grabbing';
    
    // Add visual effect to the dragged item
    const activeElement = document.getElementById(active.id as string);
    if (activeElement) {
      activeElement.style.transform = 'rotate(2deg)';
      activeElement.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDragOverId(null);
    document.body.style.cursor = '';

    // Reset all visual effects
    document.querySelectorAll('.sortable-candidate').forEach(element => {
      (element as HTMLElement).style.transform = '';
      (element as HTMLElement).style.boxShadow = '';
      (element as HTMLElement).style.borderLeft = '';
    });

    if (!over) return;

    const candidateId = active.id as string;
    const targetCandidateId = over.id as string;

    // Find the target candidate to get its stage
    const targetCandidate = candidates.find(c => c.id === targetCandidateId);
    const draggedCandidate = candidates.find(c => c.id === candidateId);
    
    if (targetCandidate && draggedCandidate && targetCandidate.id !== candidateId) {
      // Only update if the stage is different
      if (draggedCandidate.stage !== targetCandidate.stage) {
        updateCandidateStage(candidateId, targetCandidate.stage);
      }
    }
  };

  const handleDragOver = (event: DragEndEvent) => {
    const { over } = event;
    setDragOverId(over?.id as string || null);

    // Add visual feedback to the drop target
    document.querySelectorAll('.sortable-candidate').forEach(element => {
      (element as HTMLElement).style.borderLeft = '';
    });

    if (over) {
      const overElement = document.getElementById(over.id as string);
      if (overElement) {
        overElement.style.borderLeft = '4px solid #3b82f6';
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDragOverId(null);
    document.body.style.cursor = '';
    
    // Reset all visual effects
    document.querySelectorAll('.sortable-candidate').forEach(element => {
      (element as HTMLElement).style.transform = '';
      (element as HTMLElement).style.boxShadow = '';
      (element as HTMLElement).style.borderLeft = '';
    });
  };

  const getStageBadgeColor = (stage: string) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800 border border-blue-200',
      screen: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      tech: 'bg-purple-100 text-purple-800 border border-purple-200',
      offer: 'bg-green-100 text-green-800 border border-green-200',
      hired: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200',
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getStageLabel = (stage: string) => {
    const labels = {
      applied: 'Applied',
      screen: 'Screening',
      tech: 'Technical',
      offer: 'Offer',
      hired: 'Hired',
      rejected: 'Rejected',
    };
    return labels[stage as keyof typeof labels] || stage;
  };

  const activeCandidate = activeId ? candidates.find(c => c.id === activeId) : null;

  if (loading && !propCandidates) {
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
    >
      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        {/* List Header */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Candidate List ({candidates.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Drag candidates to change their stage. Drop on a candidate to match their stage.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Drag & Drop Enabled</span>
            </div>
          </div>
        </div>

        {/* Candidates */}
        <div className="divide-y divide-gray-100">
          <SortableContext items={candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {candidates.map((candidate) => (
              <SortableCandidateCard
                key={candidate.id}
                candidate={candidate}
                stageBadgeColor={getStageBadgeColor(candidate.stage)}
                stageLabel={getStageLabel(candidate.stage)}
                isDragging={activeId === candidate.id}
                isDragOver={dragOverId === candidate.id}
              />
            ))}
          </SortableContext>
        </div>

        {candidates.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No candidates found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}

        {/* Drag Hint */}
        {candidates.length > 0 && (
          <div className="bg-blue-50 border-t border-blue-200 px-6 py-3">
            <div className="flex items-center justify-center space-x-2 text-sm text-blue-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Tip: Drag a candidate onto another to match their stage</span>
            </div>
          </div>
        )}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeCandidate ? (
          <div className="transform rotate-3 scale-105 opacity-90">
            <SortableCandidateCard
              candidate={activeCandidate}
              stageBadgeColor={getStageBadgeColor(activeCandidate.stage)}
              stageLabel={getStageLabel(activeCandidate.stage)}
              isDragging={true}
              isDragOver={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default CandidatesList;