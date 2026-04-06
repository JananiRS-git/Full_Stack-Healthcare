import React from 'react';
import { motion } from 'framer-motion';

interface Notification {
  id: number;
  message: string;
  time: string;
}

const NotificationPanel: React.FC<{ notifications: Notification[] }> = ({ notifications }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Notifications</h3>
      <motion.ul className="space-y-2" initial="hidden" animate="visible" variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } }
      }}>
        {notifications.map((n) => (
          <motion.li
            key={n.id}
            variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
            className="text-sm text-gray-700 dark:text-gray-200"
          >
            <span className="font-medium">{n.time}</span>: {n.message}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default NotificationPanel;
