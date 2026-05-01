import { useState } from 'react';
import { PageHeader, GlassCard, SectionTitle, StatCard } from '../../components/ui';
import { ATTENDANCE_DATA, STUDENTS, MONTHLY_ATTENDANCE } from '../../data/mockData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const TODAY_STUDENTS = STUDENTS.map(s => ({
  ...s, todayStatus: Math.random() > 0.15 ? 'present' : Math.random() > 0.5 ? 'absent' : 'late'
}));

const STATUS_COLOR = { present: 'green', absent: 'red', late: 'yellow' };

export default function Attendance() {
  const [selectedClass, setSelectedClass] = useState('Class 8A');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [view, setView] = useState('mark');

  const classStudents = TODAY_STUDENTS.slice(0, 8);
  const presentCount = classStudents.filter(s => s.todayStatus === 'present').length;
  const absentCount = classStudents.filter(s => s.todayStatus === 'absent').length;

  return (
    <div className="space-y-5">
      <PageHeader title="Attendance Management" subtitle="Mark and track student attendance"
        actions={
          <div className="flex gap-2">
            <button onClick={() => setView('mark')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view==='mark'?'text-white':'text-slate-400 glass'}`}
              style={view==='mark'?{background:'linear-gradient(135deg,#3b82f6,#06b6d4)'}:{}}>Mark Attendance</button>
            <button onClick={() => setView('reports')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view==='reports'?'text-white':'text-slate-400 glass'}`}
              style={view==='reports'?{background:'linear-gradient(135deg,#3b82f6,#06b6d4)'}:{}}>Reports</button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today Present" value={`${presentCount}`} change={`${Math.round(presentCount/classStudents.length*100)}%`} icon="✅" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Today Absent" value={`${absentCount}`} changeType="down" change="students" icon="❌" gradient="from-red-500 to-rose-500" />
        <StatCard title="Monthly Avg" value="92.5%" change="+1.2% vs last month" icon="📊" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="On Leave" value="8" change="approved leaves" icon="🌴" gradient="from-purple-500 to-violet-500" />
      </div>

      {view === 'mark' ? (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {/* Controls */}
            <GlassCard noHover padding="p-4">
              <div className="flex flex-wrap gap-3 items-center">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Date</label>
                  <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:'auto',paddingTop:'0.4rem',paddingBottom:'0.4rem'}}/>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Class</label>
                  <select value={selectedClass} onChange={e=>setSelectedClass(e.target.value)} style={{width:'auto',paddingTop:'0.4rem',paddingBottom:'0.4rem'}}>
                    {['Class 6A','Class 7A','Class 8A','Class 8B','Class 9A','Class 10A'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <button className="mt-4 px-4 py-2 rounded-lg text-sm text-white font-medium" style={{background:'linear-gradient(135deg,#3b82f6,#06b6d4)'}}>
                  💾 Save Attendance
                </button>
                <div className="flex gap-2 ml-auto">
                  {['All Present','All Absent'].map(lbl=>(
                    <button key={lbl} className="glass px-3 py-2 text-xs text-slate-300 hover:text-white rounded-lg">{lbl}</button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Student list */}
            <GlassCard noHover padding="p-0" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead><tr><th>#</th><th>Student Name</th><th>Roll No</th><th>Status</th><th>Remarks</th></tr></thead>
                  <tbody>
                    {classStudents.map((s,i)=>(
                      <tr key={s.id}>
                        <td className="text-slate-500">{i+1}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{background:'linear-gradient(135deg,#3b82f6,#06b6d4)'}}>{s.name.charAt(0)}</div>
                            <span className="text-white text-sm">{s.name}</span>
                          </div>
                        </td>
                        <td className="text-slate-400 text-xs">0{i+1}</td>
                        <td>
                          <div className="flex gap-1">
                            {['present','absent','late'].map(st=>(
                              <button key={st}
                                className={`px-2 py-1 rounded-lg text-[10px] font-semibold capitalize transition-all ${s.todayStatus===st?'text-white':'text-slate-500 hover:text-slate-300'}`}
                                style={s.todayStatus===st?{background:st==='present'?'rgba(16,185,129,0.2)':st==='absent'?'rgba(239,68,68,0.2)':'rgba(245,158,11,0.2)',border:`1px solid ${st==='present'?'#10b981':st==='absent'?'#ef4444':'#f59e0b'}`}:{}}>
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td><input placeholder="Optional..." style={{padding:'0.25rem 0.5rem',fontSize:'0.7rem',width:'120px'}}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          {/* Summary panel */}
          <div className="space-y-4">
            <GlassCard noHover>
              <SectionTitle>Today's Summary</SectionTitle>
              <div className="space-y-3">
                {[{label:'Total Students',value:classStudents.length,color:'#94a3b8'},
                  {label:'Present',value:presentCount,color:'#10b981'},
                  {label:'Absent',value:absentCount,color:'#ef4444'},
                  {label:'Late',value:1,color:'#f59e0b'},
                  {label:'On Leave',value:1,color:'#8b5cf6'},
                ].map(r=>(
                  <div key={r.label} className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">{r.label}</span>
                    <span className="font-bold text-base" style={{color:r.color}}>{r.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-700/40">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Percentage</span>
                    <span className="text-emerald-400 font-bold">{Math.round(presentCount/classStudents.length*100)}%</span>
                  </div>
                </div>
              </div>
            </GlassCard>
            <GlassCard noHover>
              <SectionTitle>Weekly Trend</SectionTitle>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={ATTENDANCE_DATA}>
                  <XAxis dataKey="day" stroke="#475569" tick={{fill:'#94a3b8',fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis domain={[80,100]} stroke="#475569" tick={{fill:'#94a3b8',fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{background:'#1e293b',border:'1px solid rgba(148,163,184,0.1)',borderRadius:8,fontSize:11}}/>
                  <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={2} dot={{fill:'#3b82f6',r:3}} activeDot={{r:5}}/>
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          <GlassCard noHover>
            <SectionTitle>Monthly Attendance %</SectionTitle>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_ATTENDANCE} barSize={32}>
                <XAxis dataKey="month" stroke="#475569" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis domain={[80,100]} stroke="#475569" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:'#1e293b',border:'1px solid rgba(148,163,184,0.1)',borderRadius:8,fontSize:11}}/>
                <Bar dataKey="percentage" fill="url(#attGrad)" radius={[6,6,0,0]}/>
                <defs><linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient></defs>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
          <GlassCard noHover>
            <SectionTitle>Chronic Absentees (Below 75%)</SectionTitle>
            <div className="space-y-2">
              {STUDENTS.filter(s=>s.attendance<80).map(s=>(
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl" style={{background:'rgba(239,68,68,0.07)'}}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{background:'rgba(239,68,68,0.3)'}}>{s.name.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{s.name}</p>
                    <p className="text-slate-500 text-xs">{s.class} {s.section}</p>
                  </div>
                  <span className="text-red-400 font-bold text-sm">{s.attendance}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
