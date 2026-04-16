"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormInput from '../../../components/FormInput';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Staff' | 'Doctor' | 'Patient'>('Staff');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    const result = await login(email, password, role);

    if (result.success) {
      setLoading(false);
      if (role === 'Patient') {
        router.push('/patient-dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">Hospital Management</h2>
      
      {/* Role Selection Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {(['Staff', 'Doctor', 'Patient'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`px-4 py-2 font-medium transition ${
              role === r
                ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-800 dark:text-red-200 rounded text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label={role === 'Patient' ? 'Patient Name' : 'Email'}
          type={role === 'Patient' ? 'text' : 'email'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={role === 'Patient' ? 'Patient name' : 'Email'}
          required
        />
        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 mt-6 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold rounded transition"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Demo Credentials:</p>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p><strong>Patient:</strong> Any registered patient name / patient123</p>
          <p><strong>Example:</strong> patient_name / patient123</p>
          <p><strong>Doctor:</strong> yamuna@hospital.com / doctor123</p>
          <p><strong>Staff:</strong> staff@hospital.com / staff123</p>
          <p className="mt-2 text-gray-500 italic text-xs">Enter the exact name of a registered patient to access the patient portal</p>
        </div>
      </div>
    </div>
  );
}
