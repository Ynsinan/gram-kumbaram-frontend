/**
 * Environment Configuration
 * Centralized environment variable management for the application
 */

/**
 * Environment type enumeration
 */
export type Environment = "development" | "production" | "test";

/**
 * Get the current environment
 */
export const getEnvironment = (): Environment => {
  const env = process.env.NODE_ENV;
  if (env === "production") return "production";
  if (env === "test") return "test";
  return "development";
};

/**
 * Check if running in development environment
 */
export const isDevelopment = (): boolean => getEnvironment() === "development";

/**
 * Check if running in production environment
 */
export const isProduction = (): boolean => getEnvironment() === "production";

/**
 * Check if running in test environment
 */
export const isTest = (): boolean => getEnvironment() === "test";

/**
 * Environment configuration object
 */
export const env = {
  // Environment info
  NODE_ENV: getEnvironment(),
  IS_DEV: isDevelopment(),
  IS_PROD: isProduction(),
  IS_TEST: isTest(),

  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  API_TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,

  // Frontend Configuration
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",

  // Feature Flags
  ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true",
  ENABLE_MOCK_API: process.env.NEXT_PUBLIC_ENABLE_MOCK_API === "true",
} as const;

/**
 * Validate required environment variables
 * Throws an error if any required variable is missing
 */
export const validateEnv = (): void => {
  const requiredVars = ["NEXT_PUBLIC_API_URL"];

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};

/**
 * Log environment configuration (only in development)
 */
export const logEnvConfig = (): void => {
  if (!isDevelopment()) return;

  console.log("🌍 Environment Configuration:");
  console.log(`  - Environment: ${env.NODE_ENV}`);
  console.log(`  - API URL: ${env.API_URL}`);
  console.log(`  - Frontend URL: ${env.FRONTEND_URL}`);
  console.log(`  - Debug Mode: ${env.ENABLE_DEBUG}`);
  console.log(`  - Mock API: ${env.ENABLE_MOCK_API}`);
};
