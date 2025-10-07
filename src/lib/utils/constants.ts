/**
 * Application Constants
 * Centralized constants to avoid magic strings and numbers
 */

// API Configuration
export const API_CONFIG = {
  GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000',
  AUTH_BASE_PATH: '/api/v1/auth',
  TIMEOUT: 30000, // 30 seconds
} as const;

// Token Configuration
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  ACCESS_TOKEN_EXPIRY: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Date Formats
export const DATE_FORMATS = {
  FULL: 'YYYY-MM-DD HH:mm:ss',
  DATE_ONLY: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm:ss',
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Theme Configuration
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// Query Keys (for React Query / Apollo)
export const QUERY_KEYS = {
  USER: 'user',
  USERS: 'users',
  SESSIONS: 'sessions',
  THREADS: 'threads',
  MODELS: 'models',
  VIEWS: 'views',
  INSTRUCTIONS: 'instructions',
  SQL_PAIRS: 'sqlPairs',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  PROFILE: '/profile',
  PROFILE_SECURITY: '/profile/security',
  ADMIN_USERS: '/admin/users',
  MODELING: '/modeling',
  KNOWLEDGE_INSTRUCTIONS: '/knowledge/instructions',
  KNOWLEDGE_SQL_PAIRS: '/knowledge/question-sql-pairs',
  API_HISTORY: '/api-management/history',
  UNAUTHORIZED: '/unauthorized',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  WEAK_PASSWORD: 'Password must be at least 8 characters long.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REGISTRATION_SUCCESS: 'Registration successful! Welcome to Wren AI.',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  CHANGES_SAVED: 'Changes saved successfully',
} as const;

// Loading Messages
export const LOADING_MESSAGES = {
  LOADING: 'Loading...',
  SAVING: 'Saving...',
  DELETING: 'Deleting...',
  UPDATING: 'Updating...',
  PROCESSING: 'Processing...',
} as const;

// User Roles Display Names
export const ROLE_LABELS = {
  admin: 'Administrator',
  developer: 'Developer',
  analyst: 'Analyst',
  viewer: 'Viewer',
  seller: 'Seller',
} as const;

// User Status Display Names
export const STATUS_LABELS = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  suspended: 'Suspended',
} as const;

// Form Validation Messages
export const FORM_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
  PASSWORDS_MUST_MATCH: 'Passwords must match',
  USERNAME_MIN_LENGTH: `Username must be at least ${VALIDATION.USERNAME_MIN_LENGTH} characters`,
  USERNAME_MAX_LENGTH: `Username must not exceed ${VALIDATION.USERNAME_MAX_LENGTH} characters`,
} as const;

