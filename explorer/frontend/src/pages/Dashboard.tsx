import { useApi } from '../hooks/useApi';
import type { Patient, Appointment, Provider } from '../../../shared/types';

export function Dashboard() {
  // Fetch total counts from stats endpoint
  const { data: stats } = useApi<{ patients: { total: number }; appointments: { total: number }; providers: { total: number } }>('/stats');
  
  // Fetch recent/limited data for display
  const { data: recentPatientsData, loading: patientsLoading } = useApi<{ data: { patients: Patient[] }; count: number }>('/patients?per_page=5');
  const { data: upcomingAppointmentsData, loading: appointmentsLoading } = useApi<{ data: { appointments: Appointment[] }; count: number }>('/appointments?per_page=10');
  const { data: providersData, loading: providersLoading } = useApi<{ data: { providers: Provider[] } }>('/providers');

  const patientCount = stats?.patients?.total || 0;
  const appointmentCount = stats?.appointments?.total || 0;
  const providerCount = stats?.providers?.total || 0;
  
  const recentPatients = recentPatientsData?.data?.patients || [];
  const upcomingAppointments = upcomingAppointmentsData?.data?.appointments || [];
  
  const isLoading = patientsLoading || appointmentsLoading || providersLoading;

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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Patients
          </h2>
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : recentPatients.length === 0 ? (
            <p className="text-gray-500">No patients found</p>
          ) : (
            <div className="space-y-3">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {patient.first_name} {patient.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{patient.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    patient.inactive ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {patient.inactive ? 'Inactive' : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          )}
          <a
            href="/patients"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            View all patients →
          </a>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upcoming Appointments
          </h2>
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : upcomingAppointments.length === 0 ? (
            <p className="text-gray-500">No appointments found</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 5).map((appt) => (
                <div key={appt.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {appt.provider_name || `Provider ${appt.provider_id}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(appt.start_time).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    appt.cancelled ? 'bg-red-100 text-red-800' :
                    appt.confirmed ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {appt.cancelled ? 'Cancelled' : appt.confirmed ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
          <a
            href="/appointments"
            className="mt-4 inline-flex items-center text-green-600 hover:text-green-700"
          >
            View all appointments →
          </a>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          🎉 NexHealth Explorer POC
        </h2>
        <p className="text-gray-700">
          This proof-of-concept displays real data from the NexHealth sandbox environment.
          Use the navigation above to explore patients, appointments, and providers with full search and filtering capabilities.
        </p>
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
