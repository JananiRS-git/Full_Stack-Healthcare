"use client";

import React, { useState } from 'react';
import DataTable from '../../components/DataTable';
import { useData } from '../../context/DataContext';
import { Patient } from '../../data/patients';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import FormInput from '../../components/FormInput';
import { formatDate, isValidPhoneNumber } from '../../utils/date';
import { Plus } from 'lucide-react';

export default function PatientsContent() {
  const { patients, doctors, addPatient, assignPatientToDoctor, beginConsultation, endConsultation, verifyEndConsultation } = useData();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    name: '',
    age: undefined,
    bloodGroup: 'A+',
    weight: undefined,
    bloodPressure: '',
    phone: '',
    status: 'Pending',
  });
  const [phoneError, setPhoneError] = useState<string>('');

  const filteredPatients = (() => {
    let result = statusFilter === 'All' 
      ? patients 
      : patients.filter((p) => p.status === statusFilter);
    // Sort: Pending first, then Completed; within pending, sort by token order.
    return result.sort((a, b) => {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;
      if (a.token != null && b.token != null) return a.token - b.token;
      if (a.token != null) return -1;
      if (b.token != null) return 1;
      return 0;
    });
  })();

  const handleAddPatient = async () => {
    setPhoneError('');
    
    if (newPatient.phone && !isValidPhoneNumber(newPatient.phone)) {
      setPhoneError('Phone number must be exactly 10 digits');
      return;
    }
    
    if (newPatient.name && newPatient.age && newPatient.bloodGroup && newPatient.weight && newPatient.bloodPressure && newPatient.phone) {
      await addPatient({
        id: Date.now(),
        name: newPatient.name,
        age: newPatient.age,
        bloodGroup: newPatient.bloodGroup,
        weight: newPatient.weight,
        bloodPressure: newPatient.bloodPressure,
        phone: newPatient.phone,
        status: newPatient.status as 'Pending' | 'Completed',
        doctorId: newPatient.doctorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setAddModalOpen(false);
      setNewPatient({
        name: '',
        age: undefined,
        bloodGroup: 'A+',
        weight: undefined,
        bloodPressure: '',
        phone: '',
        status: 'Pending',
      });
      setPhoneError('');
    }
  };

  const columns = [
    { header: 'Patient', accessor: 'name' as const },
    { header: 'Phone', accessor: 'phone' as const },
    { header: 'Age', accessor: 'age' as const },
    { header: 'Blood Group', accessor: 'bloodGroup' as const },
    {
      header: 'Assigned Doctor',
      accessor: 'doctorId' as const,
      render: (p: Patient) => {
        const doc = doctors.find((d) => d.id === p.doctorId);
        return doc ? doc.name : '-';
      },
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      render: (p: Patient) => <StatusBadge status={p.status} />,
    },
    {
      header: 'Consultation',
      accessor: 'consultationStatus' as const,
      render: (p: Patient) => p.consultationStatus || 'Not Started',
    },
    {
      header: 'Appointment Date',
      accessor: 'bookingDate' as const,
      render: (p: Patient) => p.bookingDate ? formatDate(p.bookingDate) : '-',
    },
    {
      header: 'Appointment Time',
      accessor: 'bookingTime' as const,
      render: (p: Patient) => p.bookingTime || '-',
    },
    {
      header: 'Token',
      accessor: 'token' as const,
      render: (p: Patient) => p.token != null ? `#${p.token}` : '-',
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      render: (p: Patient) => {
        return (
          <div className="flex items-center gap-2 flex-wrap">
            {p.status === 'Pending' && !p.doctorId && (
              <button
                className="text-teal-600 hover:underline font-medium"
                onClick={() => {
                  const docId = prompt('Enter Doctor ID to assign');
                  if (docId) {
                    const selectedDoc = doctors.find(d => d.id === Number(docId));
                    if (selectedDoc) {
                      assignPatientToDoctor(p.id, Number(docId));
                    } else {
                      alert('Doctor not found');
                    }
                  }
                }}
              >
                Assign Doctor
              </button>
            )}
            {p.status === 'Pending' && p.doctorId != null && (p.consultationStatus === null || typeof p.consultationStatus === 'undefined') && (
              <button
                className="text-purple-600 hover:underline font-medium"
                onClick={() => beginConsultation(p.id)}
              >
                Start Consultation
              </button>
            )}
            {p.consultationStatus === 'in_progress' && (
              <button
                className="text-orange-600 hover:underline font-medium"
                onClick={() => endConsultation(p.id)}
              >
                End Consultation
              </button>
            )}
            {p.consultationStatus === 'verifying_end' && (
              <button
                className="text-green-600 hover:underline font-semibold"
                onClick={() => verifyEndConsultation(p.id)}
              >
                Verify End
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patients</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage patient records and track consultation history
          </p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition font-semibold"
        >
          <Plus size={18} />
          Add Patient
        </button>
      </div>


      
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('All')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            statusFilter === 'All'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All Patients ({patients.length})
        </button>
        <button
          onClick={() => setStatusFilter('Pending')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            statusFilter === 'Pending'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Pending ({patients.filter((p) => p.status === 'Pending').length})
        </button>
        <button
          onClick={() => setStatusFilter('Completed')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            statusFilter === 'Completed'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Completed ({patients.filter((p) => p.status === 'Completed').length})
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {filteredPatients.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No patients found in this category.</p>
          </div>
        ) : (
          <DataTable columns={columns} data={filteredPatients} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{patients.length}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Consultations</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {patients.filter((p) => p.status === 'Completed').length}
          </div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
            {patients.filter((p) => p.status === 'Pending').length}
          </div>
        </div>
      </div>

      {addModalOpen && (
        <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add New Patient">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddPatient();
            }}
            className="space-y-4"
          >
            <FormInput
              label="Patient Name"
              value={newPatient.name || ''}
              onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              required
              placeholder="Enter patient name"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Age"
                type="number"
                value={newPatient.age || ''}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value ? Number(e.target.value) : undefined })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Blood Group</label>
                <select
                  value={newPatient.bloodGroup || 'A+'}
                  onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                  className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                >
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Weight (kg)"
                type="number"
                value={newPatient.weight || ''}
                onChange={(e) => setNewPatient({ ...newPatient, weight: e.target.value ? Number(e.target.value) : undefined })}
                required
              />
              <FormInput
                label="Blood Pressure"
                value={newPatient.bloodPressure || ''}
                onChange={(e) => setNewPatient({ ...newPatient, bloodPressure: e.target.value })}
                required
                placeholder="e.g. 120/80"
              />
            </div>
            <div>
              <FormInput
                label="Phone Number (10 digits)"
                value={newPatient.phone || ''}
                onChange={(e) => {
                  setNewPatient({ ...newPatient, phone: e.target.value });
                  setPhoneError('');
                }}
                required
                placeholder="e.g. 9876543210"
              />
              {phoneError && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{phoneError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Assign Doctor (Optional)</label>
              <select
                value={newPatient.doctorId || ''}
                onChange={(e) =>
                  setNewPatient({
                    ...newPatient,
                    doctorId: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="">None</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Add Patient
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-400"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
