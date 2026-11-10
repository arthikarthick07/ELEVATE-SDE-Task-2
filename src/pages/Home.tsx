import { Link } from 'react-router-dom';
import {
  FilePlus,
  Search,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock as LockIcon,
} from 'lucide-react';

const actions = [
  {
    to: '/request',
    label: 'Request a Certificate',
    description: 'Submit a new certificate application with your details.',
    icon: FilePlus,
  },
  {
    to: '/track',
    label: 'Track Application',
    description: 'Check the status of your submitted application.',
    icon: Search,
  },
  {
    to: '/verify',
    label: 'Verify Certificate',
    description: 'Confirm the authenticity of an issued certificate.',
    icon: ShieldCheck,
  },
];

const features = [
  {
    icon: CheckCircle2,
    title: 'Trusted & Secure',
    text: 'Every certificate is issued with a unique ID and can be independently verified.',
  },
  {
    icon: Clock,
    title: 'Fast Processing',
    text: 'Applications are reviewed promptly. Track progress in real time.',
  },
  {
    icon: LockIcon,
    title: 'Revocation Protection',
    text: 'Revoked certificates are clearly flagged during verification.',
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, #e4b432 0, transparent 40%), radial-gradient(circle at 80% 80%, #4a6fb0 0, transparent 45%)'
        }} />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-3xl animate-fade-in">
            <span className="badge bg-white/10 text-gold-300 backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Official Certificate Authority
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Issue and verify certificates with{' '}
              <span className="text-gold-400">complete confidence</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-navy-200">
              CredVault is a modern platform for requesting, tracking, and
              verifying digital certificates. Every record carries a unique ID
              for transparent, tamper-evident validation.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/request" className="btn-gold">
                <FilePlus className="h-5 w-5" />
                Request a Certificate
              </Link>
              <Link to="/verify" className="btn-outline border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10">
                <ShieldCheck className="h-5 w-5" />
                Verify a Certificate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Three action cards */}
      <section className="mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-3">
          {actions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-50 text-navy-700 transition-colors group-hover:bg-navy-700 group-hover:text-gold-400">
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy-900">{action.label}</h3>
              <p className="mt-1.5 text-sm text-navy-500">{action.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-700 transition-colors group-hover:text-gold-600">
                Get started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            Why CredVault
          </p>
          <h2 className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">
            A platform built on trust and transparency
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-600">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-navy-900">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-navy-500">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Admin CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
          <div className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-700 text-gold-400">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-900">Administration Portal</h3>
                <p className="text-sm text-navy-500">
                  Review applications, issue certificates, and manage revocations.
                </p>
              </div>
            </div>
            <Link to="/admin/login" className="btn-primary shrink-0">
              <Lock className="h-4 w-4" />
              Admin Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
