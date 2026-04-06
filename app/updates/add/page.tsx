"use client";

import React, { useState } from 'react';
import FormInput from '../../../components/FormInput';
import { useData } from '../../../context/DataContext';
import { useRouter } from 'next/navigation';

export default function AddUpdatePage() {
  const { addUpdate } = useData();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUpdate({
      id: Date.now(),
      title,
      details,
      date: new Date().toLocaleDateString(),
      userId: 1,
      userName: 'Admin',
      timestamp: new Date().toISOString(),
    });
    router.push('/updates');
  };

  return (
    <div className="max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">New Announcement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Details</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Post
        </button>
      </form>
    </div>
  );
}