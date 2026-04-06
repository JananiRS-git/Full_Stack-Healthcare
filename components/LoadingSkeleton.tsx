import React from 'react';

const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`} />;
};

export default LoadingSkeleton;
