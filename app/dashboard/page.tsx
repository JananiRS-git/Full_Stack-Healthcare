"use client";

import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/date';
import { Users, UserCheck, Clock, CheckCircle, Heart, Bell, Activity, TrendingUp, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Modal from '../../components/Modal';
import LoginHistoryModal from '../../components/LoginHistoryModal';

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

// SVG Donut Chart Component
const DonutChart = ({ completed, pending }: { completed: number; pending: number }) => {
  const total = completed + pending;
  if (total === 0) return <div className="text-center text-gray-500">No data</div>;
  
  const completedPercent = (completed / total) * 100;
  const pendingPercent = (pending / total) * 100;
  
  const completedDeg = (completedPercent / 100) * 360;
  const pendingDeg = (pendingPercent / 100) * 360;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-40 h-40">
        <svg className="w-40 h-40" viewBox="0 0 100 100">
          {/* Completed segment */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="#10b981"
            strokeWidth="12"
            strokeDasharray={`${completedPercent * 2.19} 219`}
            strokeDashoffset="0"
            transform="rotate(-90 50 50)"
          />
          {/* Pending segment */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="12"
            strokeDasharray={`${pendingPercent * 2.19} 219`}
            strokeDashoffset={`-${completedPercent * 2.19}`}
            transform="rotate(-90 50 50)"
          />
          {/* Center text */}
          <text x="50" y="48" textAnchor="middle" fontSize="24" fontWeight="bold" fill="currentColor">
            {total}
          </text>
          <text x="50" y="62" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7">
            patients
          </text>
        </svg>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-700 dark:text-gray-300">Completed: {completed}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-gray-700 dark:text-gray-300">Pending: {pending}</span>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { doctors, deletedDoctors, patients, bloodRequests, updates } = useData();
  const { role, loginHistory } = useAuth();
  const router = useRouter();
  const [showPrev, setShowPrev] = useState(false);
  const [showLoginHistory, setShowLoginHistory] = useState(false);

  // Redirect patients to their dashboard
  React.useEffect(() => {
    if (role === 'Patient') {
      router.push('/patient-dashboard');
    }
  }, [role, router]);

  if (role === 'Patient') {
    return null;
  }

  const completedPatients = patients.filter((p) => p.status === 'Completed').length;
  const pendingPatients = patients.filter((p) => p.status === 'Pending').length;
  const assignedPatients = patients.filter((p) => p.doctorId).length;

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: Users,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Pending',
      value: pendingPatients,
      icon: Clock,
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200 dark:border-amber-800',
    },
    {
      title: 'Assigned',
      value: assignedPatients,
      icon: UserCheck,
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      textColor: 'text-teal-600',
      borderColor: 'border-teal-200 dark:border-teal-800',
    },
    {
      title: 'In Progress',
      value: doctors.filter((d) => d.status === 'Busy').length,
      icon: Activity,
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
    {
      title: 'Completed',
      value: completedPatients,
      icon: CheckCircle,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600',
      borderColor: 'border-green-200 dark:border-green-800',
    },
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Hospital Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage patients, doctors, and hospital operations</p>
      </motion.div>

      {/* Top Stats Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              className={`${stat.bgColor} border-2 ${stat.borderColor} rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer`}
              suppressHydrationWarning
              onClick={() => {
                if (stat.title === 'Pending') {
                  router.push('/patients?filter=Pending');
                } else if (stat.title === 'Completed') {
                  router.push('/patients?filter=Completed');
                } else {
                  router.push('/patients');
                }
              }}
            >
              <div className="flex justify-between items-start" suppressHydrationWarning>
                <div suppressHydrationWarning>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400" suppressHydrationWarning>{stat.title}</p>
                  <p className={`text-3xl font-bold mt-2 ${stat.textColor}`} suppressHydrationWarning>{stat.value}</p>
                </div>
                <div className={`${stat.textColor} opacity-20`} suppressHydrationWarning>
                  <Icon size={32} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible" className="flex flex-wrap gap-3">
        <button
          onClick={() => router.push('/patients')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
        >
          <Users size={18} />
          Patient Management
        </button>
        <button
          onClick={() => router.push('/doctors/add')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
        >
          <UserCheck size={18} />
          Doctor Management
        </button>
        <button
          onClick={() => router.push('/doctor-free-time')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
        >
          <Clock size={18} />
          Doctor Scheduling
        </button>
        <button
          onClick={() => setShowPrev(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
        >
          <Activity size={18} />
          Previous Records
        </button>
        {role === 'Doctor' && (
          <button
            onClick={() => setShowLoginHistory(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
          >
            <LogIn size={18} />
            Login History
          </button>
        )}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Report - Donut Chart */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
          suppressHydrationWarning
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-teal-600" />
            Overall Report
          </h3>
          <DonutChart completed={completedPatients} pending={pendingPatients} />
        </motion.div>

        {/* Patient Statistics by Status */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
          suppressHydrationWarning
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Patients by Status</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <p className="text-sm text-green-600 font-semibold">Completed</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">{completedPatients}</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
              <p className="text-sm text-amber-600 font-semibold">Pending</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{pendingPatients}</p>
            </div>
            <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-700">
              <p className="text-sm text-teal-600 font-semibold">Assigned to Doctor</p>
              <p className="text-2xl font-bold text-teal-700 dark:text-teal-400">{assignedPatients}</p>
            </div>
          </div>
        </motion.div>

        {/* Doctor Workload */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
          suppressHydrationWarning
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Doctor Workload</h3>
          <div className="space-y-3">
            {doctors.map((doctor, idx) => {
              const doctorPatients = patients.filter((p) => p.doctorId === doctor.id).length;
              const maxPatients = 5;
              const percentage = (doctorPatients / maxPatients) * 100;
              return (
                <div key={doctor.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{doctor.name}</p>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{doctorPatients}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percentage < 40 ? 'bg-green-500' : percentage < 70 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Doctor Availability Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Doctor Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" suppressHydrationWarning>
          {doctors.map((doc) => (
            <motion.div
              key={doc.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white">{doc.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{doc.specialization}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2 ${
                  doc.status === 'Free'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                  {doc.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Case Time: <span className="font-semibold">{doc.caseTime}</span></p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recent Patients Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Patients</h2>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden" suppressHydrationWarning>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Patient</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Assigned Doctor</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Blood Group</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {patients.slice(0, 8).map((p) => {
                  const assignedDoctor = doctors.find((d) => d.id === p.doctorId);
                  return (
                    <motion.tr
                      key={p.id}
                      variants={itemVariants}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">{p.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          p.status === 'Completed'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {assignedDoctor ? assignedDoctor.name : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">{p.bloodGroup}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* Updates Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell size={20} />
          Recent Updates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" suppressHydrationWarning>
          {updates.slice(0, 4).map((update) => (
            <motion.div
              key={update.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white">{update.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{update.details}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{update.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Previous Records Modal */}
      <Modal isOpen={showPrev} onClose={() => setShowPrev(false)} title="Previous Records">
        <div className="space-y-6">
          {/* Patient History Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Patient History</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Total Records:</span> {patients.length}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b-2 border-gray-200 dark:border-gray-600">
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Patient Name</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Age</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Blood Group</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Doctor</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Last Modified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {patients.map((p) => {
                    const doc = doctors.find((d) => d.id === p.doctorId);
                    const deletedDoc = deletedDoctors.find((d) => d.id === p.doctorId);
                    const doctor = doc || deletedDoc;
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{p.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{p.age}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-xs font-semibold">
                            {p.bloodGroup}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            p.status === 'Completed'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className={deletedDoc ? 'line-through opacity-60' : ''}>
                            {doctor ? doctor.name : '-'}
                          </span>
                          {deletedDoc && <span className="ml-1 text-xs text-red-600 dark:text-red-400">(Deleted)</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(p.updatedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deleted Doctors History Section */}
          {deletedDoctors.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Deleted Doctors</h3>
              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Total Deleted:</span> {deletedDoctors.length}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b-2 border-gray-200 dark:border-gray-600">
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Doctor Name</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Specialization</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Case Time</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Deleted Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {deletedDoctors.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100 line-through">{doc.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{doc.specialization}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{doc.caseTime}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(doc.updatedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {role === "Doctor" && (<LoginHistoryModal isOpen={showLoginHistory} onClose={() => setShowLoginHistory(false)} loginHistory={loginHistory} />)}
    </div>
  );
}


