import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  AlertCircle,
  Calendar,
  Phone,
  MapPin,
  User,
  FileText,
  Award,
  ArrowRight,
} from 'lucide-react';
import { PageContainer } from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import type { Application } from '@/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Track() {
  const { getApplication, certificates } = useApp();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Application | null | 'not-found'>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const found = getApplication(query);
    setResult(found ?? 'not-found');
    setSubmitted(true);
  };

  const issuedCert = result && result !== 'not-found' && result.status === 'Issued'
    ? certificates.find((c) => c.applicationId === result.id)
    : undefined;

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Citizen Services"
        title="Track Your Application"
        description="Enter your Application ID to check the current status of your certificate request."
        icon={<Search className="h-6 w-6" />}
      />

      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
          <label htmlFor="appId" className="mb-1.5 block text-sm font-semibold text-navy-700">
            Application ID
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input
                id="appId"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input-field pl-10"
                placeholder="e.g. APP-2026-0001"
              />
            </div>
            <button type="submit" className="btn-primary shrink-0">
              <Search className="h-4 w-4" />
              Track
            </button>
          </div>
          <p className="mt-3 text-xs text-navy-400">
            Tip: Your Application ID was shown on the confirmation screen after submission.
          </p>
        </form>

        {submitted && result === 'not-found' && (
          <div className="mt-6 animate-fade-in card border-rose-200 bg-rose-50 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-rose-900">Application not found</h3>
                <p className="mt-1 text-sm text-rose-700">
                  We couldn't find an application with that ID. Please check the ID and try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {submitted && result && result !== 'not-found' && (
          <div className="mt-6 animate-fade-in space-y-4">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-navy-100 bg-navy-50 px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                    Application ID
                  </p>
                  <p className="font-mono text-lg font-bold text-navy-900">{result.id}</p>
                </div>
                <StatusBadge status={result.status} />
              </div>
              <div className="grid gap-px bg-navy-100 sm:grid-cols-2">
                <DetailRow icon={User} label="Applicant Name" value={result.name} />
                <DetailRow icon={Phone} label="Phone" value={result.phone} />
                <DetailRow icon={FileText} label="Gender" value={result.gender} />
                <DetailRow icon={MapPin} label="City" value={result.city} />
                <DetailRow icon={MapPin} label="State" value={result.state} />
                <DetailRow icon={Calendar} label="Submitted" value={formatDate(result.submittedAt)} />
                {result.decidedAt && (
                  <DetailRow
                    icon={Calendar}
                    label={result.status === 'Rejected' ? 'Decision Date' : 'Issued Date'}
                    value={formatDate(result.decidedAt)}
                  />
                )}
              </div>
              {result.status === 'Rejected' && result.rejectionReason && (
                <div className="border-t border-navy-100 bg-rose-50 px-6 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">
                    Reason for Rejection
                  </p>
                  <p className="mt-1 text-sm text-rose-800">{result.rejectionReason}</p>
                </div>
              )}
              {issuedCert && (
                <div className="flex items-center justify-between border-t border-navy-100 bg-emerald-50 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-emerald-800">
                      Certificate issued: <span className="font-mono font-bold">{issuedCert.id}</span>
                    </span>
                  </div>
                  <Link to="/verify" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                    Verify it
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            {result.status === 'Pending' && (
              <div className="card flex items-start gap-3 bg-gold-50 p-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-200 text-gold-700">
                  <Calendar className="h-4 w-4" />
                </div>
                <p className="text-sm text-gold-800">
                  Your application is under review. Please check back later for an update.
                </p>
              </div>
            )}
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
