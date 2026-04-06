"use client";

import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { users } from '../data/users';
import { LoginRecord } from '../data/users';

interface AuthState {
  role: 'Staff' | 'Doctor' | 'Patient' | null;
  user: string | null;
  userId?: number;
  userName?: string;
}

interface AuthContextProps extends AuthState {
  login: (email: string, password: string, role: 'Staff' | 'Doctor' | 'Patient') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginHistory: LoginRecord[];
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ role: null, user: null });
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('loginHistory');
      if (stored) return JSON.parse(stored);
    }
    return [];
  });

  // persist login history to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
    }
  }, [loginHistory]);

  const login = async (
    email: string,
    password: string,
    role: 'Staff' | 'Doctor' | 'Patient'
  ): Promise<{ success: boolean; error?: string }> => {
    // trim whitespace and validate credentials (case-insensitive email)
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    
    // For patients, use the email as the patient name (already validated to exist in patients list)
    if (role === 'Patient') {
      // Validate password against default patient password
      if (trimmedPassword !== 'patient123') {
        return { success: false, error: 'Invalid email, password, or role' };
      }
      
      // Check if patient exists in the system (from localStorage)
      let patientsData: any[] = [];
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('patients');
        if (stored) {
          try {
            patientsData = JSON.parse(stored);
          } catch (e) {
            patientsData = [];
          }
        }
      }
      
      // Validate that patient exists with matching name
      const patientExists = patientsData.some(
        (p: any) => p.name.toLowerCase() === trimmedEmail
      );
      
      if (!patientExists) {
        return { success: false, error: 'Patient not found in system. Please register first.' };
      }
      
      // Store the patient name as the email (already validated to exist)
      setState({ user: trimmedEmail, role: 'Patient', userName: trimmedEmail });
      
      // add to login history
      const record: LoginRecord = {
        id: Date.now(),
        userId: Date.now(),
        userName: trimmedEmail,
        role: 'Patient',
        email: trimmedEmail,
        loginTime: new Date().toISOString(),
      };
      setLoginHistory((prev) => [...prev, record]);
      return { success: true };
    }
    
    const user = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === trimmedPassword && u.role === role
    );

    if (!user) {
      return { success: false, error: 'Invalid email, password, or role' };
    }

    // login successful
    setState({ user: user.email, role: user.role, userId: user.id, userName: user.name });

    // add to login history
    const record: LoginRecord = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      role: user.role,
      email: user.email,
      loginTime: new Date().toISOString(),
    };
    setLoginHistory((prev) => [...prev, record]);

    return { success: true };
  };

  const logout = () => {
    setState({ user: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, loginHistory }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
