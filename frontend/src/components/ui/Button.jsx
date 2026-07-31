import { forwardRef } from 'react';

const VARIANTS = {
  primary:   'bg-brand-500 hover:bg-brand-400 active:bg-brand-600 text-white font-semibold shadow-glow-amber/50 hover:shadow-glow-amber',
  secondary: 'bg-dark-750/80 hover:bg-dark-700 text-slate-200 border border-dark-600 hover:border-dark-500',
  ghost:     'bg-transparent hover:bg-dark-750/60 text-slate-400 hover:text-slate-200',
  danger:    'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 hover:border-rose-500/40',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-5 py-3 text-sm rounded-xl gap-2.5',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}, ref) => {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-1 focus:ring-offset-dark-900 disabled:opacity-40 disabled:cursor-not-allowed select-none';

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${base} ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? SIZES.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children && <span>{children}</span>}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
