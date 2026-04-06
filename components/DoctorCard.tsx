import React from 'react';
import StatusBadge from './StatusBadge';

interface Doctor {
  name: string;
  specialization: string;
  status: string;
  caseTime: string;
}

const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{doctor.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{doctor.specialization}</p>
        </div>
        <StatusBadge status={doctor.status} />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Case time: {doctor.caseTime}</p>
    </div>
  );
};

export default DoctorCard;
