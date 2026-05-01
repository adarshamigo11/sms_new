import { useState } from 'react';
import { PageHeader, StatCard, GlassCard, SectionTitle, Badge, PrimaryBtn, SecondaryBtn, Modal, FormField } from '../../components/ui';
import { STUDENTS, HOMEWORK, TIMETABLE } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { downloadCSV } from '../../utils/download';

function useToast() {
  const [msg, setMsg] = useState('');
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };
  const Toast = () => msg ? <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-glass animate-slide-in-up" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>{msg}</div> : null;
  return { show, Toast };
}

export function TeacherDashboard() {
  const { user } = useAuth();
  const { show, Toast } = useToast();
  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title={`Hello, ${user.name} 👋`} subtitle="Class 8A Math & 9B Math · Today's overview" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Classes" value="4" icon="🏫" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Students" value="96" icon="🎓" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Today's Periods" value="6" icon="📅" gradient="from-purple-500 to-violet-500" />
        <StatCard title="Pending Grading" value="3" changeType="down" icon="📝" gradient="from-amber-500 to-orange-500" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <GlassCard noHover>
          <SectionTitle>Today's Classes</SectionTitle>
          <div className="space-y-2">
            {[{ time: '8:00 AM', cls: 'Class 8A', sub: 'Mathematics', room: 'Room 12', done: false }, { time: '10:00 AM', cls: 'Class 9B', sub: 'Mathematics', room: 'Room 8', done: false }, { time: '12:30 PM', cls: 'Class 7A', sub: 'Mathematics', room: 'Room 5', done: true }].map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.4)' }}>
                <div className="text-right w-16 flex-shrink-0"><p className="text-white text-xs font-semibold">{c.time}</p></div>
                <div className="w-px h-8 bg-slate-700" />
                <div className="flex-1"><p className="text-white text-sm font-medium">{c.cls} — {c.sub}</p><p className="text-slate-500 text-xs">{c.room}</p></div>
                <Badge type={c.done ? 'green' : 'blue'}>{c.done ? 'done' : 'upcoming'}</Badge>
                {!c.done && <PrimaryBtn small onClick={() => show(`📋 Marking attendance for ${c.cls}...`)}>Mark Attend.</PrimaryBtn>}
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard noHover>
          <SectionTitle>Pending Tasks</SectionTitle>
          <div className="space-y-2">
            {[{ title: 'Grade Class 8A Homework', sub: 'Chapter 5 Exercise', due: 'Today', urgent: true }, { title: 'Enter Unit Test marks', sub: 'Class 9B Mathematics', due: 'Apr 30', urgent: false }, { title: 'Submit attendance report', sub: 'Week of Apr 21', due: 'Today', urgent: true }].map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: t.urgent ? 'rgba(239,68,68,0.07)' : 'rgba(30,41,59,0.4)' }}>
                <span className="text-lg mt-0.5">{t.urgent ? '🔴' : '🟡'}</span>
                <div className="flex-1"><p className="text-white text-sm font-medium">{t.title}</p><p className="text-slate-500 text-xs">{t.sub} · Due: {t.due}</p></div>
                <PrimaryBtn small onClick={() => show(`✅ Opening: ${t.title}`)}>Open</PrimaryBtn>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export function TeacherClasses() {
  const { show, Toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('Class 8A');
  const [viewStu, setViewStu] = useState(null);
  const classStu = STUDENTS.filter(s => s.class === 'Class 8' && s.section === 'A').concat(STUDENTS.slice(0, 4));

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="My Classes" subtitle="Students in your assigned classes"
        actions={<SecondaryBtn onClick={() => { downloadCSV(`${selectedClass}-students.csv`, ['Name', 'Roll', 'Attendance%', 'Fee Status'], classStu.map(s => [s.name, s.rollNo, s.attendance, s.fees])); show('⬇️ Exported!'); }}>⬇️ Export</SecondaryBtn>} />
      <div className="flex gap-2 flex-wrap">
        {['Class 8A', 'Class 9B', 'Class 7A', 'Class 10A'].map(c => (
          <button key={c} onClick={() => setSelectedClass(c)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedClass === c ? 'text-white' : 'text-slate-400 glass'}`}
            style={selectedClass === c ? { background: 'linear-gradient(135deg,#10b981,#059669)' } : {}}>
            {c}
          </button>
        ))}
      </div>
      <div className="glass-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Student</th><th>Roll No</th><th>Attendance %</th><th>Last Marks</th><th>HW Status</th><th>Actions</th></tr></thead>
            <tbody>
              {classStu.map((s, i) => (
                <tr key={i}>
                  <td><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>{s.name.charAt(0)}</div><span className="text-white text-sm">{s.name}</span></div></td>
                  <td className="text-slate-400">{s.rollNo}</td>
                  <td><div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${s.attendance}%`, background: s.attendance >= 90 ? '#10b981' : s.attendance >= 75 ? '#f59e0b' : '#ef4444' }} /></div><span className="text-xs text-slate-400">{s.attendance}%</span></div></td>
                  <td><span className="text-emerald-400 font-medium">{70 + Math.floor(Math.random() * 25)}%</span></td>
                  <td><Badge type={Math.random() > 0.3 ? 'green' : 'yellow'}>{Math.random() > 0.3 ? 'Submitted' : 'Pending'}</Badge></td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => setViewStu(s)} className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded-lg hover:bg-blue-500/10">View</button>
                      <button onClick={() => show(`📝 Adding remark for ${s.name}...`)} className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-slate-700/30">Remark</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!viewStu} onClose={() => setViewStu(null)} title="Student Detail" width="max-w-md">
        {viewStu && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>{viewStu.name.charAt(0)}</div>
              <div><h3 className="text-white font-bold text-lg">{viewStu.name}</h3><p className="text-slate-400 text-sm">{viewStu.class} · Roll {viewStu.rollNo}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[['Attendance', `${viewStu.attendance}%`], ['Fee Status', viewStu.fees], ['Gender', viewStu.gender], ['Phone', viewStu.phone]].map(([l, v]) => (
                <div key={l} className="p-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.5)' }}><p className="text-slate-500 text-[10px] uppercase">{l}</p><p className="text-white text-sm font-medium">{v}</p></div>
              ))}
            </div>
            <div className="flex gap-2">
              <PrimaryBtn small onClick={() => { setViewStu(null); show('📝 Adding remark...'); }}>Add Remark</PrimaryBtn>
              <PrimaryBtn small onClick={() => { setViewStu(null); show('📊 Opening results...'); }}>View Results</PrimaryBtn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export function TeacherAttendance() {
  const { show, Toast } = useToast();
  const [attendance, setAttendance] = useState(STUDENTS.slice(0, 8).map(s => ({ ...s, status: 'present' })));
  const [saved, setSaved] = useState(false);

  const toggle = (id, status) => setAttendance(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  const markAll = (status) => setAttendance(prev => prev.map(s => ({ ...s, status })));

  const save = () => {
    setSaved(true);
    show(`✅ Attendance saved! ${attendance.filter(s => s.status === 'present').length} present, ${attendance.filter(s => s.status === 'absent').length} absent`);
    downloadCSV('attendance.csv', ['Student', 'Roll', 'Status'], attendance.map(s => [s.name, s.rollNo, s.status]));
  };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Mark Attendance" subtitle="Record today's class attendance" />
      <GlassCard noHover padding="p-4">
        <div className="flex flex-wrap gap-3 items-end justify-between">
          <div className="flex gap-3 flex-wrap">
            <div><label className="text-xs text-slate-400 block mb-1">Date</label><input type="date" defaultValue={new Date().toISOString().split('T')[0]} style={{ width: 'auto', paddingTop: '0.4rem', paddingBottom: '0.4rem' }} /></div>
            <div><label className="text-xs text-slate-400 block mb-1">Class</label><select style={{ width: 'auto', paddingTop: '0.4rem', paddingBottom: '0.4rem' }}><option>Class 8A</option><option>Class 9B</option></select></div>
          </div>
          <div className="flex gap-2">
            <SecondaryBtn onClick={() => markAll('present')}>All Present</SecondaryBtn>
            <SecondaryBtn onClick={() => markAll('absent')}>All Absent</SecondaryBtn>
            <PrimaryBtn onClick={save} disabled={saved}>{saved ? '✓ Saved' : '💾 Save Attendance'}</PrimaryBtn>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {attendance.map((s) => (
          <div key={s.id} className="glass p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: s.status === 'present' ? 'linear-gradient(135deg,#10b981,#059669)' : s.status === 'absent' ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#f59e0b,#d97706)' }}>{s.name.charAt(0)}</div>
            <div className="flex-1"><p className="text-white text-sm font-medium">{s.name}</p><p className="text-slate-500 text-xs">Roll {s.rollNo}</p></div>
            <div className="flex gap-1">
              {['present', 'absent', 'late'].map(st => (
                <button key={st} onClick={() => toggle(s.id, st)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold capitalize transition-all ${s.status === st ? 'text-white' : 'text-slate-500 hover:text-slate-300 glass'}`}
                  style={s.status === st ? { background: st === 'present' ? 'rgba(16,185,129,0.25)' : st === 'absent' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)', border: `1px solid ${st === 'present' ? '#10b981' : st === 'absent' ? '#ef4444' : '#f59e0b'}` } : {}}>
                  {st}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[{ label: 'Present', value: attendance.filter(s => s.status === 'present').length, color: '#10b981' }, { label: 'Absent', value: attendance.filter(s => s.status === 'absent').length, color: '#ef4444' }, { label: 'Late', value: attendance.filter(s => s.status === 'late').length, color: '#f59e0b' }].map(r => (
          <div key={r.label} className="glass-static p-4 text-center">
            <p className="text-2xl font-bold font-poppins" style={{ color: r.color }}>{r.value}</p>
            <p className="text-slate-400 text-xs mt-0.5">{r.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TeacherHomework() {
  const { show, Toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const STATUS_COLOR = { active: 'blue', due_today: 'yellow', overdue: 'red' };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Homework" subtitle="Create and grade assignments"
        actions={<PrimaryBtn onClick={() => setCreateOpen(true)}>➕ Create Assignment</PrimaryBtn>} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HOMEWORK.map((h, i) => (
          <div key={h.id} className={`glass p-5 animate-fade-in delay-${i * 100}`}>
            <div className="flex justify-between items-start mb-2">
              <div><p className="text-white font-semibold text-sm">{h.title}</p><p className="text-slate-400 text-xs">{h.subject} · {h.class} · Due: {h.dueDate}</p></div>
              <Badge type={STATUS_COLOR[h.status] || 'blue'}>{h.status.replace('_', ' ')}</Badge>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Submissions</span><span className="text-white">{h.submissions}/{h.total}</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.round(h.submissions / h.total * 100)}%`, background: 'linear-gradient(135deg,#10b981,#059669)' }} /></div>
            </div>
            <div className="flex gap-2">
              <PrimaryBtn small onClick={() => show(`📋 Viewing ${h.submissions} submissions for: ${h.title}`)}>📋 View</PrimaryBtn>
              <PrimaryBtn small onClick={() => show(`✏️ Grading: ${h.title}`)}>✏️ Grade All</PrimaryBtn>
              <SecondaryBtn small onClick={() => { downloadCSV(`${h.subject}-hw.csv`, ['Student', 'Submitted', 'Marks'], STUDENTS.slice(0, h.submissions).map(s => [s.name, 'Yes', Math.floor(6 + Math.random() * 4)])); show('⬇️ Exported!'); }}>⬇️</SecondaryBtn>
            </div>
          </div>
        ))}
      </div>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Assignment" width="max-w-lg">
        <div className="space-y-3">
          <FormField label="Title" required><input placeholder="e.g. Algebra Practice Set 4" /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Class"><select><option>Class 8A</option><option>Class 9B</option><option>Class 7A</option></select></FormField>
            <FormField label="Due Date"><input type="date" /></FormField>
            <FormField label="Max Marks"><input type="number" defaultValue="10" /></FormField>
          </div>
          <FormField label="Instructions"><textarea rows={3} placeholder="Instructions for students..." /></FormField>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
            <SecondaryBtn onClick={() => setCreateOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={() => { setCreateOpen(false); show('✅ Assignment created and assigned!'); }}>Create</PrimaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function TeacherResults() {
  const { show, Toast } = useToast();
  const [marks, setMarks] = useState(STUDENTS.slice(0, 8).map(s => ({ ...s, obtained: Math.floor(60 + Math.random() * 38) })));
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Results Entry" subtitle="Enter marks for your assigned exams" />
      <GlassCard noHover padding="p-4">
        <div className="flex flex-wrap gap-3">
          <div><label className="text-xs text-slate-400 block mb-1">Exam</label><select style={{ width: 'auto', paddingTop: '0.4rem', paddingBottom: '0.4rem' }}><option>Final Exam 2025-26</option><option>Unit Test 3</option></select></div>
          <div><label className="text-xs text-slate-400 block mb-1">Subject</label><select style={{ width: 'auto', paddingTop: '0.4rem', paddingBottom: '0.4rem' }}><option>Mathematics</option></select></div>
          <div><label className="text-xs text-slate-400 block mb-1">Class</label><select style={{ width: 'auto', paddingTop: '0.4rem', paddingBottom: '0.4rem' }}><option>Class 8A</option><option>Class 9B</option></select></div>
        </div>
      </GlassCard>
      <div className="glass-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Roll</th><th>Student Name</th><th>Max Marks</th><th>Obtained</th><th>Grade</th></tr></thead>
            <tbody>
              {marks.map((s, i) => {
                const g = s.obtained >= 90 ? 'A+' : s.obtained >= 80 ? 'A' : s.obtained >= 70 ? 'B+' : s.obtained >= 60 ? 'B' : 'C';
                return (
                  <tr key={i}>
                    <td className="text-slate-400">{i + 1}</td>
                    <td className="text-white font-medium">{s.name}</td>
                    <td className="text-slate-400">100</td>
                    <td>
                      <input type="number" min="0" max="100" value={s.obtained}
                        onChange={e => setMarks(prev => prev.map((x, j) => j === i ? { ...x, obtained: parseInt(e.target.value) || 0 } : x))}
                        style={{ width: '80px', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} />
                    </td>
                    <td><Badge type={s.obtained >= 80 ? 'green' : s.obtained >= 60 ? 'blue' : 'yellow'}>{g}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <SecondaryBtn onClick={() => { downloadCSV('marks-entry.csv', ['Student', 'Roll', 'Marks', 'Grade'], marks.map((s, i) => [s.name, i + 1, s.obtained, s.obtained >= 80 ? 'A' : 'B'])); show('⬇️ Marks sheet exported!'); }}>⬇️ Export</SecondaryBtn>
        <PrimaryBtn onClick={() => { setSaved(true); show(`✅ Marks saved for ${marks.length} students!`); }} disabled={saved}>{saved ? '✓ Saved' : '💾 Save Marks'}</PrimaryBtn>
      </div>
    </div>
  );
}

export function TeacherLeaves() {
  const { show, Toast } = useToast();
  const [applyOpen, setApplyOpen] = useState(false);
  const leaves = [{ type: 'Medical Leave', from: '2026-05-03', to: '2026-05-05', days: 3, status: 'pending' }, { type: 'Casual Leave', from: '2026-02-14', to: '2026-02-14', days: 1, status: 'approved' }];
  const STATUS_COLOR = { pending: 'yellow', approved: 'green', rejected: 'red' };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Leave Requests" subtitle="Your leave history and applications"
        actions={<PrimaryBtn onClick={() => setApplyOpen(true)}>➕ Apply Leave</PrimaryBtn>} />
      <div className="grid grid-cols-3 gap-4">
        {[{ l: 'Casual Leave', a: 6, t: 12 }, { l: 'Medical Leave', a: 8, t: 10 }, { l: 'Emergency', a: 3, t: 3 }].map(lb => (
          <div key={lb.l} className="glass p-4 text-center">
            <p className="text-2xl font-bold text-white font-poppins">{lb.a}</p>
            <p className="text-slate-400 text-xs mt-0.5">{lb.l}</p>
            <p className="text-slate-600 text-[10px]">{lb.a}/{lb.t} remaining</p>
          </div>
        ))}
      </div>
      <GlassCard noHover>
        <SectionTitle>My Leave History</SectionTitle>
        <div className="space-y-2">
          {leaves.map((l, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.4)' }}>
              <div className="flex-1"><p className="text-white text-sm font-medium">{l.type}</p><p className="text-slate-500 text-xs">{l.from} → {l.to} ({l.days} days)</p></div>
              <Badge type={STATUS_COLOR[l.status]}>{l.status}</Badge>
              {l.status === 'pending' && <PrimaryBtn small onClick={() => show('🗑 Leave application withdrawn')}>Withdraw</PrimaryBtn>}
            </div>
          ))}
        </div>
      </GlassCard>
      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} title="Apply for Leave" width="max-w-md">
        <div className="space-y-3">
          <FormField label="Leave Type"><select><option>Medical Leave</option><option>Casual Leave</option><option>Emergency Leave</option></select></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="From Date"><input type="date" /></FormField>
            <FormField label="To Date"><input type="date" /></FormField>
          </div>
          <FormField label="Reason"><textarea rows={3} placeholder="Reason for leave..." /></FormField>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
            <SecondaryBtn onClick={() => setApplyOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={() => { setApplyOpen(false); show('✅ Leave application submitted!'); }}>Submit</PrimaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function TeacherTimetable() {
  const { show, Toast } = useToast();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const schedule = { Monday: ['Class 8A - Math', '—', 'Class 9B - Math', 'BREAK', '—', 'Class 7A - Math', '—'], Tuesday: ['—', 'Class 10A - Math', '—', 'BREAK', 'Class 8A - Math', '—', 'Class 9B - Math'], Wednesday: ['Class 9B - Math', '—', 'Class 8A - Math', 'BREAK', 'Class 10A - Math', '—', '—'], Thursday: ['—', 'Class 7A - Math', '—', 'BREAK', 'Class 9B - Math', 'Class 8A - Math', '—'], Friday: ['Class 10A - Math', '—', '—', 'BREAK', 'Class 7A - Math', '—', 'Class 8A - Math'] };
  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="My Timetable" subtitle="Weekly class schedule"
        actions={<SecondaryBtn onClick={() => { window.print(); show('🖨️ Print dialog opened'); }}>🖨️ Print</SecondaryBtn>} />
      <GlassCard noHover className="overflow-x-auto" padding="p-4">
        <table className="w-full" style={{ minWidth: '600px' }}>
          <thead><tr><th className="text-xs text-slate-500 p-2 text-left">Period</th>{days.map(d => <th key={d} className="text-xs font-semibold text-slate-300 p-2 text-center">{d}</th>)}</tr></thead>
          <tbody>
            {['P1 8:00', 'P2 9:00', 'P3 10:00', 'Break', 'P5 11:30', 'P6 12:30', 'P7 1:30'].map((p, pi) => (
              <tr key={pi}><td className="p-2 text-[10px] text-slate-500">{p}</td>
                {days.map(d => (
                  <td key={d} className="p-1.5">
                    {schedule[d][pi] === 'BREAK'
                      ? <div className="rounded-lg p-2 text-center text-xs text-slate-600" style={{ background: 'rgba(51,65,85,0.3)' }}>BREAK</div>
                      : schedule[d][pi] === '—'
                        ? <div className="rounded-lg p-2 text-center text-xs text-slate-600">—</div>
                        : <div className="rounded-lg p-2 text-center text-xs text-white font-medium cursor-pointer" style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.3),rgba(5,150,105,0.3))', border: '1px solid rgba(16,185,129,0.2)' }} onClick={() => show(`📋 Marking attendance for: ${schedule[d][pi]}`)}>{schedule[d][pi]}</div>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
