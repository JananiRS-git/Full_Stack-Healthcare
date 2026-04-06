import React, { ReactNode } from 'react';

interface ModalProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 max-h-[90vh] flex flex-col">
        {title && <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>}
        <div className="overflow-y-auto flex-1">{children}</div>
        <button
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
