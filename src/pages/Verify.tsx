import { useState, type FormEvent } from 'react';
import {
  ShieldCheck,
  AlertCircle,
  Calendar,
  Phone,
  MapPin,
  User,
  FileText,
  Award,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { PageContainer } from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import type { Certificate } from '@/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Verify() {
  const { getCertificate } = useApp();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Certificate | null | 'not-found'>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const found = getCertificate(query);
    setResult(found ?? 'not-found');
    setSubmitted(true);
  };

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Public Verification"
        title="Verify a Certificate"
        description="Enter a Certificate ID to confirm its authenticity and current standing."
        icon={<ShieldCheck className="h-6 w-6" />}
      />

      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
          <label htmlFor="certId" className="mb-1.5 block text-sm font-semibold text-navy-700">
            Certificate ID
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input
                id="certId"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input-field pl-10"
                placeholder="e.g. CV-2026-0007"
              />
            </div>
            <button type="submit" className="btn-gold shrink-0">
              <ShieldCheck className="h-4 w-4" />
              Verify
            </button>
          </div>
          <p className="mt-3 text-xs text-navy-400">
            Anyone can verify a certificate without logging in. The ID is printed on the issued document.
          </p>
        </form>

        {submitted && result === 'not-found' && (
          <div className="mt-6 animate-fade-in card border-rose-200 bg-rose-50 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-rose-900">Certificate not found</h3>
                <p className="mt-1 text-sm text-rose-700">
                  No certificate exists with that ID. Please verify the ID and try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {submitted && result && result !== 'not-found' && (
          <div className="mt-6 animate-fade-in space-y-4">
            {/* Verdict banner */}
            <div
              className={`card overflow-hidden ${
                result.status === 'Active' ? 'border-emerald-200' : 'border-rose-200'
              }`}
            >
              <div
                className={`flex items-center gap-3 px-6 py-4 ${
                  result.status === 'Active'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-rose-500 to-rose-600 text-white'
                }`}
              >
                {result.status === 'Active' ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <XCircle className="h-6 w-6" />
                )}
                <div>
                  <p className="font-bold">
                    {result.status === 'Active' ? 'Certificate is Valid' : 'Certificate is Revoked'}
                  </p>
                  <p className="text-sm opacity-90">
                    {result.status === 'Active'
                      ? 'This certificate is authentic and currently active.'
                      : 'This certificate has been revoked and is no longer valid.'}
                  </p>
                </div>
                <Award className="ml-auto h-8 w-8 opacity-40" />
              </div>

              <div className="flex items-center justify-between border-b border-navy-100 bg-navy-50 px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                    Certificate ID
                  </p>
                  <p className="font-mono text-lg font-bold text-navy-900">{result.id}</p>
                </div>
                <StatusBadge status={result.status} />
              </div>

              <div className="grid gap-px bg-navy-100 sm:grid-cols-2">
                <DetailRow icon={User} label="Holder Name" value={result.name} />
                <DetailRow icon={Phone} label="Phone" value={result.phone} />
                <DetailRow icon={FileText} label="Gender" value={result.gender} />
                <DetailRow icon={MapPin} label="City" value={result.city} />
                <DetailRow icon={MapPin} label="State" value={result.state} />
                <DetailRow icon={Calendar} label="Issued On" value={formatDate(result.issuedAt)} />
              </div>

              {result.status === 'Revoked' && result.revokeReason && (
                <div className="border-t border-navy-100 bg-rose-50 px-6 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">
                    Reason for Revocation
                  </p>
                  <p className="mt-1 text-sm text-rose-800">{result.revokeReason}</p>
                  {result.revokedAt && (
                    <p className="mt-2 text-xs text-rose-500">
                      Revoked on {formatDate(result.revokedAt)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-white px-6 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-500">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-navy-800 break-words">{value}</p>
      </div>
    </div>
  );
}
