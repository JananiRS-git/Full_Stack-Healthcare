"use client";

import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';

interface DoctorSchedule {
  [key: number]: { [slot: string]: boolean };
}

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

export default function DoctorFreeTimePage() {
  const { doctors } = useData();
  const [schedule, setSchedule] = useState<DoctorSchedule>({});

  useEffect(() => {
    // Load saved schedules from localStorage
    const loadedSchedule: DoctorSchedule = {};
    doctors.forEach((doc) => {
      const saved = localStorage.getItem(`doctor_schedule_${doc.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        loadedSchedule[doc.id] = TIME_SLOTS.reduce((acc, slot) => {
          acc[slot] = parsed.availableSlots.includes(slot);
          return acc;
        }, {} as { [slot: string]: boolean });
      } else {
        // Default to all available if doctor is free
        loadedSchedule[doc.id] = TIME_SLOTS.reduce((acc, slot) => {
          acc[slot] = doc.status === 'Free';
          return acc;
        }, {} as { [slot: string]: boolean });
      }
    });
    setSchedule(loadedSchedule);
  }, [doctors]);

  const toggleSlot = (doctorId: number, slot: string) => {
    setSchedule((prev) => ({
      ...prev,
      [doctorId]: {
        ...prev[doctorId],
        [slot]: !prev[doctorId][slot],
      },
    }));
  };

  const getAvailableCount = (doctorId: number) => {
    return Object.values(schedule[doctorId] || {}).filter(Boolean).length;
  };

  const handleSaveSchedule = (doctorId: number) => {
    const availableSlots = Object.entries(schedule[doctorId] || {})
      .filter(([_, isAvailable]) => isAvailable)
      .map(([slot, _]) => slot);
    
    localStorage.setItem(
      `doctor_schedule_${doctorId}`,
      JSON.stringify({
        doctorId,
        availableSlots,
        updatedAt: new Date().toISOString(),
      })
    );
    
    alert(`✓ Schedule saved for doctor ID ${doctorId}. Available slots: ${availableSlots.join(', ') || 'None'}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Doctor Scheduling</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage doctor availability and free time slots</p>
      </div>

      {/* Doctors Schedule */}
      <div className="grid gap-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
            {/* Doctor Info Header */}
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900 dark:to-teal-800 p-6 border-b border-teal-200 dark:border-teal-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{doctor.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{doctor.specialization}</p>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={doctor.status} />
                    <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
                      {getAvailableCount(doctor.id)} slots available
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Case Time</p>
                  <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{doctor.caseTime}</p>
                </div>
              </div>
            </div>

            {/* Time Slots Grid */}
            <div className="p-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Available Time Slots - Click to toggle</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isAvailable = schedule[doctor.id]?.[slot] ?? false;
                  return (
                    <button
                      key={slot}
                      onClick={() => toggleSlot(doctor.id, slot)}
                      className={`p-3 rounded-lg font-semibold text-sm transition duration-200 flex items-center justify-center min-h-16 ${
                        isAvailable
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 border-2 border-green-400 dark:border-green-600 hover:bg-green-200 dark:hover:bg-green-800'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className="text-center">
                        <div className="text-xs opacity-75">Click</div>
                        <div>{slot}</div>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Availability: <span className="font-semibold text-teal-600 dark:text-teal-400">{getAvailableCount(doctor.id)}/{TIME_SLOTS.length}</span>
              </p>
              <button
                onClick={() => handleSaveSchedule(doctor.id)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
