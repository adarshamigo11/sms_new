// ─── Shared UI Components ────────────────────────────────────────────────────

export function StatCard({ title, value, change, changeType = 'up', icon, gradient, delay = 0 }) {
  return (
    <div className="glass p-5 overflow-hidden relative group cursor-pointer animate-fade-in"
      style={{ animationDelay: `${delay}s` }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-slate-400 text-xs font-medium truncate">{title}</p>
            <h3 className="text-2xl font-bold text-white mt-1 font-poppins truncate">{value}</h3>
          </div>
          <div className={`stat-icon bg-gradient-to-br ${gradient} ml-2 flex-shrink-0`} style={{opacity:0.85}}>
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-medium ${changeType === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            <span>{changeType === 'up' ? '↑' : '↓'}</span>
            <span className="truncate">{change}</span>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 w-full rounded-full" />
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 animate-fade-in">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white font-poppins">{title}</h2>
        {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function PrimaryBtn({ onClick, children, type = 'button', disabled = false, small = false }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-lg font-medium text-white flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap`}
      style={{ background: disabled ? '#334155' : 'linear-gradient(135deg,#3b82f6,#06b6d4)', boxShadow: disabled ? 'none' : '0 4px 16px rgba(59,130,246,0.2)' }}>
      {children}
    </button>
  );
}

export function SecondaryBtn({ onClick, children, small = false }) {
  return (
    <button onClick={onClick}
      className={`glass ${small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-lg font-medium text-slate-300 hover:text-white whitespace-nowrap`}>
      {children}
    </button>
  );
}

export function DangerBtn({ onClick, children, small = false }) {
  return (
    <button onClick={onClick}
      className={`${small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-lg font-medium text-red-400 hover:text-white whitespace-nowrap border border-red-500/30 hover:bg-red-500/20 transition-all`}>
      {children}
    </button>
  );
}

export function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ paddingLeft: '2rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', width: '220px' }} />
    </div>
  );
}

export function GlassCard({ children, className = '', padding = 'p-6', noHover = false }) {
  return (
    <div className={`${noHover ? 'glass-static' : 'glass'} ${padding} ${className}`}>
      {children}
    </div>
  );
}

export function Badge({ type = 'blue', children }) {
  return <span className={`badge badge-${type}`}>{children}</span>;
}

export function ProgressBar({ value, gradient = 'linear-gradient(135deg,#3b82f6,#06b6d4)' }) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${Math.min(value, 100)}%`, background: gradient }} />
    </div>
  );
}

export function EmptyState({ icon = '📭', title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <span className="text-5xl mb-3">{icon}</span>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
    </div>
  );
}

export function SectionTitle({ children }) {
  return <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">{children}</h3>;
}

export function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`glass-static w-full ${width} relative z-10 animate-scale-in overflow-hidden max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/40 flex-shrink-0">
          <h3 className="text-white font-semibold font-poppins">{title}</h3>
          <button onClick={onClose}
            className="text-slate-400 hover:text-white text-xl w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-700/40 transition-all">✕</button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function FormField({ label, required = false, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-slate-400 text-xs font-medium">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(148,163,184,0.1)' }}>
      {tabs.map(tab => (
        <button key={tab.key} onClick={() => onChange(tab.key)}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${active === tab.key ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          style={active === tab.key ? { background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' } : {}}>
          {tab.icon && <span className="mr-1">{tab.icon}</span>}{tab.label}
        </button>
      ))}
    </div>
  );
}

export function Avatar({ name, gradient = 'from-blue-500 to-cyan-500', size = 8, text = 'xs' }) {
  return (
    <div className={`w-${size} h-${size} rounded-xl flex items-center justify-center text-white text-${text} font-bold flex-shrink-0 bg-gradient-to-br ${gradient}`}>
      {name?.charAt(0) || '?'}
    </div>
  );
}

export function Toast({ message, type = 'success' }) {
  const colors = { success:'linear-gradient(135deg,#10b981,#059669)', error:'linear-gradient(135deg,#ef4444,#dc2626)', info:'linear-gradient(135deg,#3b82f6,#06b6d4)' };
  if (!message) return null;
  return (
    <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-glass animate-slide-in-up"
      style={{background:colors[type]}}>
      {message}
    </div>
  );
}
