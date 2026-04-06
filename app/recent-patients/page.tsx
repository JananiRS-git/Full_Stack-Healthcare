'use client';

import DataTable from '@/components/DataTable';
import { useData } from '@/context/DataContext';
import { formatDate } from '@/utils/date';

export default function RecentPatientsPage() {
  const { patients, doctors } = useData();

  // Filter and sort patients that have been assigned to doctors (have consultation history)
  const recentPatients = patients
    .filter((p) => p.doctorId || p.doctorName) // Has or had a doctor assigned
    .sort((a, b) => {
      // Sort by newest consultations first
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });

  const columns = [
    { header: 'Patient', accessor: 'name' as const },
    { header: 'Phone', accessor: 'phone' as const },
    { header: 'Age', accessor: 'age' as const },
    { header: 'Blood Group', accessor: 'bloodGroup' as const },
    { header: 'Assigned Doctor', accessor: 'doctorName' as const },
    { header: 'Status', accessor: 'status' as const },
    { header: 'Consultation', accessor: 'consultationStatus' as const },
    { header: 'Last Visit', accessor: 'updatedAt' as const },
  ];

  const formattedData = recentPatients.map((patient) => {
    // Ensure doctor name is always set - look up from doctorId if not in patient record
    let doctorName = patient.doctorName;
    if (!doctorName && patient.doctorId) {
      const doctor = doctors.find((d) => d.id === patient.doctorId);
      doctorName = doctor?.name || '-';
    }
    return {
      ...patient,
      doctorName: doctorName || '-',
      updatedAt: formatDate(patient.updatedAt),
      consultationStatus: patient.consultationStatus || 'Not Started',
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recent Patients</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View consultation history with assigned doctors. Doctor names are preserved even if doctors are removed from the system.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {recentPatients.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No recent patient consultations found.</p>
          </div>
        ) : (
          <DataTable columns={columns} data={formattedData} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{recentPatients.length}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Consultations</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {recentPatients.filter((p) => p.status === 'Completed').length}
          </div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
            {recentPatients.filter((p) => p.consultationStatus === 'in_progress').length}
          </div>
        </div>
      </div>
    </div>
  );
}
