"use client";

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BloodRequest } from '../../data/bloodRequests';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import FormInput from '../../components/FormInput';
import { Plus, Filter } from 'lucide-react';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function BloodDonationPage() {
  const { bloodRequests, addBloodRequest, toggleBloodStatus } = useData();
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [requester, setRequester] = useState('');
  const [group, setGroup] = useState('A+');
  const [status, setStatus] = useState<'Urgent' | 'Normal'>('Normal');

  const filtered = selectedGroup === '' ? bloodRequests : bloodRequests.filter((r) => r.group === selectedGroup);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBloodRequest({ id: Date.now(), requester, group, status });
    setRequester('');
    setGroup('A+');
    setStatus('Normal');
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Blood Donation Requests
        </h2>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> New Request
        </button>
      </div>

      {/* Filter by Blood Group */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-gray-600 dark:text-gray-300" />
          <span className="font-medium text-gray-800 dark:text-gray-100">Filter by Blood Group:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGroup('')}
            className={`px-3 py-1 rounded text-sm transition ${
              selectedGroup === '' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
            }`}
          >
            All
          </button>
          {bloodGroups.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={`px-3 py-1 rounded text-sm transition ${
                selectedGroup === bg ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Blood Requests Table */}
      <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-red-50 dark:bg-red-900">
              <th className="p-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-100">Requester</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-100">Blood Group</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-100">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No requests found
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3 text-gray-800 dark:text-gray-100">{r.requester}</td>
                  <td className="p-3 font-semibold text-gray-800 dark:text-gray-100">{r.group}</td>
                  <td
                    className="p-3 cursor-pointer"
                    onClick={() => toggleBloodStatus(r.id)}
                    title="Click to toggle urgency"
                  >
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Request Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Blood Request">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Requester (Ward/Department)"
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
            placeholder="e.g., Ward A, ICU"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Blood Group</label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Urgency</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'Urgent' | 'Normal')}
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="Urgent">Urgent</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Submit Request
            </button>
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-400"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
