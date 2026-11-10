import { type ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy-700 text-gold-400 shadow-card">
            {icon}
          </div>
        )}
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm text-navy-500">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
