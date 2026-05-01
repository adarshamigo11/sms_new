import { useState } from 'react';
import { PageHeader, StatCard, GlassCard, SectionTitle, Badge, PrimaryBtn, SecondaryBtn, Modal } from '../../components/ui';
import { STUDENTS, EXAM_RESULTS, HOMEWORK, NOTICES, TIMETABLE } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { downloadCSV, printWindow, makeReportCard } from '../../utils/download';

function useToast() {
  const [msg, setMsg] = useState('');
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };
  const Toast = () => msg ? <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-glass animate-slide-in-up" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>{msg}</div> : null;
  return { show, Toast };
}

// ── Student Dashboard ────────────────────────────────────────────────────────
export function StudentDashboard() {
  const { user } = useAuth();
  const { show, Toast } = useToast();
  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title={`Welcome back, ${user.name?.split(' ')[0]} 👋`} subtitle="Class 8A · Roll No. 01 · AY 2025-26" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance" value="82.8%" change="+2% this month" icon="📅" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Last Exam" value="A+" change="Final 2025-26" icon="🏆" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Homework Due" value="3" changeType="down" icon="📝" gradient="from-amber-500 to-orange-500" />
        <StatCard title="Fee Status" value="Paid" change="₹15,000" icon="✅" gradient="from-purple-500 to-violet-500" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <GlassCard noHover>
          <SectionTitle>Today's Schedule</SectionTitle>
          <div className="space-y-2">
            {[{ time: '8:00', sub: 'Mathematics', teacher: 'Priya Verma', room: 'Room 12' }, { time: '9:00', sub: 'Science', teacher: 'Amit Joshi', room: 'Room 12' }, { time: '10:00', sub: 'English', teacher: 'Sunita Mishra', room: 'Room 12' }, { time: '11:30', sub: 'Hindi', teacher: 'Rajesh Tiwari', room: 'Room 12' }].map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.4)' }}>
                <span className="text-slate-400 text-xs w-12 flex-shrink-0">{p.time}</span>
                <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                <div className="flex-1"><p className="text-white text-sm font-medium">{p.sub}</p><p className="text-slate-500 text-xs">{p.teacher} · {p.room}</p></div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard noHover>
          <SectionTitle>Upcoming Homework</SectionTitle>
          <div className="space-y-2">
            {HOMEWORK.slice(0, 4).map((h, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.4)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>{h.subject.charAt(0)}</div>
                <div className="flex-1"><p className="text-white text-xs font-medium">{h.title}</p><p className="text-slate-500 text-[10px]">{h.subject} · Due: {h.dueDate}</p></div>
                <Badge type={h.status === 'overdue' ? 'red' : h.status === 'due_today' ? 'yellow' : 'blue'}>{h.status.replace('_', ' ')}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
      <GlassCard noHover>
        <SectionTitle>Recent Notices</SectionTitle>
        <div className="grid md:grid-cols-2 gap-2">
          {NOTICES.slice(0, 4).map((n, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.4)' }}>
              <span className="text-xl flex-shrink-0">{n.type === 'Event' ? '🎉' : n.type === 'Exam' ? '📝' : '📢'}</span>
              <div><p className="text-white text-sm font-medium">{n.title}</p><p className="text-slate-500 text-xs">{n.date}</p></div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ── Student Attendance ───────────────────────────────────────────────────────
export function StudentAttendance() {
  const { show, Toast } = useToast();
  const months = ['Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'];
  const monthData = months.map(m => ({ month: m, present: Math.floor(18 + Math.random() * 5), total: 24 }));

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="My Attendance" subtitle="Detailed attendance record"
        actions={<PrimaryBtn onClick={() => { downloadCSV('my-attendance.csv', ['Month', 'Present', 'Total Days', 'Percentage'], monthData.map(m => [m.month, m.present, m.total, `${Math.round(m.present / m.total * 100)}%`])); show('⬇️ Attendance report downloaded!'); }}>⬇️ Download Report</PrimaryBtn>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Days" value="168" icon="📅" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Present" value="139" icon="✅" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Absent" value="21" changeType="down" icon="❌" gradient="from-red-500 to-rose-500" />
        <StatCard title="Percentage" value="82.8%" change="Needs improvement" icon="📊" gradient="from-amber-500 to-orange-500" />
      </div>
      <div className="glass-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Month</th><th>Present Days</th><th>Total Days</th><th>Absent</th><th>Percentage</th><th>Status</th></tr></thead>
            <tbody>
              {monthData.map(m => {
                const pct = Math.round(m.present / m.total * 100);
                return (
                  <tr key={m.month}>
                    <td className="text-white font-medium">{m.month}</td>
                    <td className="text-emerald-400">{m.present}</td>
                    <td className="text-slate-400">{m.total}</td>
                    <td className="text-red-400">{m.total - m.present}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 90 ? '#10b981' : pct >= 75 ? '#f59e0b' : '#ef4444' }} /></div>
                        <span className="text-xs text-slate-400">{pct}%</span>
                      </div>
                    </td>
                    <td><Badge type={pct >= 90 ? 'green' : pct >= 75 ? 'yellow' : 'red'}>{pct >= 90 ? 'Excellent' : pct >= 75 ? 'Good' : 'Low'}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Student Results ──────────────────────────────────────────────────────────
export function StudentResults() {
  const { show, Toast } = useToast();
  const [viewExam, setViewExam] = useState(null);
  const exams = [
    { name: 'Final Exam 2025-26', date: 'Mar 2026', status: 'published', marks: [{sub:'Mathematics',max:100,obt:91,g:'A+'},{sub:'Science',max:100,obt:78,g:'B+'},{sub:'English',max:100,obt:85,g:'A'},{sub:'Hindi',max:100,obt:79,g:'B+'},{sub:'Social Science',max:100,obt:83,g:'A'}] },
    { name: 'Mid Term 2025', date: 'Sep 2025', status: 'published', marks: [{sub:'Mathematics',max:100,obt:88,g:'A'},{sub:'Science',max:100,obt:72,g:'B+'},{sub:'English',max:100,obt:80,g:'A'},{sub:'Hindi',max:100,obt:75,g:'B+'},{sub:'Social Science',max:100,obt:77,g:'B+'}] },
    { name: 'Unit Test 1', date: 'Jun 2025', status: 'published', marks: [{sub:'Mathematics',max:50,obt:43,g:'A+'},{sub:'Science',max:50,obt:38,g:'A'},{sub:'English',max:50,obt:40,g:'A'}] },
    { name: 'Unit Test 3', date: 'May 2026', status: 'upcoming', marks: [] },
  ];

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="My Results" subtitle="Exam scores and report cards" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Current Grade" value="A+" change="Final 2025-26" icon="🏆" gradient="from-amber-500 to-orange-500" />
        <StatCard title="Best Score" value="91%" change="Mathematics" icon="🥇" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Class Rank" value="#5" change="Out of 24" icon="📊" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Avg Score" value="83.2%" icon="📈" gradient="from-purple-500 to-violet-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map((e, i) => (
          <div key={i} className="glass p-5">
            <div className="flex justify-between items-start mb-3">
              <div><p className="text-white font-semibold">{e.name}</p><p className="text-slate-400 text-xs">{e.date}</p></div>
              <Badge type={e.status === 'published' ? 'green' : 'blue'}>{e.status}</Badge>
            </div>
            {e.status === 'published' && e.marks.length > 0 && (
              <>
                <div className="space-y-1 mb-3">
                  {e.marks.slice(0, 3).map((m, mi) => (
                    <div key={mi} className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">{m.sub}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden"><div className="h-full rounded-full bg-blue-400" style={{ width: `${m.obt / m.max * 100}%` }} /></div>
                        <span className="text-white font-medium w-8 text-right">{m.obt}/{m.max}</span>
                        <span className="w-7 text-right font-bold" style={{ color: m.obt / m.max >= 0.8 ? '#10b981' : '#f59e0b' }}>{m.g}</span>
                      </div>
                    </div>
                  ))}
                  {e.marks.length > 3 && <p className="text-slate-600 text-[10px]">+{e.marks.length - 3} more subjects…</p>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-white text-sm font-bold">Total: {e.marks.reduce((s, m) => s + m.obt, 0)}/{e.marks.reduce((s, m) => s + m.max, 0)} ({Math.round(e.marks.reduce((s, m) => s + m.obt, 0) / e.marks.reduce((s, m) => s + m.max, 0) * 100)}%)</div>
                  <div className="flex gap-2">
                    <PrimaryBtn small onClick={() => setViewExam(e)}>View Full</PrimaryBtn>
                    <SecondaryBtn small onClick={() => { printWindow(makeReportCard({ name: 'Aarav Gupta', admissionNo: 'NWA/2024/0000', className: 'Class 8A', rollNo: '01' }, e.marks.map(m => ({ subject: m.sub, maxMarks: m.max, obtained: m.obt, grade: m.g })), { name: 'NEXTWAY Academy' }), 'Report Card'); show('🖨️ Report card opened!'); }}>🖨️ Report Card</SecondaryBtn>
                  </div>
                </div>
              </>
            )}
            {e.status === 'upcoming' && <div className="text-center py-6"><span className="text-4xl">⏳</span><p className="text-slate-400 text-sm mt-2">Exam scheduled for May 10, 2026</p><p className="text-slate-500 text-xs">Results will be published after exam</p></div>}
          </div>
        ))}
      </div>

      <Modal open={!!viewExam} onClose={() => setViewExam(null)} title={`${viewExam?.name} — Detailed Results`} width="max-w-lg">
        {viewExam && (
          <div>
            <div className="space-y-2 mb-4">
              {viewExam.marks.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.5)' }}>
                  <div className="flex-1"><p className="text-white text-sm font-medium">{m.sub}</p></div>
                  <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${m.obt / m.max * 100}%`, background: m.obt / m.max >= 0.8 ? '#10b981' : '#f59e0b' }} /></div>
                  <span className="text-slate-400 text-xs w-16 text-right">{m.obt} / {m.max}</span>
                  <Badge type={m.obt / m.max >= 0.8 ? 'green' : 'yellow'}>{m.g}</Badge>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl mb-3" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Marks</span>
                <span className="text-white font-bold">{viewExam.marks.reduce((s, m) => s + m.obt, 0)} / {viewExam.marks.reduce((s, m) => s + m.max, 0)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-400">Percentage</span>
                <span className="text-emerald-400 font-bold">{Math.round(viewExam.marks.reduce((s, m) => s + m.obt, 0) / viewExam.marks.reduce((s, m) => s + m.max, 0) * 100)}%</span>
              </div>
            </div>
            <div className="flex gap-2">
              <PrimaryBtn onClick={() => { printWindow(makeReportCard({ name: 'Aarav Gupta', admissionNo: 'NWA/2024/0000', className: 'Class 8A', rollNo: '01' }, viewExam.marks.map(m => ({ subject: m.sub, maxMarks: m.max, obtained: m.obt, grade: m.g })), { name: 'NEXTWAY Academy' }), 'Report Card'); show('🖨️ Report card opened!'); setViewExam(null); }}>🖨️ Print Report Card</PrimaryBtn>
              <SecondaryBtn onClick={() => { downloadCSV(`${viewExam.name}.csv`, ['Subject', 'Max', 'Obtained', 'Grade'], viewExam.marks.map(m => [m.sub, m.max, m.obt, m.g])); show('⬇️ Downloaded!'); }}>⬇️ Download</SecondaryBtn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── Student Fees ─────────────────────────────────────────────────────────────
export function StudentFees() {
  const { show, Toast } = useToast();
  const invoices = [
    { term: 'Term 1 (Apr–Jun 2025)', amount: 15000, paid: 15000, balance: 0, status: 'paid', date: '2025-04-10', method: 'UPI', receipt: 'RCP-2025-001', heads: [{ name: 'Tuition Fee', amount: 10000 }, { name: 'Lab Fee', amount: 2000 }, { name: 'Transport Fee', amount: 2500 }, { name: 'Library Fee', amount: 500 }] },
    { term: 'Term 2 (Jul–Sep 2025)', amount: 15000, paid: 15000, balance: 0, status: 'paid', date: '2025-07-05', method: 'Cash', receipt: 'RCP-2025-022', heads: [{ name: 'Tuition Fee', amount: 10000 }, { name: 'Lab Fee', amount: 2000 }, { name: 'Transport Fee', amount: 2500 }, { name: 'Library Fee', amount: 500 }] },
    { term: 'Term 3 (Oct–Dec 2025)', amount: 15000, paid: 9000, balance: 6000, status: 'partial', date: '2025-10-12', method: 'Bank Transfer', receipt: 'RCP-2025-041', heads: [{ name: 'Tuition Fee', amount: 10000 }, { name: 'Lab Fee', amount: 2000 }, { name: 'Transport Fee', amount: 2500 }, { name: 'Library Fee', amount: 500 }] },
    { term: 'Term 4 (Jan–Mar 2026)', amount: 15000, paid: 0, balance: 15000, status: 'pending', date: null, method: null, receipt: null, heads: [{ name: 'Tuition Fee', amount: 10000 }, { name: 'Lab Fee', amount: 2000 }, { name: 'Transport Fee', amount: 2500 }, { name: 'Library Fee', amount: 500 }] },
  ];
  const STATUS_COLOR = { paid: 'green', partial: 'yellow', pending: 'red' };
  const [viewInv, setViewInv] = useState(null);

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="My Fees" subtitle="Fee history and outstanding dues" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Annual Fee" value="₹60,000" icon="💳" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Paid" value="₹39,000" change="3 terms" icon="✅" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Outstanding" value="₹21,000" changeType="down" icon="⚠️" gradient="from-red-500 to-rose-500" />
        <StatCard title="Next Due" value="Jan 31" change="₹15,000 pending" icon="📅" gradient="from-amber-500 to-orange-500" />
      </div>
      <div className="space-y-3">
        {invoices.map((inv, i) => (
          <div key={i} className="glass p-5">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div>
                <p className="text-white font-semibold">{inv.term}</p>
                <p className="text-slate-400 text-xs">{inv.date ? `Paid on ${inv.date} via ${inv.method}` : 'Not yet paid'}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right"><p className="text-white font-bold">₹{inv.amount.toLocaleString()}</p><p className="text-slate-500 text-xs">Paid: ₹{inv.paid.toLocaleString()}</p></div>
                <Badge type={STATUS_COLOR[inv.status]}>{inv.status}</Badge>
                <PrimaryBtn small onClick={() => setViewInv(inv)}>View Details</PrimaryBtn>
                {inv.receipt && <SecondaryBtn small onClick={() => show(`🖨️ Receipt ${inv.receipt} opened`)}>🖨️ Receipt</SecondaryBtn>}
              </div>
            </div>
            {inv.status === 'partial' && (
              <div className="mt-3"><div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Payment progress</span><span className="text-white">{Math.round(inv.paid / inv.amount * 100)}%</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${inv.paid / inv.amount * 100}%`, background: 'linear-gradient(135deg,#f59e0b,#d97706)' }} /></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal open={!!viewInv} onClose={() => setViewInv(null)} title="Invoice Details" width="max-w-md">
        {viewInv && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.5)' }}>
              <p className="text-white font-semibold">{viewInv.term}</p>
              <p className="text-slate-400 text-xs mt-0.5">{viewInv.receipt || 'Invoice pending'}</p>
            </div>
            {viewInv.heads.map((h, i) => (
              <div key={i} className="flex justify-between text-sm py-1.5 border-b border-slate-700/30"><span className="text-slate-400">{h.name}</span><span className="text-white">₹{h.amount.toLocaleString()}</span></div>
            ))}
            <div className="flex justify-between text-sm font-bold pt-1"><span className="text-slate-300">Total</span><span className="text-white">₹{viewInv.amount.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Paid</span><span className="text-emerald-400 font-semibold">₹{viewInv.paid.toLocaleString()}</span></div>
            {viewInv.balance > 0 && <div className="flex justify-between text-sm"><span className="text-slate-400">Balance</span><span className="text-red-400 font-semibold">₹{viewInv.balance.toLocaleString()}</span></div>}
            {viewInv.receipt && (
              <PrimaryBtn onClick={() => { show(`🖨️ Printing receipt ${viewInv.receipt}...`); setViewInv(null); }}>🖨️ Print Receipt</PrimaryBtn>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── Student Homework ─────────────────────────────────────────────────────────
export function StudentHomework() {
  const { show, Toast } = useToast();
  const [submitted, setSubmitted] = useState([]);
  const STATUS_COLOR = { active: 'blue', due_today: 'yellow', overdue: 'red' };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="My Homework" subtitle="Assignments and due dates" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending" value={HOMEWORK.filter(h => h.status !== 'overdue').length} icon="📝" gradient="from-amber-500 to-orange-500" />
        <StatCard title="Submitted" value={submitted.length} icon="✅" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Overdue" value={HOMEWORK.filter(h => h.status === 'overdue').length} changeType="down" icon="🚨" gradient="from-red-500 to-rose-500" />
        <StatCard title="Due Today" value={HOMEWORK.filter(h => h.status === 'due_today').length} icon="⏰" gradient="from-blue-500 to-cyan-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HOMEWORK.map((h, i) => (
          <div key={h.id} className="glass p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>{h.subject.charAt(0)}</div>
                <div><p className="text-white text-sm font-semibold">{h.title}</p><p className="text-slate-400 text-xs">{h.subject} · {h.class}</p></div>
              </div>
              <Badge type={STATUS_COLOR[h.status] || 'blue'}>{h.status.replace('_', ' ')}</Badge>
            </div>
            <div className="flex justify-between text-xs mb-3"><span className="text-slate-500">Assigned by: {h.assignedBy}</span><span className="text-slate-400">Due: {h.dueDate}</span></div>
            {submitted.includes(h.id)
              ? <div className="flex items-center gap-2"><span className="badge badge-green">✓ Submitted</span><span className="text-slate-400 text-xs">Awaiting grading</span></div>
              : <PrimaryBtn small onClick={() => { setSubmitted(prev => [...prev, h.id]); show(`✅ "${h.title}" submitted successfully!`); }}>Submit Homework</PrimaryBtn>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Student Timetable ────────────────────────────────────────────────────────
export function StudentTimetable() {
  const { show, Toast } = useToast();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['8:00', '9:00', '10:00', 'BREAK', '11:30', '12:30', '1:30'];
  const schedule = {
    Monday:    ['Mathematics', 'English', 'Science', 'BREAK', 'Hindi', 'Social Science', 'Computer'],
    Tuesday:   ['Science', 'Mathematics', 'English', 'BREAK', 'Art', 'Hindi', 'Mathematics'],
    Wednesday: ['English', 'Social Science', 'Mathematics', 'BREAK', 'Science', 'PE', 'Hindi'],
    Thursday:  ['Hindi', 'Science', 'Social Science', 'BREAK', 'Mathematics', 'English', 'Library'],
    Friday:    ['Computer', 'Hindi', 'Mathematics', 'BREAK', 'English', 'Science', 'Social Science'],
  };
  const subColors = { Mathematics: 'rgba(59,130,246,0.2)', Science: 'rgba(16,185,129,0.2)', English: 'rgba(139,92,246,0.2)', Hindi: 'rgba(245,158,11,0.2)', 'Social Science': 'rgba(236,72,153,0.2)', Computer: 'rgba(99,102,241,0.2)', Art: 'rgba(239,68,68,0.15)', PE: 'rgba(34,197,94,0.2)', Library: 'rgba(234,179,8,0.15)' };
  const today = days[Math.min(new Date().getDay() - 1, 4)];

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="My Timetable" subtitle="Class 8A — Weekly Schedule"
        actions={<SecondaryBtn onClick={() => { window.print(); show('🖨️ Printing...'); }}>🖨️ Print</SecondaryBtn>} />
      <GlassCard noHover className="overflow-x-auto" padding="p-4">
        <table className="w-full" style={{ minWidth: '640px' }}>
          <thead>
            <tr>
              <th className="text-xs text-slate-500 p-2 text-left w-16">Time</th>
              {days.map(d => <th key={d} className={`text-xs font-semibold p-2 text-center ${d === today ? 'text-blue-400' : 'text-slate-300'}`}>{d}{d === today ? ' 📍' : ''}</th>)}
            </tr>
          </thead>
          <tbody>
            {periods.map((p, pi) => (
              <tr key={pi}>
                <td className="p-1.5 text-[10px] text-slate-500">{p}</td>
                {days.map(d => (
                  <td key={d} className="p-1.5">
                    {schedule[d][pi] === 'BREAK'
                      ? <div className="rounded-lg p-2 text-center text-xs text-slate-600" style={{ background: 'rgba(51,65,85,0.3)' }}>BREAK</div>
                      : <div className="rounded-lg p-2 text-center text-xs text-white" style={{ background: subColors[schedule[d][pi]] || 'rgba(30,41,59,0.5)', border: d === today ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent' }}>{schedule[d][pi]}</div>
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

// ── AI Doubt Solver ──────────────────────────────────────────────────────────
export function AiDoubtSolver() {
  const { show, Toast } = useToast();
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [history, setHistory] = useState([
    { role: 'assistant', text: '👋 Hello! I\'m your AI Doubt Solver. Ask me any academic question and I\'ll explain it step by step. What would you like to learn today?' }
  ]);
  const [loading, setLoading] = useState(false);

  const DEMO_ANSWERS = {
    default: "Great question! Let me explain this step by step:\n\n**Step 1:** First, let's understand the concept.\n**Step 2:** Apply the formula/rule.\n**Step 3:** Work through the example.\n\nThe key takeaway is that practice makes perfect. Try a few similar problems to reinforce your understanding! 💡",
    math: "Let me solve this mathematically:\n\n**Given:** The problem as stated\n**Find:** The solution\n\n**Step 1:** Identify what's known\n**Step 2:** Choose the right formula\n**Step 3:** Substitute values\n**Step 4:** Simplify\n\n**Answer:** Follow these steps and you'll reach the solution! ✅\n\nRemember: Always check your answer by substituting back!",
    science: "Excellent science question! Here's the explanation:\n\n**Concept:** This relates to a fundamental scientific principle.\n\n**Explanation:** The process works because of the underlying laws of nature. \n\n**Key Points:**\n• First important point\n• Second important point  \n• Third important point\n\n**Real-world application:** You can see this in everyday life! 🔬",
  };

  const ask = async () => {
    if (!question.trim()) return;
    const q = question.trim();
    setHistory(h => [...h, { role: 'user', text: q }]);
    setQuestion('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const ans = subject === 'Mathematics' ? DEMO_ANSWERS.math : subject === 'Science' ? DEMO_ANSWERS.science : DEMO_ANSWERS.default;
    setHistory(h => [...h, { role: 'assistant', text: ans }]);
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="AI Doubt Solver 🤖" subtitle="Ask any academic question — powered by AI" />
      <div className="grid lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 flex flex-col gap-3" style={{ height: '550px' }}>
          <GlassCard noHover padding="p-0" className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {history.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm mr-2 flex-shrink-0" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>🤖</div>
                  )}
                  <div className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} style={{ maxWidth: '80%', whiteSpace: 'pre-line' }}>{m.text}</div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>🤖</div>
                  <div className="chat-bubble-ai flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 border-t border-slate-700/40">
              <div className="flex gap-2 mb-2">
                <select value={subject} onChange={e => setSubject(e.target.value)} style={{ width: 'auto', paddingTop: '0.4rem', paddingBottom: '0.4rem', fontSize: '0.8rem' }}>
                  {['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Computer Science'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} placeholder="Type your question... (e.g. How do I solve quadratic equations?)" style={{ flex: 1 }} />
                <PrimaryBtn onClick={ask} disabled={loading || !question.trim()}>Ask ↵</PrimaryBtn>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-3">
          <GlassCard noHover>
            <p className="text-slate-400 text-xs font-medium mb-2">Quick Topics</p>
            <div className="space-y-1.5">
              {['Quadratic Formula', 'Photosynthesis', 'Newton\'s Laws', 'French Revolution', 'Parts of Speech', 'Ohm\'s Law'].map(t => (
                <button key={t} onClick={() => setQuestion(t)} className="w-full text-left px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/40 text-xs transition-all">{t}</button>
              ))}
            </div>
          </GlassCard>
          <GlassCard noHover>
            <p className="text-slate-400 text-xs font-medium mb-2">Session</p>
            <p className="text-white text-lg font-bold">{history.filter(m => m.role === 'user').length}</p>
            <p className="text-slate-500 text-xs">Questions asked</p>
            <SecondaryBtn small onClick={() => { setHistory([{ role: 'assistant', text: '👋 Hello! I\'m your AI Doubt Solver. Ask me any academic question!' }]); show('🔄 Conversation cleared'); }}>Clear Chat</SecondaryBtn>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
