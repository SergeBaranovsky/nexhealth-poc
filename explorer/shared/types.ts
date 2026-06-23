/**
 * Shared TypeScript types for NexHealth API
 * Used by both frontend and backend
 */

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  bio?: {
    date_of_birth?: string;
    gender?: string;
  };
  inactive: boolean;
}

export interface Appointment {
  id: string;
  patient_id: string;
  provider_id?: string;
  start_time: string;
  end_time: string;
  status?: string;
  did_not_come?: boolean;
}

export interface Provider {
  id: string;
  first_name: string;
  last_name: string;
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
