export interface BloodRequest {
  id: number;
  requester: string;
  group: string;
  status: 'Urgent' | 'Normal';
}

export const bloodRequests: BloodRequest[] = [
  { id: 1, requester: 'Ward A', group: 'A+', status: 'Urgent' },
  { id: 2, requester: 'Ward B', group: 'O-', status: 'Normal' },
];
