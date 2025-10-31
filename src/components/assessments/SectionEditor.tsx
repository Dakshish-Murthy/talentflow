import React, { useState } from 'react';
import { Assessment, Section, Question } from '../../types';
import { useAssessments } from '../../hooks/useAssessments';
import QuestionEditor from './QuestionEditor';

interface SectionEditorProps {
  assessment: Assessment;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ assessment }) => {
  const {
    handleUpdateAssessment,
    handleAddSection,
    handleUpdateSection,
    handleRemoveSection,
  } = useAssessments();

  const [newSectionTitle, setNewSectionTitle] = useState('');

  const handleAddNewSection = () => {
    if (!newSectionTitle.trim()) return;

    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: newSectionTitle.trim(),
      questions: [],
    };

    handleAddSection(newSection);
    setNewSectionTitle('');
  };

  const handleAssessmentUpdate = (updates: Partial<Assessment>) => {
    handleUpdateAssessment(updates);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Assessment Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Assessment Details</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="assessmentTitle" className="block text-sm font-medium text-gray-700">
              Assessment Title
            </label>
            <input
              type="text"
              id="assessmentTitle"
              value={assessment.title}
              onChange={(e) => handleAssessmentUpdate({ title: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter assessment title"
            />
          </div>
          <div>
            <label htmlFor="assessmentDescription" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="assessmentDescription"
              value={assessment.description}
              onChange={(e) => handleAssessmentUpdate({ description: e.target.value })}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter assessment description"
            />
          </div>
        </div>
      </div>

      {/* Add New Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Section</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter section title"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddNewSection();
              }
            }}
          />
          <button
            onClick={handleAddNewSection}
            disabled={!newSectionTitle.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Section
          </button>
        </div>
      </div>

      {/* Existing Sections */}
      {assessment.sections.map((section, sectionIndex) => (
        <div key={section.id} className="bg-white rounded-lg border border-gray-200">
          {/* Section Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                  className="text-lg font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0 w-full"
                  placeholder="Section title"
                />
              </div>
              <div className="flex items-center space-x-2">
                {sectionIndex > 0 && (
                  <button className="text-gray-400 hover:text-gray-600">
                    ↑
                  </button>
                )}
                {sectionIndex < assessment.sections.length - 1 && (
                  <button className="text-gray-400 hover:text-gray-600">
                    ↓
                  </button>
                )}
                <button
                  onClick={() => handleRemoveSection(section.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Section Questions */}
          <div className="p-6">
            <QuestionEditor section={section} />
          </div>
        </div>
      ))}

      {assessment.sections.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No sections yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first section above.
          </p>
        </div>
      )}
    </div>
  );
};

export default SectionEditor;