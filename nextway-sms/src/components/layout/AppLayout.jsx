import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = {
  admin: [
    { to:'/admin/dashboard',     icon:'📊', label:'Dashboard' },
    { to:'/admin/students',      icon:'🎓', label:'Students' },
    { to:'/admin/teachers',      icon:'👩‍🏫', label:'Teachers & Staff' },
    { to:'/admin/classes',       icon:'🏫', label:'Classes & Sections' },
    { to:'/admin/attendance',    icon:'📋', label:'Attendance' },
    { to:'/admin/timetable',     icon:'🗓️', label:'Timetable' },
    { to:'/admin/homework',      icon:'📝', label:'Homework' },
    { to:'/admin/exams',         icon:'📄', label:'Exams & Results' },
    { to:'/admin/fees',          icon:'💰', label:'Fee Management' },
    { to:'/admin/transport',     icon:'🚌', label:'Transport' },
    { to:'/admin/hostel',        icon:'🏠', label:'Hostel' },
    { to:'/admin/library',       icon:'📚', label:'Library' },
    { to:'/admin/inventory',     icon:'📦', label:'Inventory' },
    { to:'/admin/leaves',        icon:'🌴', label:'Leave Management' },
    { to:'/admin/communication', icon:'💬', label:'Communication' },
    { to:'/admin/events',        icon:'📅', label:'Events & Notices' },
    { to:'/admin/certificates',  icon:'🏆', label:'Certificates' },
    { to:'/admin/reports',       icon:'📈', label:'Reports' },
    { to:'/admin/settings',      icon:'⚙️', label:'Settings' },
    { to:'/admin/audit',         icon:'🔍', label:'Audit Logs' },
  ],
  teacher: [
    { to:'/teacher/dashboard',  icon:'📊', label:'Dashboard' },
    { to:'/teacher/classes',    icon:'🏫', label:'My Classes' },
    { to:'/teacher/attendance', icon:'📋', label:'Mark Attendance' },
    { to:'/teacher/homework',   icon:'📝', label:'Homework' },
    { to:'/teacher/results',    icon:'📄', label:'Results Entry' },
    { to:'/teacher/leaves',     icon:'🌴', label:'Leave Requests' },
    { to:'/teacher/timetable',  icon:'🗓️', label:'My Timetable' },
  ],
  student: [
    { to:'/student/dashboard',  icon:'📊', label:'Dashboard' },
    { to:'/student/attendance', icon:'📋', label:'My Attendance' },
    { to:'/student/results',    icon:'📄', label:'My Results' },
    { to:'/student/fees',       icon:'💰', label:'My Fees' },
    { to:'/student/homework',   icon:'📝', label:'Homework' },
    { to:'/student/timetable',  icon:'🗓️', label:'Timetable' },
    { to:'/student/ai-doubt',   icon:'🤖', label:'AI Doubt Solver' },
  ],
  parent: [
    { to:'/parent/dashboard',      icon:'📊', label:'Dashboard' },
    { to:'/parent/children',       icon:'🎓', label:'My Children' },
    { to:'/parent/fees',           icon:'💰', label:'Fee Details' },
    { to:'/parent/attendance',     icon:'📋', label:'Attendance' },
    { to:'/parent/results',        icon:'📄', label:'Results' },
    { to:'/parent/communication',  icon:'💬', label:'Messages' },
  ],
};

const ROLE_META = {
  admin:   { grad:'from-blue-500 to-cyan-500',     label:'School Admin',    accent:'59,130,246' },
  teacher: { grad:'from-emerald-500 to-teal-500',  label:'Teacher',         accent:'16,185,129' },
  student: { grad:'from-purple-500 to-violet-500', label:'Student',         accent:'139,92,246' },
  parent:  { grad:'from-amber-500 to-orange-500',  label:'Parent',          accent:'245,158,11' },
};

const NOTIFICATIONS = [
  { id:1, text:'Aarav Gupta submitted homework', time:'5m ago',  icon:'📝', unread:true  },
  { id:2, text:'Fee payment received - Sneha Patel', time:'1h ago', icon:'💰', unread:true  },
  { id:3, text:'Leave request from Priya Verma', time:'2h ago', icon:'🌴', unread:false },
  { id:4, text:'Unit Test 1 scheduled for May 5', time:'1d ago', icon:'📅', unread:false },
];

