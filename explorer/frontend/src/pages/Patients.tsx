import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { usePagination } from '../hooks/usePagination';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from '../components/common/SearchBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { DataTable, type Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Pagination } from '../components/common/Pagination';
import { formatName, formatPhone, formatDate } from '../utils/formatters';
import type { Patient } from '../../../shared/types';

export function Patients() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { page, setPage, itemsPerPage } = usePagination();

  // Fetch total count from stats endpoint
  const { data: stats } = useApi<{ patients: { total: number } }>('/api/stats');

  const { data, loading, error, refetch } = useApi<{
    data: { patients: Patient[] };
    count: number;
  }>(`/api/patients?page=${page}&per_page=${itemsPerPage}`);

  const total = stats?.patients?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const allPatients = data?.data?.patients || [];

  // Client-side search filter
  const patients = debouncedSearch
    ? allPatients.filter(
        (p) =>
          p.first_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          p.last_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          p.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : allPatients;

  // Define table columns
  const columns: Column<Patient>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (patient) => (
        <span className="font-medium text-gray-900">{patient.id}</span>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (patient) => formatName(patient.first_name, patient.last_name),
    },
    {
      key: 'email',
      header: 'Email',
      render: (patient) => patient.email || '-',
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (patient) =>
        formatPhone(patient.bio?.phone_number || patient.phone),
    },
    {
      key: 'dob',
      header: 'Date of Birth',
      render: (patient) => formatDate(patient.bio?.date_of_birth),
    },
    {
      key: 'status',
      header: 'Status',
      render: (patient) => (
        <StatusBadge
          status={patient.inactive ? 'inactive' : 'active'}
          label={patient.inactive ? 'Inactive' : 'Active'}
        />
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner text="Loading patients..." />;
  }

  if (error) {
    return (
      <ErrorAlert message={`Error loading patients: ${error}`} onRetry={refetch} />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
        <div className="text-sm text-gray-600">
          Page {page} of {totalPages} • {total} total patients
        </div>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by name or email..."
        variant="blue"
      />

      <DataTable<Patient>
        data={patients}
        columns={columns}
        emptyMessage="No patients found"
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
        itemLabel="patients"
        variant="blue"
      />
    </div>
  );
}
