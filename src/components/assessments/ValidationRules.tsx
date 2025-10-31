import React from 'react';
import { Question } from '../../types';

interface ValidationRulesProps {
  question: Question;
  sectionId: string;
  onUpdate: (updates: Partial<Question>) => void;
}

const ValidationRules: React.FC<ValidationRulesProps> = ({ question, onUpdate }) => {
  return (
    <div className="border-t border-gray-200 pt-4">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Validation Rules</h4>
      
      <div className="space-y-3">
        {/* Required Field */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`required-${question.id}`}
            checked={question.required || false}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor={`required-${question.id}`} className="ml-2 block text-sm text-gray-900">
            Required field
          </label>
        </div>

        {/* Type-specific validations */}
        {question.type === 'numeric' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`min-${question.id}`} className="block text-xs font-medium text-gray-700">
                Minimum value
              </label>
              <input
                type="number"
                id={`min-${question.id}`}
                value={question.min || ''}
                onChange={(e) => onUpdate({ min: e.target.value ? Number(e.target.value) : undefined })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-2 py-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor={`max-${question.id}`} className="block text-xs font-medium text-gray-700">
                Maximum value
              </label>
              <input
                type="number"
                id={`max-${question.id}`}
                value={question.max || ''}
                onChange={(e) => onUpdate({ max: e.target.value ? Number(e.target.value) : undefined })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-2 py-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {(question.type === 'short-text' || question.type === 'long-text') && (
          <div>
            <label htmlFor={`maxLength-${question.id}`} className="block text-xs font-medium text-gray-700">
              Maximum length
            </label>
            <input
              type="number"
              id={`maxLength-${question.id}`}
              value={question.maxLength || ''}
              onChange={(e) => onUpdate({ maxLength: e.target.value ? Number(e.target.value) : undefined })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-2 py-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="No limit"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationRules;