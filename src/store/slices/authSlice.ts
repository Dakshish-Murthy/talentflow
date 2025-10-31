import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: null | { 
    id: string; 
    name: string; 
    email: string;
    role: 'hr' | 'candidate' 
  };
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ 
      role: 'hr' | 'candidate'; 
      userId?: string;
      email?: string;
    }>) => {
      if (action.payload.role === 'hr') {
        state.user = { 
          id: 'hr-1', 
          name: 'HR Manager', 
          email: action.payload.email || 'hr@talentflow.com',
          role: 'hr' 
        };
      } else {
        state.user = { 
          id: action.payload.userId || 'candidate-1', 
          name: 'Candidate', 
          email: action.payload.email || 'candidate@talentflow.com',
          role: 'candidate' 
        };
      }
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;