/**
 * Application-wide constants and configuration values
 */

/**
 * Pagination configuration
 */
export const ITEMS_PER_PAGE = 25;

/**
 * Debounce delay for search inputs (milliseconds)
 */
export const DEFAULT_DEBOUNCE_MS = 300;

/**
 * API configuration
 */
export const API_BASE_URL = '/api';

/**
 * Date format patterns
 */
export const DATE_FORMAT = 'MM/DD/YYYY';
export const DATETIME_FORMAT = 'MM/DD/YYYY HH:mm';
export const TIME_FORMAT = 'HH:mm';

/**
 * Status badge color configurations
 */
export const STATUS_COLORS = {
  active: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  inactive: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200'
  },
  confirmed: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  pending: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200'
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200'
  },
} as const;

/**
 * Theme color configurations for different sections
 */
export const THEME_COLORS = {
  patients: 'blue',
  appointments: 'green',
  providers: 'purple',
} as const;

/**
 * Button color variants for different themes
 */
export const BUTTON_VARIANTS = {
  blue: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-blue-100 hover:bg-blue-200 text-blue-800',
    disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
  },
  green: {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-green-100 hover:bg-green-200 text-green-800',
    disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
  },
  purple: {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-purple-100 hover:bg-purple-200 text-purple-800',
    disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
  },
  default: {
    primary: 'bg-gray-600 hover:bg-gray-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
  },
} as const;

/**
 * Spinner color variants for different themes
 */
export const SPINNER_COLORS = {
  blue: 'border-blue-600',
  green: 'border-green-600',
  purple: 'border-purple-600',
  default: 'border-gray-600',
} as const;

/**
 * Type definitions for better type safety
 */
export type StatusType = keyof typeof STATUS_COLORS;
export type ThemeColor = keyof typeof THEME_COLORS | 'default';
export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
