import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Assessment, AssessmentResponse, AssessmentFormState } from '../../types';
import { assessmentsService } from '../../services/assessmentsService';

interface AssessmentsState {
  currentAssessment: Assessment | null;
  currentResponse: AssessmentResponse | null;
  loading: boolean;
  error: string | null;
  previewMode: boolean;
  validationErrors: Record<string, string>;
}

const initialState: AssessmentsState = {
  currentAssessment: null,
  currentResponse: null,
  loading: false,
  error: null,
  previewMode: false,
  validationErrors: {},
};

// Async thunks
export const fetchAssessment = createAsyncThunk(
  'assessments/fetchAssessment',
  async (jobId: string) => {
    const response = await assessmentsService.getAssessment(jobId);
    return response;
  }
);

export const createAssessment = createAsyncThunk(
  'assessments/createAssessment',
  async ({ jobId, assessmentData }: { jobId: string; assessmentData: Partial<Assessment> }) => {
    const response = await assessmentsService.createAssessment(jobId, assessmentData);
    return response;
  }
);

export const updateAssessment = createAsyncThunk(
  'assessments/updateAssessment',
  async ({ jobId, assessmentData }: { jobId: string; assessmentData: Partial<Assessment> }) => {
    const response = await assessmentsService.updateAssessment(jobId, assessmentData);
    return response;
  }
);

export const submitResponse = createAsyncThunk(
  'assessments/submitResponse',
  async ({ assessmentId, response }: { assessmentId: string; response: any }) => {
    const apiResponse = await assessmentsService.submitAssessment(assessmentId, response);
    return apiResponse;
  }
);

const assessmentsSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
    setCurrentAssessment: (state, action: PayloadAction<Assessment | null>) => {
      state.currentAssessment = action.payload;
    },
    updateCurrentAssessment: (state, action: PayloadAction<Partial<Assessment>>) => {
      if (state.currentAssessment) {
        state.currentAssessment = { ...state.currentAssessment, ...action.payload };
      }
    },
    setCurrentResponse: (state, action: PayloadAction<AssessmentResponse | null>) => {
      state.currentResponse = action.payload;
    },
    updateCurrentResponse: (state, action: PayloadAction<Partial<AssessmentResponse>>) => {
      if (state.currentResponse) {
        state.currentResponse = { ...state.currentResponse, ...action.payload };
      } else {
        state.currentResponse = {
          id: `response-${Date.now()}`,
          assessmentId: '',
          candidateId: 'current-candidate',
          responses: [],
          submittedAt: new Date(),
          ...action.payload
        } as AssessmentResponse;
      }
    },
    updateResponseAnswer: (state, action: PayloadAction<{ questionId: string; answer: any }>) => {
      if (!state.currentResponse) {
        state.currentResponse = {
          id: `response-${Date.now()}`,
          assessmentId: state.currentAssessment?.id || '',
          candidateId: 'current-candidate',
          responses: [],
          submittedAt: new Date(),
        };
      }

      const { questionId, answer } = action.payload;
      const existingResponseIndex = state.currentResponse.responses.findIndex(
        r => r.questionId === questionId
      );

      if (existingResponseIndex >= 0) {
        state.currentResponse.responses[existingResponseIndex].answer = answer;
      } else {
        state.currentResponse.responses.push({
          questionId,
          answer,
        });
      }
    },
    togglePreviewMode: (state) => {
      state.previewMode = !state.previewMode;
    },
    setValidationError: (state, action: PayloadAction<{ questionId: string; error: string }>) => {
      state.validationErrors[action.payload.questionId] = action.payload.error;
    },
    clearValidationError: (state, action: PayloadAction<string>) => {
      delete state.validationErrors[action.payload];
    },
    clearAllValidationErrors: (state) => {
      state.validationErrors = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    // Section management
    addSection: (state, action: PayloadAction<{ section: any }>) => {
      if (state.currentAssessment) {
        state.currentAssessment.sections.push(action.payload.section);
      }
    },
    updateSection: (state, action: PayloadAction<{ sectionId: string; updates: any }>) => {
      if (state.currentAssessment) {
        const sectionIndex = state.currentAssessment.sections.findIndex(
          s => s.id === action.payload.sectionId
        );
        if (sectionIndex >= 0) {
          state.currentAssessment.sections[sectionIndex] = {
            ...state.currentAssessment.sections[sectionIndex],
            ...action.payload.updates,
          };
        }
      }
    },
    removeSection: (state, action: PayloadAction<string>) => {
      if (state.currentAssessment) {
        state.currentAssessment.sections = state.currentAssessment.sections.filter(
          s => s.id !== action.payload
        );
      }
    },
    // Question management
    addQuestion: (state, action: PayloadAction<{ sectionId: string; question: any }>) => {
      if (state.currentAssessment) {
        const sectionIndex = state.currentAssessment.sections.findIndex(
          s => s.id === action.payload.sectionId
        );
        if (sectionIndex >= 0) {
          state.currentAssessment.sections[sectionIndex].questions.push(action.payload.question);
        }
      }
    },
    updateQuestion: (state, action: PayloadAction<{ sectionId: string; questionId: string; updates: any }>) => {
      if (state.currentAssessment) {
        const sectionIndex = state.currentAssessment.sections.findIndex(
          s => s.id === action.payload.sectionId
        );
        if (sectionIndex >= 0) {
          const questionIndex = state.currentAssessment.sections[sectionIndex].questions.findIndex(
            q => q.id === action.payload.questionId
          );
          if (questionIndex >= 0) {
            state.currentAssessment.sections[sectionIndex].questions[questionIndex] = {
              ...state.currentAssessment.sections[sectionIndex].questions[questionIndex],
              ...action.payload.updates,
            };
          }
        }
      }
    },
    removeQuestion: (state, action: PayloadAction<{ sectionId: string; questionId: string }>) => {
      if (state.currentAssessment) {
        const sectionIndex = state.currentAssessment.sections.findIndex(
          s => s.id === action.payload.sectionId
        );
        if (sectionIndex >= 0) {
          state.currentAssessment.sections[sectionIndex].questions = 
            state.currentAssessment.sections[sectionIndex].questions.filter(
              q => q.id !== action.payload.questionId
            );
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch assessment
      .addCase(fetchAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssessment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAssessment = action.payload;
      })
      .addCase(fetchAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch assessment';
      })
      // Create assessment
      .addCase(createAssessment.fulfilled, (state, action) => {
        state.currentAssessment = action.payload;
      })
      .addCase(createAssessment.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create assessment';
      })
      // Update assessment
      .addCase(updateAssessment.fulfilled, (state, action) => {
        state.currentAssessment = action.payload;
      })
      .addCase(updateAssessment.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update assessment';
      })
      // Submit response
      .addCase(submitResponse.fulfilled, (state, action) => {
        state.currentResponse = action.payload;
      })
      .addCase(submitResponse.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to submit assessment';
      });
  },
});

export const {
  setCurrentAssessment,
  updateCurrentAssessment,
  setCurrentResponse,
  updateCurrentResponse,
  updateResponseAnswer,
  togglePreviewMode,
  setValidationError,
  clearValidationError,
  clearAllValidationErrors,
  clearError,
  addSection,
  updateSection,
  removeSection,
  addQuestion,
  updateQuestion,
  removeQuestion,
} = assessmentsSlice.actions;

export default assessmentsSlice.reducer;