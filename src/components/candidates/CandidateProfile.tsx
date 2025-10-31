import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCandidates } from '../../hooks/useCandidates';
import { useJobs } from '../../hooks/useJobs';
import LoadingSpinner from '../common/LoadingSpinner';
import Timeline from './Timeline';
import NotesEditor from './NotesEditor';

const CandidateProfile: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { 
    currentCandidate, 
    loading, 
    loadTimeline, 
    loadCandidate 
  } = useCandidates();
  const { jobs } = useJobs();

  const [activeTab, setActiveTab] = useState<'profile' | 'timeline' | 'notes'>('profile');
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    if (candidateId) {
      loadCandidate(candidateId);
      loadTimeline(candidateId).then((result) => {
        if (result.payload) {
          setTimeline(result.payload as any[]);
        }
      });
    }
  }, [candidateId, loadCandidate, loadTimeline]);

  const job = jobs.find(j => j.id === currentCandidate?.jobId);

  if (loading && !currentCandidate) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentCandidate) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Candidate not found</h3>
        <p className="text-gray-500 mt-2">The candidate you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {currentCandidate.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{currentCandidate.name}</h1>
            <p className="text-gray-600">{currentCandidate.email}</p>
            <p className="text-gray-600">{currentCandidate.phone}</p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              currentCandidate.stage === 'applied' ? 'bg-blue-100 text-blue-800' :
              currentCandidate.stage === 'screen' ? 'bg-yellow-100 text-yellow-800' :
              currentCandidate.stage === 'tech' ? 'bg-purple-100 text-purple-800' :
              currentCandidate.stage === 'offer' ? 'bg-green-100 text-green-800' :
              currentCandidate.stage === 'hired' ? 'bg-emerald-100 text-emerald-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentCandidate.stage.charAt(0).toUpperCase() + currentCandidate.stage.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'profile', name: 'Profile' },
              { id: 'timeline', name: 'Timeline' },
              { id: 'notes', name: 'Notes' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{currentCandidate.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900">{currentCandidate.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="text-sm text-gray-900">{currentCandidate.location}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Experience</dt>
                    <dd className="text-sm text-gray-900">{currentCandidate.experience}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Application Details</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Applied For</dt>
                    <dd className="text-sm text-gray-900">
                      {job?.title || currentCandidate.jobTitle}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Company</dt>
                    <dd className="text-sm text-gray-900">{job?.company}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Applied Date</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(currentCandidate.appliedDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Skills</dt>
                    <dd className="text-sm text-gray-900">
                      {currentCandidate.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1 mb-1"
                        >
                          {skill}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <Timeline events={timeline} />
          )}

          {activeTab === 'notes' && (
            <div className="p-6">
              <NotesEditor 
                candidateId={currentCandidate.id} 
                notes={currentCandidate.notes || []} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;