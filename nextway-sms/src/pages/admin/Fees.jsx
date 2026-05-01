import { useState } from 'react';
import { PageHeader, PrimaryBtn, SecondaryBtn, Badge, GlassCard, StatCard, SectionTitle, SearchBar, Modal, FormField } from '../../components/ui';
import { FEE_INVOICES, FEE_COLLECTION_DATA, STUDENTS } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const STATUS_MAP = { paid: 'green', partial: 'yellow', overdue: 'red', pending: 'blue' };

export function Fees() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [collectModal, setCollectModal] = useState(null);
  const [receiptModal, setReceiptModal] = useState(null);
  const [generateModal, setGenerateModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash');
  const [toastMsg, setToastMsg] = useState('');

  const filtered = FEE_INVOICES.filter(f =>
    f.student.toLowerCase().includes(search.toLowerCase()) &&
    (!statusFilter || f.status === statusFilter)
  );
  const totalCollected = FEE_INVOICES.reduce((s, f) => s + f.paid, 0);
  const totalPending   = FEE_INVOICES.reduce((s, f) => s + f.balance, 0);

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500); };

  const handleCollect = () => {
    showToast(`✅ Payment of ₹${parseInt(amount||0).toLocaleString()} recorded via ${method}`);
    setCollectModal(null); setAmount(''); setMethod('Cash');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-glass animate-slide-in-up"
          style={{background:'linear-gradient(135deg,#10b981,#059669)'}}>
          {toastMsg}
        </div>
      )}

      <PageHeader title="Fee Management" subtitle="Track collections, invoices and defaulters"
        actions={<>
          <SecondaryBtn onClick={() => showToast('📊 Report exported!')}>📊 Export Report</SecondaryBtn>
          <PrimaryBtn onClick={() => setGenerateModal(true)}>➕ Generate Invoices</PrimaryBtn>
        </>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Collected" value={`₹${(totalCollected/1000).toFixed(1)}k`} change="April 2026" changeType="up" icon="✅" gradient="from-emerald-500 to-teal-500" delay={0}/>
        <StatCard title="Pending Amount"  value={`₹${(totalPending/1000).toFixed(1)}k`} change="needs attention" changeType="down" icon="⏳" gradient="from-amber-500 to-orange-500" delay={0.1}/>
        <StatCard title="Overdue"         value={FEE_INVOICES.filter(f=>f.status==='overdue').length} change="students" icon="🚨" gradient="from-red-500 to-rose-500" delay={0.2}/>
        <StatCard title="Fully Paid"      value={FEE_INVOICES.filter(f=>f.status==='paid').length}    change="invoices" icon="💳" gradient="from-blue-500 to-cyan-500" delay={0.3}/>
      </div>

      {/* Charts + Fee heads */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2" noHover>
          <SectionTitle>Monthly Collection vs Pending (₹)</SectionTitle>
          <ResponsiveContainer width="100%" height={175}>
            <BarChart data={FEE_COLLECTION_DATA} barSize={22} barGap={4}>
              <XAxis dataKey="month" stroke="#475569" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis stroke="#475569" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`}/>
              <Tooltip contentStyle={{background:'#1e293b',border:'1px solid rgba(148,163,184,0.1)',borderRadius:8,fontSize:11}}/>
              <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4,4,0,0]}/>
              <Bar dataKey="pending"   name="Pending"   fill="#f59e0b" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard noHover>
          <SectionTitle>Fee Structure Breakdown</SectionTitle>
          <div className="space-y-4">
            {[
              {label:'Tuition Fee',  amount:'₹10,000', pct:67, color:'linear-gradient(135deg,#3b82f6,#06b6d4)'},
              {label:'Lab Fee',      amount:'₹2,000',  pct:13, color:'linear-gradient(135deg,#8b5cf6,#6d28d9)'},
              {label:'Transport',    amount:'₹3,000',  pct:20, color:'linear-gradient(135deg,#f59e0b,#d97706)'},
            ].map(f=>(
              <div key={f.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">{f.label}</span>
                  <span className="text-white font-semibold">{f.amount}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width:`${f.pct}%`, background:f.color}}/>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-700/40 flex justify-between text-sm">
              <span className="text-slate-400">Total per Student</span>
              <span className="text-white font-bold">₹15,000</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filter Bar */}
      <div className="glass-static p-4 flex flex-wrap gap-3 items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student name…"/>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
          style={{width:'auto',paddingTop:'0.5rem',paddingBottom:'0.5rem'}}>
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        <select style={{width:'auto',paddingTop:'0.5rem',paddingBottom:'0.5rem'}}>
          <option>All Classes</option>
          <option>Class 7</option><option>Class 8</option>
          <option>Class 9</option><option>Class 10</option>
        </select>
        {(search||statusFilter) && (
          <button className="text-slate-400 hover:text-white text-xs"
            onClick={()=>{setSearch('');setStatusFilter('');}}>✕ Clear</button>
        )}
        <span className="ml-auto text-slate-500 text-xs">{filtered.length} invoices</span>
      </div>

      {/* Invoice Table */}
      <div className="glass-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th><th>Class</th><th>Total</th>
                <th>Paid</th><th>Balance</th><th>Due Date</th>
                <th>Method</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={f.id} className={`animate-fade-in delay-${Math.min(i,5)*100}`}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{background:'linear-gradient(135deg,#3b82f6,#06b6d4)'}}>
                        {f.student.charAt(0)}
                      </div>
                      <span className="text-white font-medium text-sm">{f.student}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{f.class}</span></td>
                  <td className="text-slate-300 font-medium">₹{f.amount.toLocaleString()}</td>
                  <td className="text-emerald-400 font-semibold">₹{f.paid.toLocaleString()}</td>
                  <td className={f.balance > 0 ? 'text-red-400 font-semibold' : 'text-slate-500'}>
                    ₹{f.balance.toLocaleString()}
                  </td>
                  <td className="text-slate-400 text-xs">{f.dueDate}</td>
                  <td className="text-slate-400 text-xs">{f.method}</td>
                  <td><Badge type={STATUS_MAP[f.status]}>{f.status}</Badge></td>
                  <td>
                    <div className="flex gap-1">
                      {f.status !== 'paid' && (
                        <PrimaryBtn small onClick={() => { setCollectModal(f); setAmount(f.balance); }}>
                          💳 Collect
                        </PrimaryBtn>
                      )}
                      <SecondaryBtn small onClick={() => setReceiptModal(f)}>🧾 Receipt</SecondaryBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-3xl mb-2">🔍</p>
              <p>No invoices match your search</p>
            </div>
          )}
        </div>
      </div>

      {/* Collect Fee Modal */}
      <Modal open={!!collectModal} onClose={() => setCollectModal(null)} title="Collect Fee Payment" width="max-w-md">
        {collectModal && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{background:'rgba(59,130,246,0.08)',border:'1px solid rgba(59,130,246,0.15)'}}>
              <p className="text-white font-semibold">{collectModal.student}</p>
              <p className="text-slate-400 text-sm">{collectModal.class} · Invoice #{collectModal.id}</p>
              <div className="flex gap-4 mt-2 text-sm">
                <div><p className="text-slate-500 text-xs">Total Due</p><p className="text-white font-bold">₹{collectModal.amount.toLocaleString()}</p></div>
                <div><p className="text-slate-500 text-xs">Already Paid</p><p className="text-emerald-400 font-bold">₹{collectModal.paid.toLocaleString()}</p></div>
                <div><p className="text-slate-500 text-xs">Balance</p><p className="text-red-400 font-bold">₹{collectModal.balance.toLocaleString()}</p></div>
              </div>
            </div>
            <FormField label="Amount Received (₹)">
              <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Enter amount"/>
            </FormField>
            <FormField label="Payment Method">
              <select value={method} onChange={e=>setMethod(e.target.value)}>
                <option>Cash</option><option>UPI</option>
                <option>Bank Transfer</option><option>Cheque</option><option>Card</option>
              </select>
            </FormField>
            <FormField label="Receipt No (Auto)">
              <input defaultValue={`RCP-2026-${Math.floor(Math.random()*9000)+1000}`} disabled/>
            </FormField>
            <FormField label="Remarks">
              <input placeholder="Optional note…"/>
            </FormField>
            <div className="flex gap-3 justify-end pt-1">
              <SecondaryBtn onClick={() => setCollectModal(null)}>Cancel</SecondaryBtn>
              <PrimaryBtn onClick={handleCollect}>✅ Confirm Payment</PrimaryBtn>
            </div>
          </div>
        )}
      </Modal>

      {/* Receipt Modal */}
      <Modal open={!!receiptModal} onClose={() => setReceiptModal(null)} title="Fee Receipt" width="max-w-md">
        {receiptModal && (
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-slate-700/40">
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-bold mb-2"
                style={{background:'linear-gradient(135deg,#3b82f6,#06b6d4)'}}>N</div>
              <p className="text-white font-bold font-poppins">NEXTWAY Academy</p>
              <p className="text-slate-400 text-xs">Official Fee Receipt</p>
            </div>
            <div className="space-y-2">
              {[
                {l:'Receipt No',    v:`RCP-2026-${receiptModal.id}001`},
                {l:'Student Name',  v:receiptModal.student},
                {l:'Class',         v:receiptModal.class},
                {l:'Amount Paid',   v:`₹${receiptModal.paid.toLocaleString()}`},
                {l:'Payment Method',v:receiptModal.method},
                {l:'Date',          v:'April 5, 2026'},
                {l:'Status',        v:receiptModal.status.toUpperCase()},
              ].map(r=>(
                <div key={r.l} className="flex justify-between py-1 border-b border-slate-700/20 text-sm">
                  <span className="text-slate-400">{r.l}</span>
                  <span className={`text-white font-medium ${r.l==='Status'&&receiptModal.status==='paid'?'text-emerald-400':''}`}>{r.v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <SecondaryBtn onClick={() => setReceiptModal(null)}>Close</SecondaryBtn>
              <PrimaryBtn onClick={() => showToast('🖨️ Sent to printer!')}>🖨️ Print</PrimaryBtn>
            </div>
          </div>
        )}
      </Modal>

      {/* Generate Invoices Modal */}
      <Modal open={generateModal} onClose={() => setGenerateModal(false)} title="Generate Fee Invoices" width="max-w-md">
        <div className="space-y-4">
          <FormField label="Academic Term">
            <select><option>Q2 July–Sept 2026</option><option>Q3 Oct–Dec 2026</option></select>
          </FormField>
          <FormField label="Classes">
            <select><option>All Classes</option><option>Class 8 only</option><option>Class 9 only</option></select>
          </FormField>
          <FormField label="Due Date"><input type="date" defaultValue="2026-07-10"/></FormField>
          <div className="p-3 rounded-xl text-sm" style={{background:'rgba(59,130,246,0.08)',border:'1px solid rgba(59,130,246,0.15)'}}>
            <p className="text-slate-300">This will generate <strong className="text-white">200 invoices</strong> for all enrolled students.</p>
          </div>
          <div className="flex gap-3 justify-end">
            <SecondaryBtn onClick={() => setGenerateModal(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={() => { setGenerateModal(false); showToast('✅ 200 invoices generated!'); }}>Generate</PrimaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
