export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  status: 'Free' | 'Busy';
  caseTime: string;
  /** ISO timestamp when the record was created */
  createdAt?: string;
  /** ISO timestamp when the record was last updated */
  updatedAt?: string;
}

export const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Yamuna',
    specialization: 'Cardiology',
    status: 'Free',
    caseTime: '30m',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 2,
    name: 'Dr.Sonika',
    specialization: 'Neurology',
    status: 'Free',
    caseTime: '45m',
    createdAt: '2026-02-28T09:30:00.000Z',
    updatedAt: '2026-02-28T09:30:00.000Z',
  },
  {
    id: 3,
    name: 'Dr.Athvaitha',
    specialization: 'Pediatrics',
    status: 'Free',
    caseTime: '20m',
    createdAt: '2026-03-02T08:15:00.000Z',
    updatedAt: '2026-03-02T08:15:00.000Z',
  },
  {
    id: 4,
    name: 'Dr.Senthil',
    specialization: 'Dermatologist',
    status: 'Free',
    caseTime: '25m',
    createdAt: '2026-03-03T08:00:00.000Z',
    updatedAt: '2026-03-03T08:00:00.000Z',
  },
];
