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
