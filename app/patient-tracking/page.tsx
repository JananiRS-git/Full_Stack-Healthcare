"use client";

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';
import { calculateWaitTime } from '../../utils/date';
import { Phone, Clock, User, Heart, Users, Ticket, AlertCircle } from 'lucide-react';

export default function PatientTrackingPage() {
  const { patients, doctors } = useData();
  const [phoneInput, setPhoneInput] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [viewMode, setViewMode] = useState<'search' | 'queue'>('search');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    
    if (!phoneInput.trim()) {
      setPhoneError('Please enter your 10-digit phone number');
      return;
    }

    const cleanPhone = phoneInput.replace(/\D/g, '');
    
    if (cleanPhone.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits');
      return;
    }

    setSearchAttempted(true);
  };

  // Helper function to calculate token number for a specific patient based on doctor's queue
  const getPatientToken = (patient: typeof patients[0]) => {
    if (!patient.doctorId) return null;
    
    // Count all patients assigned to this doctor who are either Pending or in consultation
    const doctorQueue = patients
      .filter((p) => 
        p.doctorId === patient.doctorId && 
        (p.status === 'Pending' || p.consultationStatus === 'in_progress' || p.consultationStatus === 'verifying_end')
      )
      .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    
    const tokenPos = doctorQueue.findIndex((p) => p.id === patient.id);
    return tokenPos >= 0 ? tokenPos + 1 : null;
  };

  // Get pending patients grouped by doctor with proper tokens
  const patientsWithTokens = patients
    .filter((p) => (p.status === 'Pending' || p.consultationStatus === 'in_progress') && p.doctorId)
    .map((p) => ({ ...p, token: getPatientToken(p) }))
    .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());

  const cleanPhone = phoneInput.replace(/\D/g, '');
  const patientRecord = phoneInput && cleanPhone.length === 10 
    ? patients.find((p) => p.phone?.replace(/\D/g, '') === cleanPhone)
    : null;

  const doctor = patientRecord && patientRecord.doctorId
    ? doctors.find((d) => d.id === patientRecord.doctorId)
    : null;

  // For the current patient viewing their status - calculate their token
  const patientToken = patientRecord ? getPatientToken(patientRecord) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="inline-block p-3 bg-teal-100 dark:bg-teal-900/30 rounded-full mb-4">
              <Heart className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Patient Tracking</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your consultation status or view the queue</p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-3 justify-center mb-6">
            <button
              onClick={() => {
                setViewMode('search');
                setSearchAttempted(false);
              }}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition ${
                viewMode === 'search'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-teal-500'
              }`}
            >
              <Phone className="w-4 h-4" />
              My Status
            </button>
            <button
              onClick={() => setViewMode('queue')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition ${
                viewMode === 'queue'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-teal-500'
              }`}
            >
              <Users className="w-4 h-4" />
              Queue
            </button>
          </div>
        </div>

        {/* SEARCH MODE */}
        {viewMode === 'search' && (
        <>
        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                Enter Your 10-Digit Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value);
                    setPhoneError('');
                  }}
                  placeholder="9876543210"
                  maxLength={10}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 dark:bg-gray-700 dark:text-white text-lg"
                />
              </div>
              {phoneError && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-medium">{phoneError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 text-lg"
            >
              Check Status
            </button>
          </form>
        </div>

        {/* Results */}
        {searchAttempted && (
          <>
            {!patientRecord ? (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">❌</div>
                <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">No Patient Found</h3>
                <p className="text-red-700 dark:text-red-400">
                  The phone number <span className="font-mono font-bold">{cleanPhone}</span> is not registered in our system.
                </p>
                <p className="text-red-600 dark:text-red-500 text-sm mt-3">
                  Please verify the number or contact the reception desk.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Patient Information */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-teal-600" />
                    Your Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Name</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{patientRecord.name}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Age</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{patientRecord.age} years</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Blood Group</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{patientRecord.bloodGroup}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Status</p>
                      <div className="mt-1">
                        <StatusBadge status={patientRecord.status} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor Status */}
                {doctor ? (
                  <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-teal-200 dark:border-teal-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Doctor Status</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Doctor Name</p>
                        <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{doctor.name}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                          <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Specialization</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{doctor.specialization}</p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                          <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Doctor Status</p>
                          <StatusBadge status={doctor.status} />
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                          <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Case Time</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{doctor.caseTime} per patient</p>
                        </div>
                        
                        {patientToken && (
                          <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Your Token</p>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">#{patientToken}</p>
                          </div>
                        )}
                      </div>

                      {patientRecord.consultationStatus === 'in_progress' && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center gap-4 border-2 border-purple-300 dark:border-purple-700">
                          <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
                          <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Consultation Time</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {calculateWaitTime(patientRecord.consultationStartedAt)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Message */}
                    <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl">
                      {patientRecord.status === 'Completed' && (
                        <div className="flex gap-3">
                          <span className="text-3xl">✅</span>
                          <div>
                            <p className="font-bold text-green-700 dark:text-green-400">Consultation Completed</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Your consultation with {doctor.name} has been completed.</p>
                          </div>
                        </div>
                      )}
                      
                      {patientRecord.status === 'Pending' && !patientRecord.doctorId && (
                        <div className="flex gap-3">
                          <span className="text-3xl">⏳</span>
                          <div>
                            <p className="font-bold text-yellow-700 dark:text-yellow-400">Awaiting Doctor Assignment</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">A doctor will be assigned shortly. Please wait.</p>
                          </div>
                        </div>
                      )}
                      
                      {patientRecord.status === 'Pending' && patientRecord.doctorId && !patientRecord.consultationStatus && (
                        <div className="flex gap-3">
                          <span className="text-3xl">👨‍⚕️</span>
                          <div>
                            <p className="font-bold text-blue-700 dark:text-blue-400">Assigned to {doctor.name}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {doctor.status === 'Free' 
                                ? 'Doctor is available. Consultation can start soon.' 
                                : 'Doctor is currently consulting with another patient. Your turn will come shortly.'}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {patientRecord.consultationStatus === 'in_progress' && (
                        <div className="flex gap-3">
                          <span className="text-3xl">🩺</span>
                          <div>
                            <p className="font-bold text-purple-700 dark:text-purple-400">Consultation In Progress</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">You are currently consulting with {doctor.name}.</p>
                          </div>
                        </div>
                      )}
                      
                      {patientRecord.consultationStatus === 'verifying_end' && (
                        <div className="flex gap-3">
                          <span className="text-3xl">⏹️</span>
                          <div>
                            <p className="font-bold text-orange-700 dark:text-orange-400">Consultation Ending</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Your consultation is being completed. Thank you for visiting.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 mb-2">⏳ Awaiting Doctor Assignment</h3>
                    <p className="text-yellow-700 dark:text-yellow-400">
                      You are registered but a doctor has not been assigned yet. Please check back soon or contact the reception desk.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        </>
        )}

        {/* QUEUE MODE */}
        {viewMode === 'queue' && (
          <div className="space-y-6">
            {/* Queue grouped by Doctor */}
            {doctors.map((doc) => {
              const doctorPatients = patientsWithTokens
                .filter((p) => p.doctorId === doc.id)
                .sort((a, b) => (a.token ?? 0) - (b.token ?? 0));

              if (doctorPatients.length === 0) return null;

              return (
                <div key={doc.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
                      👨‍⚕️
                    </div>
                    {doc.name}'s Queue ({doctorPatients.length} patient{doctorPatients.length !== 1 ? 's' : ''})
                  </h3>
                  
                  <div className="space-y-3">
                    {doctorPatients.map((patient) => {
                      const isTokenTwo = patient.token === 2;
                      const arrivalTime = new Date(patient.createdAt || '').toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
                      
                      return (
                        <div
                          key={patient.id}
                          className={`p-4 rounded-lg border-2 transition ${
                            isTokenTwo
                              ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-300 dark:border-yellow-700 shadow-md'
                              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg ${
                              isTokenTwo
                                ? 'bg-gradient-to-br from-yellow-400 to-amber-400 text-white shadow-lg'
                                : 'bg-teal-600 text-white'
                            }`}>
                              #{patient.token}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Name</p>
                                  <p className="font-bold text-gray-900 dark:text-white truncate">{patient.name}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Age</p>
                                  <p className="font-bold text-gray-900 dark:text-white">{patient.age}y</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Blood Group</p>
                                  <p className="font-bold text-gray-900 dark:text-white">{patient.bloodGroup}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Arrival</p>
                                  <p className="font-bold text-gray-900 dark:text-white text-sm">{arrivalTime}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }).filter(Boolean)}

            {patientsWithTokens.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">No patients in queue at the moment</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Need help? Contact the reception desk or call the hospital</p>
        </div>
      </div>
    </div>
  );
}
