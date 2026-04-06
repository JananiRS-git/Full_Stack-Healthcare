export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'Staff' | 'Doctor' | 'Patient';
}

export const users: User[] = [
  {
    id: 1,
    email: 'yamuna@hospital.com',
    password: 'doctor123',
    name: 'Dr. Yamuna',
    role: 'Doctor',
  },
  {
    id: 2,
    email: 'staff@hospital.com',
    password: 'staff123',
    name: 'John Staff',
    role: 'Staff',
  },
  {
    id: 3,
    email: 'sonika@hospital.com',
    password: 'doctor123',
    name: 'Dr.Sonika',
    role: 'Doctor',
  },
  {
    id: 4,
    email: 'athvaitha@hospital.com',
    password: 'doctor123',
    name: 'Dr.Athvaitha',
    role: 'Doctor',
  },
  {
    id: 5,
    email: 'senthil@hospital.com',
    password: 'doctor123',
    name: 'Dr.Senthil',
    role: 'Doctor',
  },
  // Patient accounts
  {
    id: 101,
    email: 'naveen@patient.com',
    password: 'patient123',
    name: 'Naveen',
    role: 'Patient',
  },
  {
    id: 102,
    email: 'prasad@patient.com',
    password: 'patient123',
    name: 'Prasad',
    role: 'Patient',
  },
  {
    id: 103,
    email: 'bharath@patient.com',
    password: 'patient123',
    name: 'Bharath',
    role: 'Patient',
  },
  {
    id: 104,
    email: 'padmavathi@patient.com',
    password: 'patient123',
    name: 'Padmavathi',
    role: 'Patient',
  },
];

export interface LoginRecord {
  id: number;
  userId: number;
  userName: string;
  role: 'Staff' | 'Doctor' | 'Patient';
  email: string;
  loginTime: string; // ISO timestamp
}
