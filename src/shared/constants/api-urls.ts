/**
 * Backend API endpoint URLs
 * All API routes should be defined here for consistency
 */

// Auth endpoints
export const API_AUTH = {
  ME: "/auth/me",
  GOOGLE: "/auth/google",
  EXCHANGE: "/auth/exchange",
} as const;

// Prices endpoints
export const API_PRICES = {
  BASE: "/api/prices",
  BY_TYPE: (goldType: string) => `/api/prices/${goldType}`,
} as const;

// Transactions endpoints
export const API_TRANSACTIONS = {
  BASE: "/api/transactions",
  BY_ID: (id: string) => `/api/transactions/${id}`,
  HOLDINGS: "/api/transactions/holdings",
} as const;

// Portfolio endpoints
export const API_PORTFOLIO = {
  BASE: "/api/portfolio",
} as const;
