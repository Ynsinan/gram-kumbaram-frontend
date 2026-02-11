import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "./types";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isInitialized = true;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isInitialized = true;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isInitialized = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isInitialized = true;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
    initializeAuth: (state) => {
      // Only initialize once
      if (state.isInitialized) return;

      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          state.token = token;
          // Keep loading true - we'll fetch user data
        } else {
          state.isLoading = false;
          state.isInitialized = true;
        }
      }
    },
    setInitialized: (state) => {
      state.isInitialized = true;
      state.isLoading = false;
    },
  },
});

export const {
  setCredentials,
  setUser,
  setToken,
  setLoading,
  setError,
  logout,
  initializeAuth,
  setInitialized,
} = authSlice.actions;

export default authSlice.reducer;
