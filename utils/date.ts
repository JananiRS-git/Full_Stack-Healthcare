// utility for deterministic date formatting independent of environment

/**
 * Format an ISO timestamp string into "M/D/YYYY, h:mm:ss AM/PM" with uppercase AM/PM.
 * This implementation avoids using toLocaleString to keep server/client output identical.
 */
export function formatDate(timestamp?: string): string {
  if (!timestamp) return '-';
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return '-';

  const pad = (n: number) => n.toString().padStart(2, '0');
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  const ampm = hours < 12 ? 'AM' : 'PM';
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
}

/**
 * Validate phone number - must be exactly 10 digits
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Format the wait time since consultation started
 */
export function calculateWaitTime(consultationStartedAt?: string | null): string {
  if (!consultationStartedAt) return '-';
  
  const started = new Date(consultationStartedAt);
  const now = new Date();
  
  if (isNaN(started.getTime())) return '-';
  
  const diffMs = now.getTime() - started.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMins % 60}m`;
  }
  return `${diffMins}m`;
}
