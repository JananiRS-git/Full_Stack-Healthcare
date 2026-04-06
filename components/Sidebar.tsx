"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Calendar, Users, Heart, Bell, Settings, Clipboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <Home size={18} /> },
  { name: 'Doctors', href: '/doctors', icon: <User size={18} /> },
  { name: 'Doctor Free Time', href: '/doctor-free-time', icon: <Calendar size={18} /> },
  { name: 'Doctor Consultation', href: '/doctor-consultation', icon: <Clipboard size={18} /> },
  { name: 'Doctor-Patients', href: '/doctor-patients', icon: <Users size={18} /> },
  { name: 'Patients', href: '/patients', icon: <Heart size={18} /> },
  { name: 'Patient Tracking', href: '/patient-tracking', icon: <Heart size={18} /> },
  { name: 'Blood Donation', href: '/blood-donation', icon: <Heart size={18} /> },
  { name: 'Updates', href: '/updates', icon: <Bell size={18} /> },
  { name: 'Settings', href: '/settings', icon: <Settings size={18} /> },
];

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed: controlled }) => {
  const pathname = usePathname();
  const { role } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const isCollapsed = controlled !== undefined ? controlled : collapsed;

  // Patients don't see the sidebar
  if (role === 'Patient') {
    return null;
  }

  return (
    <aside className={`bg-white dark:bg-gray-800 border-r dark:border-gray-700 h-full transition-width duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    } fixed md:relative z-40 ${collapsed ? '-left-16' : 'left-0'} md:left-0`}>
      <div className="flex items-center justify-between p-4">
        <span className="text-xl font-semibold text-teal-600">SHMD</span>
        <button
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setCollapsed(!collapsed)}
        >
          {isCollapsed ? '›' : '<'}
        </button>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              pathname === item.href ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}>
            <span className="mr-3">{item.icon}</span>
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
