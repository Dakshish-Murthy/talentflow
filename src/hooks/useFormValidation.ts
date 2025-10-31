import { useCallback } from 'react';
import { Question } from '../types';

export const useFormValidation = () => {
  const validateQuestion = useCallback((question: Question, value: any): string | null => {
    // Required field validation
    if (question.required && (!value || value === '' || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required';
    }

    // Type-specific validation
    switch (question.type) {
      case 'numeric':
        if (value && value !== '') {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            return 'Please enter a valid number';
          }
          if (question.min !== undefined && numValue < question.min) {
            return `Value must be at least ${question.min}`;
          }
          if (question.max !== undefined && numValue > question.max) {
            return `Value must be at most ${question.max}`;
          }
        }
        break;

      case 'short-text':
      case 'long-text':
        if (value && question.maxLength && value.length > question.maxLength) {
          return `Text must be less than ${question.maxLength} characters`;
        }
        break;

      case 'single-choice':
      case 'multi-choice':
        if (value && question.options && !question.options.includes(value)) {
          return 'Please select a valid option';
        }
        break;

      default:
        break;
    }

    return null;
  }, []);

  const validateAllQuestions = useCallback((questions: Question[], responses: Record<string, any>): Record<string, string> => {
    const errors: Record<string, string> = {};

    questions.forEach(question => {
      const error = validateQuestion(question, responses[question.id]);
      if (error) {
        errors[question.id] = error;
      }
    });

    return errors;
  }, [validateQuestion]);

  return {
    validateQuestion,
    validateAllQuestions,
  };
};