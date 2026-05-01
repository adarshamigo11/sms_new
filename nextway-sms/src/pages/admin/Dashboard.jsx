import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard, PageHeader, GlassCard, SectionTitle, Badge, PrimaryBtn } from '../../components/ui';
import { STUDENTS, ATTENDANCE_DATA, FEE_COLLECTION_DATA, NOTICES, HOMEWORK } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const PIE_DATA  = [{ name:'Present', value:185 }, { name:'Absent', value:15 }];
const PIE_COLORS = ['#3b82f6','#ef4444'];

const TIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-static px-3 py-2 text-xs rounded-xl">
      {label && <p className="text-slate-400 mb-1 font-medium">{label}</p>}
      {payload.map((p,i)=>(
        <p key={i} style={{color:p.color||'#94a3b8'}}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

const QUICK_ACTIONS = [
  { icon:'➕', label:'Add Student',  color:'rgba(59,130,246,0.15)'  },
  { icon:'📋', label:'Attendance',   color:'rgba(16,185,129,0.15)' },
  { icon:'💳', label:'Collect Fee',  color:'rgba(245,158,11,0.15)' },
  { icon:'📢', label:'Notice',       color:'rgba(139,92,246,0.15)' },
  { icon:'🗓️', label:'Timetable',   color:'rgba(236,72,153,0.15)' },
  { icon:'📄', label:'Report',       color:'rgba(6,182,212,0.15)'  },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeAction, setActiveAction] = useState(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, ${user.name.split(' ')[0]} 👋`}
        subtitle="Here's what's happening at NEXTWAY Academy today."
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value="200"  change="+12 this month"      changeType="up"   icon="🎓" gradient="from-blue-500 to-cyan-500"    delay={0}  />
        <StatCard title="Teachers & Staff" value="25" change="+2 this session"     changeType="up"   icon="👩‍🏫" gradient="from-emerald-500 to-teal-500" delay={0.1}/>
        <StatCard title="Attendance Today" value="92.5%" change="+1.5% vs yesterday" changeType="up" icon="📋" gradient="from-purple-500 to-violet-500" delay={0.2}/>
        <StatCard title="Fee Collected"  value="₹3.2L"  change="April 2026"         icon="💰"       gradient="from-amber-500 to-orange-500"   delay={0.3}/>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Attendance Bar */}
        <GlassCard className="lg:col-span-2" noHover>
          <SectionTitle>Weekly Attendance (%)</SectionTitle>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={ATTENDANCE_DATA} barSize={30}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#475569" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis domain={[80,100]} stroke="#475569" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<TIP/>}/>
              <Bar dataKey="percentage" name="Attendance %" fill="url(#barGrad)" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Today's Pie */}
        <GlassCard noHover>
          <SectionTitle>Today's Overview</SectionTitle>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={38} outerRadius={55} paddingAngle={3} dataKey="value">
                {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]}/>)}
              </Pie>
              <Tooltip content={<TIP/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-5 mt-1 mb-3">
            {PIE_DATA.map((d,i)=>(
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{background:PIE_COLORS[i]}}/>
                <span className="text-slate-400 text-xs">{d.name}: <strong className="text-white">{d.value}</strong></span>
              </div>
            ))}
          </div>
          <div className="space-y-1.5 pt-2 border-t border-slate-700/40">
            {[
              {l:'Classes at 100%', v:'4', c:'text-emerald-400'},
              {l:'Students on Leave', v:'8', c:'text-yellow-400'},
              {l:'Late Arrivals', v:'3', c:'text-blue-400'},
              {l:'Absent Teachers', v:'1', c:'text-red-400'},
            ].map(r=>(
              <div key={r.l} className="flex justify-between text-xs">
                <span className="text-slate-400">{r.l}</span>
                <span className={`font-bold ${r.c}`}>{r.v}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Fee + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2" noHover>
          <SectionTitle>Monthly Fee Collection (₹)</SectionTitle>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={FEE_COLLECTION_DATA} barSize={22} barGap={4}>
              <XAxis dataKey="month" stroke="#475569" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis stroke="#475569" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`}/>
              <Tooltip content={<TIP/>}/>
              <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4,4,0,0]}/>
              <Bar dataKey="pending"   name="Pending"   fill="#f59e0b" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-5 mt-2">
            {[{c:'#10b981',l:'Collected'},{c:'#f59e0b',l:'Pending'}].map(x=>(
              <div key={x.l} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{background:x.c}}/>
                <span className="text-slate-400 text-xs">{x.l}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard noHover>
          <SectionTitle>Quick Actions</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((a,i)=>(
              <button key={i} onClick={() => setActiveAction(a.label)}
                className={`flex flex-col items-center justify-center py-4 rounded-xl transition-all duration-200 group hover:scale-105 ${activeAction===a.label?'ring-1 ring-blue-500':''}`}
                style={{background: activeAction===a.label ? 'rgba(59,130,246,0.15)' : a.color}}>
                <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">{a.icon}</span>
                <span className="text-xs font-medium text-slate-300 group-hover:text-white">{a.label}</span>
              </button>
            ))}
          </div>
          {activeAction && (
            <div className="mt-3 p-2.5 rounded-xl text-xs text-center" style={{background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)'}}>
              <span className="text-blue-400">"{activeAction}" — navigate to the full page from sidebar</span>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Notices + Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard noHover>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle>Recent Notices</SectionTitle>
            <button className="text-blue-400 hover:text-blue-300 text-xs">View all →</button>
          </div>
          <div className="space-y-2">
            {NOTICES.map((n,i)=>(
              <div key={n.id}
                className={`flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/30 transition-all cursor-pointer animate-slide-in-up delay-${(i+1)*100}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{background: n.priority==='high' ? 'rgba(239,68,68,0.15)':'rgba(59,130,246,0.15)'}}>
                  📢
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{n.title}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{n.date} · For: {n.target}</p>
                </div>
                <Badge type={n.priority==='high'?'red':'blue'}>{n.priority}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard noHover>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle>Active Assignments</SectionTitle>
            <button className="text-blue-400 hover:text-blue-300 text-xs">View all →</button>
          </div>
          <div className="space-y-2">
            {HOMEWORK.map((h,i)=>(
              <div key={h.id}
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/30 transition-all cursor-pointer animate-slide-in-up delay-${(i+1)*100}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{background:'linear-gradient(135deg,#8b5cf6,#6d28d9)'}}>
                  {h.subject.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{h.title}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{h.class} · Due {h.dueDate}</p>
                  <div className="mt-1.5 progress-bar" style={{height:'3px'}}>
                    <div className="progress-fill" style={{width:`${Math.round(h.submissions/h.total*100)}%`,background:'linear-gradient(135deg,#8b5cf6,#6d28d9)'}}/>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white text-xs font-bold">{h.submissions}/{h.total}</p>
                  <p className="text-slate-500 text-[10px]">submitted</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Bottom metrics strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {l:'Active Classes Today', v:'14 / 16', icon:'🏫', c:'#3b82f6'},
          {l:'Homework Due Today',   v:'3 pending', icon:'📝', c:'#f59e0b'},
          {l:'Library Books Out',    v:'7 issued', icon:'📚', c:'#8b5cf6'},
          {l:'Transport Active',     v:'3 routes', icon:'🚌', c:'#10b981'},
        ].map((m,i)=>(
          <div key={i} className="glass p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{background:`${m.c}20`}}>
              {m.icon}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{m.v}</p>
              <p className="text-slate-500 text-[10px]">{m.l}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
