import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="ui-label">{label}</label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon className="absolute left-3.5 w-4 h-4 text-slate-600 pointer-events-none" />
        )}
        <input
          ref={ref}
          className={`ui-input ${Icon ? 'pl-10' : ''} ${error ? 'border-rose-500/70 focus:ring-rose-500/20 focus:border-rose-500/70' : ''} ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-rose-400">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-600">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
