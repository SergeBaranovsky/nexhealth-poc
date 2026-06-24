import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { usePagination } from '../hooks/usePagination';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { DataTable, type Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Pagination } from '../components/common/Pagination';
import { formatDateTime } from '../utils/formatters';
import type { Appointment } from '../../../shared/types';

export function Appointments() {
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  });

  const { page, setPage, itemsPerPage } = usePagination();

  // Fetch total count from stats endpoint
  const { data: stats } = useApi<{ appointments: { total: number } }>('/api/stats');

  const { data, loading, error, refetch } = useApi<{
    data: { appointments: Appointment[] };
    count: number;
  }>(
    `/api/appointments?page=${page}&per_page=${itemsPerPage}&start=${dateRange.start}&end=${dateRange.end}`
  );

  const appointments = data?.data?.appointments || [];
  const total = stats?.appointments?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
    setPage(1); // Reset to first page when filters change
  };

  // Get appointment status
  const getAppointmentStatus = (
    appointment: Appointment
  ): 'cancelled' | 'confirmed' | 'pending' => {
    if (appointment.cancelled) return 'cancelled';
    if (appointment.confirmed) return 'confirmed';
    return 'pending';
  };

  // Define table columns
  const columns: Column<Appointment>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (apt) => <span className="font-medium text-gray-900">{apt.id}</span>,
    },
    {
      key: 'patient_id',
      header: 'Patient ID',
      render: (apt) => apt.patient_id,
    },
    {
      key: 'provider_id',
      header: 'Provider ID',
      render: (apt) => apt.provider_id || '-',
    },
    {
      key: 'start_time',
      header: 'Start Time',
      render: (apt) => formatDateTime(apt.start_time),
    },
    {
      key: 'end_time',
      header: 'End Time',
      render: (apt) => formatDateTime(apt.end_time),
    },
    {
      key: 'status',
      header: 'Status',
      render: (apt) => {
        const status = getAppointmentStatus(apt);
        const labels = {
          cancelled: 'Cancelled',
          confirmed: 'Confirmed',
          pending: 'Pending',
        };
        return <StatusBadge status={status} label={labels[status]} />;
      },
    },
  ];

  if (loading) {
    return <LoadingSpinner text="Loading appointments..." color="green" />;
  }

  if (error) {
    return (
      <ErrorAlert
        message={`Error loading appointments: ${error}`}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <div className="text-sm text-gray-600">
          Page {page} of {totalPages} • {total} total appointments
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => handleDateChange('start', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => handleDateChange('end', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      <DataTable<Appointment>
        data={appointments}
        columns={columns}
        emptyMessage="No appointments found"
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
        itemLabel="appointments"
        variant="green"
      />
    </div>
  );
}
