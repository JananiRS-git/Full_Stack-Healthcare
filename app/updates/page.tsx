"use client";

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Update } from '../../data/updates';
import Modal from '../../components/Modal';
import FormInput from '../../components/FormInput';
import { formatDate } from '../../utils/date';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function UpdatesPage() {
  const { updates, addUpdate, updateUpdate, deleteUpdate } = useData();
  const { userId, userName } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [newUpdate, setNewUpdate] = useState({ title: '', details: '' });

  const handleAddUpdate = () => {
    if (newUpdate.title && newUpdate.details) {
      addUpdate({
        id: Date.now(),
        title: newUpdate.title,
        details: newUpdate.details,
        date: new Date().toLocaleDateString(),
        userId: userId || 1,
        userName: userName || 'Anonymous',
        timestamp: new Date().toISOString(),
      });
      setNewUpdate({ title: '', details: '' });
      setShowAddModal(false);
    }
  };

  const handleEditUpdate = () => {
    if (editingUpdate) {
      updateUpdate(editingUpdate);
      setEditingUpdate(null);
      setShowEditModal(false);
    }
  };

  const handleDeleteUpdate = (id: number) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      deleteUpdate(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Updates & Announcements</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={18} />
          New Announcement
        </button>
      </div>

      {updates.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No announcements yet.
        </div>
      ) : (
        <div className="space-y-3">
          {updates.map((u) => (
            <div key={u.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700" suppressHydrationWarning>
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{u.title}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>Posted by: <span className="font-medium">{u.userName}</span></span>
                    <span>on {formatDate(u.timestamp)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingUpdate(u);
                      setShowEditModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteUpdate(u.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-gray-700 dark:text-gray-200">{u.details}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Announcement Modal */}
      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Announcement">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddUpdate();
            }}
            className="space-y-4"
          >
            <FormInput
              label="Title"
              value={newUpdate.title}
              onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
              required
              placeholder="Announcement title"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Details</label>
              <textarea
                value={newUpdate.details}
                onChange={(e) => setNewUpdate({ ...newUpdate, details: e.target.value })}
                className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                rows={4}
                required
                placeholder="Announcement details"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Post
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-400"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Announcement Modal */}
      {showEditModal && editingUpdate && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Announcement">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditUpdate();
            }}
            className="space-y-4"
          >
            <FormInput
              label="Title"
              value={editingUpdate.title}
              onChange={(e) => setEditingUpdate({ ...editingUpdate, title: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Details</label>
              <textarea
                value={editingUpdate.details}
                onChange={(e) => setEditingUpdate({ ...editingUpdate, details: e.target.value })}
                className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                rows={4}
                required
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-400"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
