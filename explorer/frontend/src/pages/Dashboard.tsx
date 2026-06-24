import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useStats } from '../hooks/useStats';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { StatusBadge } from '../components/common/StatusBadge';
import { StatCard } from '../components/dashboard/StatCard';
import { formatName, formatDateTime } from '../utils/formatters';
import type { Patient, Appointment } from '../../../shared/types';

export function Dashboard() {
  // Fetch total counts from stats endpoint using centralized hook
  const { patients, appointments, providers, loading: statsLoading } = useStats();

  // Fetch recent/limited data for display
  const { data: recentPatientsData, loading: patientsLoading } = useApi<{
    data: { patients: Patient[] };
    count: number;
  }>('/api/patients?per_page=5');

  const { data: upcomingAppointmentsData, loading: appointmentsLoading } =
    useApi<{ data: { appointments: Appointment[] }; count: number }>(
      '/api/appointments?per_page=10'
    );

  const patientCount = patients?.total || 0;
  const appointmentCount = appointments?.total || 0;
  const providerCount = providers?.total || 0;

  const recentPatients = recentPatientsData?.data?.patients || [];
  const upcomingAppointments = upcomingAppointmentsData?.data?.appointments || [];

  const isLoading =
    statsLoading || patientsLoading || appointmentsLoading;

  if (isLoading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value={patientCount}
          link="/patients"
          linkText="View Patients"
          icon={<span className="text-4xl">👥</span>}
          color="blue"
        />
        <StatCard
          title="Appointments"
          value={appointmentCount}
          link="/appointments"
          linkText="View Appointments"
          icon={<span className="text-4xl">📅</span>}
          color="green"
        />
        <StatCard
          title="Providers"
          value={providerCount}
          link="/providers"
          linkText="View Providers"
          icon={<span className="text-4xl">👨‍⚕️</span>}
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
          {recentPatients.length === 0 ? (
            <p className="text-gray-500">No patients found</p>
          ) : (
            <div className="space-y-3">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatName(patient.first_name, patient.last_name)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {patient.email || '-'}
                    </p>
                  </div>
                  <StatusBadge
                    status={patient.inactive ? 'inactive' : 'active'}
                    label={patient.inactive ? 'Inactive' : 'Active'}
                  />
                </div>
              ))}
            </div>
          )}
          <Link
            to="/patients"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            View all patients →
          </Link>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upcoming Appointments
          </h2>
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-500">No appointments found</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 5).map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {appt.provider_name || `Provider ${appt.provider_id}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(appt.start_time)}
                    </p>
                  </div>
                  <StatusBadge
                    status={
                      appt.cancelled
                        ? 'cancelled'
                        : appt.confirmed
                        ? 'confirmed'
                        : 'pending'
                    }
                    label={
                      appt.cancelled
                        ? 'Cancelled'
                        : appt.confirmed
                        ? 'Confirmed'
                        : 'Pending'
                    }
                  />
                </div>
              ))}
            </div>
          )}
          <Link
            to="/appointments"
            className="mt-4 inline-flex items-center text-green-600 hover:text-green-700"
          >
            View all appointments →
          </Link>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          🎉 NexHealth Explorer POC
        </h2>
        <p className="text-gray-700">
          This proof-of-concept displays real data from the NexHealth sandbox
          environment. Use the navigation above to explore patients, appointments,
          and providers with full search and filtering capabilities.
        </p>
      </div>
    </div>
  );
}
