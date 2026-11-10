import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, FilePlus, Search, ShieldCheck, Lock } from 'lucide-react';
import Brand from './Brand';

const publicLinks = [
  { to: '/request', label: 'Request', icon: FilePlus },
  { to: '/track', label: 'Track', icon: Search },
  { to: '/verify', label: 'Verify', icon: ShieldCheck },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="transition-transform hover:scale-[1.02]">
          <Brand />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-navy-700 text-white shadow-card'
                    : 'text-navy-600 hover:bg-navy-100 hover:text-navy-800'
                }`
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
          <Link to="/admin/login" className="btn-outline ml-2">
            <Lock className="h-4 w-4" />
            Admin
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-navy-700 hover:bg-navy-100 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-navy-100 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-navy-700 text-white'
                      : 'text-navy-700 hover:bg-navy-100'
                  }`
                }
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isAdminArea ? 'bg-navy-700 text-white' : 'text-navy-700 hover:bg-navy-100'
              }`}
            >
              <Lock className="h-5 w-5" />
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
