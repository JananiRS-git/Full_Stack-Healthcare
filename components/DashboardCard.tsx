import React from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex items-center space-x-4"
    >
      {icon && <div className="text-teal-600">{icon}</div>}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
