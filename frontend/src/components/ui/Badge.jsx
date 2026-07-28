const TYPE_STYLES = {
  academic:   { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.25)', label: 'Academic' },
  hostel:     { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)', label: 'Hostel' },
  canteen:    { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)', label: 'Canteen' },
  gate:       { color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.25)', label: 'Gate' },
  sports:     { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)', label: 'Sports' },
  admin:      { color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.25)', label: 'User' },
  library:    { color: '#f472b6', bg: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.25)', label: 'Library' },
  recreation: { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)', border: 'rgba(34,211,238,0.25)', label: 'Recreation' },
  medical:    { color: '#fb7185', bg: 'rgba(251,113,133,0.12)', border: 'rgba(251,113,133,0.25)', label: 'Medical' },
  facility:   { color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)', border: 'rgba(45,212,191,0.25)', label: 'Facility' },
  other:      { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.25)', label: 'Other' },
};

export default function Badge({ type = 'other', label: customLabel, size = 'md' }) {
  const style = TYPE_STYLES[type] || TYPE_STYLES.other;
  const label = customLabel || style.label;

  const sizeClass = size === 'sm'
    ? 'text-[11px] px-2 py-0.5'
    : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border tracking-wide select-none ${sizeClass}`}
      style={{
        color: style.color,
        backgroundColor: style.bg,
        borderColor: style.border,
      }}
    >
      {label}
    </span>
  );
}

export { TYPE_STYLES };
