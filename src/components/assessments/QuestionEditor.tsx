import React, { useState } from 'react';
import { Question, Section } from '../../types';
import { useAssessments } from '../../hooks/useAssessments';
import ConditionalLogic from './ConditionalLogic';

interface QuestionEditorProps {
  section: Section;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ section }) => {
  const {
    handleAddQuestion,
    handleUpdateQuestion,
    handleRemoveQuestion,
    currentAssessment,
  } = useAssessments();

  const [newQuestionText, setNewQuestionText] = useState('');

  // Get all questions from all sections for conditional logic
  const allQuestions = currentAssessment?.sections.flatMap(s => s.questions) || [];

  const handleAddNewQuestion = () => {
    if (!newQuestionText.trim()) return;

    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      type: 'single-choice',
      question: newQuestionText,
      required: false,
      options: ['Option 1', 'Option 2'],
    };

    handleAddQuestion(section.id, newQuestion);
    setNewQuestionText('');
  };

  const handleQuestionTypeChange = (questionId: string, newType: Question['type']) => {
    const updates: Partial<Question> = { type: newType };
    
    // Set default options for choice types
    if (newType === 'single-choice' || newType === 'multi-choice') {
      updates.options = ['Option 1', 'Option 2'];
    } else {
      updates.options = undefined;
    }

    handleUpdateQuestion(section.id, questionId, updates);
  };

  const addOption = (questionId: string) => {
    const question = section.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    const newOptions = [...question.options, `Option ${question.options.length + 1}`];
    handleUpdateQuestion(section.id, questionId, { options: newOptions });
  };

  const updateOption = (questionId: string, optionIndex: number, newValue: string) => {
    const question = section.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    const newOptions = [...question.options];
    newOptions[optionIndex] = newValue;
    handleUpdateQuestion(section.id, questionId, { options: newOptions });
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = section.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    const newOptions = question.options.filter((_, index) => index !== optionIndex);
    handleUpdateQuestion(section.id, questionId, { options: newOptions });
  };

  return (
    <div className="space-y-4">
      {/* Add New Question */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
          placeholder="Enter new question..."
          className="flex-1 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddNewQuestion();
            }
          }}
        />
        <button
          onClick={handleAddNewQuestion}
          disabled={!newQuestionText.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Question
        </button>
      </div>

      {/* Existing Questions */}
      {section.questions.map((question) => (
        <div key={question.id} className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex justify-between items-start mb-4">
            <input
              type="text"
              value={question.question}
              onChange={(e) => handleUpdateQuestion(section.id, question.id, { question: e.target.value })}
              className="flex-1 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-medium"
            />
            <button
              onClick={() => handleRemoveQuestion(section.id, question.id)}
              className="ml-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type
              </label>
              <select
                value={question.type}
                onChange={(e) => handleQuestionTypeChange(question.id, e.target.value as Question['type'])}
                className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="single-choice">Single Choice</option>
                <option value="multi-choice">Multiple Choice</option>
                <option value="short-text">Short Text</option>
                <option value="long-text">Long Text</option>
                <option value="numeric">Numeric</option>
                <option value="file">File Upload</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id={`required-${question.id}`}
                checked={question.required || false}
                onChange={(e) => handleUpdateQuestion(section.id, question.id, { required: e.target.checked })}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor={`required-${question.id}`} className="ml-2 block text-sm text-gray-700">
                Required question
              </label>
            </div>
          </div>

          {/* Options for choice questions */}
          {(question.type === 'single-choice' || question.type === 'multi-choice') && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-2">
                {question.options?.map((option, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(question.id, index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <button
                      onClick={() => removeOption(question.id, index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addOption(question.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add Option
                </button>
              </div>
            </div>
          )}

          {/* Conditional Logic */}
          <div className="mt-4">
            <ConditionalLogic
              question={question}
              onUpdate={(updates) => handleUpdateQuestion(section.id, question.id, updates)}
              allQuestions={allQuestions}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionEditor;