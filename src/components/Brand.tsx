import { ShieldCheck } from 'lucide-react';

interface BrandProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { icon: 'h-8 w-8', title: 'text-lg', sub: 'text-[10px]' },
  md: { icon: 'h-10 w-10', title: 'text-xl', sub: 'text-[11px]' },
  lg: { icon: 'h-12 w-12', title: 'text-2xl', sub: 'text-xs' },
};

export default function Brand({ variant = 'dark', size = 'md' }: BrandProps) {
  const s = sizeMap[size];
  const titleColor = variant === 'light' ? 'text-white' : 'text-navy-800';
  const subColor = variant === 'light' ? 'text-navy-200' : 'text-navy-400';

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 shadow-card">
        <ShieldCheck className="h-5 w-5 text-gold-400" />
      </div>
      <div className="leading-tight">
        <div className={`font-serif font-bold tracking-tight ${s.title} ${titleColor}`}>
          Cred<span className="text-gold-400">Vault</span>
        </div>
        <div className={`uppercase tracking-[0.18em] font-semibold ${s.sub} ${subColor}`}>
          Certificate Authority
        </div>
      </div>
    </div>
  );
}
