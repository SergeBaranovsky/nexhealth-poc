import { useApi } from '../hooks/useApi';
import type { Patient, Appointment, Provider } from '../../../shared/types';

export function Dashboard() {
  const { data: patientsData } = useApi<{ data: { patients: Patient[] }; count: number }>('/patients?per_page=5');
  const { data: appointmentsData } = useApi<{ data: { appointments: Appointment[] }; count: number }>('/appointments?per_page=5');
  const { data: providersData } = useApi<{ data: { providers: Provider[] } }>('/providers');

  const patientCount = patientsData?.count || 0;
  const appointmentCount = appointmentsData?.count || 0;
  const providerCount = providersData?.data?.providers?.length || 0;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value={patientCount}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Appointments"
          value={appointmentCount}
          icon="📅"
          color="green"
        />
        <StatCard
          title="Providers"
          value={providerCount}
          icon="👨‍⚕️"
          color="purple"
        />
      </div>

      {/* Welcome Message */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Welcome to NexHealth Explorer
        </h2>
        <p className="text-gray-600 mb-4">
          This is a simple proof-of-concept application for exploring NexHealth sandbox data.
          Use the navigation above to browse patients, appointments, and providers.
        </p>
        <div className="flex gap-4">
          <a
            href="/patients"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Patients →
          </a>
          <a
            href="/appointments"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            View Appointments →
          </a>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'purple';
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className={`text-4xl ${colorClasses[color]} w-16 h-16 rounded-full flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
