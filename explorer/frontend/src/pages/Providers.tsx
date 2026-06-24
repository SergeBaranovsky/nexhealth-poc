import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { DataTable, type Column } from '../components/common/DataTable';
import { formatName } from '../utils/formatters';
import type { Provider } from '../../../shared/types';

export function Providers() {
  const { data, loading, error, refetch } = useApi<{
    data: { providers: Provider[] };
  }>('/api/providers');

  const providers = data?.data?.providers || [];

  // Define table columns
  const columns: Column<Provider>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (provider) => (
        <span className="font-medium text-gray-900">{provider.id}</span>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (provider) =>
        formatName(provider.first_name, provider.last_name),
    },
    {
      key: 'npi',
      header: 'NPI',
      render: (provider) => provider.npi || '-',
    },
    {
      key: 'email',
      header: 'Email',
      render: (provider) => provider.email || '-',
    },
  ];

  if (loading) {
    return <LoadingSpinner text="Loading providers..." color="purple" />;
  }

  if (error) {
    return (
      <ErrorAlert
        message={`Error loading providers: ${error}`}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Providers</h1>
        <div className="text-sm text-gray-600">
          {providers.length} providers found
        </div>
      </div>

      <DataTable<Provider>
        data={providers}
        columns={columns}
        emptyMessage="No providers found"
      />
    </div>
  );
}
