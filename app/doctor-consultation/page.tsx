"use client";

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Doctor } from '../../data/doctors';
import { Patient } from '../../data/patients';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { ArrowRight, Clock, Users } from 'lucide-react';

export default function DoctorConsultationPage() {
  const { doctors, patients, endConsultation, verifyEndConsultation } = useData();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const getDoctorPatients = (doctorId: number) => {
    return patients.filter((p) => p.doctorId === doctorId && (p.status === 'Pending' || p.consultationStatus));
  };

  const getCurrentPatient = (doctorId: number) => {
    return patients.find(
      (p) =>
        p.doctorId === doctorId &&
        p.consultationStatus === 'in_progress'
    );
  };

  const getWaitingPatients = (doctorId: number) => {
    return patients.filter(
      (p) =>
        p.doctorId === doctorId &&
        p.status === 'Pending' &&
        !p.consultationStatus
    );
  };

  const getVerifyingPatient = (doctorId: number) => {
    return patients.find(
      (p) =>
        p.doctorId === doctorId &&
        p.consultationStatus === 'verifying_end'
    );
  };

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDetailsModalOpen(true);
  };

  const handleEndConsultation = (patientId: number) => {
    endConsultation(patientId);
  };

  const handleVerifyEnd = (patientId: number) => {
    verifyEndConsultation(patientId);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Doctor Consultation Queue
      </h2>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doctor) => {
          const doctorPatients = getDoctorPatients(doctor.id);
          const currentPatient = getCurrentPatient(doctor.id);
          const waitingCount = getWaitingPatients(doctor.id).length;
          const verifyingPatient = getVerifyingPatient(doctor.id);

          return (
            <div
              key={doctor.id}
              onClick={() => handleDoctorClick(doctor)}
              className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg dark:hover:bg-gray-800 transition cursor-pointer hover:border-teal-600 dark:hover:border-teal-400"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {doctor.specialization}
                  </p>
                </div>
                <StatusBadge status={doctor.status} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-gray-700 p-2 rounded">
                  <Clock size={16} />
                  <span>Current: {currentPatient ? currentPatient.name : 'None'}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-gray-700 p-2 rounded">
                  <Users size={16} />
                  <span>Waiting: {waitingCount}</span>
                </div>

                {verifyingPatient && (
                  <div className="text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-gray-700 p-2 rounded font-medium">
                    ⏳ Pending verification: {verifyingPatient.name}
                  </div>
                )}
              </div>

              <button className="mt-4 w-full px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded transition flex items-center justify-center gap-2">
                View Queue
                <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Doctor Details Modal */}
      {detailsModalOpen && selectedDoctor && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`${selectedDoctor.name} - Queue Management`}
        >
          <div className="space-y-6">
            {/* Doctor Info */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Specialization</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {selectedDoctor.specialization}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-semibold">
                    <StatusBadge status={selectedDoctor.status} />
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Case Time</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {selectedDoctor.caseTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Patient Under Consultation */}
            {(() => {
              const current = getCurrentPatient(selectedDoctor.id);
              return current ? (
                <div className="bg-green-50 dark:bg-gray-800 border-2 border-green-300 dark:border-green-600 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                    🟢 Currently Consulting
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600 dark:text-gray-400">Patient:</span>{' '}
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {current.name}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600 dark:text-gray-400">Token:</span>{' '}
                      <span className="font-bold text-lg text-green-600 dark:text-green-400">
                        #{current.token}
                      </span>
                    </p>
                    <button
                      onClick={() => handleEndConsultation(current.id)}
                      className="w-full mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition text-sm font-medium"
                    >
                      End Consultation
                    </button>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Pending Verification */}
            {(() => {
              const verifying = getVerifyingPatient(selectedDoctor.id);
              return verifying ? (
                <div className="bg-yellow-50 dark:bg-gray-800 border-2 border-yellow-300 dark:border-yellow-600 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3">
                    ⏳ Pending Verification
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600 dark:text-gray-400">Patient:</span>{' '}
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {verifying.name}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600 dark:text-gray-400">Token:</span>{' '}
                      <span className="font-bold text-lg text-yellow-600 dark:text-yellow-400">
                        #{verifying.token}
                      </span>
                    </p>
                    <button
                      onClick={() => handleVerifyEnd(verifying.id)}
                      className="w-full mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition text-sm font-medium"
                    >
                      Verify & Complete
                    </button>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Waiting Queue */}
            {(() => {
              const waiting = getWaitingPatients(selectedDoctor.id);
              return waiting.length > 0 ? (
                <div className="bg-blue-50 dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-600 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                    👥 Waiting Queue ({waiting.length})
                  </h4>
                  <div className="space-y-2">
                    {waiting.map((patient, idx) => (
                      <div
                        key={patient.id}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border border-blue-200 dark:border-gray-600"
                      >
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-100">
                            {patient.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Age: {patient.age} | Blood: {patient.bloodGroup}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Token</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* No Patients */}
            {!getCurrentPatient(selectedDoctor.id) &&
              !getVerifyingPatient(selectedDoctor.id) &&
              getWaitingPatients(selectedDoctor.id).length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No patients assigned to this doctor</p>
                </div>
              )}
          </div>
        </Modal>
      )}
    </div>
  );
}
