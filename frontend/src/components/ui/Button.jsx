import { forwardRef } from 'react';

const VARIANTS = {
  primary:   'bg-brand-600 hover:bg-brand-500 text-white shadow-sm border border-brand-500/30 focus:ring-brand-500/50',
  secondary: 'bg-dark-800 hover:bg-dark-750 text-slate-200 border border-slate-800 focus:ring-slate-700',
  ghost:     'bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 focus:ring-slate-700',
  danger:    'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 focus:ring-rose-500/40',
};

const SIZES = {
  sm: 'px-2.5 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-3.5 py-2 text-sm rounded-lg gap-2',
  lg: 'px-4 py-2.5 text-sm font-medium rounded-lg gap-2.5',
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
  const baseClass = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
