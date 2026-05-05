import { useState, useMemo, useEffect } from 'react';
import { PageHeader, PrimaryBtn, SecondaryBtn, SearchBar, Badge, Modal, FormField, StatCard, GlassCard, SectionTitle, DangerBtn } from '../../components/ui';
import { studentsApi } from '../../services/api';

const STATUS_MAP = { active: 'green', inactive: 'red' };
const FEE_MAP    = { paid: 'green', pending: 'yellow', overdue: 'red' };

const GENDER_GRAD = { Male: 'from-blue-500 to-cyan-500', Female: 'from-pink-500 to-rose-500' };

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,       setSearch]      = useState('');
  const [filterClass,  setFilterClass] = useState('');
  const [filterStatus, setFilterStatus]= useState('');
  const [addOpen,      setAddOpen]     = useState(false);
  const [viewStudent,  setViewStudent] = useState(null);
  const [editStudent,  setEditStudent] = useState(null);
  const [toast,        setToast]       = useState('');
  const [form,         setForm]        = useState({ firstName:'', lastName:'', class:'Class 8', section:'A', gender:'Male', dob:'', phone:'', blood:'', email:'' });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsApi.list();
      setStudents(response.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Load students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = useMemo(() =>
    students.filter(s =>
      (s.name?.toLowerCase().includes(search.toLowerCase()) ||
       s.admissionNo?.toLowerCase().includes(search.toLowerCase())) &&
      (!filterClass  || s.class === filterClass) &&
      (!filterStatus || s.status === filterStatus)
    ), [students, search, filterClass, filterStatus]);

  const handleAdd = async () => {
    try {
      // Map class name to classId - you'll need to fetch this from API or use hardcoded mapping
      const classMap = {
        'Class 1': '69f993cecadb689a0ada52e0',
        'Class 2': '69f993cecadb689a0ada52e1',
        'Class 3': '69f993cecadb689a0ada52e2',
        'Class 4': '69f993cecadb689a0ada52e3',
        'Class 5': '69f993cecadb689a0ada52e4',
        'Class 6': '69f993cecadb689a0ada52e5',
        'Class 7': '69f993cecadb689a0ada52e6',
        'Class 8': '69f993cecadb689a0ada52e7',
        'Class 9': '69f993cecadb689a0ada52e8',
        'Class 10': '69f993cecadb689a0ada52e9',
      };
      
      const response = await studentsApi.create({
        firstName: form.firstName,
        lastName: form.lastName,
        classId: classMap[form.class] || classMap['Class 8'],
        gender: form.gender,
        dateOfBirth: form.dob,
        phone: form.phone,
        bloodGroup: form.blood,
        email: form.email || undefined
      });
      
      // Show credentials to admin
      const creds = response.tempPassword ? 
        `✅ Student created! Email: ${response.student.email || form.email}, Password: ${response.tempPassword}` :
        '✅ Student added successfully!';
      showToast(creds);
      
      setAddOpen(false);
      setForm({ firstName:'', lastName:'', class:'Class 8', section:'A', gender:'Male', dob:'', phone:'', blood:'', email:'' });
      fetchStudents(); // Refresh list
    } catch (error) {
      showToast('❌ ' + (error.message || 'Failed to add student'));
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-glass animate-slide-in-up"
          style={{background:'linear-gradient(135deg,#10b981,#059669)'}}>
          {toast}
        </div>
      )}

      <PageHeader title="Students" subtitle={`${students.length} students enrolled · ${students.filter(s=>s.status==='active').length} active`}
        actions={<>
          <SecondaryBtn onClick={() => showToast('📥 CSV template downloaded!')}>⬆️ Import CSV</SecondaryBtn>
          <SecondaryBtn onClick={() => showToast('📊 Export started!')}>⬇️ Export</SecondaryBtn>
          <PrimaryBtn onClick={() => setAddOpen(true)}>➕ Add Student</PrimaryBtn>
        </>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students"  value={students.length}                                     icon="🎓" gradient="from-blue-500 to-cyan-500"    delay={0}  />
        <StatCard title="Active"          value={students.filter(s=>s.status==='active').length}       icon="✅" gradient="from-emerald-500 to-teal-500" delay={0.1}/>
        <StatCard title="Fee Defaulters"  value={students.filter(s=>s.fees==='overdue').length}        icon="🚨" gradient="from-red-500 to-rose-500"     delay={0.2}/>
        <StatCard title="Avg Attendance"  value={`${students.length > 0 ? Math.round(students.reduce((a,s)=>a+(s.attendance||0),0)/students.length) : 0}%`} icon="📋" gradient="from-purple-500 to-violet-500" delay={0.3}/>
      </div>

      {/* Filters */}
      <div className="glass-static p-4 flex flex-wrap gap-3 items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or admission no…"/>
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
          style={{width:'auto',paddingTop:'0.5rem',paddingBottom:'0.5rem'}}>
          <option value="">All Classes</option>
          {['Class 6','Class 7','Class 8','Class 9','Class 10'].map(c=><option key={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{width:'auto',paddingTop:'0.5rem',paddingBottom:'0.5rem'}}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {(search||filterClass||filterStatus) && (
          <button className="text-slate-400 hover:text-white text-xs transition-colors"
            onClick={() => { setSearch(''); setFilterClass(''); setFilterStatus(''); }}>
            ✕ Clear filters
          </button>
        )}
        <span className="ml-auto text-slate-500 text-xs">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="glass-static overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-2 animate-pulse">⏳</p>
            <p className="text-white font-semibold">Loading students...</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th><th>Admission No</th><th>Class & Section</th>
                <th>Attendance</th><th>Fee Status</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className={`animate-fade-in`} style={{animationDelay:`${Math.min(i,8)*0.05}s`}}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 bg-gradient-to-br ${GENDER_GRAD[s.gender]||'from-blue-500 to-cyan-500'}`}>
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium leading-tight">{s.name}</p>
                        <p className="text-slate-500 text-[10px]">{s.gender} · DOB {s.dob}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-slate-400 text-xs font-mono">{s.admissionNo}</td>
                  <td>
                    <span className="badge badge-blue">{s.class}</span>
                    <span className="badge badge-purple ml-1">Sec {s.section}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{width:`${s.attendance}%`,background:s.attendance>=90?'#10b981':s.attendance>=75?'#f59e0b':'#ef4444'}}/>
                      </div>
                      <span className={`text-xs font-semibold ${s.attendance>=90?'text-emerald-400':s.attendance>=75?'text-yellow-400':'text-red-400'}`}>{s.attendance}%</span>
                    </div>
                  </td>
                  <td><Badge type={FEE_MAP[s.fees]}>{s.fees}</Badge></td>
                  <td><Badge type={STATUS_MAP[s.status]}>{s.status}</Badge></td>
                  <td>
                    <div className="flex gap-1.5">
                      <button onClick={() => setViewStudent(s)}
                        className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded-lg hover:bg-blue-500/10 transition-all">View</button>
                      <button onClick={() => setEditStudent(s)}
                        className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-slate-700/40 transition-all">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <p className="text-4xl mb-2">🔍</p>
              <p className="text-white font-semibold">No students found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
        )}
      </div>

      {/* ── ADD STUDENT MODAL ── */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Student" width="max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="First Name" required><input value={form.firstName} onChange={e=>setForm(f=>({...f,firstName:e.target.value}))} placeholder="e.g. Aarav"/></FormField>
          <FormField label="Last Name"  required><input value={form.lastName} onChange={e=>setForm(f=>({...f,lastName:e.target.value}))} placeholder="e.g. Gupta"/></FormField>
          <FormField label="Date of Birth" required><input type="date" value={form.dob} onChange={e=>setForm(f=>({...f,dob:e.target.value}))}/></FormField>
          <FormField label="Gender">
            <select value={form.gender} onChange={e=>setForm(f=>({...f,gender:e.target.value}))}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </FormField>
          <FormField label="Class">
            <select value={form.class} onChange={e=>setForm(f=>({...f,class:e.target.value}))}>
              {['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10'].map(c=><option key={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Section">
            <select value={form.section} onChange={e=>setForm(f=>({...f,section:e.target.value}))}>
              <option>A</option><option>B</option><option>C</option>
            </select>
          </FormField>
          <FormField label="Parent Phone" required>
            <input type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="10-digit number"/>
          </FormField>
          <FormField label="Student Email (optional)">
            <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="student@email.com"/>
          </FormField>
          <FormField label="Blood Group">
            <select value={form.blood} onChange={e=>setForm(f=>({...f,blood:e.target.value}))}>
              <option value="">Unknown</option>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=><option key={b}>{b}</option>)}
            </select>
          </FormField>
          <FormField label="Aadhaar No"><input placeholder="12-digit number" maxLength={12}/></FormField>
        </div>
        <div className="mt-4">
          <FormField label="Home Address">
            <textarea rows={2} placeholder="Full residential address…"/>
          </FormField>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mt-4">
          <p className="text-blue-400 text-xs">ℹ️ A student account will be created automatically. Login credentials will be shown after creation.</p>
        </div>
        <div className="flex gap-3 mt-5 justify-end border-t border-slate-700/40 pt-4">
          <SecondaryBtn onClick={() => setAddOpen(false)}>Cancel</SecondaryBtn>
          <PrimaryBtn onClick={handleAdd} disabled={!form.firstName || !form.lastName || !form.phone}>✅ Create Student & Account</PrimaryBtn>
        </div>
      </Modal>

      {/* ── VIEW STUDENT MODAL ── */}
      <Modal open={!!viewStudent} onClose={() => setViewStudent(null)} title="Student Profile" width="max-w-lg">
        {viewStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold bg-gradient-to-br ${GENDER_GRAD[viewStudent.gender]}`}>
                {viewStudent.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-white text-xl font-bold font-poppins">{viewStudent.name}</h3>
                <p className="text-slate-400 text-sm">{viewStudent.admissionNo}</p>
                <div className="flex gap-1.5 mt-1">
                  <Badge type="blue">{viewStudent.class}</Badge>
                  <Badge type={STATUS_MAP[viewStudent.status]}>{viewStudent.status}</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                {l:'Roll No',    v:viewStudent.rollNo},
                {l:'Section',   v:viewStudent.section},
                {l:'Gender',    v:viewStudent.gender},
                {l:'DOB',       v:viewStudent.dob},
                {l:'Phone',     v:viewStudent.phone},
                {l:'Fee Status',v:viewStudent.fees},
              ].map(f=>(
                <div key={f.l} className="p-3 rounded-xl" style={{background:'rgba(30,41,59,0.5)'}}>
                  <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wide">{f.l}</p>
                  <p className="text-white text-sm font-semibold mt-0.5">{f.v}</p>
                </div>
              ))}
            </div>
            {/* Attendance bar */}
            <div className="p-4 rounded-xl" style={{background:'rgba(30,41,59,0.5)'}}>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Attendance</span>
                <span className={`text-sm font-bold ${viewStudent.attendance>=90?'text-emerald-400':viewStudent.attendance>=75?'text-yellow-400':'text-red-400'}`}>{viewStudent.attendance}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width:`${viewStudent.attendance}%`,background:viewStudent.attendance>=90?'linear-gradient(135deg,#10b981,#059669)':viewStudent.attendance>=75?'linear-gradient(135deg,#f59e0b,#d97706)':'linear-gradient(135deg,#ef4444,#dc2626)'}}/>
              </div>
              {viewStudent.attendance < 75 && (
                <p className="text-red-400 text-xs mt-1.5">⚠️ Below required 75% threshold</p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <PrimaryBtn small onClick={() => { setViewStudent(null); showToast('Opening attendance records…'); }}>📋 Attendance</PrimaryBtn>
              <PrimaryBtn small onClick={() => { setViewStudent(null); showToast('Opening fee records…'); }}>💰 Fees</PrimaryBtn>
              <PrimaryBtn small onClick={() => { setViewStudent(null); showToast('Opening results…'); }}>📄 Results</PrimaryBtn>
              <SecondaryBtn small onClick={() => showToast('🖨️ ID Card sent to printer!')}>🪪 ID Card</SecondaryBtn>
            </div>
          </div>
        )}
      </Modal>

      {/* ── EDIT STUDENT MODAL ── */}
      <Modal open={!!editStudent} onClose={() => setEditStudent(null)} title="Edit Student" width="max-w-lg">
        {editStudent && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl text-sm" style={{background:'rgba(59,130,246,0.08)',border:'1px solid rgba(59,130,246,0.15)'}}>
              <span className="text-blue-400">Editing: </span>
              <span className="text-white font-medium">{editStudent.name}</span>
              <span className="text-slate-400"> · {editStudent.admissionNo}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Class">
                <select defaultValue={editStudent.class}>
                  {['Class 6','Class 7','Class 8','Class 9','Class 10'].map(c=><option key={c}>{c}</option>)}
                </select>
              </FormField>
              <FormField label="Section">
                <select defaultValue={editStudent.section}><option>A</option><option>B</option></select>
              </FormField>
              <FormField label="Phone"><input defaultValue={editStudent.phone}/></FormField>
              <FormField label="Status">
                <select defaultValue={editStudent.status}><option value="active">Active</option><option value="inactive">Inactive</option></select>
              </FormField>
            </div>
            <div className="flex gap-3 justify-between pt-4 border-t border-slate-700/40">
              <DangerBtn onClick={() => { setEditStudent(null); showToast('⚠️ Student deactivated'); }}>Deactivate</DangerBtn>
              <div className="flex gap-2">
                <SecondaryBtn onClick={() => setEditStudent(null)}>Cancel</SecondaryBtn>
                <PrimaryBtn onClick={() => { setEditStudent(null); showToast('✅ Student updated!'); }}>Save Changes</PrimaryBtn>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
