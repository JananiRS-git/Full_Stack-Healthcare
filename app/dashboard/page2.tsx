"use client";

import React from 'react';
import { useData } from '../../context/DataContext';
import DashboardCard from '../../components/DashboardCard';
import { Home, Users, UserCheck, UserX, Heart, Bell, Activity, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const { doctors, patients, bloodRequests, updates } = useData();

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Completed',
      value: patients.filter((p) => p.status === 'Completed').length,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Pending',
      value: patients.filter((p) => p.status === 'Pending').length,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Available Doctors',
      value: doctors.filter((d) => d.status === 'Free').length,
      icon: UserCheck,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    },
    {
      title: 'Busy Doctors',
      value: doctors.filter((d) => d.status === 'Busy').length,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Blood Requests',
      value: bloodRequests.length,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome to Smart Hospital Management System</p>
        </div>
        <div className="text-right text-sm text-gray-600 dark:text-gray-300">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
      >
        <motion.button
          variants={itemVariants}
          className="p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition shadow-sm"
        >
          + Add Patient
        </motion.button>
        <motion.button
          variants={itemVariants}
          className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition shadow-sm"
        >
          + Add Doctor
        </motion.button>
        <motion.button
          variants={itemVariants}
          className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition shadow-sm"
        >
          Blood Request
        </motion.button>
        <motion.button
          variants={itemVariants}
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-sm"
        >
          + Announcement
        </motion.button>
      </motion.div>

      {/* Key Statistics Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp size={20} className="text-teal-600" />
          Key Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                className={`${stat.bgColor} border border-gray-200 dark:border-gray-700 rounded-lg p-4`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-2 bg-white dark:bg-gray-800 rounded`}>
                    <Icon size={20} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Doctor Management Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <UserCheck size={20} className="text-green-600" />
          Doctor Availability Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doc) => (
            <motion.div
              key={doc.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{doc.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{doc.specialization}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Case time: {doc.caseTime}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  doc.status === 'Free' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                  {doc.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recent Patient Activity Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity size={20} className="text-blue-600" />
          Recent Patient Activities
        </h2>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Patient Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Assigned Doctor</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {patients.slice(0, 5).map((p) => {
                  const assignedDoctor = doctors.find((d) => d.id === p.doctorId);
                  return (
                    <motion.tr
                      key={p.id}
                      variants={itemVariants}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{p.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          p.status === 'Completed'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {assignedDoctor ? assignedDoctor.name : '-'}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* Notifications & Updates Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell size={20} className="text-blue-600" />
          Recent Updates
        </h2>
        <div className="space-y-3">
          {updates.map((update) => (
            <motion.div
              key={update.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{update.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{update.details}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{update.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
