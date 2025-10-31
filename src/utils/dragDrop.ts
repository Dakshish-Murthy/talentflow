import { DragEndEvent, DragOverEvent } from '@dnd-kit/core';

export interface DragData {
  candidateId: string;
  fromStage: string;
  toStage: string;
}

export const handleDragEnd = (
  event: DragEndEvent,
  stages: string[],
  onStageChange: (candidateId: string, newStage: string) => void
) => {
  const { active, over } = event;

  if (!over) return;

  const candidateId = active.id as string;
  const targetStage = over.id as string;

  // Check if the drop target is a valid stage
  if (stages.includes(targetStage)) {
    onStageChange(candidateId, targetStage);
  }
};

export const handleDragOver = (event: DragOverEvent) => {
  const { over } = event;
  
  if (!over) return;

  // Add visual feedback for valid drop targets
  const overElement = document.getElementById(over.id as string);
  if (overElement) {
    overElement.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
  }
};

export const handleDragCancel = () => {
  // Remove visual feedback from all elements
  document.querySelectorAll('[id]').forEach(element => {
    element.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
  });
};

export const getDragCursorStyle = (isDragging: boolean) => {
  return {
    cursor: isDragging ? 'grabbing' : 'grab',
  };
};

export const createDragOverlayStyle = (transform: { x: number; y: number } | null) => {
  return {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
  };
};