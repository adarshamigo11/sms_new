import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../services/api';

const ROLES = [
  { key:'admin',   label:'School Admin', icon:'🏫', color:'from-blue-500 to-cyan-500',    desc:'Full access · All modules',     email:'admin@nextway.edu'           },
  { key:'teacher', label:'Teacher',      icon:'👩‍🏫', color:'from-emerald-500 to-teal-500', desc:'Classes · Attendance · Grades',  email:'priya@nextway.edu'            },
  { key:'student', label:'Student',      icon:'🎓', color:'from-purple-500 to-violet-500', desc:'Dashboard · AI Doubt Solver',   email:'aarav@student.nextway.edu'    },
  { key:'parent',  label:'Parent',       icon:'👨‍👩‍👧', color:'from-amber-500 to-orange-500',  desc:"Track your child's progress",  email:'suresh@gmail.com'             },
];

const FEATURES = [
  { icon:'✅', text:'Student & Fee Management' },
  { icon:'📊', text:'Real-time Analytics' },
  { icon:'🤖', text:'AI-Powered Doubt Solver' },
  { icon:'📚', text:'Complete Academic Suite' },
  { icon:'🚌', text:'Transport & Hostel' },
  { icon:'📋', text:'Attendance & Leave Tracking' },
];

export default function Login() {
  const { login, demoLogin } = useAuth();
  const navigate   = useNavigate();
  const [selected, setSelected]  = useState('admin');
  const [email,    setEmail]     = useState('admin@nextway.edu');
  const [password, setPassword]  = useState('');
  const [showPass, setShowPass]  = useState(false);
  const [loading,  setLoading]   = useState(false);
  const [error,    setError]     = useState('');


  const handleRoleSelect = (r) => { setSelected(r.key); setEmail(r.email); setError(''); };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email'); return; }
    setError(''); setLoading(true);
    try {
      const user = await login(email, password);
      const role = ROUTE_MAP[user.role] || 'admin';
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    demoLogin(selected);
    navigate(`/${selected}/dashboard`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{position:'absolute',top:'-15%',right:'-8%',width:'500px',height:'500px',borderRadius:'50%',background:'radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)'}}/>
        <div style={{position:'absolute',bottom:'-15%',left:'-8%',width:'500px',height:'500px',borderRadius:'50%',background:'radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)'}}/>
      </div>

      <div className="w-full max-w-4xl animate-scale-in" style={{position:'relative',zIndex:1}}>
        <div className="grid md:grid-cols-5 rounded-2xl overflow-hidden shadow-glass-lg">

          {/* Left */}
          <div className="hidden md:flex md:col-span-2 flex-col justify-between p-8"
            style={{background:'linear-gradient(160deg, rgba(17,24,39,0.97) 0%, rgba(15,23,42,0.97) 100%)', borderRight:'1px solid rgba(148,163,184,0.08)'}}>
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
                  style={{background:'linear-gradient(135deg,#3b82f6,#06b6d4)'}}>N</div>
                <div>
                  <div className="text-white font-bold text-xl font-poppins">NEXTWAY</div>
                  <div className="text-slate-500 text-xs">School Management System</div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white font-poppins leading-snug mb-2">
                Manage Your School<br/>
                <span style={{background:'linear-gradient(135deg,#3b82f6,#06b6d4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                  Smarter & Faster
                </span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">Complete school management solution for modern institutions.</p>
            </div>
            <div className="space-y-2.5">
              {FEATURES.map((f,i)=>(
                <div key={i} className="flex items-center gap-2.5 animate-slide-in-left" style={{animationDelay:`${i*0.07}s`}}>
                  <span className="text-base">{f.icon}</span>
                  <span className="text-slate-400 text-sm">{f.text}</span>
                </div>
              ))}
            </div>
            <div className="text-slate-700 text-xs">© 2026 NEXTWAY Info Tech · nextwayinfo.tech</div>
          </div>

          {/* Right */}
          <div className="md:col-span-3 p-7 md:p-8"
            style={{background:'rgba(30,41,59,0.7)', backdropFilter:'blur(20px)'}}>
            <div className="mb-6">
              <h3 className="text-white text-2xl font-bold font-poppins">Welcome Back 👋</h3>
              <p className="text-slate-400 text-sm mt-1">Select your role and sign in</p>
            </div>

            {/* Role picker */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {ROLES.map(r=>(
                <button key={r.key} type="button" onClick={()=>handleRoleSelect(r)}
                  className={`text-left p-3 rounded-xl border transition-all duration-200 group ${selected===r.key?'border-blue-500/50 bg-blue-500/10':'border-slate-700/50 hover:border-slate-600/70'}`}>
                  <span className="text-xl block mb-1">{r.icon}</span>
                  <span className={`text-xs font-semibold block ${selected===r.key?'text-white':'text-slate-300 group-hover:text-white'}`}>{r.label}</span>
                  <span className="text-[10px] text-slate-500 leading-tight">{r.desc}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Email Address</label>
                <input value={email} onChange={e=>{setEmail(e.target.value);setError('');}} type="email" placeholder="your@email.com" required/>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-slate-400 text-xs font-medium">Password</label>
                  <button type="button" className="text-blue-400 hover:text-blue-300 text-[11px]">Forgot password?</button>
                </div>
                <div className="relative">
                  <input value={password} onChange={e=>setPassword(e.target.value)} type={showPass?'text':'password'} placeholder="Enter password" style={{paddingRight:'2.75rem'}}/>
                  <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-sm" tabIndex={-1}>
                    {showPass?'🙈':'👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-3 py-2 rounded-lg text-xs text-red-400" style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)'}}>
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2"
                style={{background:loading?'#334155':'linear-gradient(135deg,#3b82f6,#06b6d4)',boxShadow:loading?'none':'0 8px 32px rgba(59,130,246,0.25)'}}>
                {loading
                  ? <><span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"/><span>Signing in…</span></>
                  : `Sign In as ${ROLES.find(r=>r.key===selected)?.label}`
                }
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-700/40">
              <p className="text-slate-500 text-xs text-center mb-2">No backend? Use demo mode:</p>
              <button onClick={handleDemo}
                className="w-full py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all"
                style={{background:'rgba(148,163,184,0.08)',border:'1px solid rgba(148,163,184,0.15)'}}>
                🎮 Enter Demo as {ROLES.find(r=>r.key===selected)?.label}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
