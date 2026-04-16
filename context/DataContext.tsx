"use client";

import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { doctors as initialDoctors, Doctor } from '../data/doctors';
import {
  createPatient,
  deletePatient as apiDeletePatient,
  getPatients,
  Patient,
  updatePatient as apiUpdatePatient,
} from '../data/patients';
import { bloodRequests as initialRequests, BloodRequest } from '../data/bloodRequests';
import { updates as initialUpdates, Update } from '../data/updates';

interface DataContextProps {
  doctors: Doctor[];
  deletedDoctors: Doctor[];
  patients: Patient[];
  bloodRequests: BloodRequest[];
  updates: Update[];
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (doctor: Doctor) => void;
  deleteDoctor: (doctorId: number) => void;
  addPatient: (patient: Patient) => Promise<void>;
  assignPatientToDoctor: (patientId: number, doctorId: number, bookingDate?: string, bookingTime?: string) => Promise<void>;
  beginConsultation: (patientId: number) => Promise<void>;
  endConsultation: (patientId: number) => Promise<void>;
  verifyEndConsultation: (patientId: number) => Promise<void>;
  startConsultation: (patientId: number, doctorId: number) => Promise<void>;
  movePatientToCompleted: (id: number, doctorId?: number) => Promise<void>;
  updatePatient: (patient: Patient) => Promise<void>;
  deletePatient: (patientId: number) => Promise<void>;
  addBloodRequest: (req: BloodRequest) => void;
  toggleBloodStatus: (id: number) => void;
  addUpdate: (update: Update) => void;
  updateUpdate: (update: Update) => void;
  deleteUpdate: (id: number) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // load from localStorage if available, otherwise fall back to initial data
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('doctors');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // If parse fails, fall back to initial data
        }
      }
    }
    // assign timestamps to initial records
    const initialData = initialDoctors.map((d) => ({
      ...d,
      createdAt: d.createdAt || new Date().toISOString(),
      updatedAt: d.updatedAt || new Date().toISOString(),
    }));
    // Save immediately to localStorage so it persists
    if (typeof window !== 'undefined') {
      localStorage.setItem('doctors', JSON.stringify(initialData));
    }
    return initialData;
  });
  
  const [deletedDoctors, setDeletedDoctors] = useState<Doctor[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('deletedDoctors');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bloodRequests');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return initialRequests;
        }
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('bloodRequests', JSON.stringify(initialRequests));
    }
    return initialRequests;
  });
  const [updates, setUpdates] = useState<Update[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('updates');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return initialUpdates;
        }
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('updates', JSON.stringify(initialUpdates));
    }
    return initialUpdates;
  });

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const fetchedPatients = await getPatients();
        setPatients(fetchedPatients);
      } catch (error) {
        console.error('Error loading patients from API:', error);
      }
    };

    loadPatients();
  }, []);

  const parseBookingTime = (bookingTime?: string) => {
    if (!bookingTime) return null;
    const match = bookingTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3].toUpperCase();

    if (hours === 12) {
      hours = period === 'AM' ? 0 : 12;
    } else if (period === 'PM') {
      hours += 12;
    }

    return { hours, minutes };
  };

  const getAppointmentTimestamp = (bookingDate?: string, bookingTime?: string) => {
    if (!bookingDate) return null;
    const date = new Date(bookingDate);
    if (Number.isNaN(date.getTime())) return null;

    const parsedTime = parseBookingTime(bookingTime ?? '');
    if (parsedTime) {
      date.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
    } else {
      date.setHours(23, 59, 59, 999);
    }

    return date.getTime();
  };

  const compareAppointments = (a: Patient, b: Patient) => {
    const aTs = getAppointmentTimestamp(a.bookingDate, a.bookingTime);
    const bTs = getAppointmentTimestamp(b.bookingDate, b.bookingTime);

    if (aTs == null && bTs == null) return 0;
    if (aTs == null) return 1;
    if (bTs == null) return -1;
    if (aTs !== bTs) return aTs - bTs;

    const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return aCreated - bCreated;
  };

  const reorderDoctorQueue = (doctorId: number, updatedPatient?: Patient) => {
    const queuePatients = patients
      .filter(
        (p) =>
          p.doctorId === doctorId &&
          (p.status === 'Pending' || p.consultationStatus === 'in_progress' || p.consultationStatus === 'verifying_end')
      )
      .map((p) => ({ ...p }));

    if (updatedPatient) {
      const existingIndex = queuePatients.findIndex((p) => p.id === updatedPatient.id);
      if (existingIndex >= 0) {
        queuePatients[existingIndex] = { ...updatedPatient };
      } else {
        queuePatients.push({ ...updatedPatient });
      }
    }

    return queuePatients
      .sort(compareAppointments)
      .map((p, index) => ({ ...p, token: index + 1 }));
  };

  const addDoctor = (doctor: Doctor) => {
    const now = new Date().toISOString();
    setDoctors((prev) => [...prev, { ...doctor, createdAt: now, updatedAt: now }]);
  };
  const updateDoctor = (doctor: Doctor) =>
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === doctor.id
          ? { ...doctor, updatedAt: new Date().toISOString() }
          : d
      )
    );

  const deleteDoctor = (doctorId: number) => {
    // Find the doctor and move to deleted doctors
    const doctorToDelete = doctors.find((d) => d.id === doctorId);
    if (doctorToDelete) {
      setDeletedDoctors((prev) => [...prev, { ...doctorToDelete, updatedAt: new Date().toISOString() }]);
    }
    // Remove doctor from doctors list
    setDoctors((prev) => prev.filter((d) => d.id !== doctorId));
    // Keep patient assignments for historical records (don't clear doctorId or doctorName)
    // This way, deleted doctors still show in patient records
  };

  const savePatient = async (patient: Patient): Promise<Patient> => {
    try {
      const updated = await apiUpdatePatient(patient.id, {
        name: patient.name,
        age: patient.age,
        bloodGroup: patient.bloodGroup,
        weight: patient.weight,
        bloodPressure: patient.bloodPressure,
        phone: patient.phone,
        status: patient.status,
        doctorId: patient.doctorId,
        doctorName: patient.doctorName,
        consultationStatus: patient.consultationStatus,
        token: patient.token,
        consultationStartedAt: patient.consultationStartedAt,
        bookingDate: patient.bookingDate,
        bookingTime: patient.bookingTime,
      });
      setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      return updated;
    } catch (error) {
      console.error('Error saving patient:', error);
      return patient;
    }
  };

  const addPatient = async (patient: Patient) => {
    const now = new Date().toISOString();

    let doctorName = patient.doctorName;
    let tokenNumber = patient.token;

    if (patient.doctorId != null) {
      const doctor = doctors.find((d) => d.id === patient.doctorId);
      doctorName = doctor?.name || doctorName || 'Unknown Doctor';

      const patientsWaitingForDoctor = patients.filter(
        (p) =>
          p.doctorId === patient.doctorId &&
          (p.status === 'Pending' || p.consultationStatus === 'in_progress' || p.consultationStatus === 'verifying_end')
      );
      tokenNumber = tokenNumber ?? patientsWaitingForDoctor.length + 1;
    }

    try {
      const created = await createPatient({
        name: patient.name,
        age: patient.age,
        bloodGroup: patient.bloodGroup,
        weight: patient.weight,
        bloodPressure: patient.bloodPressure,
        phone: patient.phone,
        status: patient.status || 'Pending',
        doctorId: patient.doctorId,
        doctorName,
        consultationStatus: patient.consultationStatus ?? null,
        token: tokenNumber,
        consultationStartedAt: patient.consultationStartedAt ?? null,
        bookingDate: patient.bookingDate,
        bookingTime: patient.bookingTime,
      });
      setPatients((prev) => [created, ...prev]);

      if (created.doctorId) {
        setDoctors((prev) =>
          prev.map((d) =>
            d.id === created.doctorId ? { ...d, status: 'Busy', updatedAt: now } : d
          )
        );
      }
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  // Assign a patient to a doctor without starting consultation yet
  const assignPatientToDoctor = async (patientId: number, doctorId: number, bookingDate?: string, bookingTime?: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const doctor = doctors.find((d) => d.id === doctorId);
    const doctorName = doctor?.name || 'Unknown Doctor';

    const updatedBookingDate = bookingDate ?? patient.bookingDate;
    const updatedBookingTime = bookingTime ?? patient.bookingTime;

    const updatedPatient: Patient = {
      ...patient,
      doctorId,
      doctorName,
      status: 'Pending',
      consultationStatus: null,
      bookingDate: updatedBookingDate,
      bookingTime: updatedBookingTime,
      updatedAt: new Date().toISOString(),
    };

    const updatedQueue = reorderDoctorQueue(doctorId, updatedPatient);
    const queueMap = new Map(updatedQueue.map((p) => [p.id, p]));

    setPatients((prev) =>
      prev.map((p) => queueMap.get(p.id) ?? p)
    );

    await Promise.all(
      updatedQueue.map(async (queuePatient) => {
        const existing = patients.find((p) => p.id === queuePatient.id);
        if (!existing || existing.token !== queuePatient.token || existing.bookingDate !== queuePatient.bookingDate || existing.bookingTime !== queuePatient.bookingTime) {
          await savePatient(queuePatient);
        }
      })
    );

    setDoctors((prev) =>
      prev.map((d) =>
        d.id === doctorId ? { ...d, status: 'Busy', updatedAt: new Date().toISOString() } : d
      )
    );
  };

  // Begin the actual consultation (patient touches start consultation)
  const beginConsultation = async (patientId: number) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;
    const consultationTime = new Date().toISOString();

    const tokenNumber = patient.token ?? 1;
    const updatedPatient: Patient = {
      ...patient,
      consultationStatus: 'in_progress',
      token: tokenNumber,
      consultationStartedAt: consultationTime,
      updatedAt: consultationTime,
    };

    await savePatient(updatedPatient);

    if (patient.doctorId) {
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === patient.doctorId ? { ...d, status: 'Busy', updatedAt: consultationTime } : d
        )
      );
    }
  };

  // End the consultation (doctor touches end consultation)
  const endConsultation = async (patientId: number) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const updatedPatient: Patient = {
      ...patient,
      consultationStatus: 'verifying_end',
      updatedAt: new Date().toISOString(),
    };

    await savePatient(updatedPatient);
  };

  // Verify and complete the consultation (verification button)
  const verifyEndConsultation = async (patientId: number) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const updatedPatient: Patient = {
      ...patient,
      status: 'Completed',
      consultationStatus: null,
      consultationStartedAt: null,
      updatedAt: new Date().toISOString(),
    };

    await savePatient(updatedPatient);

    if (patient.doctorId) {
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === patient.doctorId ? { ...d, status: 'Free', updatedAt: new Date().toISOString() } : d
        )
      );
    }
  };

  const startConsultation = async (patientId: number, doctorId: number) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const doctor = doctors.find((d) => d.id === doctorId);
    const doctorName = doctor?.name || 'Unknown Doctor';

    const patientsWithDoctor = patients.filter(
      (p) => p.doctorId === doctorId && (p.status === 'Pending' || p.consultationStatus) && p.id !== patientId
    );
    const tokenNumber = patientsWithDoctor.length + 1;

    const updatedPatient: Patient = {
      ...patient,
      doctorId,
      doctorName,
      status: 'Pending',
      token: tokenNumber,
      updatedAt: new Date().toISOString(),
    };

    await savePatient(updatedPatient);

    setDoctors((prev) =>
      prev.map((d) =>
        d.id === doctorId ? { ...d, status: 'Busy', updatedAt: new Date().toISOString() } : d
      )
    );
  };

  const movePatientToCompleted = async (id: number) => {
    const patient = patients.find((p) => p.id === id);
    if (!patient) return;

    const updatedPatient: Patient = {
      ...patient,
      status: 'Completed',
      updatedAt: new Date().toISOString(),
    };

    await savePatient(updatedPatient);

    if (patient.doctorId) {
      setDoctors((prev) =>
        prev.map((d) => {
          if (d.id === patient.doctorId) {
            const otherPendingPatients = patients.filter(
              (p) => p.doctorId === patient.doctorId && p.id !== id && p.status === 'Pending'
            );
            const newStatus = otherPendingPatients.length > 0 ? 'Busy' : 'Free';
            return { ...d, status: newStatus, updatedAt: new Date().toISOString() };
          }
          return d;
        })
      );
    }
  };

  const updatePatient = async (patient: Patient) => {
    const updated = await apiUpdatePatient(patient.id, {
      name: patient.name,
      age: patient.age,
      bloodGroup: patient.bloodGroup,
      weight: patient.weight,
      bloodPressure: patient.bloodPressure,
      phone: patient.phone,
      status: patient.status,
      doctorId: patient.doctorId,
      doctorName: patient.doctorName,
      consultationStatus: patient.consultationStatus,
      token: patient.token,
      consultationStartedAt: patient.consultationStartedAt,
      bookingDate: patient.bookingDate,
      bookingTime: patient.bookingTime,
    });
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deletePatient = async (patientId: number) => {
    try {
      await apiDeletePatient(patientId);
      setPatients((prev) => prev.filter((p) => p.id !== patientId));
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const toggleBloodStatus = (id: number) => {
    setBloodRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === 'Urgent' ? 'Normal' : 'Urgent' }
          : r
      )
    );
  };

  const addUpdate = (update: Update) => setUpdates((prev) => [...prev, update]);

  const updateUpdate = (update: Update) =>
    setUpdates((prev) =>
      prev.map((u) =>
        u.id === update.id ? { ...update, timestamp: new Date().toISOString() } : u
      )
    );

  const deleteUpdate = (id: number) =>
    setUpdates((prev) => prev.filter((u) => u.id !== id));

  const addBloodRequest = (req: BloodRequest) => setBloodRequests((prev) => [...prev, req]);

  // Sync doctor statuses with patient assignments
  useEffect(() => {
    setDoctors((prevDoctors) =>
      prevDoctors.map((doctor) => {
        // Check if this doctor has any pending or in_progress patients
        const hasPendingPatients = patients.some(
          (p) => p.doctorId === doctor.id && (p.status === 'Pending' || p.consultationStatus === 'in_progress')
        );
        
        // Update doctor status based on patient assignments
        const newStatus = hasPendingPatients ? 'Busy' : 'Free';
        if (doctor.status !== newStatus) {
          return { ...doctor, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return doctor;
      })
    );
  }, [patients]);

  // persist to localStorage whenever underlying arrays change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('doctors', JSON.stringify(doctors));
    }
  }, [doctors]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('deletedDoctors', JSON.stringify(deletedDoctors));
    }
  }, [deletedDoctors]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bloodRequests', JSON.stringify(bloodRequests));
    }
  }, [bloodRequests]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('updates', JSON.stringify(updates));
    }
  }, [updates]);

  return (
    <DataContext.Provider
      value={{
        doctors,
        deletedDoctors,
        patients,
        bloodRequests,
        updates,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        addPatient,
        updatePatient,
        deletePatient,
        assignPatientToDoctor,
        beginConsultation,
        endConsultation,
        verifyEndConsultation,
        startConsultation,
        movePatientToCompleted,
        addBloodRequest,
        toggleBloodStatus,
        addUpdate,
        updateUpdate,
        deleteUpdate,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
