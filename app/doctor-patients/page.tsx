"use client";

import React from 'react';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';
import { Users } from 'lucide-react';

export default function DoctorPatientsPage() {
  const { doctors, patients } = useData();

  // Map each doctor with their patients
  const doctorPatientData = doctors.map((doctor) => {
    const doctorPatients = patients.filter((p) => p.doctorId === doctor.id);
    return {
      doctor,
      patients: doctorPatients,
      pendingCount: doctorPatients.filter((p) => p.status === 'Pending').length,
      completedCount: doctorPatients.filter((p) => p.status === 'Completed').length,
      consultingCount: doctorPatients.filter((p) => p.consultationStatus === 'in_progress').length,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Doctor-Patient Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">View patient assignments and consultation status for each doctor</p>
      </div>

      <div className="grid gap-6">
        {doctorPatientData.map(({ doctor, patients: docPatients, pendingCount, completedCount, consultingCount }) => (
          <div key={doctor.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            {/* Doctor Header */}
            <div className="flex items-start justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{doctor.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{doctor.specialization}</p>
              </div>
              <div className="flex gap-4 items-center">
                <StatusBadge status={doctor.status} />
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Case Time:</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{doctor.caseTime}</p>
                </div>
              </div>
            </div>

            {/* Patient Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Patients</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{docPatients.length}</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingCount}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Consulting</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{consultingCount}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</p>
              </div>
            </div>

            {/* Patients List */}
            {docPatients.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users size={20} />
                  Assigned Patients
                </h3>
                <div className="space-y-3">
                  {docPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                            <span className="font-semibold text-teal-600 dark:text-teal-400">{patient.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{patient.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Age: {patient.age} | Phone: {patient.phone || '-'} | Blood: {patient.bloodGroup}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {patient.token && (
                          <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-center">
                            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Token #{patient.token}</p>
                          </div>
                        )}
                        <div className="text-right">
                          <StatusBadge status={patient.status} />
                          {patient.consultationStatus === 'in_progress' && (
                            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1">Consulting</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No patients assigned to this doctor</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {doctors.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No doctors available. Create doctors to see patient assignments.</p>
        </div>
      )}
    </div>
  );
}
