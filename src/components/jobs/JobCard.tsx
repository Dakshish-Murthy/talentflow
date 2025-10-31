import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Job } from '../../types';
import { useJobs } from '../../hooks/useJobs';
import JobForm from './JobForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: Job;
  index: number;
}

const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
  const { archiveJob, activateJob } = useJobs();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.order.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleArchive = () => {
    archiveJob(job.id);
  };

  const handleActivate = () => {
    activateJob(job.id);
  };

  const handleViewDetails = () => {
    navigate(`/jobs/${job.id}`);
  };

  const handleApply = () => {
    navigate(`/application/${job.id}`);
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    archived: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const getSalaryColor = (salary: string) => {
    if (salary?.includes('$120k') || salary?.includes('$130k') || salary?.includes('$150k') || salary?.includes('$160k')) 
      return 'from-green-500 to-emerald-500';
    if (salary?.includes('$100k') || salary?.includes('$110k')) 
      return 'from-blue-500 to-cyan-500';
    if (salary?.includes('$80k')) 
      return 'from-purple-500 to-pink-500';
    return 'from-gray-500 to-gray-700';
  };

  const isHR = user?.role === 'hr';

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`
          group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 transition-all duration-300 hover:shadow-xl hover:border-gray-300/60
          ${isDragging ? 'rotate-3 shadow-2xl border-blue-300 bg-blue-50' : 'shadow-soft'}
          hover:transform hover:-translate-y-1
        `}
      >
        {/* Status Badge and Actions */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[job.status]}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${job.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
            {job.status === 'active' ? 'Active' : 'Archived'}
          </span>
          
          {isHR && (
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                title="Edit Job"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              {job.status === 'active' ? (
                <button
                  onClick={handleArchive}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                  title="Archive Job"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleActivate}
                  className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-150"
                  title="Activate Job"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Job Content */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {job.brandLogo ? (
                  <img
                    className="h-12 w-12 rounded-xl object-cover border border-gray-200"
                    src={job.brandLogo}
                    alt="Company Logo"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    T
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 
                    className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                    onClick={handleViewDetails}
                  >
                    {job.title}
                  </h3>
                </div>
                
                {/* Location */}
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                </div>

                {/* Salary */}
                {job.salary && (
                  <div className="mt-3">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r ${getSalaryColor(job.salary)} text-white text-sm font-medium`}>
                      💰 {job.salary}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {job.tags && job.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.tags.slice(0, 4).map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                    {job.tags.length > 4 && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        +{job.tags.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Description */}
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  {job.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200/60">
          <div className="flex items-center space-x-4">
            {!isHR && job.status === 'active' && (
              <button
                onClick={handleApply}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Apply Now
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
            
            <button
              onClick={handleViewDetails}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-150"
            >
              View Details
            </button>
          </div>

          {/* Drag handle for HR */}
          {isHR && (
            <div 
              className="flex items-center text-sm text-gray-500 cursor-grab active:cursor-grabbing hover:text-gray-700 transition-colors duration-150"
              {...listeners}
              {...attributes}
            >
              <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Drag to reorder
            </div>
          )}
        </div>

        {/* Featured Badge */}
        {job.tags?.includes('featured') && (
          <div className="absolute -top-2 -right-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <JobForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        job={job}
      />
    </>
  );
};

export default JobCard;