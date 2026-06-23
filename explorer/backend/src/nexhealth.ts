/**
 * NexHealth API Client
 * Ported from Python reference implementation
 */

import type {
  Patient,
  Appointment,
  Provider,
  AppointmentType,
  AvailableSlotsResponse,
  Institution,
  ApiResponse,
  AuthResponse,
} from '../../shared/types';

const DEFAULT_BASE_URL = 'https://nexhealth.info';
const DEFAULT_API_VERSION = 'v20240412';

interface NexHealthConfig {
  apiKey: string;
  subdomain: string;
  locationId: string;
  baseUrl?: string;
  apiVersion?: string;
}

interface RequestParams {
  [key: string]: string | number | boolean | undefined;
}

export class NexHealthClient {
  private apiKey: string;
  private subdomain: string;
  private locationId: string;
  private baseUrl: string;
  private apiVersion: string;
  private token: string | null = null;

  constructor(config: NexHealthConfig) {
    this.apiKey = config.apiKey;
    this.subdomain = config.subdomain;
    this.locationId = config.locationId;
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.apiVersion = config.apiVersion || DEFAULT_API_VERSION;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Nex-Api-Version': this.apiVersion,
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    } else {
      headers['Authorization'] = this.apiKey;
    }

    return headers;
  }

  private getBaseParams(): RequestParams {
    return {
      subdomain: this.subdomain,
      location_id: this.locationId,
    };
  }

  private buildUrl(endpoint: string, params?: RequestParams): string {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async request<T>(
    method: string,
    endpoint: string,
    params?: RequestParams
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);

    try {
      const response = await fetch(url, {
        method,
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();

      // Normalize response structure
      if (Array.isArray(data)) {
        return { data: data as T, count: data.length };
      }

      if (data === null) {
        return { data: {} as T };
      }

      return data;
    } catch (error) {
      console.error(`Request failed for ${method} /${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Authenticate and get token
   */
  async authenticate(): Promise<string> {
    console.log('Authenticating with NexHealth API...');
    
    const response = await this.request<AuthResponse['data']>('POST', 'authenticates');
    const token = response.data.token;

    if (!token) {
      throw new Error('No token received from authentication');
    }

    // Decode JWT to get expiration time
    try {
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      const exp = new Date(payload.exp * 1000);
      console.log(`Token acquired. Expires at ${exp.toLocaleTimeString()}`);
    } catch (e) {
      console.log('Token acquired (could not decode expiration)');
    }

    this.token = token;
    return token;
  }

  /**
   * Get institution and location information
   */
  async getInstitution(): Promise<ApiResponse<{ institutions: Institution[] }>> {
    return this.request('GET', 'institutions', { subdomain: this.subdomain });
  }

  /**
   * List patients with pagination
   */
  async getPatients(options: {
    page?: number;
    per_page?: number;
  } = {}): Promise<ApiResponse<{ patients: Patient[] }>> {
    const params = {
      ...this.getBaseParams(),
      new_patient: 'false',
      include_upcoming_appts: 'false',
      location_strict: 'false',
      page: options.page || 1,
      per_page: options.per_page || 25,
    };

    return this.request('GET', 'patients', params);
  }

  /**
   * Get a specific patient by ID
   */
  async getPatient(patientId: string): Promise<ApiResponse<Patient>> {
    return this.request('GET', `patients/${patientId}`, this.getBaseParams());
  }

  /**
   * List appointments with date range
   */
  async getAppointments(options: {
    start?: string;
    end?: string;
    page?: number;
    per_page?: number;
  } = {}): Promise<ApiResponse<{ appointments: Appointment[] }>> {
    const now = new Date();
    const defaultStart = now.toISOString();
    const defaultEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const params = {
      ...this.getBaseParams(),
      start: options.start || defaultStart,
      end: options.end || defaultEnd,
      page: options.page || 1,
      per_page: options.per_page || 25,
    };

    return this.request('GET', 'appointments', params);
  }

  /**
   * List providers
   */
  async getProviders(): Promise<ApiResponse<{ providers: Provider[] }>> {
    return this.request('GET', 'providers', this.getBaseParams());
  }

  /**
   * List appointment types
   */
  async getAppointmentTypes(): Promise<ApiResponse<{ appointment_types: AppointmentType[] }>> {
    return this.request('GET', 'appointment_types', this.getBaseParams());
  }

  /**
   * List available appointment slots
   */
  async getAvailableSlots(options: {
    provider_id?: string;
    appointment_type_id?: string;
    start_date?: string;
    days?: number;
  } = {}): Promise<ApiResponse<{ available_slots: AvailableSlotsResponse[] }>> {
    const defaultStart = new Date().toISOString().split('T')[0];

    const params: RequestParams = {
      subdomain: this.subdomain,
      'lids[]': this.locationId,
      start_date: options.start_date || defaultStart,
      days: options.days || 7,
    };

    if (options.provider_id) {
      params['pids[]'] = options.provider_id;
    }

    if (options.appointment_type_id) {
      params['appointment_type_id'] = options.appointment_type_id;
    }

    return this.request('GET', 'available_slots', params);
  }
}
