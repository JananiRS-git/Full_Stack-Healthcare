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

export type NewPatient = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'> & {
  status?: 'Pending' | 'Completed';
};

const API_BASE = "/api/patients";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const payload = await res.text();
    throw new Error(`API error (${res.status}): ${payload}`);
  }
  return res.json();
}

export async function getPatients(): Promise<Patient[]> {
  const res = await fetch(API_BASE, { cache: 'no-store' });
  return handleResponse<Patient[]>(res);
}

export async function createPatient(patient: NewPatient): Promise<Patient> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patient),
  });
  const payload = await handleResponse<{ message: string; data: Patient }>(res);
  return payload.data;
}

export async function updatePatient(patientId: number, patient: Partial<Patient>): Promise<Patient> {
  const res = await fetch(`${API_BASE}/${patientId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patient),
  });
  const payload = await handleResponse<{ message: string; data: Patient }>(res);
  return payload.data;
}

export async function deletePatient(patientId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/${patientId}`, {
    method: 'DELETE',
  });
  await handleResponse<{ message: string; data: Patient }>(res);
}

