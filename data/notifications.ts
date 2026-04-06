export interface Notification {
  id: number;
  message: string;
  time: string;
}

export const notifications = [
  { id: 1, message: 'System maintenance scheduled at 2 AM.', time: '10:00 AM' },
  { id: 2, message: 'New patient admitted: Anna Taylor.', time: '9:45 AM' },
];
