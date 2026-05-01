import { useState } from 'react';
import { PageHeader, GlassCard, PrimaryBtn, SecondaryBtn, DangerBtn, StatCard, SectionTitle, Badge, Modal, FormField, SearchBar } from '../../components/ui';
import { TEACHERS, CLASSES, EXAMS, EXAM_RESULTS, HOMEWORK, LEAVE_REQUESTS, BOOKS, TRANSPORT_ROUTES, HOSTEL_ROOMS, INVENTORY, NOTICES, AUDIT_LOGS, STUDENTS } from '../../data/mockData';
import { downloadCSV, printWindow, makeReceipt, makeReportCard, makeIDCard } from '../../utils/download';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ── Shared Toast ───────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState('');
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };
  const Toast = () => msg ? (
    <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-glass animate-slide-in-up"
      style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>{msg}</div>
  ) : null;
  return { show, Toast };
}

// ─── TEACHERS ────────────────────────────────────────────────────────────────
export function Teachers() {
  const { show, Toast } = useToast();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [viewT, setViewT] = useState(null);
  const [form, setForm] = useState({ name:'', email:'', subject:'Mathematics', phone:'', role:'Teacher' });

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await usersApi.list({ role: 'teacher' });
      setTeachers(response.users || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      show('❌ Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async () => {
    try {
      await usersApi.create({
        name: form.name,
        email: form.email,
        password: 'Teacher@2026!',
        role: 'teacher',
        subject: form.subject,
        phone: form.phone
      });
      show('✅ Teacher added successfully!');
      setAddOpen(false);
      setForm({ name:'', email:'', subject:'Mathematics', phone:'', role:'Teacher' });
      fetchTeachers();
    } catch (error) {
      show('❌ ' + (error.message || 'Failed to add teacher'));
    }
  };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Teachers & Staff" subtitle={`${teachers.length} staff members`}
        actions={<>
          <SecondaryBtn onClick={() => downloadCSV('teachers.csv', ['Name','Email','Subject','Phone','Role'], teachers.map(t => [t.name, t.email, t.subject, t.phone, t.role]))}>⬇️ Export CSV</SecondaryBtn>
          <PrimaryBtn onClick={() => setAddOpen(true)}>➕ Add Staff</PrimaryBtn>
        </>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Teachers" value="15" icon="👩‍🏫" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Admin Staff" value="5" icon="👔" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Support Staff" value="8" icon="🔧" gradient="from-purple-500 to-violet-500" />
        <StatCard title="On Leave Today" value="2" icon="🌴" gradient="from-amber-500 to-orange-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-16 text-slate-400">
            <p className="text-4xl mb-2 animate-pulse">⏳</p>
            <p className="text-white font-semibold">Loading teachers...</p>
          </div>
        ) : teachers.map((t, i) => (
          <div key={t._id || t.id} className={`glass p-5 animate-fade-in delay-${i * 100}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>{t.name?.charAt(0)}</div>
              <div><p className="text-white font-semibold text-sm">{t.name}</p><p className="text-slate-400 text-xs">{t.email}</p></div>
            </div>
            <div className="space-y-1.5">
              {[['Subject', t.subject || 'N/A'], ['Phone', t.phone || 'N/A'], ['Role', t.role || 'Teacher']].map(([l, v]) => (
                <div key={l} className="flex justify-between text-xs"><span className="text-slate-500">{l}</span><span className="text-slate-300">{v}</span></div>
              ))}
            </div>
            <div className="mt-3 flex justify-between items-center">
              <Badge type="green">Active</Badge>
              <div className="flex gap-1">
                <button onClick={() => setViewT(t)} className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded-lg hover:bg-blue-500/10">View</button>
                <button onClick={() => show(`📧 Reset email sent to ${t.email}`)} className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-slate-700/30">Reset Pwd</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Staff Member" width="max-w-lg">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Full Name" required><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Priya Verma" /></FormField>
            <FormField label="Email" required><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="priya@nextway.edu" /></FormField>
            <FormField label="Role"><select><option>Teacher</option><option>Librarian</option><option>Accountant</option><option>Receptionist</option></select></FormField>
            <FormField label="Subject"><select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}><option>Mathematics</option><option>Science</option><option>English</option><option>Hindi</option><option>Social Science</option><option>Computer Science</option></select></FormField>
            <FormField label="Phone"><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="10-digit" /></FormField>
            <FormField label="Joining Date"><input type="date" defaultValue={new Date().toISOString().split('T')[0]} /></FormField>
          </div>
          <FormField label="Address"><input placeholder="Full address" /></FormField>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
            <SecondaryBtn onClick={() => setAddOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={handleAddTeacher}>Create Staff Account</PrimaryBtn>
          </div>
        </div>
      </Modal>

      {/* View Teacher Modal */}
      <Modal open={!!viewT} onClose={() => setViewT(null)} title="Staff Profile" width="max-w-lg">
        {viewT && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>{viewT.name.charAt(0)}</div>
              <div><h3 className="text-white text-lg font-bold">{viewT.name}</h3><p className="text-slate-400 text-sm">{viewT.employeeId}</p><Badge type="green">{viewT.status}</Badge></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[['Subject', viewT.subject], ['Classes', viewT.class], ['Phone', viewT.phone], ['Email', viewT.email], ['Joined', viewT.joiningDate], ['Role', 'Teacher']].map(([l, v]) => (
                <div key={l} className="p-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.5)' }}><p className="text-slate-500 text-[10px] uppercase">{l}</p><p className="text-white text-sm font-medium">{v}</p></div>
              ))}
            </div>
            <div className="flex gap-2">
              <PrimaryBtn small onClick={() => show('📊 Attendance report opened')}>View Attendance</PrimaryBtn>
              <PrimaryBtn small onClick={() => show('📋 Timetable opened')}>Timetable</PrimaryBtn>
              <SecondaryBtn small onClick={() => { setViewT(null); show(`⚠️ ${viewT.name} deactivated`); }}>Deactivate</SecondaryBtn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── CLASSES ─────────────────────────────────────────────────────────────────
export function Classes() {
  const { show, Toast } = useToast();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [viewC, setViewC] = useState(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classesApi.list();
      setClasses(response.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      show('❌ Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddClass = async () => {
    try {
      await classesApi.create({
        name: 'Class 11',
        sections: ['A', 'B'],
        maxStrength: 50
      });
      show('✅ Class created successfully!');
      setAddOpen(false);
      fetchClasses();
    } catch (error) {
      show('❌ ' + (error.message || 'Failed to create class'));
    }
  };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Classes & Sections" subtitle={`${classes.length} classes managed`}
        actions={<PrimaryBtn onClick={() => setAddOpen(true)}>➕ Add Class</PrimaryBtn>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Classes" value="10" icon="🏫" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Total Sections" value="15" icon="📂" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Avg Class Size" value="24" icon="👥" gradient="from-purple-500 to-violet-500" />
        <StatCard title="Total Students" value="200" icon="🎓" gradient="from-amber-500 to-orange-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-16 text-slate-400">
            <p className="text-4xl mb-2 animate-pulse">⏳</p>
            <p className="text-white font-semibold">Loading classes...</p>
          </div>
        ) : classes.map((c, i) => (
          <div key={c._id || c.id} className={`glass p-5 animate-fade-in delay-${i * 100}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>{c.name?.replace('Class ', '')}</div>
              <Badge type="blue">{(c.sections || []).length} section{(c.sections || []).length > 1 ? 's' : ''}</Badge>
            </div>
            <p className="text-white font-semibold mb-1">{c.name}</p>
            <p className="text-slate-400 text-xs mb-3">Class Teacher: {c.classTeacher || 'N/A'}</p>
            <div className="flex gap-1 mb-3">{(c.sections || []).map(s => <span key={s} className="badge badge-purple">Sec {s}</span>)}</div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">{c.students || 0} students</span>
              <div className="flex gap-1">
                <button onClick={() => setViewC(c)} className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded-lg hover:bg-blue-500/10">View</button>
                <button onClick={() => show(`➕ Section added to ${c.name}`)} className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-slate-700/30">+ Section</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Class" width="max-w-md">
        <div className="space-y-3">
          <FormField label="Class Name" required><input placeholder="e.g. Class 11" /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="No. of Sections"><input type="number" min="1" max="5" defaultValue="2" /></FormField>
            <FormField label="Max Strength/Section"><input type="number" defaultValue="50" /></FormField>
          </div>
          <FormField label="Class Teacher"><select><option>Priya Verma</option><option>Amit Joshi</option><option>Sunita Mishra</option></select></FormField>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
            <SecondaryBtn onClick={() => setAddOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={handleAddClass}>Create Class</PrimaryBtn>
          </div>
        </div>
      </Modal>
      <Modal open={!!viewC} onClose={() => setViewC(null)} title={`${viewC?.name} Details`} width="max-w-md">
        {viewC && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[['Name', viewC.name], ['Sections', viewC.sections.join(', ')], ['Students', viewC.students], ['Class Teacher', viewC.classTeacher]].map(([l, v]) => (
                <div key={l} className="p-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.5)' }}><p className="text-slate-500 text-[10px] uppercase">{l}</p><p className="text-white text-sm font-medium">{v}</p></div>
              ))}
            </div>
            <div className="flex gap-2">
              <PrimaryBtn small onClick={() => show('📋 Timetable editor opened')}>Edit Timetable</PrimaryBtn>
              <PrimaryBtn small onClick={() => { downloadCSV(`${viewC.name}-students.csv`, ['Name', 'Roll No', 'Gender', 'Attendance%'], STUDENTS.filter(s => s.class === viewC.name).map(s => [s.name, s.rollNo, s.gender, s.attendance])); show('⬇️ Student list exported!'); }}>Export Students</PrimaryBtn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── TIMETABLE ───────────────────────────────────────────────────────────────
export function Timetable() {
  const { show, Toast } = useToast();
  const [selClass, setSelClass] = useState('Class 8A');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['P1 8:00', 'P2 9:00', 'P3 10:00', 'Break', 'P5 11:30', 'P6 12:30', 'P7 1:30'];
  const schedule = {
    Monday:    ['Mathematics', 'English',      'Science',     '—', 'Hindi',       'Social Sci.', 'Computer'],
    Tuesday:   ['Science',     'Mathematics',  'English',     '—', 'Art',          'Hindi',       'Mathematics'],
    Wednesday: ['English',     'Social Sci.',  'Mathematics', '—', 'Science',      'PE',          'Hindi'],
    Thursday:  ['Hindi',       'Science',      'Social Sci.', '—', 'Mathematics',  'English',     'Library'],
    Friday:    ['Computer',    'Hindi',        'Mathematics', '—', 'English',      'Science',     'Social Sci.'],
  };
  const colors = { Mathematics: 'from-blue-500 to-cyan-500', Science: 'from-emerald-500 to-teal-500', English: 'from-purple-500 to-violet-500', Hindi: 'from-amber-500 to-orange-500', 'Social Sci.': 'from-pink-500 to-rose-500', Computer: 'from-indigo-500 to-blue-500', Art: 'from-red-400 to-orange-400', PE: 'from-green-500 to-emerald-500', Library: 'from-yellow-400 to-amber-400' };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Timetable" subtitle="Weekly class schedule"
        actions={<>
          <select value={selClass} onChange={e => setSelClass(e.target.value)} style={{ width: 'auto', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>{['Class 6A', 'Class 7A', 'Class 8A', 'Class 8B', 'Class 9A', 'Class 10A'].map(c => <option key={c}>{c}</option>)}</select>
          <PrimaryBtn onClick={() => show('✅ Timetable auto-generated!')}>Auto Generate</PrimaryBtn>
          <SecondaryBtn onClick={() => { window.print(); show('🖨️ Print dialog opened'); }}>Export PDF</SecondaryBtn>
        </>} />
      <GlassCard noHover className="overflow-x-auto" padding="p-4">
        <table className="w-full" style={{ minWidth: '700px' }}>
          <thead><tr><th className="text-xs text-slate-500 p-2 text-left w-20">Period</th>{days.map(d => <th key={d} className="text-xs font-semibold text-slate-300 p-2 text-center">{d}</th>)}</tr></thead>
          <tbody>
            {periods.map((p, pi) => (
              <tr key={pi}>
                <td className="p-1.5 text-[10px] text-slate-400">{p}</td>
                {days.map(d => (
                  <td key={d} className="p-1.5">
                    {schedule[d][pi] === '—'
                      ? <div className="rounded-lg p-2 text-center text-xs text-slate-600" style={{ background: 'rgba(51,65,85,0.3)' }}>BREAK</div>
                      : <div className={`rounded-lg p-2 text-center text-xs text-white font-medium bg-gradient-to-br ${colors[schedule[d][pi]] || 'from-slate-600 to-slate-700'} cursor-pointer hover:opacity-100`} style={{ opacity: 0.85 }} onClick={() => show(`📝 Editing: ${schedule[d][pi]} - ${d} ${p}`)}>{schedule[d][pi]}</div>
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

// ─── HOMEWORK ────────────────────────────────────────────────────────────────
export function Homework() {
  const { show, Toast } = useToast();
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [viewHW, setViewHW] = useState(null);
  const STATUS_COLOR = { active: 'blue', due_today: 'yellow', overdue: 'red' };

  const fetchHomework = async () => {
    try {
      setLoading(true);
      const response = await homeworkApi.list({});
      setHomework(response.homework || []);
    } catch (error) {
      console.error('Error fetching homework:', error);
      show('❌ Failed to load homework');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomework();
  }, []);

  const handleCreateHomework = async () => {
    try {
      await homeworkApi.create({
        title: 'Chapter 5 Assignment',
        subject: 'Mathematics',
        class: 'Class 8',
        dueDate: new Date().toISOString(),
        maxMarks: 10
      });
      show('✅ Assignment created and notified to students!');
      setOpen(false);
      fetchHomework();
    } catch (error) {
      show('❌ ' + (error.message || 'Failed to create assignment'));
    }
  };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Homework & Assignments" subtitle={`${homework.length} assignments`}
        actions={<>
          <SecondaryBtn onClick={() => downloadCSV('homework.csv', ['Subject', 'Class', 'Title', 'Due Date'], homework.map(h => [h.subject, h.class, h.title, h.dueDate]))}>⬇️ Export</SecondaryBtn>
          <PrimaryBtn onClick={() => setOpen(true)}>➕ Create Assignment</PrimaryBtn>
        </>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active" value={homework.filter(h => h.status === 'active').length} icon="📝" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Due Today" value={homework.filter(h => h.status === 'due_today').length} icon="⌛" gradient="from-amber-500 to-orange-500" />
        <StatCard title="Overdue" value={homework.filter(h => h.status === 'overdue').length} icon="🚨" gradient="from-red-500 to-rose-500" />
        <StatCard title="Completed" value="12" change="this month" icon="✅" gradient="from-emerald-500 to-teal-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-16 text-slate-400">
            <p className="text-4xl mb-2 animate-pulse">⏳</p>
            <p className="text-white font-semibold">Loading homework...</p>
          </div>
        ) : homework.map((h, i) => (
          <div key={h._id || h.id} className={`glass p-5 animate-fade-in delay-${i * 100}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>{h.subject.charAt(0)}</div>
                <div><p className="text-white text-sm font-semibold">{h.title}</p><p className="text-slate-400 text-xs">{h.subject} · {h.class}</p></div>
              </div>
              <Badge type={STATUS_COLOR[h.status]}>{h.status.replace('_', ' ')}</Badge>
            </div>
            <div className="flex justify-between text-xs mb-2"><span className="text-slate-500">By: {h.assignedBy}</span><span className="text-slate-400">Due: {h.dueDate}</span></div>
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Submissions</span><span className="text-white">{h.submissions}/{h.total}</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.round(h.submissions / h.total * 100)}%`, background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }} /></div>
            </div>
            <div className="flex gap-2">
              <PrimaryBtn small onClick={() => setViewHW(h)}>📋 Submissions</PrimaryBtn>
              <SecondaryBtn small onClick={() => show(`✏️ Grading ${h.title}...`)}>Grade All</SecondaryBtn>
            </div>
          </div>
        ))}
      </div>

      {/* Create Homework Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Create Assignment" width="max-w-lg">
        <div className="space-y-3">
          <FormField label="Title" required><input placeholder="e.g. Chapter 5 - Quadratic Equations" /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Class" required><select>{CLASSES.map(c => <option key={c.id}>{c.name}</option>)}</select></FormField>
            <FormField label="Section"><select><option>A</option><option>B</option><option>All</option></select></FormField>
            <FormField label="Subject"><select><option>Mathematics</option><option>Science</option><option>English</option><option>Hindi</option></select></FormField>
            <FormField label="Due Date" required><input type="date" /></FormField>
          </div>
          <FormField label="Max Marks"><input type="number" defaultValue="10" /></FormField>
          <FormField label="Description"><textarea rows={3} placeholder="Instructions for students..." /></FormField>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
            <SecondaryBtn onClick={() => setOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={handleCreateHomework}>Create Assignment</PrimaryBtn>
          </div>
        </div>
      </Modal>

      {/* View Submissions Modal */}
      <Modal open={!!viewHW} onClose={() => setViewHW(null)} title="Submissions" width="max-w-lg">
        {viewHW && (
          <div>
            <div className="p-3 rounded-xl mb-4" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <p className="text-white font-semibold">{viewHW.title}</p>
              <p className="text-slate-400 text-xs">{viewHW.subject} · {viewHW.class} · Due: {viewHW.dueDate}</p>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {STUDENTS.slice(0, 6).map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.4)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>{s.name.charAt(0)}</div>
                  <div className="flex-1"><p className="text-white text-xs font-medium">{s.name}</p></div>
                  {i < viewHW.submissions
                    ? <><span className="badge badge-green">Submitted</span><PrimaryBtn small onClick={() => show(`✏️ Grading ${s.name}...`)}>Grade</PrimaryBtn></>
                    : <span className="badge badge-red">Pending</span>
                  }
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-slate-700/40">
              <SecondaryBtn onClick={() => { downloadCSV(`${viewHW.subject}-submissions.csv`, ['Student', 'Status', 'Marks'], STUDENTS.slice(0, 6).map((s, i) => [s.name, i < viewHW.submissions ? 'Submitted' : 'Pending', i < viewHW.submissions ? rand(6, 10) : '-'])); show('⬇️ Exported!'); }}>⬇️ Export</SecondaryBtn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

// ─── EXAMS ───────────────────────────────────────────────────────────────────
export function Exams() {
  const { show, Toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [viewResult, setViewResult] = useState(null);
  const STATUS_COLOR = { upcoming: 'blue', completed: 'green', ongoing: 'yellow', results_published: 'purple' };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Exams & Results" subtitle="Manage exam schedules and result entry"
        actions={<PrimaryBtn onClick={() => setAddOpen(true)}>➕ Create Exam</PrimaryBtn>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Upcoming" value={EXAMS.filter(e => e.status === 'upcoming').length} icon="📅" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Completed" value={EXAMS.filter(e => e.status === 'completed').length} icon="✅" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Results Published" value="1" icon="📊" gradient="from-purple-500 to-violet-500" />
        <StatCard title="Avg Score" value="82.8%" icon="🏆" gradient="from-amber-500 to-orange-500" />
      </div>
      <div className="glass-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Exam Name</th><th>Type</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {EXAMS.map(e => (
                <tr key={e.id}>
                  <td className="text-white font-medium">{e.name}</td>
                  <td><Badge type="purple">{e.type}</Badge></td>
                  <td className="text-slate-400">{e.startDate}</td>
                  <td className="text-slate-400">{e.endDate}</td>
                  <td><Badge type={STATUS_COLOR[e.status]}>{e.status.replace('_', ' ')}</Badge></td>
                  <td>
                    <div className="flex gap-1">
                      <PrimaryBtn small onClick={() => setViewResult(e)}>📊 Results</PrimaryBtn>
                      <SecondaryBtn small onClick={() => { downloadCSV(`${e.name}-results.csv`, ['Student', 'Class', 'Mathematics', 'Science', 'English', 'Hindi', 'Total', 'Grade'], STUDENTS.slice(0, 8).map(s => [s.name, s.class, rand(60, 98), rand(60, 98), rand(60, 98), rand(60, 98), rand(300, 490), pick(['A', 'A+', 'B+', 'B'])])); show('⬇️ Results exported!'); }}>⬇️ Export</SecondaryBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Modal */}
      <Modal open={!!viewResult} onClose={() => setViewResult(null)} title={`${viewResult?.name} — Results`} width="max-w-2xl">
        {viewResult && (
          <div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>Student</th><th>Math</th><th>Science</th><th>English</th><th>Total</th><th>%</th><th>Grade</th><th>Action</th></tr></thead>
                <tbody>
                  {STUDENTS.slice(0, 6).map((s, i) => {
                    const marks = [rand(60, 98), rand(60, 98), rand(60, 98)];
                    const total = marks.reduce((a, b) => a + b, 0);
                    const pct = Math.round(total / 300 * 100);
                    const g = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : 'B';
                    return (
                      <tr key={i}>
                        <td className="text-white font-medium text-sm">{s.name}</td>
                        {marks.map((m, mi) => <td key={mi} className="text-slate-300">{m}</td>)}
                        <td className="text-emerald-400 font-semibold">{total}</td>
                        <td>{pct}%</td>
                        <td><Badge type={g === 'A+' ? 'green' : 'blue'}>{g}</Badge></td>
                        <td>
                          <button onClick={() => { printWindow(makeReportCard({ name: s.name, admissionNo: s.admissionNo, className: `${s.class} ${s.section}`, rollNo: s.rollNo }, [{ subject: 'Mathematics', maxMarks: 100, obtained: marks[0], grade: marks[0] >= 80 ? 'A' : 'B' }, { subject: 'Science', maxMarks: 100, obtained: marks[1], grade: marks[1] >= 80 ? 'A' : 'B' }, { subject: 'English', maxMarks: 100, obtained: marks[2], grade: marks[2] >= 80 ? 'A' : 'B' }], { name: 'NEXTWAY Academy' }), `Report Card - ${s.name}`); show('🖨️ Report card opened!'); }} className="text-blue-400 hover:text-blue-300 text-xs">🖨️ Print</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2 mt-4">
              <PrimaryBtn onClick={() => { downloadCSV(`${viewResult.name}-results.csv`, ['Student', 'Class', 'Math', 'Science', 'English', 'Total', 'Grade'], STUDENTS.slice(0, 6).map(s => { const marks = [rand(60, 98), rand(60, 98), rand(60, 98)]; const tot = marks.reduce((a, b) => a + b, 0); return [s.name, s.class, ...marks, tot, tot >= 240 ? 'A' : 'B']; })); show('⬇️ Full results exported!'); }}>⬇️ Export All</PrimaryBtn>
              <SecondaryBtn onClick={() => { setViewResult(null); show('✅ Results published to students & parents!'); }}>📢 Publish Results</SecondaryBtn>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Exam Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Create Exam" width="max-w-lg">
        <div className="space-y-3">
          <FormField label="Exam Name" required><input placeholder="e.g. Unit Test 3" /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Type"><select><option>Unit Test</option><option>Mid Term</option><option>Final</option><option>Pre-Board</option></select></FormField>
            <FormField label="Start Date"><input type="date" /></FormField>
            <FormField label="End Date"><input type="date" /></FormField>
            <FormField label="Classes"><select><option>All Classes</option><option>Class 8</option><option>Class 9</option><option>Class 10</option></select></FormField>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
            <SecondaryBtn onClick={() => setAddOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={() => { setAddOpen(false); show('✅ Exam scheduled!'); }}>Create Exam</PrimaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// ─── TRANSPORT ───────────────────────────────────────────────────────────────
export function Transport() {
  const { show, Toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [viewR, setViewR] = useState(null);

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Transport Management" subtitle="Routes, vehicles and student allocation"
        actions={<><SecondaryBtn onClick={() => downloadCSV('routes.csv', ['Route', 'Vehicle', 'Driver', 'Students', 'Shift'], TRANSPORT_ROUTES.map(r => [r.name, r.vehicle, r.driver, r.students, r.shift]))}>⬇️ Export</SecondaryBtn><PrimaryBtn onClick={() => setAddOpen(true)}>➕ Add Route</PrimaryBtn></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Routes" value={TRANSPORT_ROUTES.length} icon="🚌" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Total Vehicles" value="5" icon="🚍" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Students on Bus" value="84" icon="👥" gradient="from-purple-500 to-violet-500" />
        <StatCard title="Drivers" value="5" icon="👨‍💼" gradient="from-amber-500 to-orange-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRANSPORT_ROUTES.map((r, i) => (
          <div key={r.id} className={`glass p-5 animate-fade-in delay-${i * 100}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl" style={{ background: 'rgba(59,130,246,0.15)' }}>🚌</div>
              <div><p className="text-white font-semibold text-sm">{r.name}</p><p className="text-slate-400 text-xs">{r.vehicle}</p></div>
            </div>
            {[['Driver', r.driver], ['Stops', r.stops], ['Students', r.students], ['Shift', r.shift]].map(([l, v]) => (
              <div key={l} className="flex justify-between text-xs mb-1"><span className="text-slate-500">{l}</span><span className="text-slate-300">{v}</span></div>
            ))}
            <div className="flex gap-2 mt-3">
              <PrimaryBtn small onClick={() => setViewR(r)}>View Students</PrimaryBtn>
              <SecondaryBtn small onClick={() => show(`✏️ Editing ${r.name}...`)}>Edit</SecondaryBtn>
            </div>
          </div>
        ))}
      </div>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Transport Route" width="max-w-lg">
        <div className="space-y-3">
          <FormField label="Route Name" required><input placeholder="e.g. Route 5 - MG Road" /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Vehicle No"><input placeholder="MP09 XX 0000" /></FormField>
            <FormField label="Driver Name"><input placeholder="Driver name" /></FormField>
            <FormField label="Driver Phone"><input placeholder="10-digit" /></FormField>
            <FormField label="Shift"><select><option>Both</option><option>Morning</option><option>Afternoon</option></select></FormField>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
            <SecondaryBtn onClick={() => setAddOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={() => { setAddOpen(false); show('✅ Route added!'); }}>Add Route</PrimaryBtn>
          </div>
        </div>
      </Modal>
      <Modal open={!!viewR} onClose={() => setViewR(null)} title={`${viewR?.name} — Students`} width="max-w-md">
        {viewR && (
          <div>
            <p className="text-slate-400 text-sm mb-3">Driver: {viewR.driver} · {viewR.vehicle}</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {STUDENTS.slice(0, viewR.students || 6).map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: 'rgba(30,41,59,0.4)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>{s.name.charAt(0)}</div>
                  <div className="flex-1"><p className="text-white text-xs font-medium">{s.name}</p><p className="text-slate-500 text-[10px]">{s.class}</p></div>
                  <button onClick={() => show(`🚌 ${s.name} removed from route`)} className="text-red-400 hover:text-red-300 text-[10px]">Remove</button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <PrimaryBtn small onClick={() => show('➕ Add student dialog opened')}>Add Student</PrimaryBtn>
              <SecondaryBtn small onClick={() => { downloadCSV(`${viewR.name}-students.csv`, ['Name', 'Class', 'Phone'], STUDENTS.slice(0, viewR.students || 6).map(s => [s.name, s.class, s.phone])); show('⬇️ List exported!'); }}>⬇️ Export</SecondaryBtn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── HOSTEL ──────────────────────────────────────────────────────────────────
export function Hostel() {
  const { show, Toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const STATUS_COLOR = { full: 'red', available: 'green' };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Hostel Management" subtitle="Rooms, allocations and occupancy"
        actions={<PrimaryBtn onClick={() => setAddOpen(true)}>➕ Add Room</PrimaryBtn>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Rooms" value={HOSTEL_ROOMS.length} icon="🏠" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Occupied Beds" value={HOSTEL_ROOMS.reduce((s, r) => s + r.occupied, 0)} icon="🛏️" gradient="from-purple-500 to-violet-500" />
        <StatCard title="Available Beds" value={HOSTEL_ROOMS.reduce((s, r) => s + (r.capacity - r.occupied), 0)} icon="✅" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Occupancy" value="78%" icon="📊" gradient="from-amber-500 to-orange-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {HOSTEL_ROOMS.map((r, i) => (
          <div key={r.id} className={`glass p-5 animate-fade-in delay-${i * 100}`}>
            <div className="flex justify-between items-start mb-3">
              <div><p className="text-white font-semibold">Room {r.roomNo}</p><p className="text-slate-400 text-xs">{r.building} · Floor {r.floor}</p></div>
              <Badge type={STATUS_COLOR[r.status]}>{r.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(30,41,59,0.5)' }}><p className="text-slate-500">Type</p><p className="text-white font-medium">{r.type}</p></div>
              <div className="p-2 rounded-lg" style={{ background: 'rgba(30,41,59,0.5)' }}><p className="text-slate-500">Occupancy</p><p className="text-white font-medium">{r.occupied}/{r.capacity}</p></div>
            </div>
            <div className="progress-bar mb-3"><div className="progress-fill" style={{ width: `${r.occupied / r.capacity * 100}%`, background: r.status === 'full' ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#10b981,#059669)' }} /></div>
            <div className="flex gap-2">
              {r.status !== 'full' && <PrimaryBtn small onClick={() => show(`✅ Student assigned to Room ${r.roomNo}`)}>Assign Student</PrimaryBtn>}
              <SecondaryBtn small onClick={() => show(`✏️ Editing Room ${r.roomNo}`)}>Edit</SecondaryBtn>
            </div>
          </div>
        ))}
      </div>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Hostel Room" width="max-w-md">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Room No" required><input placeholder="e.g. 401" /></FormField>
            <FormField label="Building"><input placeholder="e.g. Block D" /></FormField>
            <FormField label="Floor"><input placeholder="e.g. 4" /></FormField>
            <FormField label="Type"><select><option>Single</option><option>Double</option><option>Triple</option><option>Dormitory</option></select></FormField>
            <FormField label="Capacity"><input type="number" defaultValue="2" /></FormField>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
            <SecondaryBtn onClick={() => setAddOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={() => { setAddOpen(false); show('✅ Room added!'); }}>Add Room</PrimaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── LIBRARY ─────────────────────────────────────────────────────────────────
export function Library() {
  const { show, Toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(null);

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Library Management" subtitle="Books, issues and returns"
        actions={<>
          <SecondaryBtn onClick={() => downloadCSV('books.csv', ['Title', 'Author', 'ISBN', 'Category', 'Available', 'Total', 'Rack'], BOOKS.map(b => [b.title, b.author, b.isbn, b.category, b.available, b.total, b.rack]))}>⬇️ Export</SecondaryBtn>
          <PrimaryBtn onClick={() => setAddOpen(true)}>➕ Add Book</PrimaryBtn>
        </>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Books" value={BOOKS.reduce((s, b) => s + b.total, 0)} icon="📚" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Issued" value={BOOKS.reduce((s, b) => s + (b.total - b.available), 0)} icon="📤" gradient="from-purple-500 to-violet-500" />
        <StatCard title="Available" value={BOOKS.reduce((s, b) => s + b.available, 0)} icon="✅" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Overdue" value="3" changeType="down" icon="⏰" gradient="from-red-500 to-rose-500" />
      </div>
      <div className="glass-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Available</th><th>Rack</th><th>Actions</th></tr></thead>
            <tbody>
              {BOOKS.map(b => (
                <tr key={b.id}>
                  <td className="text-white font-medium">{b.title}</td>
                  <td className="text-slate-400">{b.author}</td>
                  <td><Badge type="blue">{b.category}</Badge></td>
                  <td><span className={b.available === 0 ? 'text-red-400 font-semibold' : 'text-emerald-400 font-semibold'}>{b.available}</span><span className="text-slate-500 text-xs"> / {b.total}</span></td>
                  <td><span className="badge badge-purple">{b.rack}</span></td>
                  <td>
                    <div className="flex gap-1">
                      {b.available > 0 && <PrimaryBtn small onClick={() => setIssueOpen(b)}>📤 Issue</PrimaryBtn>}
                      <SecondaryBtn small onClick={() => show(`✅ Book "${b.title}" returned!`)}>↩️ Return</SecondaryBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Book" width="max-w-lg">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Title" required><input placeholder="Book title" /></FormField>
            <FormField label="Author"><input placeholder="Author name" /></FormField>
            <FormField label="ISBN"><input placeholder="ISBN" /></FormField>
            <FormField label="Category"><select><option>Textbook</option><option>Fiction</option><option>Non-Fiction</option><option>Reference</option><option>Biography</option></select></FormField>
            <FormField label="No. of Copies"><input type="number" defaultValue="5" /></FormField>
            <FormField label="Rack Location"><input placeholder="e.g. A-09" /></FormField>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
            <SecondaryBtn onClick={() => setAddOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={() => { setAddOpen(false); show('✅ Book added to library!'); }}>Add Book</PrimaryBtn>
          </div>
        </div>
      </Modal>
      <Modal open={!!issueOpen} onClose={() => setIssueOpen(null)} title="Issue Book" width="max-w-md">
        {issueOpen && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <p className="text-white font-semibold">{issueOpen.title}</p>
              <p className="text-slate-400 text-xs">{issueOpen.author} · {issueOpen.available} copies available</p>
            </div>
            <FormField label="Issue To"><select>{STUDENTS.slice(0, 8).map(s => <option key={s.id}>{s.name} — {s.class}</option>)}</select></FormField>
            <FormField label="Return Date"><input type="date" defaultValue={new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]} /></FormField>
            <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
              <SecondaryBtn onClick={() => setIssueOpen(null)}>Cancel</SecondaryBtn>
              <PrimaryBtn onClick={() => { setIssueOpen(null); show(`✅ "${issueOpen.title}" issued!`); }}>Issue Book</PrimaryBtn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── INVENTORY ───────────────────────────────────────────────────────────────
export function Inventory() {
  const { show, Toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Inventory Management" subtitle="Assets, stock and purchase records"
        actions={<>
          <SecondaryBtn onClick={() => downloadCSV('inventory.csv', ['Item', 'Category', 'Quantity', 'Unit Price', 'Total Value', 'Vendor', 'Purchase Date'], INVENTORY.map(i => [i.name, i.category, i.quantity, i.unitPrice, i.quantity * i.unitPrice, i.vendor, i.purchaseDate]))}>⬇️ Export</SecondaryBtn>
          <PrimaryBtn onClick={() => setAddOpen(true)}>➕ Add Item</PrimaryBtn>
        </>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Items" value={INVENTORY.length} icon="📦" gradient="from-blue-500 to-cyan-500" />
        <StatCard title="Total Value" value="₹18.5L" icon="💰" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Low Stock" value="2" changeType="down" icon="⚠️" gradient="from-amber-500 to-orange-500" />
        <StatCard title="Categories" value="8" icon="🗂️" gradient="from-purple-500 to-violet-500" />
      </div>
      <div className="glass-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Item Name</th><th>Category</th><th>Quantity</th><th>Unit Price</th><th>Total Value</th><th>Vendor</th><th>Actions</th></tr></thead>
            <tbody>
              {INVENTORY.map(item => (
                <tr key={item.id}>
                  <td className="text-white font-medium">{item.name}</td>
                  <td><Badge type="blue">{item.category}</Badge></td>
                  <td className="text-slate-300">{item.quantity}</td>
                  <td className="text-slate-300">₹{item.unitPrice.toLocaleString()}</td>
                  <td className="text-emerald-400 font-medium">₹{(item.quantity * item.unitPrice).toLocaleString()}</td>
                  <td className="text-slate-400">{item.vendor}</td>
                  <td>
                    <div className="flex gap-1">
                      <PrimaryBtn small onClick={() => show(`✏️ Editing ${item.name}...`)}>Edit</PrimaryBtn>
                      <SecondaryBtn small onClick={() => show(`📋 ${item.name} — condition updated`)}>Update</SecondaryBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Inventory Item" width="max-w-lg">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Item Name" required><input placeholder="e.g. Printer Cartridge" /></FormField>
            <FormField label="Category"><select><option>Electronics</option><option>Furniture</option><option>Science Equipment</option><option>Sports</option><option>Safety</option><option>Medical</option></select></FormField>
            <FormField label="Quantity"><input type="number" defaultValue="1" /></FormField>
            <FormField label="Unit Price (₹)"><input type="number" placeholder="0" /></FormField>
            <FormField label="Vendor"><input placeholder="Vendor name" /></FormField>
            <FormField label="Purchase Date"><input type="date" /></FormField>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
            <SecondaryBtn onClick={() => setAddOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={() => { setAddOpen(false); show('✅ Item added to inventory!'); }}>Add Item</PrimaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── LEAVES ──────────────────────────────────────────────────────────────────
export function Leaves() {
  const { show, Toast } = useToast();
  const [applyOpen, setApplyOpen] = useState(false);
  const [leaves, setLeaves] = useState(LEAVE_REQUESTS);
  const STATUS_COLOR = { pending: 'yellow', approved: 'green', rejected: 'red' };

  const review = (id, status) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    show(status === 'approved' ? '✅ Leave approved!' : '❌ Leave rejected');
  };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Leave Management" subtitle="Staff and student leave requests"
        actions={<>
          <SecondaryBtn onClick={() => downloadCSV('leaves.csv', ['Name', 'Role', 'Type', 'From', 'To', 'Days', 'Status'], leaves.map(l => [l.name, l.role, l.type, l.from, l.to, l.days, l.status]))}>⬇️ Export</SecondaryBtn>
          <PrimaryBtn onClick={() => setApplyOpen(true)}>➕ Apply Leave</PrimaryBtn>
        </>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending" value={leaves.filter(l => l.status === 'pending').length} icon="⏳" gradient="from-amber-500 to-orange-500" />
        <StatCard title="Approved" value={leaves.filter(l => l.status === 'approved').length} icon="✅" gradient="from-emerald-500 to-teal-500" />
        <StatCard title="Rejected" value={leaves.filter(l => l.status === 'rejected').length} icon="❌" gradient="from-red-500 to-rose-500" />
        <StatCard title="This Month" value={leaves.length} icon="📅" gradient="from-blue-500 to-cyan-500" />
      </div>
      <div className="glass-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Role</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {leaves.map(l => (
                <tr key={l.id}>
                  <td className="text-white font-medium">{l.name}</td>
                  <td><Badge type="blue">{l.role}</Badge></td>
                  <td className="text-slate-300">{l.type}</td>
                  <td className="text-slate-400">{l.from}</td>
                  <td className="text-slate-400">{l.to}</td>
                  <td className="text-slate-300">{l.days}</td>
                  <td className="text-slate-400 text-xs max-w-xs truncate">{l.reason}</td>
                  <td><Badge type={STATUS_COLOR[l.status]}>{l.status}</Badge></td>
                  <td>
                    {l.status === 'pending' && (
                      <div className="flex gap-1">
                        <button onClick={() => review(l.id, 'approved')} className="badge badge-green cursor-pointer hover:opacity-80">✓ Approve</button>
                        <button onClick={() => review(l.id, 'rejected')} className="badge badge-red cursor-pointer hover:opacity-80 ml-1">✗ Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} title="Apply for Leave" width="max-w-md">
        <div className="space-y-3">
          <FormField label="Leave Type" required><select><option>Medical Leave</option><option>Casual Leave</option><option>Emergency Leave</option><option>Personal Leave</option></select></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="From Date" required><input type="date" /></FormField>
            <FormField label="To Date" required><input type="date" /></FormField>
          </div>
          <FormField label="Reason" required><textarea rows={3} placeholder="Reason for leave..." /></FormField>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
            <SecondaryBtn onClick={() => setApplyOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={() => { setApplyOpen(false); show('✅ Leave application submitted!'); }}>Submit Application</PrimaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── COMMUNICATION ───────────────────────────────────────────────────────────
export function Communication() {
  const { show, Toast } = useToast();
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [selectedChat, setSelectedChat] = useState(0);
  const [chatMsg, setChatMsg] = useState('');
  const [chats, setChats] = useState([
    { id: 0, name: 'Priya Verma', role: 'Math Teacher', msgs: [{ from: 'them', text: 'Aarav scored 87 in today\'s test!' }, { from: 'me', text: 'Great! Thanks for the update.' }] },
    { id: 1, name: 'Amit Joshi', role: 'Science Teacher', msgs: [{ from: 'them', text: 'Lab report submission pending for 5 students.' }] },
    { id: 2, name: 'All Teachers', role: 'Group', msgs: [{ from: 'me', text: 'Staff meeting tomorrow at 4 PM.' }] },
  ]);

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    setChats(prev => prev.map((c, i) => i === selectedChat ? { ...c, msgs: [...c.msgs, { from: 'me', text: chatMsg }] } : c));
    setChatMsg('');
  };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Communication" subtitle="Internal messages and broadcast announcements" />
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Chat list */}
        <GlassCard noHover padding="p-4">
          <SectionTitle>Conversations</SectionTitle>
          <div className="space-y-1">
            {chats.map((c, i) => (
              <div key={c.id} onClick={() => setSelectedChat(i)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedChat === i ? 'bg-blue-500/15 border border-blue-500/20' : 'hover:bg-slate-800/30'}`}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>{c.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium">{c.name}</p>
                  <p className="text-slate-500 text-[10px] truncate">{c.msgs[c.msgs.length - 1]?.text}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Chat window */}
        <GlassCard noHover padding="p-0" className="lg:col-span-2 overflow-hidden flex flex-col" style={{ height: '400px' }}>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/40">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>{chats[selectedChat]?.name.charAt(0)}</div>
            <div><p className="text-white text-sm font-medium">{chats[selectedChat]?.name}</p><p className="text-slate-500 text-[10px]">{chats[selectedChat]?.role}</p></div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chats[selectedChat]?.msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={m.from === 'me' ? 'chat-bubble-user' : 'chat-bubble-ai'}>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-700/40 flex gap-2">
            <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Type a message..." style={{ flex: 1, paddingTop: '0.5rem', paddingBottom: '0.5rem' }} />
            <PrimaryBtn onClick={sendChat}>Send</PrimaryBtn>
          </div>
        </GlassCard>
      </div>

      {/* Broadcast */}
      <GlassCard noHover>
        <SectionTitle>Broadcast Announcement</SectionTitle>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <FormField label="Title"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement title" /></FormField>
            <FormField label="Send To"><select><option>All</option><option>Students</option><option>Parents</option><option>Teachers</option></select></FormField>
            <FormField label="Priority"><select><option>Normal</option><option>High</option><option>Urgent</option></select></FormField>
          </div>
          <div className="space-y-3">
            <FormField label="Message"><textarea rows={4} value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type your announcement..." /></FormField>
            <PrimaryBtn onClick={() => { if (!title || !msg) return show('⚠️ Please fill title and message'); show(`📢 Announcement "${title}" sent to all!`); setTitle(''); setMsg(''); }}>📢 Send Announcement</PrimaryBtn>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── EVENTS ──────────────────────────────────────────────────────────────────
export function Events() {
  const { show, Toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [notices, setNotices] = useState(NOTICES);
  const PRIORITY_COLOR = { high: 'red', medium: 'yellow', low: 'blue' };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Events & Notice Board" subtitle="School notices and events"
        actions={<PrimaryBtn onClick={() => setAddOpen(true)}>➕ Create Notice</PrimaryBtn>} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map((n, i) => (
          <div key={n.id} className={`glass p-5 animate-fade-in delay-${i * 100}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2"><span className="text-2xl">📢</span><div><p className="text-white font-semibold text-sm">{n.title}</p><p className="text-slate-500 text-xs">{n.date} · For: {n.target}</p></div></div>
              <Badge type={PRIORITY_COLOR[n.priority]}>{n.priority}</Badge>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">{n.content}</p>
            <div className="flex gap-2">
              <PrimaryBtn small onClick={() => show(`✏️ Editing: ${n.title}`)}>Edit</PrimaryBtn>
              <SecondaryBtn small onClick={() => show(`📢 Re-sent: ${n.title}`)}>Resend</SecondaryBtn>
              <DangerBtn small onClick={() => { setNotices(prev => prev.filter(x => x.id !== n.id)); show(`🗑 Notice deleted`); }}>Delete</DangerBtn>
            </div>
          </div>
        ))}
      </div>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Create Notice/Event" width="max-w-lg">
        <div className="space-y-3">
          <FormField label="Title" required><input placeholder="e.g. Republic Day Celebration" /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Type"><select><option>Notice</option><option>Event</option><option>Holiday</option><option>Exam</option></select></FormField>
            <FormField label="Priority"><select><option>Medium</option><option>High</option><option>Low</option></select></FormField>
            <FormField label="Publish Date"><input type="date" defaultValue={new Date().toISOString().split('T')[0]} /></FormField>
            <FormField label="Target Audience"><select><option>All</option><option>Students</option><option>Parents</option><option>Teachers</option></select></FormField>
          </div>
          <FormField label="Content" required><textarea rows={4} placeholder="Write your notice/event details here..." /></FormField>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
            <SecondaryBtn onClick={() => setAddOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={() => { setAddOpen(false); show('✅ Notice published!'); }}>Publish Notice</PrimaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── CERTIFICATES ────────────────────────────────────────────────────────────
export function Certificates() {
  const { show, Toast } = useToast();
  const [genOpen, setGenOpen] = useState(null);
  const [idCardOpen, setIdCardOpen] = useState(false);

  const certTypes = [
    { title: 'Transfer Certificate', icon: '📄', count: 5, color: 'from-blue-500 to-cyan-500' },
    { title: 'Bonafide Certificate', icon: '🏅', count: 12, color: 'from-emerald-500 to-teal-500' },
    { title: 'Character Certificate', icon: '⭐', count: 8, color: 'from-purple-500 to-violet-500' },
    { title: 'ID Cards', icon: '🪪', count: 200, color: 'from-amber-500 to-orange-500' },
  ];

  const generateCert = (type, student) => {
    const w = window.open('', '_blank', 'width=700,height=600');
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    let body = '';
    if (type === 'Bonafide Certificate') {
      body = `<p>This is to certify that <strong>${student.name}</strong> (Admission No: ${student.admissionNo}) is a bonafide student of ${student.class}, Section ${student.section} of this school during the academic year 2025-26.</p><p style="margin-top:12px">This certificate is issued on the request of the student for the purpose of ______________________.</p>`;
    } else if (type === 'Transfer Certificate') {
      body = `<p>This is to certify that <strong>${student.name}</strong> (Admission No: ${student.admissionNo}) was a bonafide student of ${student.class} in this institution. The student is hereby granted Transfer Certificate to seek admission in another institution.</p><p style="margin-top:12px">Date of Leaving: ${date}<br/>Reason: Parent's request</p>`;
    } else {
      body = `<p>This is to certify that <strong>${student.name}</strong> (Admission No: ${student.admissionNo}), student of ${student.class}, has borne a good moral character during their stay in this institution. The student has been sincere, disciplined, and well-behaved throughout.</p>`;
    }
    w.document.write(`<!DOCTYPE html><html><head><title>${type}</title><style>body{font-family:Arial,sans-serif;padding:40px;max-width:680px;margin:0 auto;color:#333}h1{text-align:center;color:#1e3a5f;font-size:22px;margin-bottom:4px}h2{text-align:center;color:#555;font-size:15px;font-weight:normal;border-bottom:2px solid #1e3a5f;padding-bottom:8px;margin-bottom:20px}h3{text-align:center;font-size:17px;color:#1e3a5f;margin:12px 0}p{line-height:1.7;font-size:14px}.info{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:15px 0}.info-row{font-size:13px}.label{color:#666}.sig{margin-top:50px;display:flex;justify-content:space-between}.sig-line{text-align:center;border-top:1px solid #333;width:150px;padding-top:5px;font-size:12px}@media print{button{display:none}}</style></head><body><h1>NEXTWAY Academy</h1><h2>CBSE · Indore, Madhya Pradesh</h2><h3>${type.toUpperCase()}</h3><hr/><div class="info"><div class="info-row"><span class="label">Student Name: </span><strong>${student.name}</strong></div><div class="info-row"><span class="label">Admission No: </span>${student.admissionNo}</div><div class="info-row"><span class="label">Class: </span>${student.class} ${student.section}</div><div class="info-row"><span class="label">Date: </span>${date}</div></div><hr/><br/>${body}<div class="sig"><div class="sig-line">Class Teacher</div><div class="sig-line">Principal</div></div><br/><button onclick="window.print()" style="width:100%;padding:10px;background:#1e3a5f;color:white;border:none;border-radius:5px;cursor:pointer">Print Certificate</button></body></html>`);
    w.document.close();
    show(`✅ ${type} generated!`);
  };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Certificates & ID Cards" subtitle="Generate transfer, bonafide and character certificates" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {certTypes.map((c, i) => (
          <div key={i} className={`glass p-5 cursor-pointer text-center animate-fade-in delay-${i * 100}`} onClick={() => c.title === 'ID Cards' ? setIdCardOpen(true) : setGenOpen(c.title)}>
            <span className="text-4xl mb-3 block">{c.icon}</span>
            <p className="text-white font-semibold text-sm">{c.title}</p>
            <p className="text-slate-400 text-xs mt-1">{c.count} generated</p>
            <PrimaryBtn small>Generate</PrimaryBtn>
          </div>
        ))}
      </div>

      {/* Recent Certs Table */}
      <GlassCard noHover>
        <SectionTitle>Recent Certificates</SectionTitle>
        <table className="data-table">
          <thead><tr><th>Student</th><th>Certificate</th><th>Serial No</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>
            {[{ s: STUDENTS[0], t: 'Bonafide Certificate', sn: 'BC-2026-001', d: '2026-04-25' }, { s: STUDENTS[1], t: 'Transfer Certificate', sn: 'TC-2026-001', d: '2026-04-20' }, { s: STUDENTS[2], t: 'Character Certificate', sn: 'CC-2026-001', d: '2026-04-18' }].map((r, i) => (
              <tr key={i}>
                <td className="text-white font-medium">{r.s.name}</td>
                <td><Badge type="blue">{r.t}</Badge></td>
                <td className="text-slate-400 text-xs">{r.sn}</td>
                <td className="text-slate-400">{r.d}</td>
                <td><PrimaryBtn small onClick={() => generateCert(r.t, r.s)}>🖨️ Reprint</PrimaryBtn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* Generate Certificate Modal */}
      <Modal open={!!genOpen} onClose={() => setGenOpen(null)} title={`Generate ${genOpen}`} width="max-w-md">
        <div className="space-y-3">
          <FormField label="Select Student"><select>{STUDENTS.map(s => <option key={s.id}>{s.name} — {s.class}</option>)}</select></FormField>
          <FormField label="Date"><input type="date" defaultValue={new Date().toISOString().split('T')[0]} /></FormField>
          <FormField label="Reason / Purpose"><input placeholder="e.g. For bank account opening" /></FormField>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
            <SecondaryBtn onClick={() => setGenOpen(null)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={() => { generateCert(genOpen, STUDENTS[0]); setGenOpen(null); }}>Generate & Print</PrimaryBtn>
          </div>
        </div>
      </Modal>

      {/* ID Card Modal */}
      <Modal open={idCardOpen} onClose={() => setIdCardOpen(false)} title="Generate ID Cards" width="max-w-md">
        <div className="space-y-3">
          <FormField label="Generate For"><select><option>Single Student</option><option>Entire Class</option><option>All Students</option></select></FormField>
          <FormField label="Student (if single)"><select>{STUDENTS.map(s => <option key={s.id}>{s.name} — {s.class}</option>)}</select></FormField>
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-700/40">
            <SecondaryBtn onClick={() => setIdCardOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={() => { const s = STUDENTS[0]; const w = window.open('', '_blank', 'width=400,height=500'); const grad = s.gender === 'Female' ? '#ec4899,#be185d' : '#3b82f6,#1d4ed8'; w.document.write(`<!DOCTYPE html><html><head><title>ID Card</title><style>body{font-family:Arial;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#f5f5f5;margin:0;padding:20px}.card{width:300px;border-radius:12px;overflow:hidden;border:2px solid #1e3a5f;background:white}.header{background:linear-gradient(135deg,${grad});padding:18px;text-align:center;color:white}.avatar{width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:bold;margin:0 auto 8px}.name{font-size:15px;font-weight:bold}.role{font-size:11px;opacity:0.85}.body{padding:15px}.row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f0f0f0;font-size:12px}.label{color:#666}.footer{background:#f8f9fa;padding:10px;text-align:center;font-size:10px;color:#666}@media print{button{display:none}}</style></head><body><div class="card"><div class="header"><div class="avatar">${s.name.charAt(0)}</div><div class="name">${s.name}</div><div class="role">Student | NEXTWAY Academy</div></div><div class="body"><div class="row"><span class="label">Adm No</span><span>${s.admissionNo}</span></div><div class="row"><span class="label">Class</span><span>${s.class}${s.section}</span></div><div class="row"><span class="label">Roll No</span><span>${s.rollNo}</span></div><div class="row"><span class="label">DOB</span><span>${s.dob}</span></div><div class="row"><span class="label">Blood</span><span style="color:red;font-weight:bold">B+</span></div></div><div class="footer">AY 2025-26 | Valid for current academic year only</div></div><br/><button onclick="window.print()" style="width:300px;padding:10px;background:#1e3a5f;color:white;border:none;border-radius:8px;cursor:pointer">Print ID Card</button></body></html>`); w.document.close(); setIdCardOpen(false); show('🪪 ID card opened!'); }}>Generate & Print</PrimaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── REPORTS ─────────────────────────────────────────────────────────────────
export function Reports() {
  const { show, Toast } = useToast();

  const attendanceData = [
    { month: 'Jan', percentage: 91 }, { month: 'Feb', percentage: 88 }, { month: 'Mar', percentage: 93 },
    { month: 'Apr', percentage: 92 }, { month: 'May', percentage: 87 }, { month: 'Jun', percentage: 90 },
  ];

  const exportAttendance = () => {
    downloadCSV('attendance-report.csv',
      ['Student', 'Class', 'Total Days', 'Present', 'Absent', 'Late', 'Percentage'],
      STUDENTS.map(s => [s.name, s.class, 25, Math.round(25 * s.attendance / 100), Math.round(25 * (1 - s.attendance / 100)), 1, `${s.attendance}%`])
    );
    show('⬇️ Attendance report exported!');
  };

  const exportFees = () => {
    const { FEE_INVOICES } = require('../../data/mockData');
    downloadCSV('fee-report.csv',
      ['Student', 'Class', 'Total Amount', 'Paid', 'Balance', 'Status', 'Method'],
      FEE_INVOICES.map(f => [f.student, f.class, f.amount, f.paid, f.balance, f.status, f.method])
    );
    show('⬇️ Fee collection report exported!');
  };

  const exportStudents = () => {
    downloadCSV('students-report.csv',
      ['Name', 'Admission No', 'Class', 'Section', 'Gender', 'Attendance %', 'Fee Status'],
      STUDENTS.map(s => [s.name, s.admissionNo, s.class, s.section, s.gender, s.attendance, s.fees])
    );
    show('⬇️ Student report exported!');
  };

  const reportCards = [
    { title: 'Attendance Report', icon: '📋', desc: 'Monthly attendance summary', color: 'from-blue-500 to-cyan-500', onExport: exportAttendance },
    { title: 'Fee Collection',    icon: '💰', desc: 'Payment and dues summary',   color: 'from-emerald-500 to-teal-500', onExport: exportFees },
    { title: 'Student Report',    icon: '🎓', desc: 'Class-wise student data',    color: 'from-purple-500 to-violet-500', onExport: exportStudents },
    {
      title: 'Exam Results',   icon: '📊', desc: 'Subject-wise performance',   color: 'from-amber-500 to-orange-500',
      onExport: () => { downloadCSV('exam-results.csv', ['Student', 'Class', 'Math', 'Science', 'English', 'Hindi', 'Total', '%', 'Grade'], STUDENTS.slice(0, 8).map(s => { const marks = [rand(60, 98), rand(60, 98), rand(60, 98), rand(60, 98)]; const tot = marks.reduce((a, b) => a + b, 0); return [s.name, s.class, ...marks, tot, Math.round(tot / 400 * 100) + '%', tot > 320 ? 'A' : 'B']; })); show('⬇️ Exam results exported!'); },
    },
  ];

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Reports Dashboard" subtitle="Analytics and exportable reports" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {reportCards.map((r, i) => (
          <div key={i} className={`glass p-5 cursor-pointer text-center animate-fade-in delay-${i * 100}`}>
            <span className="text-3xl mb-2 block">{r.icon}</span>
            <p className="text-white font-medium text-sm">{r.title}</p>
            <p className="text-slate-500 text-xs mb-3">{r.desc}</p>
            <div className="flex gap-1 justify-center flex-wrap">
              <PrimaryBtn small onClick={r.onExport}>⬇️ CSV</PrimaryBtn>
              <SecondaryBtn small onClick={() => show(`🖨️ ${r.title} sent to printer`)}>🖨️ Print</SecondaryBtn>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <GlassCard noHover>
          <SectionTitle>Monthly Attendance %</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData} barSize={30}>
              <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="percentage" fill="url(#rGrad)" radius={[6, 6, 0, 0]} />
              <defs><linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard noHover>
          <SectionTitle>Top Performing Students</SectionTitle>
          <div className="space-y-2">
            {[{ name: 'Ananya Singh', cls: '10A', score: '94.2%', rank: 1 }, { name: 'Aarav Gupta', cls: '8A', score: '82.8%', rank: 2 }, { name: 'Riya Sharma', cls: '9B', score: '80.1%', rank: 3 }, { name: 'Pooja Agarwal', cls: '9A', score: '79.5%', rank: 4 }].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.4)' }}>
                <span className="text-lg font-bold w-6" style={{ color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#cd7f32' }}>#{s.rank}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>{s.name.charAt(0)}</div>
                <div className="flex-1"><p className="text-white text-sm">{s.name}</p><p className="text-slate-500 text-xs">Class {s.cls}</p></div>
                <span className="text-emerald-400 font-bold text-sm">{s.score}</span>
              </div>
            ))}
          </div>
          <PrimaryBtn onClick={() => { downloadCSV('top-students.csv', ['Rank', 'Name', 'Class', 'Score'], [['1', 'Ananya Singh', '10A', '94.2%'], ['2', 'Aarav Gupta', '8A', '82.8%'], ['3', 'Riya Sharma', '9B', '80.1%']]); show('⬇️ Top students list exported!'); }}>⬇️ Export</PrimaryBtn>
        </GlassCard>
      </div>
    </div>
  );
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
export function Settings() {
  const { show, Toast } = useToast();
  const [form, setForm] = useState({ name: 'NEXTWAY Academy', code: 'NWA001', board: 'CBSE', city: 'Indore', phone: '+91 731 400 0000', email: 'info@nextway.edu.in' });

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Settings & Master Data" subtitle="Configure school settings" />
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard noHover>
          <SectionTitle>School Information</SectionTitle>
          <div className="space-y-3">
            {[['School Name', 'name', 'text'], ['School Code', 'code', 'text'], ['Board', 'board', 'text'], ['City', 'city', 'text'], ['Phone', 'phone', 'text'], ['Email', 'email', 'email']].map(([label, field, type]) => (
              <FormField key={field} label={label}><input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} /></FormField>
            ))}
            <PrimaryBtn onClick={() => show('✅ School information saved!')}>Save Changes</PrimaryBtn>
          </div>
        </GlassCard>
        <div className="space-y-4">
          <GlassCard noHover>
            <SectionTitle>Master Data</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {['Fee Heads', 'Leave Types', 'Subject Categories', 'Designations', 'Departments', 'Grading Scale', 'Academic Year', 'Holidays'].map(m => (
                <button key={m} onClick={() => show(`✏️ Editing: ${m}`)} className="glass p-3 text-left hover:bg-slate-700/30 transition-all">
                  <p className="text-slate-300 text-xs font-medium">{m}</p>
                </button>
              ))}
            </div>
          </GlassCard>
          <GlassCard noHover>
            <SectionTitle>Current Academic Year</SectionTitle>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <p className="text-white font-semibold">2025-26</p>
              <p className="text-slate-400 text-xs mt-1">Apr 1, 2025 — Mar 31, 2026</p>
              <span className="badge badge-green mt-2 inline-block">Current</span>
            </div>
            <PrimaryBtn onClick={() => show('🔄 Promoting to new academic year 2026-27...')}>Promote to Next Year</PrimaryBtn>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────
export function AuditLogs() {
  const { show, Toast } = useToast();
  const ACTION_COLOR = { UPDATE: 'yellow', CREATE: 'green', DELETE: 'red', LOGIN: 'blue', EXPORT: 'purple' };

  return (
    <div className="space-y-5">
      <Toast />
      <PageHeader title="Audit Logs" subtitle="Immutable trail of all system actions"
        actions={<SecondaryBtn onClick={() => { downloadCSV('audit-logs.csv', ['Timestamp', 'User', 'Action', 'Entity', 'Detail', 'IP'], AUDIT_LOGS.map(l => [l.time, l.user, l.action, l.entity, l.detail, l.ip])); show('⬇️ Audit log exported!'); }}>⬇️ Export</SecondaryBtn>} />
      <div className="glass-static p-4 flex gap-3 flex-wrap">
        <select style={{ width: 'auto', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}><option>All Actions</option><option>CREATE</option><option>UPDATE</option><option>DELETE</option><option>LOGIN</option></select>
        <select style={{ width: 'auto', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}><option>All Users</option>{AUDIT_LOGS.map((l, i) => <option key={i}>{l.user}</option>)}</select>
        <input type="date" style={{ width: 'auto', paddingTop: '0.5rem', paddingBottom: '0.5rem' }} />
      </div>
      <div className="glass-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Entity</th><th>Detail</th><th>IP Address</th></tr></thead>
            <tbody>
              {AUDIT_LOGS.map(l => (
                <tr key={l.id}>
                  <td className="text-slate-400 text-xs">{l.time}</td>
                  <td className="text-white font-medium text-sm">{l.user}</td>
                  <td><Badge type={ACTION_COLOR[l.action] || 'blue'}>{l.action}</Badge></td>
                  <td><span className="badge badge-purple">{l.entity}</span></td>
                  <td className="text-slate-400 text-xs max-w-xs">{l.detail}</td>
                  <td className="text-slate-500 text-xs font-mono">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
