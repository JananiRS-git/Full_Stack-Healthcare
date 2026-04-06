"use client";

import { Bell, Sun, Moon, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'next/navigation';

const UserMenu: React.FC = () => {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  
  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">
        <User size={16} className="text-gray-600 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{role}</span>
      </div>
      <button 
        onClick={handleLogout} 
        className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
        title="Logout"
      >
        <LogOut size={16} />
        <span className="hidden sm:inline text-sm">Logout</span>
      </button>
    </div>
  );
};

interface NavbarProps {
  onHamburger?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onHamburger }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { role } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-3 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {role !== 'Patient' && (
          <button 
            className="md:hidden p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
            onClick={onHamburger}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700 dark:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
        <h1 className="text-lg font-bold text-teal-600 dark:text-teal-400">Smart Hospital</h1>
      </div>
      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleDarkMode} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          title="Toggle theme"
        >
          {darkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-gray-600" />}
        </button>
        <button 
          className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          title="Notifications"
        >
          <Bell size={18} className="text-gray-700 dark:text-gray-200" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <UserMenu />
      </div>
    </header>
  );
};

export default Navbar;
