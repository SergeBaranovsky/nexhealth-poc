/**
 * Shared TypeScript types for NexHealth API
 * Used by both frontend and backend
 */

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  name?: string;
  email?: string;
  phone?: string;
  bio?: {
    date_of_birth?: string;
    gender?: string;
    phone_number?: string;
  };
  inactive: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  provider_id?: number;
  provider_name?: string;
  start_time: string;
  end_time: string;
  status?: string;
  confirmed?: boolean;
  patient_confirmed?: boolean;
  cancelled?: boolean;
  patient_missed?: boolean;
  appointment_type_id?: number;
}

export interface Provider {
  id: number;
  first_name: string;
  last_name: string;
  name?: string;
  npi?: string;
  email?: string;
}

export interface AppointmentType {
  id: string;
  name: string;
  duration: number;
}

export interface AvailableSlot {
  time: string;
  operatory_id?: string;
  provider_id?: string;
}

export interface AvailableSlotsResponse {
  lid: string;
  pid?: string;
  slots: AvailableSlot[];
}

export interface Institution {
  id: string;
  name: string;
  locations?: Location[];
}

export interface Location {
  id: string;
  name: string;
}

export interface ApiResponse<T> {
  data: T;
  count?: number;
}

export interface AuthResponse {
  data: {
    token: string;
  };
}

/**
 * Generic paginated API response
 */
export interface PaginatedResponse<T> {
  data: T;
  count: number;
  page?: number;
  per_page?: number;
  total_pages?: number;
}

/**
 * Stats endpoint response
 */
export interface StatsResponse {
  patients: {
    total: number;
  };
  appointments: {
    total: number;
  };
  providers: {
    total: number;
  };
}

/**
 * Patient filtering options
 */
export interface PatientFilters {
  search?: string;
  inactive?: boolean;
  page?: number;
  per_page?: number;
}

/**
 * Appointment filtering options
 */
export interface AppointmentFilters {
  start?: string;
  end?: string;
  provider_id?: number;
  status?: AppointmentStatus;
  page?: number;
  per_page?: number;
}

/**
 * Sort direction for sortable columns
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Status types used across the application
 */
export type StatusType = 'active' | 'inactive' | 'confirmed' | 'pending' | 'cancelled';

/**
 * Appointment status (more specific than generic StatusType)
 */
export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled';
