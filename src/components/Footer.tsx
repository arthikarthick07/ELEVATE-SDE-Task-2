import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-navy-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800">
                <ShieldCheck className="h-5 w-5 text-gold-400" />
              </div>
              <span className="font-serif text-lg font-bold text-navy-800">
                Cred<span className="text-gold-500">Vault</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-navy-500">
              A secure, modern platform for issuing and verifying digital
              certificates of authenticity.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-navy-400">
              Services
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/request" className="text-navy-600 hover:text-navy-900">
                  Request a Certificate
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-navy-600 hover:text-navy-900">
                  Track Application
                </Link>
              </li>
              <li>
                <Link to="/verify" className="text-navy-600 hover:text-navy-900">
                  Verify Certificate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-navy-400">
              Administration
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/admin/login" className="text-navy-600 hover:text-navy-900">
                  Admin Login
                </Link>
              </li>
              <li className="text-navy-500">Official Digital Authority</li>
              <li className="text-navy-500">Government-Grade Security</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-navy-100 pt-6 text-center text-xs text-navy-400">
          &copy; {new Date().getFullYear()} CredVault. All rights reserved.
          This is a demonstration platform using local data.
        </div>
      </div>
    </footer>
  );
}
