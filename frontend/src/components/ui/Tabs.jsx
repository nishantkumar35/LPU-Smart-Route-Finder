export default function Tabs({ tabs = [], activeTab, onChange, className = '' }) {
  return (
    <div className={`flex border-b border-dark-700/80 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 -mb-px transition-all duration-150 select-none whitespace-nowrap ${
              isActive
                ? 'border-brand-500 text-slate-100'
                : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-dark-600'
            }`}
          >
            {Icon && (
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-brand-400' : 'text-slate-600'}`} />
            )}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${
                isActive
                  ? 'bg-brand-500/15 text-brand-400'
                  : 'bg-dark-700 text-slate-600'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
