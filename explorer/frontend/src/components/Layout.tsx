import { Link, Outlet, useLocation } from 'react-router-dom';

export function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClass = (path: string) => {
    const base = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    return isActive(path)
      ? `${base} bg-blue-700 text-white`
      : `${base} text-blue-100 hover:bg-blue-600`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold">
                NexHealth Explorer
              </Link>
              
              <nav className="flex space-x-1">
                <Link to="/" className={linkClass('/')}>
                  Dashboard
                </Link>
                <Link to="/patients" className={linkClass('/patients')}>
                  Patients
                </Link>
                <Link to="/appointments" className={linkClass('/appointments')}>
                  Appointments
                </Link>
                <Link to="/providers" className={linkClass('/providers')}>
                  Providers
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          NexHealth Explorer POC - Built with React + TypeScript + Hono
        </div>
      </footer>
    </div>
  );
}
