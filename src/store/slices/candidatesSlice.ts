import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Candidate, Note } from '../../types';
import { candidatesService } from '../../services/candidatesService';

interface CandidatesState {
  candidates: Candidate[];
  currentCandidate: Candidate | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    stage: string;
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

const initialState: CandidatesState = {
  candidates: [],
  currentCandidate: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    stage: '',
  },
  pagination: {
    page: 1,
    pageSize: 50,
    total: 0,
  },
};

// Async thunks
export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (params: { page?: number; pageSize?: number; search?: string; stage?: string } = {}) => {
    const response = await candidatesService.getCandidates(params);
    return response;
  }
);

export const updateCandidate = createAsyncThunk(
  'candidates/updateCandidate',
  async ({ id, updates }: { id: string; updates: Partial<Candidate> }) => {
    const response = await candidatesService.updateCandidate(id, updates);
    return response;
  }
);

export const addCandidateNote = createAsyncThunk(
  'candidates/addNote',
  async ({ candidateId, note }: { candidateId: string; note: Omit<Note, 'id' | 'createdAt'> }) => {
    const candidate = await candidatesService.getCandidateById(candidateId);
    const updatedNotes = [
      ...(candidate.notes || []),
      {
        ...note,
        id: `note-${Date.now()}`,
        createdAt: new Date(),
      }
    ];
    
    const updatedCandidate = await candidatesService.updateCandidate(candidateId, {
      notes: updatedNotes
    });
    return updatedCandidate;
  }
);

export const fetchCandidateTimeline = createAsyncThunk(
  'candidates/fetchTimeline',
  async (candidateId: string) => {
    const response = await candidatesService.getCandidateTimeline(candidateId);
    return { candidateId, timeline: response };
  }
);

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<CandidatesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    setPagination: (state, action: PayloadAction<Partial<CandidatesState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setCurrentCandidate: (state, action: PayloadAction<Candidate | null>) => {
      state.currentCandidate = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Optimistic update for stage changes
    optimisticStageChange: (state, action: PayloadAction<{ candidateId: string; newStage: Candidate['stage'] }>) => {
      const { candidateId, newStage } = action.payload;
      const candidate = state.candidates.find(c => c.id === candidateId);
      if (candidate) {
        candidate.stage = newStage;
      }
      if (state.currentCandidate?.id === candidateId) {
        state.currentCandidate.stage = newStage;
      }
    },
    // Rollback for failed stage change
    rollbackStageChange: (state, action: PayloadAction<{ candidateId: string; oldStage: Candidate['stage'] }>) => {
      const { candidateId, oldStage } = action.payload;
      const candidate = state.candidates.find(c => c.id === candidateId);
      if (candidate) {
        candidate.stage = oldStage;
      }
      if (state.currentCandidate?.id === candidateId) {
        state.currentCandidate.stage = oldStage;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch candidates
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload.data;
        state.pagination = {
          ...state.pagination,
          total: action.payload.total,
          page: action.payload.page,
        };
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch candidates';
      })
      // Update candidate
      .addCase(updateCandidate.fulfilled, (state, action) => {
        const index = state.candidates.findIndex(candidate => candidate.id === action.payload.id);
        if (index !== -1) {
          state.candidates[index] = action.payload;
        }
        if (state.currentCandidate?.id === action.payload.id) {
          state.currentCandidate = action.payload;
        }
      })
      .addCase(updateCandidate.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update candidate';
      })
      // Add note
      .addCase(addCandidateNote.fulfilled, (state, action) => {
        if (state.currentCandidate?.id === action.payload.id) {
          state.currentCandidate = action.payload;
        }
      });
  },
});

export const {
  setFilters,
  setPagination,
  setCurrentCandidate,
  clearError,
  optimisticStageChange,
  rollbackStageChange,
} = candidatesSlice.actions;

export default candidatesSlice.reducer;