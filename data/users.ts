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
  // Patient accounts are validated against registered patient records in the system.
];

export interface LoginRecord {
  id: number;
  userId: number;
  userName: string;
  role: 'Staff' | 'Doctor' | 'Patient';
  email: string;
  loginTime: string; // ISO timestamp
}
