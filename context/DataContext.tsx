"use client";

import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { doctors as initialDoctors, Doctor } from '../data/doctors';
import { patients as initialPatients, Patient } from '../data/patients';
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
  addPatient: (patient: Patient) => void;
  assignPatientToDoctor: (patientId: number, doctorId: number, bookingDate?: string, bookingTime?: string) => void;
  beginConsultation: (patientId: number) => void;
  endConsultation: (patientId: number) => void;
  verifyEndConsultation: (patientId: number) => void;
  startConsultation: (patientId: number, doctorId: number) => void;
  movePatientToCompleted: (id: number, doctorId?: number) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (patientId: number) => void;
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
  const [patients, setPatients] = useState<Patient[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('patients');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // If parse fails, fall back to initial data
        }
      }
    }
    const initialData = initialPatients.map((p) => ({
      ...p,
      createdAt: p.createdAt || new Date().toISOString(),
      updatedAt: p.updatedAt || new Date().toISOString(),
    }));
    // Save immediately to localStorage so it persists
    if (typeof window !== 'undefined') {
      localStorage.setItem('patients', JSON.stringify(initialData));
    }
    return initialData;
  });
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

  const addPatient = (patient: Patient) => {
    const now = new Date().toISOString();

    let tokenNumber = patient.token;
    if (patient.doctorId != null && tokenNumber == null) {
      const patientsWaitingForDoctor = patients.filter(
        (p) =>
          p.doctorId === patient.doctorId &&
          (p.status === 'Pending' || p.consultationStatus === 'in_progress' || p.consultationStatus === 'verifying_end')
      );
      tokenNumber = patientsWaitingForDoctor.length + 1;
    }

    // If doctorId is provided, also set doctorName
    let patientData = patient;
    if (patient.doctorId) {
      const doctor = doctors.find((d) => d.id === patient.doctorId);
      const doctorName = doctor?.name || 'Unknown Doctor';
      patientData = { ...patient, doctorName, token: tokenNumber };
    } else if (tokenNumber != null) {
      patientData = { ...patient, token: tokenNumber };
    }

    setPatients((prev) => [...prev, { ...patientData, createdAt: now, updatedAt: now }]);
  };
  
  // Assign a patient to a doctor without starting consultation yet
  const assignPatientToDoctor = (patientId: number, doctorId: number, bookingDate?: string, bookingTime?: string) => {
    // Get doctor name to store in patient record
    const doctor = doctors.find((d) => d.id === doctorId);
    const doctorName = doctor?.name || 'Unknown Doctor';
    
    const existingTokens = patients
      .filter(
        (p) =>
          p.doctorId === doctorId &&
          p.id !== patientId &&
          (p.status === 'Pending' || p.consultationStatus === 'in_progress' || p.consultationStatus === 'verifying_end')
      )
      .map((p) => p.token)
      .filter((token): token is number => typeof token === 'number');
    const tokenNumber = existingTokens.length > 0 ? Math.max(...existingTokens) + 1 : 1;
    
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { 
              ...p, 
              doctorId, 
              doctorName, 
              status: 'Pending', 
              consultationStatus: null, 
              token: tokenNumber, 
              bookingDate: bookingDate || p.bookingDate,
              bookingTime: bookingTime || p.bookingTime,
              updatedAt: new Date().toISOString() 
            }
          : p
      )
    );
    
    // Mark doctor as busy when patient is assigned
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === doctorId ? { ...d, status: 'Busy', updatedAt: new Date().toISOString() } : d
      )
    );
  };
  
  // Begin the actual consultation (patient touches start consultation)
  const beginConsultation = (patientId: number) => {
    const patient = patients.find((p) => p.id === patientId);
    const consultationTime = new Date().toISOString();
    
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          // Use existing token if already assigned, otherwise generate new one
          const existingToken = p.token;
          const tokenNumber = existingToken || 1;
          
          return { ...p, consultationStatus: 'in_progress', token: tokenNumber, consultationStartedAt: consultationTime, updatedAt: consultationTime };
        }
        return p;
      })
    );
    
    // Mark doctor as busy when consultation starts
    if (patient && patient.doctorId) {
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === patient.doctorId ? { ...d, status: 'Busy', updatedAt: new Date().toISOString() } : d
        )
      );
    }
  };
  
  // End the consultation (doctor touches end consultation)
  const endConsultation = (patientId: number) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, consultationStatus: 'verifying_end', updatedAt: new Date().toISOString() }
          : p
      )
    );
  };
  
  // Verify and complete the consultation (verification button)
  const verifyEndConsultation = (patientId: number) => {
    const patient = patients.find((p) => p.id === patientId);
    
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, status: 'Completed', consultationStatus: null, consultationStartedAt: null, updatedAt: new Date().toISOString() }
          : p
      )
    );
    
    // Mark doctor as free after consultation ends
    if (patient && patient.doctorId) {
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === patient.doctorId ? { ...d, status: 'Free', updatedAt: new Date().toISOString() } : d
        )
      );
    }
  };
  
  const startConsultation = (patientId: number, doctorId: number) => {
    // Get doctor name to store in patient record
    const doctor = doctors.find((d) => d.id === doctorId);
    const doctorName = doctor?.name || 'Unknown Doctor';
    
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          // Generate token number: count of other patients with same doctor with pending or active status
          const patientsWithDoctor = prev.filter(
            (patient) => patient.doctorId === doctorId && (patient.status === 'Pending' || patient.consultationStatus) && patient.id !== patientId
          );
          const tokenNumber = patientsWithDoctor.length + 1;
          
          return { ...p, doctorId, doctorName, status: 'Pending', token: tokenNumber, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === doctorId ? { ...d, status: 'Busy', updatedAt: new Date().toISOString() } : d
      )
    );
  };

  const movePatientToCompleted = (id: number) => {
    // Get the patient being marked as completed
    const patient = patients.find((p) => p.id === id);
    
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: 'Completed', updatedAt: new Date().toISOString() }
          : p
      )
    );
    
    // Update doctor status based on waiting patients
    if (patient && patient.doctorId) {
      setDoctors((prev) =>
        prev.map((d) => {
          if (d.id === patient.doctorId) {
            // Check if there are other pending patients for this doctor
            const otherPendingPatients = patients.filter(
              (p) => p.doctorId === patient.doctorId && p.id !== id && p.status === 'Pending'
            );
            
            // Keep doctor as busy if there are other pending patients, otherwise mark as free
            const newStatus = otherPendingPatients.length > 0 ? 'Busy' : 'Free';
            return { ...d, status: newStatus, updatedAt: new Date().toISOString() };
          }
          return d;
        })
      );
    }
  };

  const updatePatient = (patient: Patient) =>
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patient.id ? { ...patient, updatedAt: new Date().toISOString() } : p
      )
    );

  const deletePatient = (patientId: number) => {
    setPatients((prev) => prev.filter((p) => p.id !== patientId));
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
      localStorage.setItem('patients', JSON.stringify(patients));
    }
  }, [patients]);

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
