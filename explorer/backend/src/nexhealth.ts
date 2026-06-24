/**
 * NexHealth API Client
 * Ported from Python reference implementation
 * 
 * Enhanced with:
 * - Request caching with TTL
 * - Request timeout (10s default)
 * - Retry logic with exponential backoff (3 retries default)
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
const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second base delay
const DEFAULT_CACHE_TTL = 2 * 60 * 1000; // 2 minutes

interface NexHealthConfig {
  apiKey: string;
  subdomain: string;
  locationId: string;
  baseUrl?: string;
  apiVersion?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  cacheTTL?: number;
}

interface RequestParams {
  [key: string]: string | number | boolean | undefined;
}

interface CacheEntry<T> {
  data: T;
  expires: number;
}

export class NexHealthClient {
  private apiKey: string;
  private subdomain: string;
  private locationId: string;
  private baseUrl: string;
  private apiVersion: string;
  private token: string | null = null;
  private timeout: number;
  private maxRetries: number;
  private retryDelay: number;
  private cacheTTL: number;
  private cache: Map<string, CacheEntry<any>> = new Map();

  constructor(config: NexHealthConfig) {
    this.apiKey = config.apiKey;
    this.subdomain = config.subdomain;
    this.locationId = config.locationId;
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.apiVersion = config.apiVersion || DEFAULT_API_VERSION;
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.maxRetries = config.maxRetries || DEFAULT_MAX_RETRIES;
    this.retryDelay = config.retryDelay || DEFAULT_RETRY_DELAY;
    this.cacheTTL = config.cacheTTL || DEFAULT_CACHE_TTL;
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

  /**
   * Generate cache key from method, endpoint, and params
   */
  private getCacheKey(method: string, endpoint: string, params?: RequestParams): string {
    const paramStr = params ? JSON.stringify(params) : '';
    return `${method}:${endpoint}:${paramStr}`;
  }

  /**
   * Get cached response if available and not expired
   */
  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    if (Date.now() >= cached.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  /**
   * Store response in cache with TTL
   */
  private setCached<T>(key: string, data: T, ttl?: number): void {
    const expires = Date.now() + (ttl || this.cacheTTL);
    this.cache.set(key, { data, expires });
  }

  /**
   * Clear all cached responses
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear specific cache entry
   */
  public clearCacheEntry(method: string, endpoint: string, params?: RequestParams): void {
    const key = this.getCacheKey(method, endpoint, params);
    this.cache.delete(key);
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Make HTTP request with caching, timeout, and retry logic
   * - GET requests are cached for cacheTTL (default 2 minutes)
   * - Requests timeout after timeout ms (default 10 seconds)
   * - Failed requests are retried up to maxRetries times with exponential backoff
   */
  private async request<T>(
    method: string,
    endpoint: string,
    params?: RequestParams
  ): Promise<ApiResponse<T>> {
    // Check cache for GET requests
    if (method === 'GET') {
      const cacheKey = this.getCacheKey(method, endpoint, params);
      const cached = this.getCached<ApiResponse<T>>(cacheKey);
      
      if (cached) {
        return cached;
      }
    }

    // Retry loop with exponential backoff
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.makeRequestWithTimeout(method, endpoint, params);
        
        // Cache successful GET requests
        if (method === 'GET') {
          const cacheKey = this.getCacheKey(method, endpoint, params);
          this.setCached(cacheKey, response);
        }
        
        return response;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on last attempt
        if (attempt === this.maxRetries) {
          break;
        }
        
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && error.message.includes('API request failed: 4')) {
          break;
        }
        
        // Calculate exponential backoff delay
        const delay = this.retryDelay * Math.pow(2, attempt);
        console.log(
          `Request failed (attempt ${attempt + 1}/${this.maxRetries + 1}), ` +
          `retrying in ${delay}ms...`
        );
        
        await this.sleep(delay);
      }
    }

    console.error(`Request failed for ${method} /${endpoint} after ${this.maxRetries + 1} attempts`);
    throw lastError;
  }

  /**
   * Make a single HTTP request with timeout
   */
  private async makeRequestWithTimeout<T>(
    method: string,
    endpoint: string,
    params?: RequestParams
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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

      // If data has a nested 'data' array, extract count from it
      if (data.data && Array.isArray(data.data)) {
        return { ...data, count: data.count || data.data.length };
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms for ${method} /${endpoint}`);
      }
      
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

    const response = await this.request<Patient[]>('GET', 'patients', params);
    
    // Transform response to expected structure
    return {
      data: {
        patients: Array.isArray(response.data) ? response.data : []
      },
      count: response.count || 0
    };
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

    const response = await this.request<Appointment[]>('GET', 'appointments', params);
    
    // Transform response to expected structure
    return {
      data: {
        appointments: Array.isArray(response.data) ? response.data : []
      },
      count: response.count || 0
    };
  }

  /**
   * List providers
   */
  async getProviders(): Promise<ApiResponse<{ providers: Provider[] }>> {
    const response = await this.request<Provider[]>('GET', 'providers', this.getBaseParams());
    
    // Transform response to expected structure
    return {
      data: {
        providers: Array.isArray(response.data) ? response.data : []
      },
      count: response.count || 0
    };
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
