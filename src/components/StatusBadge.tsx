import type { ApplicationStatus, CertificateStatus } from '@/types';

interface StatusBadgeProps {
  status: ApplicationStatus | CertificateStatus;
}

const styles: Record<string, string> = {
  Pending: 'bg-gold-100 text-gold-800',
  Issued: 'bg-emerald-100 text-emerald-700',
  Active: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-rose-100 text-rose-700',
  Revoked: 'bg-rose-100 text-rose-700',
};

const dotStyles: Record<string, string> = {
  Pending: 'bg-gold-500',
  Issued: 'bg-emerald-500',
  Active: 'bg-emerald-500',
  Rejected: 'bg-rose-500',
  Revoked: 'bg-rose-500',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge ${styles[status] ?? 'bg-navy-100 text-navy-700'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[status] ?? 'bg-navy-400'}`} />
      {status}
    </span>
  );
}
