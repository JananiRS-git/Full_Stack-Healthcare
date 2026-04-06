"use client";

import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/date';
import Modal from '../../components/Modal';
import FormInput from '../../components/FormInput';
import { Doctor } from '../../data/doctors';
import Link from 'next/link';
import { Edit2, Trash2, Plus } from 'lucide-react';

export default function DoctorsPage() {
  const { doctors, updateDoctor } = useData();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editedDoctor, setEditedDoctor] = useState<Doctor | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleEdit = (doc: Doctor) => {
    setEditedDoctor({ ...doc });
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editedDoctor) {
      updateDoctor(editedDoctor);
      setEditModalOpen(false);
      setEditedDoctor(null);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const columns = [
    { header: 'Name', accessor: 'name' as const },
    { header: 'Specialization', accessor: 'specialization' as const },
    {
      header: 'Status',
      accessor: 'status' as const,
      render: (d: Doctor) => <StatusBadge status={d.status} />,
    },
    { header: 'Case Time', accessor: 'caseTime' as const },
    {
      header: 'Last Modified',
      accessor: 'updatedAt' as const,
      render: (d: Doctor) => formatDate(d.updatedAt)
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      render: (d: Doctor) => (
        <div className="flex gap-2">
          <button
            className="p-1 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900 rounded"
            onClick={() => handleEdit(d)}
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
            onClick={() => handleDeleteClick(d.id)}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Doctor List</h2>
        <Link href="/doctors/add" className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
          <Plus size={18} /> Add Doctor
        </Link>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
          <DataTable columns={columns} data={doctors} emptyMessage="No doctors added yet." />
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        title="Edit Doctor"
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditedDoctor(null);
        }}
      >
        {editedDoctor && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
            }}
            className="space-y-4"
          >
            <FormInput
              label="Doctor Name"
              value={editedDoctor.name}
              onChange={(e) => setEditedDoctor({ ...editedDoctor, name: e.target.value })}
              required
            />
            <FormInput
              label="Specialization"
              value={editedDoctor.specialization}
              onChange={(e) => setEditedDoctor({ ...editedDoctor, specialization: e.target.value })}
              required
            />
            <FormInput
              label="Case Time"
              value={editedDoctor.caseTime}
              onChange={(e) => setEditedDoctor({ ...editedDoctor, caseTime: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Status</label>
              <select
                value={editedDoctor.status}
                onChange={(e) => setEditedDoctor({ ...editedDoctor, status: e.target.value as 'Free' | 'Busy' })}
                className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="Free">Free</option>
                <option value="Busy">Busy</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Save
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-400"
                onClick={() => {
                  setEditModalOpen(false);
                  setEditedDoctor(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <p className="text-gray-700 dark:text-gray-200 mb-4">Are you sure you want to delete this doctor?</p>
        <div className="flex gap-2">
          <button
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => {
              // Delete logic would go here (for now just close)
              setDeleteModalOpen(false);
            }}
          >
            Delete
          </button>
          <button
            className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-400"
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
