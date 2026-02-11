// User types based on backend schema
export interface User {
  id: string; // UUID (mapped from userId)
  email: string;
  name: string;
}

// Raw response from /auth/me endpoint
export interface AuthMeData {
  userId: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export interface AuthMeResponse {
  success: boolean;
  data: AuthMeData;
}
