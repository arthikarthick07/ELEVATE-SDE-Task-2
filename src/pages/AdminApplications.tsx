import { useMemo, useState } from 'react';
import {
  LayoutGrid,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import StatusBadge from '@/components/StatusBadge';
import type { Application } from '@/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

type Filter = 'All' | 'Pending' | 'Issued' | 'Rejected';

export default function AdminApplications() {
  const { applications, issueApplication, rejectApplication, certificates } = useApp();
  const [filter, setFilter] = useState<Filter>('All');
  const [search, setSearch] = useState('');
  const [rejecting, setRejecting] = useState<Application | null>(null);
  const [reason, setReason] = useState('');
  const [viewing, setViewing] = useState<Application | null>(null);
  const [issuedCertId, setIssuedCertId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      if (filter !== 'All' && a.status !== filter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          a.id.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.phone.includes(q) ||
          a.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [applications, filter, search]);

  const counts = useMemo(
    () => ({
      All: applications.length,
      Pending: applications.filter((a) => a.status === 'Pending').length,
      Issued: applications.filter((a) => a.status === 'Issued').length,
      Rejected: applications.filter((a) => a.status === 'Rejected').length,
    }),
    [applications]
  );

  const handleIssue = (id: string) => {
    const cert = issueApplication(id);
    if (cert) {
      setIssuedCertId(cert.id);
      setTimeout(() => setIssuedCertId(null), 4000);
    }
  };

  const confirmReject = () => {
    if (!rejecting) return;
    rejectApplication(rejecting.id, reason.trim() || 'Application rejected by administrator.');
    setRejecting(null);
    setReason('');
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-700 text-gold-400">
          <LayoutGrid className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy-900">Applications</h1>
          <p className="text-sm text-navy-500">Review and process certificate requests</p>
        </div>
      </div>

      {issuedCertId && (
        <div className="mb-4 animate-slide-down flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="text-sm text-emerald-800">
            Certificate issued successfully. Certificate ID:{' '}
            <span className="font-mono font-bold">{issuedCertId}</span>
          </p>
        </div>
      )}

      {/* Filters + search */}
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

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="h-10 w-10 text-navy-300" />
            <p className="mt-3 text-sm text-navy-500">No applications match your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-navy-100 bg-navy-50 text-xs font-semibold uppercase tracking-wider text-navy-500">
                  <th className="px-4 py-3">App ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3 hidden md:table-cell">Contact</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Location</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Submitted</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filtered.map((app) => {
                  const cert = certificates.find((c) => c.applicationId === app.id);
                  return (
                    <tr key={app.id} className="transition-colors hover:bg-navy-50/50">
                      <td className="px-4 py-3 font-mono font-semibold text-navy-800">{app.id}</td>
                      <td className="px-4 py-3 font-medium text-navy-800">{app.name}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-navy-600">
                        <div>{app.phone}</div>
                        <div className="text-xs text-navy-400">{app.gender}</div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-navy-600">
                        {app.city}, {app.state}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-navy-500">
                        {formatDate(app.submittedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewing(app)}
                            className="btn-ghost px-2 py-1.5"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {app.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleIssue(app.id)}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Issue
                              </button>
                              <button
                                onClick={() => { setRejecting(app); setReason(''); }}
                                className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Reject
                              </button>
                            </>
                          )}
                          {app.status === 'Issued' && cert && (
                            <span className="font-mono text-xs text-navy-400">{cert.id}</span>
                          )}
                          {app.status === 'Rejected' && (
                            <span className="text-xs text-rose-500">Closed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View modal */}
      {viewing && (
        <Modal onClose={() => setViewing(null)} title="Application Details">
          <DetailGrid app={viewing} certId={certificates.find((c) => c.applicationId === viewing.id)?.id} />
        </Modal>
      )}

      {/* Reject modal */}
      {rejecting && (
        <Modal onClose={() => setRejecting(null)} title={`Reject ${rejecting.id}`}>
          <div className="space-y-4">
            <p className="text-sm text-navy-600">
              You are about to reject the application from{' '}
              <span className="font-semibold text-navy-800">{rejecting.name}</span>. Provide a reason
              for the applicant.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="Reason for rejection..."
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setRejecting(null)} className="btn-outline">
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
              >
                <XCircle className="h-4 w-4" />
                Confirm Rejection
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

function DetailGrid({ app, certId }: { app: Application; certId?: string }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Application ID" value={app.id} mono />
        <Field label="Status" value={app.status} />
        <Field label="Name" value={app.name} />
        <Field label="Phone" value={app.phone} />
        <Field label="Gender" value={app.gender} />
        <Field label="City" value={app.city} />
        <Field label="State" value={app.state} />
        <Field label="Submitted" value={formatDate(app.submittedAt)} />
        {certId && <Field label="Certificate ID" value={certId} mono />}
        {app.decidedAt && (
          <Field
            label={app.status === 'Rejected' ? 'Decided' : 'Issued'}
            value={formatDate(app.decidedAt)}
          />
        )}
      </div>
      {app.rejectionReason && (
        <div className="rounded-xl bg-rose-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">Rejection Reason</p>
          <p className="mt-1 text-sm text-rose-800">{app.rejectionReason}</p>
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
