"use client";

import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  // Special layout for patients - no sidebar, full width
  if (role === 'Patient') {
    return (
      <div className="w-screen h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <div className="flex h-full flex-col">
          <Navbar onHamburger={() => setSidebarOpen((o) => !o)} />
          <main className="flex-1 p-4 overflow-auto w-full">{children}</main>
        </div>
      </div>
    );
  }

  // Regular layout for staff and doctors with sidebar
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar collapsed={!sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onHamburger={() => setSidebarOpen((o) => !o)} />
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
