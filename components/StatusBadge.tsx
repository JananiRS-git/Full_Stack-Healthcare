import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const colors: Record<string, string> = {
  Free: 'bg-green-100 text-green-800',
  Busy: 'bg-red-100 text-red-800',
  Urgent: 'bg-red-600 text-white',
  Normal: 'bg-yellow-500 text-white',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const className = colors[status] || 'bg-gray-200 text-gray-800';
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>{status}</span>;
};

export default StatusBadge;
