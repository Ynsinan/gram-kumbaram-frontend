/**
 * Frontend page route URLs
 * All page routes should be defined here for consistency
 */

export const PAGE_URLS = {
  // Public pages
  HOME: "/",
  
  // Auth pages
  AUTH: {
    LOGIN: "/auth/login",
    CALLBACK: "/auth/callback",
  },
  
  // Protected pages
  DASHBOARD: "/dashboard",
  
  // Anchors (used with hash)
  ANCHORS: {
    CALCULATOR: "#calculator",
  },
} as const;
