import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Job } from '../../types';
import JobCard from './JobCard';
import { useJobs } from '../../hooks/useJobs';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface JobListProps {
  jobs: Job[];
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
  const { handleReorder } = useJobs();
  const { user } = useSelector((state: RootState) => state.auth);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const fromOrder = parseInt(active.id as string);
      const toOrder = parseInt(over.id as string);

      if (fromOrder !== toOrder) {
        handleReorder(fromOrder, toOrder);
      }
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Get started by creating a new job posting.
        </p>
      </div>
    );
  }

  // Only enable drag and drop for HR users
  if (user?.role === 'hr') {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={jobs.map(job => job.order.toString())} strategy={verticalListSortingStrategy}>
          <div className="space-y-4 p-6">
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  }

  // Regular list for candidates
  return (
    <div className="space-y-4 p-6">
      {jobs.map((job, index) => (
        <JobCard key={job.id} job={job} index={index} />
      ))}
    </div>
  );
};

export default JobList;