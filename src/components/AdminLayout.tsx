import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { LogOut, LayoutGrid, Award } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Brand from './Brand';

const adminLinks = [
  { to: '/admin/applications', label: 'Applications', icon: LayoutGrid },
  { to: '/admin/certificates', label: 'Certificates', icon: Award },
];

export default function AdminLayout() {
  const { isAdmin, adminLogout } = useApp();
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Top bar */}
      <header className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Brand size="sm" />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-navy-500 sm:block">
              Signed in as <span className="font-semibold text-navy-800">admin</span>
            </span>
            <button
              onClick={adminLogout}
              className="btn-outline px-4 py-2 text-xs"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        {/* Sidebar */}
        <aside className="lg:w-60 lg:shrink-0">
          <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-navy-100 bg-white p-2 shadow-card lg:flex-col lg:overflow-visible">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-navy-700 text-white shadow-card'
                      : 'text-navy-600 hover:bg-navy-100'
                  }`
                }
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
