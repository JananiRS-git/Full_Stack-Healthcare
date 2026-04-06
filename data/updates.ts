export interface Update {
  id: number;
  title: string;
  date: string;
  details: string;
  userId: number;
  userName: string;
  timestamp: string; // ISO timestamp
}

export const updates: Update[] = [
  { id: 1, title: 'New compliance policy', date: '2026-03-01', details: 'Please review the updated hospital compliance policy.', userId: 1, userName: 'Dr. Yamuna', timestamp: '2026-03-01T10:00:00.000Z' },
  { id: 2, title: 'Blood drive scheduled', date: '2026-02-28', details: 'Annual blood donation drive will occur next week.', userId: 1, userName: 'Dr. Yamuna', timestamp: '2026-02-28T09:30:00.000Z' },
];
