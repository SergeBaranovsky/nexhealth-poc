/**
 * Utility functions for formatting data display
 */

/**
 * Format a date to MM/DD/YYYY format
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${month}/${day}/${year}`;
};

/**
 * Format a date and time to MM/DD/YYYY HH:mm format
 * @param date - Date string or Date object
 * @returns Formatted date-time string
 */
export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${month}/${day}/${year} ${hours}:${minutes}`;
};

/**
 * Format a time to HH:mm format
 * @param date - Date string or Date object
 * @returns Formatted time string
 */
export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Time';
  
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

/**
 * Format a phone number for display
 * @param phone - Phone number string
 * @returns Formatted phone number or N/A if not provided
 */
export const formatPhone = (phone?: string): string => {
  if (!phone) return 'N/A';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for 10-digit numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // Format as +X (XXX) XXX-XXXX for 11-digit numbers (with country code)
  if (digits.length === 11) {
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // Return as-is if format doesn't match
  return phone;
};

/**
 * Format a person's full name
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Formatted full name
 */
export const formatName = (firstName: string, lastName: string): string => {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';
  
  if (!first && !last) return 'Unknown';
  if (!first) return last;
  if (!last) return first;
  
  return `${first} ${last}`;
};

/**
 * Format a date using locale string (fallback for complex formatting)
 * @param date - Date string or Date object
 * @returns Locale-formatted date string
 */
export const formatLocaleDate = (date: string | Date): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  return d.toLocaleString();
};
