import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Application, Certificate, Gender } from '@/types';
import { seedApplications, seedCertificates } from '@/data/seed';

const APP_KEY = 'credvault.applications';
const CERT_KEY = 'credvault.certificates';
const ADMIN_KEY = 'credvault.adminSession';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function nextApplicationId(existing: Application[]): string {
  const year = new Date().getFullYear();
  const nums = existing
    .map((a) => parseInt(a.id.split('-').pop() ?? '0', 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `APP-${year}-${String(next).padStart(4, '0')}`;
}

function nextCertificateId(existing: Certificate[]): string {
  const year = new Date().getFullYear();
  const nums = existing
    .map((c) => parseInt(c.id.split('-').pop() ?? '0', 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 5) + 1;
  return `CV-${year}-${String(next).padStart(4, '0')}`;
}

interface NewApplicationInput {
  name: string;
  phone: string;
  gender: Gender;
  city: string;
  state: string;
}

interface AppContextValue {
  applications: Application[];
  certificates: Certificate[];
  isAdmin: boolean;
  submitApplication: (input: NewApplicationInput) => Application;
  getApplication: (id: string) => Application | undefined;
  getCertificate: (id: string) => Certificate | undefined;
  issueApplication: (id: string) => Certificate | undefined;
  rejectApplication: (id: string, reason: string) => void;
  revokeCertificate: (id: string, reason: string) => void;
  adminLogin: (username: string, password: string) => boolean;
  adminLogout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>(() =>
    load(APP_KEY, seedApplications)
  );
  const [certificates, setCertificates] = useState<Certificate[]>(() =>
    load(CERT_KEY, seedCertificates)
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(() =>
    load(ADMIN_KEY, false)
  );

  useEffect(() => save(APP_KEY, applications), [applications]);
  useEffect(() => save(CERT_KEY, certificates), [certificates]);
  useEffect(() => save(ADMIN_KEY, isAdmin), [isAdmin]);

  const submitApplication = (input: NewApplicationInput): Application => {
    const app: Application = {
      id: nextApplicationId(applications),
      ...input,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };
    setApplications((prev) => [app, ...prev]);
    return app;
  };

  const getApplication = (id: string) =>
    applications.find((a) => a.id.toLowerCase() === id.toLowerCase().trim());

  const getCertificate = (id: string) =>
    certificates.find((c) => c.id.toLowerCase() === id.toLowerCase().trim());

  const issueApplication = (id: string): Certificate | undefined => {
    const app = applications.find((a) => a.id === id);
    if (!app || app.status !== 'Pending') return undefined;
    const cert: Certificate = {
      id: nextCertificateId(certificates),
      applicationId: app.id,
      name: app.name,
      phone: app.phone,
      gender: app.gender,
      city: app.city,
      state: app.state,
      status: 'Active',
      issuedAt: new Date().toISOString(),
    };
    setCertificates((prev) => [cert, ...prev]);
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: 'Issued', decidedAt: new Date().toISOString() }
          : a
      )
    );
    return cert;
  };

  const rejectApplication = (id: string, reason: string) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'Rejected',
              decidedAt: new Date().toISOString(),
              rejectionReason: reason,
            }
          : a
      )
    );
  };

  const revokeCertificate = (id: string, reason: string) => {
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'Revoked',
              revokedAt: new Date().toISOString(),
              revokeReason: reason,
            }
          : c
      )
    );
  };

  const adminLogin = (username: string, password: string): boolean => {
    if (username.trim() === 'admin' && password === 'admin') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => setIsAdmin(false);

  const value: AppContextValue = {
    applications,
    certificates,
    isAdmin,
    submitApplication,
    getApplication,
    getCertificate,
    issueApplication,
    rejectApplication,
    revokeCertificate,
    adminLogin,
    adminLogout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
