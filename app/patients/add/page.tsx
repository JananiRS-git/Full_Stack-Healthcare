"use client";

import React, { useState } from 'react';
import FormInput from '../../../components/FormInput';
import { useData } from '../../../context/DataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddPatientPage() {
  const { addPatient, doctors } = useData();
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(0);
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [weight, setWeight] = useState<number>(0);
  const [bloodPressure, setBloodPressure] = useState('');
  const [status, setStatus] = useState<'Pending' | 'Completed'>('Pending');
  const [doctorId, setDoctorId] = useState<number | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPatient({
      id: Date.now(),
      name,
      age,
      bloodGroup,
      weight,
      bloodPressure,
      status,
      doctorId,
    });
    router.push('/patients');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Add New Patient</h1>
          <p className="text-gray-600 dark:text-gray-400">Register a new patient to the hospital system</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 flex items-center justify-center mr-3">1</span>
                Personal Information
              </h3>
              <div className="space-y-4">
                <FormInput 
                  label="Patient Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="Enter full name"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    required
                    placeholder="Enter age"
                  />
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 dark:bg-gray-700 dark:text-gray-100 transition"
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
              </div>
            </div>

            {/* Medical Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 flex items-center justify-center mr-3">2</span>
                Medical Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Weight (kg)"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  required
                  placeholder="Enter weight"
                />
                <FormInput
                  label="Blood Pressure"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  placeholder="e.g. 120/80"
                  required
                />
              </div>
            </div>

            {/* Assignment Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 flex items-center justify-center mr-3">3</span>
                Assignment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Pending' | 'Completed')}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 dark:bg-gray-700 dark:text-gray-100 transition"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Assign Doctor</label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(Number(e.target.value) || undefined)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 dark:bg-gray-700 dark:text-gray-100 transition"
                  >
                    <option value="">None</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
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
                Save Patient
              </button>
              <button
                type="button"
                onClick={() => router.push('/patients')}
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