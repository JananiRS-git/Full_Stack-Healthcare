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
    name: 'Yamuna',
    specialization: 'Cardiology',
    status: 'Free',
    caseTime: '30m',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 2,
    name: 'Senthil',
    specialization: 'Dermatologist',
    status: 'Free',
    caseTime: '25m',
    createdAt: '2026-03-03T08:00:00.000Z',
    updatedAt: '2026-03-03T08:00:00.000Z',
  },
];
