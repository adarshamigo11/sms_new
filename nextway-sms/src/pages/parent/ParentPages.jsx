import { useState } from 'react';
import { PageHeader, StatCard, GlassCard, SectionTitle, Badge, PrimaryBtn, SecondaryBtn, Modal } from '../../components/ui';
import { STUDENTS, EXAM_RESULTS, NOTICES } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { downloadCSV, printWindow, makeReportCard, makeReceipt } from '../../utils/download';

function useToast() {
  const [msg, setMsg] = useState('');
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };
  const Toast = () => msg ? <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-glass animate-slide-in-up" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>{msg}</div> : null;
  return { show, Toast };
}

const CHILD = { name: 'Aarav Gupta', class: 'Class 8', section: 'A', admissionNo: 'NWA/2024/0000', rollNo: '01', dob: '15 Mar 2011', gender: 'Male', bloodGroup: 'B+', attendance: 82.8, grade: 'A+', phone: '9876543210' };

// ── Parent Dashboard ─────────────────────────────────────────────────────────
export function ParentDashboard() {
  const { user } = useAuth();
  const { show, Toast } = useToast();
  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title={`Hello, ${user.name?.split(' ')[0]} 👋`} subtitle="Monitoring Aarav Gupta · Class 8A" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance" value="82.8%" change="24 absences this year" icon="📅" gradient="from-amber-500 to-orange-500" />
        <StatCard title="Latest Grade" value="A+" change="Final 2025-26" icon="🏆" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Fee Balance" value="₹21,000" changeType="down" change="2 terms pending" icon="💳" gradient="from-red-500 to-rose-500" />
        <StatCard title="Homework" value="3 Due" changeType="down" icon="📝" gradient="from-blue-500 to-cyan-500" />
      </div>

      {/* Child Summary Card */}
      <GlassCard noHover>
        <SectionTitle>Child Profile — {CHILD.name}</SectionTitle>
        <div className="flex flex-wrap gap-4 items-start">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>A</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
            {[['Class', `${CHILD.class} ${CHILD.section}`], ['Admission No', CHILD.admissionNo], ['Roll No', CHILD.rollNo], ['Gender', CHILD.gender], ['DOB', CHILD.dob], ['Blood Group', CHILD.bloodGroup], ['School Phone', '+91 731 400 0000'], ['Email', 'info@nextway.edu.in']].map(([l, v]) => (
              <div key={l} className="p-2.5 rounded-xl" style={{ background: 'rgba(30,41,59,0.5)' }}><p className="text-slate-500 text-[10px] uppercase">{l}</p><p className="text-white text-sm font-medium">{v}</p></div>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-4">
        <GlassCard noHover>
          <SectionTitle>Recent Notices</SectionTitle>
          <div className="space-y-2">
            {NOTICES.slice(0, 4).map((n, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.4)' }}>
                <span className="text-xl flex-shrink-0">{n.type === 'Event' ? '🎉' : n.type === 'Exam' ? '📝' : '📢'}</span>
                <div><p className="text-white text-sm font-medium">{n.title}</p><p className="text-slate-500 text-xs">{n.date}</p></div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard noHover>
          <SectionTitle>Quick Actions</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {[{ l: '📊 View Report Card', action: () => { printWindow(makeReportCard({ name: CHILD.name, admissionNo: CHILD.admissionNo, className: `${CHILD.class}${CHILD.section}`, rollNo: CHILD.rollNo }, [{ subject: 'Mathematics', maxMarks: 100, obtained: 91, grade: 'A+' }, { subject: 'Science', maxMarks: 100, obtained: 78, grade: 'B+' }, { subject: 'English', maxMarks: 100, obtained: 85, grade: 'A' }], { name: 'NEXTWAY Academy' }), 'Report Card'); show('🖨️ Report card opened!'); } },
              { l: '📞 Contact Teacher', action: () => show('📞 Connecting to class teacher Priya Verma...') },
              { l: '💰 Pay Fees', action: () => show('💳 Opening payment portal...') },
              { l: '📅 Attendance Record', action: () => { downloadCSV('attendance.csv', ['Month', 'Present', 'Total', '%'], [['Apr 2025', 20, 24, '83%'], ['May 2025', 22, 24, '92%'], ['Jun 2025', 18, 22, '82%']]); show('⬇️ Attendance exported!'); } }].map((a, i) => (
              <button key={i} onClick={a.action} className="glass p-3 text-left hover:bg-slate-700/30 transition-all text-slate-300 hover:text-white text-sm font-medium">{a.l}</button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ── Parent Children ───────────────────────────────────────────────────────────
export function ParentChildren() {
  const { show, Toast } = useToast();
  const [viewProfile, setViewProfile] = useState(false);
  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="My Children" subtitle="Academic overview for all registered children" />
      <div className="glass p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>A</div>
          <div>
            <h3 className="text-white text-xl font-bold">{CHILD.name}</h3>
            <p className="text-slate-400">{CHILD.class} Section {CHILD.section} · Roll #{CHILD.rollNo}</p>
            <div className="flex gap-2 mt-1"><Badge type="green">Active</Badge><Badge type="blue">AY 2025-26</Badge></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[['Attendance', `${CHILD.attendance}%`], ['Latest Grade', CHILD.grade], ['Admission No', CHILD.admissionNo], ['Blood Group', CHILD.bloodGroup], ['Date of Birth', CHILD.dob], ['Gender', CHILD.gender], ['Class Teacher', 'Priya Verma'], ['Board', 'CBSE']].map(([l, v]) => (
            <div key={l} className="p-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.5)' }}><p className="text-slate-500 text-[10px] uppercase">{l}</p><p className="text-white text-sm font-medium">{v}</p></div>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          <PrimaryBtn onClick={() => setViewProfile(true)}>📋 Full Profile</PrimaryBtn>
          <PrimaryBtn onClick={() => { printWindow(makeReportCard({ name: CHILD.name, admissionNo: CHILD.admissionNo, className: `${CHILD.class}${CHILD.section}`, rollNo: CHILD.rollNo }, [{ subject: 'Mathematics', maxMarks: 100, obtained: 91, grade: 'A+' }, { subject: 'Science', maxMarks: 100, obtained: 78, grade: 'B+' }, { subject: 'English', maxMarks: 100, obtained: 85, grade: 'A' }, { subject: 'Hindi', maxMarks: 100, obtained: 79, grade: 'B+' }, { subject: 'Social Science', maxMarks: 100, obtained: 83, grade: 'A' }], { name: 'NEXTWAY Academy' }), 'Report Card'); show('🖨️ Report card opened!'); }}>📊 Report Card</PrimaryBtn>
          <SecondaryBtn onClick={() => { downloadCSV('child-summary.csv', ['Field', 'Value'], [['Name', CHILD.name], ['Class', `${CHILD.class}${CHILD.section}`], ['Admission No', CHILD.admissionNo], ['Attendance', `${CHILD.attendance}%`], ['Latest Grade', CHILD.grade]]); show('⬇️ Profile exported!'); }}>⬇️ Export</SecondaryBtn>
        </div>
      </div>

      <Modal open={viewProfile} onClose={() => setViewProfile(false)} title="Full Student Profile" width="max-w-lg">
        <div className="space-y-3">
          <div className="flex items-center gap-4 pb-3 border-b border-slate-700/40">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>A</div>
            <div><h3 className="text-white font-bold text-lg">{CHILD.name}</h3><p className="text-slate-400 text-sm">Class 8A · NWA/2024/0000</p></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[['Admission No', CHILD.admissionNo], ['Class', `${CHILD.class}${CHILD.section}`], ['Roll No', CHILD.rollNo], ['DOB', CHILD.dob], ['Gender', CHILD.gender], ['Blood Group', CHILD.bloodGroup], ['Attendance', `${CHILD.attendance}%`], ['Current Grade', CHILD.grade], ['Board', 'CBSE'], ['Academic Year', '2025-26'], ['Class Teacher', 'Priya Verma'], ['Parent Contact', CHILD.phone]].map(([l, v]) => (
              <div key={l} className="p-2.5 rounded-xl" style={{ background: 'rgba(30,41,59,0.5)' }}><p className="text-slate-500 text-[10px]">{l}</p><p className="text-white text-sm font-medium">{v}</p></div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── Parent Fees ───────────────────────────────────────────────────────────────
export function ParentFees() {
  const { show, Toast } = useToast();
  const [payOpen, setPayOpen] = useState(null);
  const invoices = [
    { term: 'Term 1 (Apr–Jun 2025)', amount: 15000, paid: 15000, balance: 0, status: 'paid', date: '2025-04-10', method: 'UPI', receipt: 'RCP-2025-001', heads: [{ name: 'Tuition Fee', amount: 10000 }, { name: 'Lab Fee', amount: 2000 }, { name: 'Transport Fee', amount: 2500 }, { name: 'Library Fee', amount: 500 }] },
    { term: 'Term 2 (Jul–Sep 2025)', amount: 15000, paid: 15000, balance: 0, status: 'paid', date: '2025-07-05', method: 'Cash', receipt: 'RCP-2025-022', heads: [{ name: 'Tuition Fee', amount: 10000 }, { name: 'Lab Fee', amount: 2000 }, { name: 'Transport Fee', amount: 2500 }, { name: 'Library Fee', amount: 500 }] },
    { term: 'Term 3 (Oct–Dec 2025)', amount: 15000, paid: 9000, balance: 6000, status: 'partial', date: '2025-10-12', method: 'Bank Transfer', receipt: 'RCP-2025-041', heads: [{ name: 'Tuition Fee', amount: 10000 }, { name: 'Lab Fee', amount: 2000 }, { name: 'Transport Fee', amount: 2500 }, { name: 'Library Fee', amount: 500 }] },
    { term: 'Term 4 (Jan–Mar 2026)', amount: 15000, paid: 0, balance: 15000, status: 'pending', date: null, method: null, receipt: null, heads: [{ name: 'Tuition Fee', amount: 10000 }, { name: 'Lab Fee', amount: 2000 }, { name: 'Transport Fee', amount: 2500 }, { name: 'Library Fee', amount: 500 }] },
  ];
  const STATUS_COLOR = { paid: 'green', partial: 'yellow', pending: 'red' };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Fee Details" subtitle={`Fee account for ${CHILD.name}`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Annual Fee" value="₹60,000" icon="💳" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Total Paid" value="₹39,000" change="3 terms" icon="✅" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Outstanding" value="₹21,000" changeType="down" icon="⚠️" gradient="from-red-500 to-rose-500" />
        <StatCard title="Due Date" value="Apr 30" change="Term 4 pending" icon="📅" gradient="from-amber-500 to-orange-500" />
      </div>
      <div className="space-y-3">
        {invoices.map((inv, i) => (
          <div key={i} className="glass p-5">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div>
                <p className="text-white font-semibold">{inv.term}</p>
                <p className="text-slate-400 text-xs">{inv.date ? `Paid ${inv.date} via ${inv.method}` : 'Payment not yet received'}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-right"><p className="text-white font-bold">₹{inv.amount.toLocaleString()}</p><p className="text-slate-500 text-xs">Bal: ₹{inv.balance.toLocaleString()}</p></div>
                <Badge type={STATUS_COLOR[inv.status]}>{inv.status}</Badge>
                {inv.receipt && (
                  <PrimaryBtn small onClick={() => {
                    printWindow(makeReceipt({ receiptNo: inv.receipt, date: inv.date, studentName: CHILD.name, className: `${CHILD.class}${CHILD.section}`, amount: inv.paid, method: inv.method, heads: inv.heads }), `Receipt ${inv.receipt}`);
                    show(`🖨️ Receipt ${inv.receipt} opened!`);
                  }}>🖨️ Receipt</PrimaryBtn>
                )}
                {inv.balance > 0 && (
                  <PrimaryBtn small onClick={() => setPayOpen(inv)}>💰 Pay Now</PrimaryBtn>
                )}
              </div>
            </div>
            {inv.status === 'partial' && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Paid so far</span><span className="text-white">{Math.round(inv.paid / inv.amount * 100)}%</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${inv.paid / inv.amount * 100}%`, background: 'linear-gradient(135deg,#f59e0b,#d97706)' }} /></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal open={!!payOpen} onClose={() => setPayOpen(null)} title="Pay Fees" width="max-w-md">
        {payOpen && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <p className="text-white font-semibold">{payOpen.term}</p>
              <p className="text-slate-400 text-xs">Balance: ₹{payOpen.balance.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              {payOpen.heads.map(h => (
                <div key={h.name} className="flex justify-between text-sm py-1 border-b border-slate-700/30">
                  <span className="text-slate-400">{h.name}</span><span className="text-white">₹{h.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold pt-1"><span className="text-slate-300">Outstanding</span><span className="text-red-400">₹{payOpen.balance.toLocaleString()}</span></div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">⚠️ Online payment is processed at the school counter. Please contact the accounts department or visit school to make payment.</div>
            <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
              <SecondaryBtn onClick={() => setPayOpen(null)}>Close</SecondaryBtn>
              <PrimaryBtn onClick={() => { setPayOpen(null); show('📞 School accounts dept: +91 731 400 0001'); }}>📞 Contact School</PrimaryBtn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── Parent Attendance ────────────────────────────────────────────────────────
export function ParentAttendance() {
  const { show, Toast } = useToast();
  const months = ['Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'];
  const data = months.map(m => ({ month: m, present: Math.floor(18 + Math.random() * 5), total: 24 }));

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title={`Attendance — ${CHILD.name}`} subtitle="Monthly attendance overview"
        actions={<PrimaryBtn onClick={() => { downloadCSV('attendance-report.csv', ['Month', 'Present', 'Total', 'Absent', '%'], data.map(d => [d.month, d.present, d.total, d.total - d.present, `${Math.round(d.present / d.total * 100)}%`])); show('⬇️ Attendance report downloaded!'); }}>⬇️ Download Report</PrimaryBtn>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Present Days" value={data.reduce((s, d) => s + d.present, 0)} icon="✅" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Total Days" value={data.reduce((s, d) => s + d.total, 0)} icon="📅" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Absent Days" value={data.reduce((s, d) => s + (d.total - d.present), 0)} changeType="down" icon="❌" gradient="from-red-500 to-rose-500" />
        <StatCard title="Overall %" value={`${Math.round(data.reduce((s, d) => s + d.present, 0) / data.reduce((s, d) => s + d.total, 0) * 100)}%`} icon="📊" gradient="from-amber-500 to-orange-500" />
      </div>
      <div className="glass-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Month</th><th>Present</th><th>Total</th><th>Absent</th><th>Percentage</th><th>Status</th></tr></thead>
            <tbody>
              {data.map(d => {
                const pct = Math.round(d.present / d.total * 100);
                return (
                  <tr key={d.month}>
                    <td className="text-white font-medium">{d.month}</td>
                    <td className="text-emerald-400 font-semibold">{d.present}</td>
                    <td className="text-slate-400">{d.total}</td>
                    <td className="text-red-400">{d.total - d.present}</td>
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

// ── Parent Results ────────────────────────────────────────────────────────────
export function ParentResults() {
  const { show, Toast } = useToast();
  const results = { name: 'Final Exam 2025-26', marks: [{ subject: 'Mathematics', maxMarks: 100, obtained: 91, grade: 'A+' }, { subject: 'Science', maxMarks: 100, obtained: 78, grade: 'B+' }, { subject: 'English', maxMarks: 100, obtained: 85, grade: 'A' }, { subject: 'Hindi', maxMarks: 100, obtained: 79, grade: 'B+' }, { subject: 'Social Science', maxMarks: 100, obtained: 83, grade: 'A' }] };
  const total = results.marks.reduce((s, m) => s + m.obtained, 0);
  const pct = Math.round(total / 500 * 100);

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title={`Results — ${CHILD.name}`} subtitle="Exam performance overview"
        actions={<>
          <PrimaryBtn onClick={() => { printWindow(makeReportCard({ name: CHILD.name, admissionNo: CHILD.admissionNo, className: `${CHILD.class}${CHILD.section}`, rollNo: CHILD.rollNo }, results.marks.map(m => ({ subject: m.subject, maxMarks: m.maxMarks, obtained: m.obtained, grade: m.grade })), { name: 'NEXTWAY Academy' }), 'Report Card'); show('🖨️ Report card opened!'); }}>🖨️ Report Card</PrimaryBtn>
          <SecondaryBtn onClick={() => { downloadCSV('results.csv', ['Subject', 'Max Marks', 'Obtained', 'Grade'], results.marks.map(m => [m.subject, m.maxMarks, m.obtained, m.grade])); show('⬇️ Results downloaded!'); }}>⬇️ Download</SecondaryBtn>
        </>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Score" value={`${total}/500`} icon="📊" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Percentage" value={`${pct}%`} icon="📈" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Grade" value="A+" change="Final 2025-26" icon="🏆" gradient="from-amber-500 to-orange-500" />
        <StatCard title="Class Rank" value="#5" change="of 24 students" icon="🥇" gradient="from-purple-500 to-violet-500" />
      </div>
      <GlassCard noHover>
        <SectionTitle>Subject-wise Performance — {results.name}</SectionTitle>
        <div className="space-y-3">
          {results.marks.map((m, i) => {
            const subPct = Math.round(m.obtained / m.maxMarks * 100);
            return (
              <div key={i} className="flex items-center gap-4">
                <div className="w-28 text-slate-400 text-sm flex-shrink-0">{m.subject}</div>
                <div className="flex-1"><div className="progress-bar"><div className="progress-fill" style={{ width: `${subPct}%`, background: subPct >= 85 ? 'linear-gradient(135deg,#10b981,#059669)' : subPct >= 70 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#ef4444,#dc2626)' }} /></div></div>
                <div className="w-20 text-right flex-shrink-0"><span className="text-white font-semibold text-sm">{m.obtained}</span><span className="text-slate-500 text-xs">/{m.maxMarks}</span></div>
                <Badge type={m.obtained >= 85 ? 'green' : m.obtained >= 70 ? 'yellow' : 'red'}>{m.grade}</Badge>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

// ── Parent Communication ──────────────────────────────────────────────────────
export function ParentCommunication() {
  const { show, Toast } = useToast();
  const [msg, setMsg] = useState('');
  const [chats, setChats] = useState([
    { from: 'teacher', name: 'Priya Verma', text: 'Aarav is doing well in class. His Mathematics score has improved to 91 this term. Keep encouraging him to practice daily.' },
    { from: 'me', text: 'Thank you for the update. We\'ll ensure he continues practicing daily.' },
    { from: 'teacher', name: 'Priya Verma', text: 'Also, please ensure he submits the Chapter 6 homework by Friday.' },
  ]);
  const [selContact, setSelContact] = useState(0);
  const contacts = [{ name: 'Priya Verma', role: 'Class Teacher (Math)' }, { name: 'Amit Joshi', role: 'Science Teacher' }, { name: 'School Office', role: 'Administration' }];

  const send = () => {
    if (!msg.trim()) return;
    setChats(prev => [...prev, { from: 'me', text: msg }]);
    setMsg('');
    setTimeout(() => { setChats(prev => [...prev, { from: 'teacher', name: contacts[selContact].name, text: 'Thank you for your message. We\'ll get back to you shortly.' }]); }, 1200);
  };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Communication" subtitle="Messages with teachers and school staff" />
      <div className="grid lg:grid-cols-4 gap-4">
        <GlassCard noHover padding="p-3">
          <p className="text-slate-400 text-xs font-medium mb-2">Contacts</p>
          <div className="space-y-1">
            {contacts.map((c, i) => (
              <div key={i} onClick={() => setSelContact(i)} className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all ${selContact === i ? 'bg-blue-500/15 border border-blue-500/20' : 'hover:bg-slate-700/30'}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>{c.name.charAt(0)}</div>
                <div><p className="text-white text-xs font-medium">{c.name}</p><p className="text-slate-500 text-[10px]">{c.role}</p></div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard noHover padding="p-0" className="lg:col-span-3 flex flex-col overflow-hidden" style={{ height: '420px' }}>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/40">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>{contacts[selContact].name.charAt(0)}</div>
            <div><p className="text-white text-sm font-medium">{contacts[selContact].name}</p><p className="text-slate-500 text-[10px]">{contacts[selContact].role}</p></div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chats.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={m.from === 'me' ? 'chat-bubble-user' : 'chat-bubble-ai'} style={{ maxWidth: '80%' }}>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-700/40 flex gap-2">
            <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type a message..." style={{ flex: 1 }} />
            <PrimaryBtn onClick={send}>Send</PrimaryBtn>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
