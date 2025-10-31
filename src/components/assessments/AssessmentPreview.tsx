import React from 'react';
import { Assessment } from '../../types';
import QuestionRenderer from './QuestionRenderer';

interface AssessmentPreviewProps {
  assessment: Assessment;
  isLivePreview?: boolean;
}

const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({ 
  assessment, 
  isLivePreview = false 
}) => {
  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{assessment.title}</h1>
            <p className="text-gray-600 mt-2">{assessment.description}</p>
            {isLivePreview && (
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                Live Preview
              </div>
            )}
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {assessment.sections.map((section, sectionIndex) => (
              <div key={section.id} className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {sectionIndex + 1}. {section.title}
                </h2>
                {section.description && (
                  <p className="text-gray-600 mb-6">{section.description}</p>
                )}
                
                {/* Questions */}
                <div className="space-y-6">
                  {section.questions.map((question, questionIndex) => (
                    <div key={question.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-start mb-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mr-3">
                          {questionIndex + 1}
                        </span>
                        <QuestionRenderer
                          question={question}
                          onChange={() => {}} // No-op for preview
                          value={null}
                        />
                      </div>
                      {question.required && (
                        <p className="text-sm text-red-500 ml-9">* Required</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {!isLivePreview && (
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                This is a preview of how candidates will see the assessment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentPreview;