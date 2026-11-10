import { useMemo, useState } from 'react';
import {
  Award,
  Ban,
  Search,
  Eye,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import StatusBadge from '@/components/StatusBadge';
import type { Certificate } from '@/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

type Filter = 'All' | 'Active' | 'Revoked';

export default function AdminCertificates() {
  const { certificates, revokeCertificate } = useApp();
  const [filter, setFilter] = useState<Filter>('All');
  const [search, setSearch] = useState('');
  const [revoking, setRevoking] = useState<Certificate | null>(null);
  const [reason, setReason] = useState('');
  const [viewing, setViewing] = useState<Certificate | null>(null);

  const filtered = useMemo(() => {
    return certificates.filter((c) => {
      if (filter !== 'All' && c.status !== filter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.applicationId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [certificates, filter, search]);

  const counts = useMemo(
    () => ({
      All: certificates.length,
      Active: certificates.filter((c) => c.status === 'Active').length,
      Revoked: certificates.filter((c) => c.status === 'Revoked').length,
    }),
    [certificates]
  );

  const confirmRevoke = () => {
    if (!revoking) return;
    revokeCertificate(revoking.id, reason.trim() || 'Certificate revoked by administrator.');
    setRevoking(null);
    setReason('');
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-700 text-gold-400">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy-900">Certificates</h1>
          <p className="text-sm text-navy-500">Manage issued certificates and revocations</p>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(counts) as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-navy-700 text-white'
                  : 'bg-white text-navy-600 hover:bg-navy-100'
              }`}
            >
              {f} <span className="opacity-70">({counts[f]})</span>
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field py-2 pl-9 text-sm"
            placeholder="Search ID, name, phone..."
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="h-10 w-10 text-navy-300" />
            <p className="mt-3 text-sm text-navy-500">No certificates match your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-navy-100 bg-navy-50 text-xs font-semibold uppercase tracking-wider text-navy-500">
                  <th className="px-4 py-3">Cert ID</th>
                  <th className="px-4 py-3">Holder</th>
                  <th className="px-4 py-3 hidden md:table-cell">Contact</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Location</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Issued</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filtered.map((cert) => (
                  <tr key={cert.id} className="transition-colors hover:bg-navy-50/50">
                    <td className="px-4 py-3 font-mono font-semibold text-navy-800">{cert.id}</td>
                    <td className="px-4 py-3 font-medium text-navy-800">{cert.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-navy-600">
                      <div>{cert.phone}</div>
                      <div className="text-xs text-navy-400">{cert.gender}</div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-navy-600">
                      {cert.city}, {cert.state}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-navy-500">
                      {formatDate(cert.issuedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={cert.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewing(cert)}
                          className="btn-ghost px-2 py-1.5"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {cert.status === 'Active' ? (
                          <button
                            onClick={() => { setRevoking(cert); setReason(''); }}
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            Revoke
                          </button>
                        ) : (
                          <span className="text-xs text-rose-500">Revoked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewing && (
        <Modal onClose={() => setViewing(null)} title="Certificate Details">
          <CertDetailGrid cert={viewing} />
        </Modal>
      )}

      {revoking && (
        <Modal onClose={() => setRevoking(null)} title={`Revoke ${revoking.id}`}>
          <div className="space-y-4">
            <p className="text-sm text-navy-600">
              You are about to revoke the certificate held by{' '}
              <span className="font-semibold text-navy-800">{revoking.name}</span>. This will
              immediately invalidate it. Provide a reason.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="Reason for revocation..."
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setRevoking(null)} className="btn-outline">
                Cancel
              </button>
              <button
                onClick={confirmRevoke}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
              >
                <Ban className="h-4 w-4" />
                Confirm Revocation
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-scale-in card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-navy-900">{title}</h3>
          <button onClick={onClose} className="btn-ghost px-2 py-1">
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CertDetailGrid({ cert }: { cert: Certificate }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Certificate ID" value={cert.id} mono />
        <Field label="Application ID" value={cert.applicationId} mono />
        <Field label="Holder Name" value={cert.name} />
        <Field label="Phone" value={cert.phone} />
        <Field label="Gender" value={cert.gender} />
        <Field label="City" value={cert.city} />
        <Field label="State" value={cert.state} />
        <Field label="Issued On" value={formatDate(cert.issuedAt)} />
        <Field label="Status" value={cert.status} />
        {cert.revokedAt && <Field label="Revoked On" value={formatDate(cert.revokedAt)} />}
      </div>
      {cert.revokeReason && (
        <div className="rounded-xl bg-rose-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">Revocation Reason</p>
          <p className="mt-1 text-sm text-rose-800">{cert.revokeReason}</p>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg bg-navy-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">{label}</p>
      <p className={`mt-0.5 text-sm font-medium text-navy-800 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
