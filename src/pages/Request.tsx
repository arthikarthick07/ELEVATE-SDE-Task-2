import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  FilePlus,
  CheckCircle2,
  ArrowRight,
  Copy,
  Search,
} from 'lucide-react';
import { PageContainer } from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { useApp } from '@/context/AppContext';
import type { Application, Gender } from '@/types';

const states = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Gujarat', 'Haryana',
  'Karnataka', 'Kerala', 'Maharashtra', 'Madhya Pradesh', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
];

const empty = {
  name: '',
  phone: '',
  gender: '' as Gender | '',
  city: '',
  state: '',
};

export default function Request() {
  const { submitApplication } = useApp();
  const [form, setForm] = useState({ ...empty });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Application | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Enter a valid name';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = 'Enter a 10-digit phone number';
    if (!form.gender) e.gender = 'Select a gender';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state) e.state = 'Select a state';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const app = submitApplication({
      name: form.name.trim(),
      phone: form.phone.trim(),
      gender: form.gender as Gender,
      city: form.city.trim(),
      state: form.state,
    });
    setSubmitted(app);
    setForm({ ...empty });
  };

  const copyId = () => {
    if (!submitted) return;
    navigator.clipboard?.writeText(submitted.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <PageContainer>
        <div className="mx-auto max-w-xl animate-scale-in">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-6 py-8 text-center text-white">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h2 className="mt-4 text-2xl font-bold">Application Submitted!</h2>
              <p className="mt-1 text-sm text-emerald-50">
                Your certificate request has been received.
              </p>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-sm text-navy-500">Your Application ID</p>
              <div className="mt-2 flex items-center gap-2 rounded-xl border-2 border-dashed border-navy-200 bg-navy-50 px-4 py-3">
                <span className="font-mono text-lg font-bold text-navy-900">
                  {submitted.id}
                </span>
                <button
                  onClick={copyId}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 shadow-sm transition-colors hover:bg-navy-100"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="mt-4 text-sm text-navy-500">
                Save this ID to track your application status. You can check its
                progress anytime on the Track page.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to="/track" className="btn-primary flex-1">
                  <Search className="h-4 w-4" />
                  Track Application
                </Link>
                <button
                  onClick={() => setSubmitted(null)}
                  className="btn-outline flex-1"
                >
                  <FilePlus className="h-4 w-4" />
                  Submit Another
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Citizen Services"
        title="Request a Certificate"
        description="Fill in the details below to submit a new certificate application. All fields are required."
        icon={<FilePlus className="h-6 w-6" />}
      />

      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="card p-6 sm:p-8" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-navy-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`input-field ${errors.name ? 'border-rose-400 focus:ring-rose-200' : ''}`}
                placeholder="e.g. Aarav Sharma"
              />
              {errors.name && <p className="mt-1.5 text-xs text-rose-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-navy-700">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`input-field ${errors.phone ? 'border-rose-400 focus:ring-rose-200' : ''}`}
                placeholder="10-digit number"
                maxLength={10}
              />
              {errors.phone && <p className="mt-1.5 text-xs text-rose-600">{errors.phone}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy-700">Gender</label>
              <div className="flex gap-2">
                {(['Male', 'Female', 'Other'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm({ ...form, gender: g })}
                    className={`flex-1 rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
                      form.gender === g
                        ? 'border-navy-700 bg-navy-700 text-white shadow-card'
                        : 'border-navy-200 bg-white text-navy-600 hover:border-navy-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {errors.gender && <p className="mt-1.5 text-xs text-rose-600">{errors.gender}</p>}
            </div>

            <div>
              <label htmlFor="city" className="mb-1.5 block text-sm font-semibold text-navy-700">
                City
              </label>
              <input
                id="city"
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={`input-field ${errors.city ? 'border-rose-400 focus:ring-rose-200' : ''}`}
                placeholder="e.g. Mumbai"
              />
              {errors.city && <p className="mt-1.5 text-xs text-rose-600">{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="state" className="mb-1.5 block text-sm font-semibold text-navy-700">
                State
              </label>
              <select
                id="state"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className={`input-field ${errors.state ? 'border-rose-400 focus:ring-rose-200' : ''}`}
              >
                <option value="">Select a state</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <p className="mt-1.5 text-xs text-rose-600">{errors.state}</p>}
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => { setForm({ ...empty }); setErrors({}); }}
              className="btn-outline"
            >
              Clear
            </button>
            <button type="submit" className="btn-primary">
              Submit Application
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
