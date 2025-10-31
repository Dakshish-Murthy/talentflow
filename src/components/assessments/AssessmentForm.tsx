import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssessments } from '../../hooks/useAssessments';
import { AssessmentResponse } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import QuestionRenderer from './QuestionRenderer';

const AssessmentForm: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const {
    currentAssessment,
    currentResponse,
    loading,
    validationErrors,
    loadAssessment,
    handleSubmitResponse,
    handleUpdateResponseAnswer,
    handleSetValidationError,
    handleClearValidationError,
    handleClearAllValidationErrors,
  } = useAssessments();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadAssessment(jobId);
    }
  }, [jobId, loadAssessment]);

  useEffect(() => {
    if (currentAssessment && !currentResponse) {
      // Initialize response
      const initialResponse: AssessmentResponse = {
        id: `response-${Date.now()}`,
        assessmentId: currentAssessment.id,
        candidateId: 'current-candidate', // This would come from auth in a real app
        responses: [],
        submittedAt: new Date(),
      };
      // handleSetCurrentResponse(initialResponse);
    }
  }, [currentAssessment, currentResponse]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    handleUpdateResponseAnswer(questionId, answer);
    // Clear validation error for this question
    if (validationErrors[questionId]) {
      handleClearValidationError(questionId);
    }
  };

  const validateForm = () => {
    handleClearAllValidationErrors();
    let isValid = true;

    if (!currentAssessment) return false;

    currentAssessment.sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.required) {
          const response = currentResponse?.responses.find(r => r.questionId === question.id);
          if (!response || !response.answer || 
              (Array.isArray(response.answer) && response.answer.length === 0) ||
              (typeof response.answer === 'string' && response.answer.trim() === '')) {
            handleSetValidationError(question.id, 'This question is required');
            isValid = false;
          }
        }
      });
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required questions');
      return;
    }

    if (!currentAssessment || !currentResponse) return;

    setIsSubmitting(true);
    try {
      await handleSubmitResponse(currentAssessment.id, currentResponse);
      navigate('/application/success');
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentAssessment) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Assessment not found</h3>
        <p className="text-gray-500 mt-2">The assessment you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{currentAssessment.title}</h1>
          <p className="text-gray-600 mt-2">{currentAssessment.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {currentAssessment.sections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
              {section.description && (
                <p className="text-gray-600 mb-6">{section.description}</p>
              )}
              
              <div className="space-y-6">
                {section.questions.map((question) => (
                  <QuestionRenderer
                    key={question.id}
                    question={question}
                    value={currentResponse?.responses.find(r => r.questionId === question.id)?.answer}
                    onChange={(answer) => handleAnswerChange(question.id, answer)}
                    error={validationErrors[question.id]}
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentForm;