// Update your auth user type to include email
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'hr' | 'candidate';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}