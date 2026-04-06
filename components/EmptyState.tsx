import React from 'react';

const EmptyState: React.FC<{ message?: string }> = ({ message = 'Nothing to display.' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg
        className="w-16 h-16 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m18 0v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6m-6-2v2m0 0v2m0-2h2m-2 0h-2"
        />
      </svg>
      <p className="text-gray-500 mt-4">{message}</p>
    </div>
  );
};

export default EmptyState;
