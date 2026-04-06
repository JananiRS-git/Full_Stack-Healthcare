"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useRouter } from 'next/navigation';
import { LogOut, Clock, User, Calendar, AlertCircle, X } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/date';

export default function PatientDashboard() {
  const { user, userName, logout, role } = useAuth();
  const { patients, doctors, assignPatientToDoctor } = useData();
  const router = useRouter();
  const [bookingMessage, setBookingMessage] = React.useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  // Redirect if not logged in as patient
  useEffect(() => {
    if (role !== 'Patient') {
      router.push('/');
    }
  }, [role, router]);

  if (role !== 'Patient') {
    return null;
  }

  // Find current patient's data by userName (email/name from login)
  const currentPatient = patients.find((p) => p.name.toLowerCase() === (userName?.toLowerCase() || ''));

  // Get current patient's doctor if assigned
  const assignedDoctor = currentPatient?.doctorId 
    ? doctors.find((d) => d.id === currentPatient.doctorId)
    : null;

  // Get all doctors for booking
  const allDoctors = doctors;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor || !bookingDate || !bookingTime) {
      alert('Please select doctor, date, and time');
      return;
    }

    // Check doctor's availability
    const doctorSchedule = localStorage.getItem(`doctor_schedule_${selectedDoctor}`);
    if (doctorSchedule) {
      const parsed = JSON.parse(doctorSchedule);
      if (!parsed.availableSlots.includes(bookingTime)) {
        alert('This time slot is not available for the selected doctor. Please choose a different time.');
        return;
      }
    } else {
      // If no schedule saved, assume doctor is free only if status is Free
      const doctor = doctors.find(d => d.id === selectedDoctor);
      if (!doctor || doctor.status !== 'Free') {
        alert('Doctor is not available. Please choose a different doctor.');
        return;
      }
    }

    // Check for conflicts - only check active bookings (not completed)
    const conflict = patients.some((p) => 
      p.doctorId === selectedDoctor && 
      p.id !== currentPatient?.id &&
      p.bookingDate === bookingDate &&
      p.bookingTime === bookingTime &&
      (p.status === 'Pending' || p.consultationStatus === 'in_progress')
    );

    if (conflict) {
      alert('This time slot is already booked. Please choose a different time.');
      return;
    }

    if (currentPatient) {
      assignPatientToDoctor(currentPatient.id, selectedDoctor, bookingDate, bookingTime);
      setBookingMessage('✓ Appointment booked successfully!');
      setShowBookingModal(false);
      setSelectedDoctor(null);
      setBookingDate('');
      setBookingTime('');
      setTimeout(() => {
        setBookingMessage('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Portal</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome, {userName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-semibold"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {bookingMessage && (
        <div className="bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 sticky top-0 z-50">
          {bookingMessage}
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {currentPatient ? (
          <>
            {/* Your Appointment Card */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Appointment Status</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Name</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{currentPatient.name}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Age</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{currentPatient.age} years</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Blood Group</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{currentPatient.bloodGroup}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Status</p>
                    <StatusBadge status={currentPatient.status} />
                  </div>
                </div>

                {assignedDoctor && (
                  <div className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
                    <h3 className="font-semibold text-teal-900 dark:text-teal-200 mb-3 flex items-center gap-2">
                      <User size={18} />
                      Your Assigned Doctor
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Doctor Name</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{assignedDoctor.name}</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Specialization</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{assignedDoctor.specialization}</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          assignedDoctor.status === 'Free'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
                        }`}>
                          {assignedDoctor.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Booking Details */}
                    {currentPatient?.bookingDate && currentPatient?.bookingTime && (
                      <div className="mt-4 pt-4 border-t border-teal-200 dark:border-teal-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Booking Date</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{currentPatient.bookingDate}</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Booking Time</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{currentPatient.bookingTime}</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Your Token</p>
                            <p className="font-semibold text-lg text-teal-600 dark:text-teal-400">#{currentPatient.token || '-'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Patient Queue List */}
                {assignedDoctor && (
                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">Waiting Queue for {assignedDoctor.name}</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {patients
                        .filter((p) => p.doctorId === assignedDoctor.id && (p.status === 'Pending' || p.consultationStatus === 'in_progress'))
                        .sort((a, b) => (a.token || 0) - (b.token || 0))
                        .map((p) => (
                          <div
                            key={p.id}
                            className={`p-3 rounded-lg flex justify-between items-center ${
                              p.id === currentPatient?.id
                                ? 'bg-white dark:bg-gray-800 border-2 border-teal-500 dark:border-teal-400'
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 dark:text-white">Token #{p.token != null ? p.token : '-'}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {p.name}{p.id === currentPatient?.id ? ' (You)' : ''}
                              </p>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              p.consultationStatus === 'in_progress'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200'
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-200'
                            }`}>
                              {p.consultationStatus === 'in_progress' ? 'In Progress' : 'Pending'}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {!assignedDoctor && (
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition"
                    >
                      Book an Appointment
                    </button>
                  </div>
                )}

                {assignedDoctor && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                    >
                      Change Appointment
                    </button>
                  </div>
                )}
              </div>
            </div>


          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-200 dark:border-gray-700">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No patient record found for {userName}.</p>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Book an Appointment</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Doctor Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Doctor *
                </label>
                <select
                  value={selectedDoctor || ''}
                  onChange={(e) => setSelectedDoctor(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="">Choose a doctor</option>
                  {allDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - {doc.specialization}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Date *
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Time Selection - 12 Hour Format */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Time *
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="">Choose a time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookAppointment}
                  className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
