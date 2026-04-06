import React from 'react';
import Modal from './Modal';
import { formatDate } from '../utils/date';
import { LoginRecord } from '../data/users';

interface LoginHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginHistory: LoginRecord[];
}

const LoginHistoryModal: React.FC<LoginHistoryModalProps> = ({ isOpen, onClose, loginHistory }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login History">
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Total Logins:</span> {loginHistory.length}
          </p>
        </div>
        {loginHistory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No login records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b-2 border-gray-200 dark:border-gray-600">
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Login Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loginHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{record.userName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{record.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          record.role === 'Doctor'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {record.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(record.loginTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LoginHistoryModal;
