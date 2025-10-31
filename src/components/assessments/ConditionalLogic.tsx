import React from 'react';
import { Question } from '../../types';

interface ConditionalLogicProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  allQuestions: Question[]; // Remove section prop, add allQuestions
}

const ConditionalLogic: React.FC<ConditionalLogicProps> = ({ 
  question, 
  onUpdate, 
  allQuestions 
}) => {
  // Filter out current question and questions that don't have options
  const availableQuestions = allQuestions.filter(
    q => q.id !== question.id && q.options && q.options.length > 0
  );

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Conditional Logic</h4>
      
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <select
            value={question.conditionalLogic?.dependsOn || ''}
            onChange={(e) => onUpdate({
              conditionalLogic: e.target.value ? {
                dependsOn: e.target.value,
                condition: 'equals',
                value: '',
              } : undefined
            })}
            className="col-span-2 border border-gray-300 rounded-md shadow-sm px-2 py-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Show this question if...</option>
            {availableQuestions.map((q) => (
              <option key={q.id} value={q.id}>
                {q.question.substring(0, 50)}...
              </option>
            ))}
          </select>

          <select
            value={question.conditionalLogic?.condition || ''}
            onChange={(e) => onUpdate({
              conditionalLogic: question.conditionalLogic ? {
                ...question.conditionalLogic,
                condition: e.target.value as any,
              } : undefined
            })}
            disabled={!question.conditionalLogic?.dependsOn}
            className="border border-gray-300 rounded-md shadow-sm px-2 py-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="equals">Equals</option>
            <option value="not-equals">Not Equals</option>
            <option value="contains">Contains</option>
          </select>
        </div>

        {question.conditionalLogic?.dependsOn && (
          <select
            value={question.conditionalLogic?.value || ''}
            onChange={(e) => onUpdate({
              conditionalLogic: question.conditionalLogic ? {
                ...question.conditionalLogic,
                value: e.target.value,
              } : undefined
            })}
            className="w-full border border-gray-300 rounded-md shadow-sm px-2 py-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select value...</option>
            {availableQuestions
              .find(q => q.id === question.conditionalLogic?.dependsOn)
              ?.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default ConditionalLogic;