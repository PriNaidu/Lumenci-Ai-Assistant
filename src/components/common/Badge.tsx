import { clsx } from 'clsx';

interface BadgeProps {
  variant: 'warning' | 'success' | 'error' | 'info';
  children: React.ReactNode;
}

const variants = {
  warning: 'bg-amber-100 text-amber-800',
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
