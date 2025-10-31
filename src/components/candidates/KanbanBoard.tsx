import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Candidate } from '../../types';
import { useCandidates } from '../../hooks/useCandidates';
import StageColumn from './StageColumn';
import KanbanCandidateCard from './KanbanCandidateCard';

// Create enhanced candidate interface locally
interface EnhancedCandidate extends Candidate {
  jobTitle?: string;
  experience?: string;
  location?: string;
  skills?: string[];
}

interface KanbanBoardProps {
  candidates: EnhancedCandidate[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ candidates }) => {
  const { updateCandidateStage } = useCandidates();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const stages: Candidate['stage'][] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    document.body.style.cursor = 'grabbing';
    
    // Add glow effect to all stage columns
    stages.forEach(stage => {
      const element = document.getElementById(stage);
      if (element) {
        element.classList.add('opacity-100');
      }
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDragOverStage(null);
    document.body.style.cursor = '';

    // Remove all visual effects
    stages.forEach(stage => {
      const element = document.getElementById(stage);
      if (element) {
        element.classList.remove(
          'ring-4', 'ring-blue-400', 'ring-opacity-50', 
          'scale-105', 'bg-blue-25', 'opacity-100'
        );
      }
    });

    if (!over) return;

    const candidateId = active.id as string;
    const targetStage = over.id as Candidate['stage'];
    
    // Find the current candidate to get their current stage
    const currentCandidate = candidates.find(c => c.id === candidateId);
    if (!currentCandidate) return;

    // Only update if the stage has actually changed
    if (stages.includes(targetStage) && currentCandidate.stage !== targetStage) {
      updateCandidateStage(candidateId, targetStage);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    
    // Reset all stage visuals first
    stages.forEach(stage => {
      const element = document.getElementById(stage);
      if (element) {
        element.classList.remove(
          'ring-4', 'ring-blue-400', 'ring-opacity-50', 
          'scale-105', 'bg-blue-25'
        );
      }
    });

    if (over && stages.includes(over.id as Candidate['stage'])) {
      setDragOverStage(over.id as string);
      const overElement = document.getElementById(over.id as string);
      if (overElement) {
        overElement.classList.add(
          'ring-4', 'ring-blue-400', 'ring-opacity-50', 
          'scale-105', 'bg-blue-25'
        );
      }
    } else {
      setDragOverStage(null);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDragOverStage(null);
    document.body.style.cursor = '';
    
    // Remove all visual effects
    stages.forEach(stage => {
      const element = document.getElementById(stage);
      if (element) {
        element.classList.remove(
          'ring-4', 'ring-blue-400', 'ring-opacity-50', 
          'scale-105', 'bg-blue-25', 'opacity-100'
        );
      }
    });
  };

  const getCandidatesByStage = (stage: Candidate['stage']) => {
    return candidates.filter(candidate => candidate.stage === stage);
  };

  const getStageLabel = (stage: Candidate['stage']) => {
    const labels = {
      applied: 'Applied',
      screen: 'Screening',
      tech: 'Technical',
      offer: 'Offer',
      hired: 'Hired',
      rejected: 'Rejected',
    };
    return labels[stage];
  };

  const getStageColor = (stage: Candidate['stage']) => {
    const colors = {
      applied: 'from-blue-500 to-cyan-500',
      screen: 'from-amber-500 to-orange-500',
      tech: 'from-purple-500 to-fuchsia-500',
      offer: 'from-green-500 to-emerald-500',
      hired: 'from-emerald-500 to-teal-500',
      rejected: 'from-rose-500 to-pink-500',
    };
    return colors[stage];
  };

  const getStageGradient = (stage: Candidate['stage']) => {
    const gradients = {
      applied: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      screen: 'bg-gradient-to-br from-amber-50 to-orange-50',
      tech: 'bg-gradient-to-br from-purple-50 to-fuchsia-50',
      offer: 'bg-gradient-to-br from-green-50 to-emerald-50',
      hired: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      rejected: 'bg-gradient-to-br from-rose-50 to-pink-50',
    };
    return gradients[stage];
  };

  const getStageDescription = (stage: Candidate['stage']) => {
    const descriptions = {
      applied: 'New applications to review',
      screen: 'Initial screening phase',
      tech: 'Technical assessments',
      offer: 'Offer extended to candidates',
      hired: 'Successfully hired candidates',
      rejected: 'Applications not proceeding',
    };
    return descriptions[stage];
  };

  const activeCandidate = activeId ? candidates.find(c => c.id === activeId) : null;

  return (
    <div className="relative">
      {/* Board Header */}
      <div className="mb-6 px-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Candidate Pipeline
              </h1>
              <p className="text-gray-600 mt-2">Drag candidates between stages to update their status</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{candidates.length}</div>
                <div className="text-sm text-gray-500">Total Candidates</div>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
      >
        <div className="flex space-x-6 px-6 pb-6 overflow-x-auto min-h-[700px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {stages.map((stage) => (
            <StageColumn
              key={stage}
              stage={stage}
              candidates={getCandidatesByStage(stage)}
              stageLabel={getStageLabel(stage)}
              stageColor={getStageColor(stage)}
              stageGradient={getStageGradient(stage)}
              stageDescription={getStageDescription(stage)}
              isDragOver={dragOverStage === stage}
            />
          ))}
        </div>
        
        {/* Enhanced Drag Overlay */}
        <DragOverlay dropAnimation={null}>
          {activeCandidate ? (
            <div className="transform rotate-3 scale-105 opacity-95 shadow-2xl">
              <KanbanCandidateCard 
                candidate={activeCandidate} 
                isDragging={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-semibold">Add Candidate</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default KanbanBoard;