export default function AppLayout() {
  const { user, school, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [unreadCount]                   = useState(NOTIFICATIONS.filter(n=>n.unread).length);
  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  if (!user) return <Navigate to="/login" replace />;

  const role = user.role === 'school_admin' ? 'admin' : user.role;
  const links = NAV_LINKS[role] || [];
  const meta  = ROLE_META[role] || ROLE_META.admin;

  const handleLogout = () => { logout(); navigate('/login'); };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{background:'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'}}>

      {/* ── SIDEBAR ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out
          md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{width:'220px', background:'rgba(15,23,42,0.95)', backdropFilter:'blur(20px)', borderRight:'1px solid rgba(148,163,184,0.07)', flexShrink:0}}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 flex-shrink-0" style={{borderBottom:'1px solid rgba(148,163,184,0.07)'}}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br ${meta.grad} flex-shrink-0`}>N</div>
          <div className="overflow-hidden">
            <div className="text-white font-bold text-sm font-poppins truncate">NEXTWAY</div>
            <div className="text-slate-500 text-[10px] truncate">{school?.name}</div>
          </div>
        </div>

        {/* Role Badge */}
        <div className="px-4 py-2.5 flex-shrink-0">
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{background:`rgba(${meta.accent},0.15)`, color:`rgb(${meta.accent})`, border:`1px solid rgba(${meta.accent},0.25)`}}>
            {meta.label.toUpperCase()}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-1 space-y-0.5">
          {links.map(link => (
            <NavLink key={link.to} to={link.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}>
              <span className="text-[15px] flex-shrink-0">{link.icon}</span>
              <span className="truncate">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="flex-shrink-0 px-2.5 py-3" style={{borderTop:'1px solid rgba(148,163,184,0.07)'}}>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-700/30 transition-all group text-left">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br ${meta.grad} flex-shrink-0`}>
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">{user.name}</div>
              <div className="text-slate-500 text-[10px] group-hover:text-red-400 transition-colors">Sign out →</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 flex-shrink-0"
          style={{background:'rgba(15,23,42,0.8)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(148,163,184,0.07)'}}>

          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700/40 transition-all">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>

            <div>
              <h1 className="text-white font-semibold text-sm md:text-base font-poppins leading-tight">{school?.name}</h1>
              <p className="text-slate-500 text-[10px] hidden md:block">{school?.board} · {school?.city} · AY 2025–26</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2 rounded-lg hover:bg-slate-700/40 text-slate-400 hover:text-white transition-all">
                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-1 ring-slate-900"/>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 glass-static rounded-2xl overflow-hidden z-50 shadow-glass-lg animate-scale-in">
                  <div className="flex items-center justify-between px-4 py-3" style={{borderBottom:'1px solid rgba(148,163,184,0.1)'}}>
                    <span className="text-white text-sm font-semibold">Notifications</span>
                    <span className="badge badge-blue">{unreadCount} new</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {NOTIFICATIONS.map(n=>(
                      <div key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-800/40 transition-colors cursor-pointer ${n.unread?'bg-blue-500/5':''}`}
                        style={{borderBottom:'1px solid rgba(148,163,184,0.05)'}}>
                        <span className="text-lg flex-shrink-0 mt-0.5">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${n.unread?'text-white font-medium':'text-slate-400'}`}>{n.text}</p>
                          <p className="text-slate-600 text-[10px] mt-0.5">{n.time}</p>
                        </div>
                        {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5"/>}
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 text-center" style={{borderTop:'1px solid rgba(148,163,184,0.08)'}}>
                    <button className="text-blue-400 hover:text-blue-300 text-xs transition-colors">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br ${meta.grad} ring-2 ring-transparent hover:ring-blue-500/50 transition-all`}>
                {user.avatar}
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-11 w-52 glass-static rounded-2xl overflow-hidden z-50 shadow-glass-lg animate-scale-in">
                  <div className="px-4 py-3" style={{borderBottom:'1px solid rgba(148,163,184,0.1)'}}>
                    <p className="text-white text-sm font-semibold">{user.name}</p>
                    <p className="text-slate-400 text-xs truncate">{user.email}</p>
                    <span className="text-[10px] mt-1 inline-block px-2 py-0.5 rounded-full"
                      style={{background:`rgba(${meta.accent},0.15)`,color:`rgb(${meta.accent})`}}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="p-1.5">
                    <button className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-700/40 rounded-lg transition-all">⚙️ Account Settings</button>
                    <button className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-700/40 rounded-lg transition-all">🔑 Change Password</button>
                    <button onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all mt-0.5">
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
