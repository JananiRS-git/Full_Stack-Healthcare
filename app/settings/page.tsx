"use client";

import React, { useState } from 'react';
import { Settings, Bell, Lock, Globe, Database, Eye, Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsPage() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [activityLog, setActivityLog] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const handleThemeChange = (value: boolean) => {
    if (value !== darkMode) {
      toggleDarkMode();
    }
  };

  const SettingRow: React.FC<{ icon: React.ReactNode; title: string; description?: string; children: React.ReactNode }> = ({
    icon,
    title,
    description,
    children,
  }) => (
    <div className="flex items-start justify-between p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
      <div className="flex items-start gap-3">
        <div className="mt-1 text-teal-600">{icon}</div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{title}</p>
          {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (val: boolean) => void }> = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      type="button"
      className={`relative w-12 h-6 rounded-full transition ${
        enabled ? 'bg-teal-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
      aria-pressed={enabled}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition transform ${
          enabled ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings size={28} />
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your preferences and account settings</p>
      </div>

      {/* Display Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Display</h2>
        </div>

        <SettingRow
          icon={<Eye size={20} />}
          title="Theme"
          description="Choose between light and dark theme"
        >
          <ToggleSwitch enabled={darkMode} onChange={handleThemeChange} />
        </SettingRow>

        <SettingRow
          icon={<Globe size={20} />}
          title="Language"
          description="Select your preferred language"
        >
          <select className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
          </select>
        </SettingRow>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell size={18} />
            Notifications
          </h2>
        </div>

        <SettingRow
          icon={<Bell size={20} />}
          title="Push Notifications"
          description="Receive alerts for important updates"
        >
          <ToggleSwitch enabled={notificationsEnabled} onChange={setNotificationsEnabled} />
        </SettingRow>

        <SettingRow
          icon={<Mail size={20} />}
          title="Email Notifications"
          description="Get notified via email about activities"
        >
          <ToggleSwitch enabled={emailNotifications} onChange={setEmailNotifications} />
        </SettingRow>

        <SettingRow
          icon={<Database size={20} />}
          title="Activity Log"
          description="Track all your account activities"
        >
          <ToggleSwitch enabled={activityLog} onChange={setActivityLog} />
        </SettingRow>
      </div>

      {/* Security & Privacy */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock size={18} />
            Security & Privacy
          </h2>
        </div>

        <SettingRow
          icon={<Lock size={20} />}
          title="Change Password"
          description="Update your account password regularly"
        >
          <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition text-sm">
            Change
          </button>
        </SettingRow>

        <SettingRow
          icon={<Database size={20} />}
          title="Data Sharing"
          description="Allow anonymous data for system improvement"
        >
          <ToggleSwitch enabled={dataSharing} onChange={setDataSharing} />
        </SettingRow>

        <SettingRow
          icon={<Globe size={20} />}
          title="Session Timeout"
          description="Automatically logout after inactivity"
        >
          <select className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
            <option>15 minutes</option>
            <option>30 minutes</option>
            <option>1 hour</option>
            <option>Never</option>
          </select>
        </SettingRow>
      </div>

      {/* Help & Support */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Help & Support</h2>
        </div>

        <SettingRow
          icon={<Globe size={20} />}
          title="Documentation"
          description="View user guide and tutorials"
        >
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
            Visit
          </button>
        </SettingRow>

        <SettingRow
          icon={<Mail size={20} />}
          title="Contact Support"
          description="Get help from our support team"
        >
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
            Email
          </button>
        </SettingRow>

        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
          <p>Version 1.0.0 • © {new Date().getFullYear()} Smart Hospital Management System</p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="font-semibold text-red-900 dark:text-red-200 mb-2">Danger Zone</p>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm">
          Clear All Data
        </button>
      </div>
    </div>
  );
}
