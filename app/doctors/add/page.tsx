"use client";

import React, { useState } from 'react';
import FormInput from '../../../components/FormInput';
import { useData } from '../../../context/DataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddDoctorPage() {
  const { addDoctor } = useData();
  const router = useRouter();
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [caseTime, setCaseTime] = useState('30m');
  const [status, setStatus] = useState<'Free' | 'Busy'>('Free');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDoctor({
      id: Date.now(),
      name,
      specialization,
      caseTime,
      status,
    });
    router.push('/doctors');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Add New Doctor</h1>
          <p className="text-gray-600 dark:text-gray-400">Register a new doctor to the hospital system</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 flex items-center justify-center mr-3">1</span>
                Basic Information
              </h3>
              <div className="space-y-4">
                <FormInput 
                  label="Doctor Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="Enter full name"
                />
                <FormInput
                  label="Specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                  placeholder="e.g., Cardiology, Neurology"
                />
              </div>
            </div>

            {/* Additional Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 flex items-center justify-center mr-3">2</span>
                Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Case Time"
                  value={caseTime}
                  onChange={(e) => setCaseTime(e.target.value)}
                  placeholder="e.g., 30m, 45m"
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Free' | 'Busy')}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 dark:bg-gray-700 dark:text-gray-100 transition"
                  >
                    <option value="Free">Free</option>
                    <option value="Busy">Busy</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                className="flex-1 py-3 px-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-teal-700 transition shadow-md hover:shadow-lg"
              >
                Save Doctor
              </button>
              <button
                type="button"
                onClick={() => router.push('/doctors')}
                className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
