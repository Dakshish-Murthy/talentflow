import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Job } from '../../types';
import { api } from '../../services/api';

interface JobsState {
  jobs: Job[];
  currentJob: Job | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search: string;
    status: string;
    tags: string[];
  };
  // Add local state for better performance
  allJobs: Job[];
  hasLoadedAll: boolean;
}

const initialState: JobsState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    status: '',
    tags: [],
  },
  allJobs: [],
  hasLoadedAll: false,
};

// Async thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params: { page?: number; pageSize?: number; search?: string; status?: string; loadAll?: boolean } = {}) => {
    if (params.loadAll) {
      // Load all jobs at once for client-side pagination
      const response = await api.getJobs({ ...params, pageSize: 1000 });
      return { ...response, loadAll: true };
    }
    
    const response = await api.getJobs(params);
    return { ...response, loadAll: false };
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.createJob(jobData);
    return response;
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, updates }: { id: string; updates: Partial<Job> }) => {
    const response = await api.updateJob(id, updates);
    return response;
  }
);

export const reorderJobs = createAsyncThunk(
  'jobs/reorderJobs',
  async ({ fromOrder, toOrder }: { fromOrder: number; toOrder: number }, { rejectWithValue }) => {
    try {
      const response = await api.reorderJobs(fromOrder, toOrder);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<JobsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
      
      // If we have all jobs loaded, filter locally
      if (state.hasLoadedAll) {
        const filteredJobs = filterJobs(state.allJobs, state.filters);
        state.jobs = paginateJobs(filteredJobs, state.pagination.page, state.pagination.pageSize);
        state.pagination.total = filteredJobs.length;
        state.pagination.totalPages = Math.ceil(filteredJobs.length / state.pagination.pageSize);
      }
    },
    setPagination: (state, action: PayloadAction<Partial<JobsState['pagination']>>) => {
      const newPagination = { ...state.pagination, ...action.payload };
      state.pagination = newPagination;
      
      // If we have all jobs loaded, paginate locally
      if (state.hasLoadedAll) {
        const filteredJobs = filterJobs(state.allJobs, state.filters);
        state.jobs = paginateJobs(filteredJobs, newPagination.page, newPagination.pageSize);
      }
    },
    setCurrentJob: (state, action: PayloadAction<Job | null>) => {
      state.currentJob = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Optimistic update for drag and drop
    optimisticReorder: (state, action: PayloadAction<{ fromOrder: number; toOrder: number }>) => {
      const { fromOrder, toOrder } = action.payload;
      const jobs = [...state.jobs];
      
      const fromIndex = jobs.findIndex(job => job.order === fromOrder);
      const toIndex = jobs.findIndex(job => job.order === toOrder);
      
      if (fromIndex !== -1 && toIndex !== -1) {
        const [movedJob] = jobs.splice(fromIndex, 1);
        jobs.splice(toIndex, 0, movedJob);
        
        // Update orders
        jobs.forEach((job, index) => {
          job.order = index + 1;
        });
        
        state.jobs = jobs;
      }
    },
    // Rollback for failed reorder
    rollbackReorder: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
    },
    // Clear all jobs data
    clearJobs: (state) => {
      state.jobs = [];
      state.allJobs = [];
      state.hasLoadedAll = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.loadAll) {
          // Store all jobs for client-side operations
          state.allJobs = action.payload.data;
          state.hasLoadedAll = true;
          
          // Apply current filters and pagination
          const filteredJobs = filterJobs(action.payload.data, state.filters);
          state.jobs = paginateJobs(filteredJobs, state.pagination.page, state.pagination.pageSize);
          state.pagination.total = filteredJobs.length;
          state.pagination.totalPages = Math.ceil(filteredJobs.length / state.pagination.pageSize);
        } else {
          // Regular server-side pagination
          state.jobs = action.payload.data;
          state.pagination = {
            ...state.pagination,
            total: action.payload.total || 0,
            totalPages: action.payload.totalPages || 0,
            page: action.payload.page || 1,
          };
        }
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch jobs';
      })
      // Create job
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload);
        if (state.hasLoadedAll) {
          state.allJobs.unshift(action.payload);
          // Update pagination after adding new job
          const filteredJobs = filterJobs(state.allJobs, state.filters);
          state.pagination.total = filteredJobs.length;
          state.pagination.totalPages = Math.ceil(filteredJobs.length / state.pagination.pageSize);
        }
      })
      .addCase(createJob.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create job';
      })
      // Update job
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        
        if (state.hasLoadedAll) {
          const allIndex = state.allJobs.findIndex(job => job.id === action.payload.id);
          if (allIndex !== -1) {
            state.allJobs[allIndex] = action.payload;
          }
          // Update pagination after updating job
          const filteredJobs = filterJobs(state.allJobs, state.filters);
          state.pagination.total = filteredJobs.length;
          state.pagination.totalPages = Math.ceil(filteredJobs.length / state.pagination.pageSize);
        }
        
        if (state.currentJob?.id === action.payload.id) {
          state.currentJob = action.payload;
        }
      })
      // Reorder jobs
      .addCase(reorderJobs.rejected, (state, action) => {
        state.error = 'Failed to reorder jobs. Please try again.';
      });
  },
});

// Helper functions for client-side operations
const filterJobs = (jobs: Job[], filters: JobsState['filters']) => {
  let filtered = [...jobs];
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(job => 
      job.title.toLowerCase().includes(searchLower) ||
      job.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  if (filters.status) {
    filtered = filtered.filter(job => job.status === filters.status);
  }
  
  if (filters.tags.length > 0) {
    filtered = filtered.filter(job => 
      filters.tags.some(tag => job.tags?.includes(tag))
    );
  }
  
  return filtered;
};

const paginateJobs = (jobs: Job[], page: number, pageSize: number) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return jobs.slice(startIndex, endIndex);
};

export const {
  setFilters,
  setPagination,
  setCurrentJob,
  clearError,
  optimisticReorder,
  rollbackReorder,
  clearJobs,
} = jobsSlice.actions;

export default jobsSlice.reducer;

