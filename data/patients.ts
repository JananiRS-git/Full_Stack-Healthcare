export interface Patient {
  id: number;
  name: string;
  age: number;
  bloodGroup: string;
  weight: number; // kg
  bloodPressure: string; // e.g. 120/80
  phone?: string; // 10-digit phone number
  status: 'Pending' | 'Completed';
  doctorId?: number;
  /** doctor name stored at assignment time (preserved in records even if doctor deleted) */
  doctorName?: string;
  /** consultation state: null (no consultation started), 'in_progress', 'verifying_end' */
  consultationStatus?: 'in_progress' | 'verifying_end' | null;
  /** token number for queue management */
  token?: number | null;
  /** timestamp when consultation started (for tracking wait time) */
  consultationStartedAt?: string | null;
  /** when the patient record was created */
  createdAt?: string;
  /** last modification timestamp (edit, status change, doctor assignment, etc) */
  updatedAt?: string;
  /** booking date in YYYY-MM-DD format */
  bookingDate?: string;
  /** booking time in HH:MM format */
  bookingTime?: string;
}

export const patients: Patient[] = [];
