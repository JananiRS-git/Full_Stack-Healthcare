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
const LOCAL_STORAGE_PATIENTS_KEY = 'patients';

const isLocalStorageAvailable = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readLocalPatients = (): Patient[] => {
  if (!isLocalStorageAvailable()) return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_PATIENTS_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveLocalPatients = (patients: Patient[]) => {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(LOCAL_STORAGE_PATIENTS_KEY, JSON.stringify(patients));
};

const mergePatients = (serverPatients: Patient[]): Patient[] => {
  const localPatients = readLocalPatients();
  const mergedMap = new Map<number, Patient>();

  localPatients.forEach((patient) => mergedMap.set(patient.id, patient));
  serverPatients.forEach((patient) => mergedMap.set(patient.id, patient));

  const merged = Array.from(mergedMap.values()).sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  saveLocalPatients(merged);
  return merged;
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const contentType = res.headers.get('content-type') || '';
    let payload: string;

    if (contentType.includes('application/json')) {
      const json = await res.json();
      payload = typeof json === 'string' ? json : JSON.stringify(json);
    } else {
      payload = await res.text();
    }

    throw new Error(`API error (${res.status}): ${payload}`);
  }
  return res.json();
}

export async function getPatients(): Promise<Patient[]> {
  try {
    const res = await fetch(API_BASE, { cache: 'no-store' });
    const serverPatients = await handleResponse<Patient[]>(res);
    if (serverPatients.length === 0) {
      const localPatients = readLocalPatients();
      if (localPatients.length > 0) {
        return localPatients;
      }
    }
    return mergePatients(serverPatients);
  } catch (error) {
    console.warn('API not available for patients, falling back to localStorage:', error);
    return readLocalPatients();
  }
}

export async function createPatient(patient: NewPatient): Promise<Patient> {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patient),
    });
    const payload = await handleResponse<{ message: string; data: Patient }>(res);
    const created = payload.data;
    const existing = readLocalPatients();
    saveLocalPatients([created, ...existing.filter((item) => item.id !== created.id)]);
    return created;
  } catch (error) {
    console.warn('API not available for creating patient, falling back to localStorage:', error);

    const now = new Date().toISOString();
    const created: Patient = {
      id: Date.now(),
      name: patient.name,
      age: patient.age,
      bloodGroup: patient.bloodGroup,
      weight: patient.weight,
      bloodPressure: patient.bloodPressure,
      phone: patient.phone,
      status: patient.status || 'Pending',
      doctorId: patient.doctorId,
      doctorName: patient.doctorName,
      consultationStatus: patient.consultationStatus ?? null,
      token: patient.token ?? null,
      consultationStartedAt: patient.consultationStartedAt ?? null,
      bookingDate: patient.bookingDate,
      bookingTime: patient.bookingTime,
      createdAt: now,
      updatedAt: now,
    };

    const existing = readLocalPatients();
    saveLocalPatients([created, ...existing]);
    return created;
  }
}

export async function updatePatient(patientId: number, patient: Partial<Patient>): Promise<Patient> {
  try {
    const res = await fetch(`${API_BASE}/${patientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patient),
    });
    const payload = await handleResponse<{ message: string; data: Patient }>(res);
    const updated = payload.data;
    const stored = readLocalPatients();
    saveLocalPatients(stored.map((item) => (item.id === updated.id ? updated : item)));
    return updated;
  } catch (error) {
    console.warn('API not available for updating patient, falling back to localStorage:', error);
    const stored = readLocalPatients();
    const updated = stored.map((item) => (item.id === patientId ? { ...item, ...patient, updatedAt: new Date().toISOString() } : item));
    saveLocalPatients(updated);
    const found = updated.find((item) => item.id === patientId);
    if (!found) throw new Error('Patient not found in local store');
    return found;
  }
}

export async function deletePatient(patientId: number): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/${patientId}`, {
      method: 'DELETE',
    });
    await handleResponse<{ message: string; data: Patient }>(res);
    const stored = readLocalPatients();
    saveLocalPatients(stored.filter((item) => item.id !== patientId));
  } catch (error) {
    console.warn('API not available for deleting patient, falling back to localStorage:', error);
    const stored = readLocalPatients();
    saveLocalPatients(stored.filter((item) => item.id !== patientId));
  }
}

