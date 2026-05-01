export function downloadCSV(filename, headers, rows) {
  const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
  trigger(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), filename);
}
function trigger(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
export function printWindow(html, title='NEXTWAY') {
  const w = window.open('','_blank','width=700,height=900');
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>body{font-family:Arial,sans-serif;padding:24px;max-width:680px;margin:0 auto;color:#333}table{width:100%;border-collapse:collapse}th{background:#1e3a5f;color:#fff;padding:9px;font-size:12px;text-align:left}td{padding:8px 9px;border-bottom:1px solid #eee;font-size:13px}h1{color:#1e3a5f}h2{color:#555;font-size:14px;font-weight:normal}.row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;border-bottom:1px solid #f0f0f0}.total{font-weight:bold;font-size:15px}.footer{text-align:center;color:#999;font-size:11px;margin-top:20px}@media print{.no-print{display:none}}</style></head><body>${html}</body></html>`);
  w.document.close();
}
export function makeReceipt(data) {
  return `<h1 style="text-align:center">NEXTWAY Academy</h1><p style="text-align:center;color:#666;font-size:12px">Official Fee Receipt</p><hr/>
  <div class="row"><span>Receipt No</span><span><b>${data.receiptNo}</b></span></div>
  <div class="row"><span>Date</span><span>${data.date}</span></div>
  <div class="row"><span>Student</span><span>${data.studentName}</span></div>
  <div class="row"><span>Class</span><span>${data.className}</span></div>
  <hr/>${(data.heads||[]).map(h=>`<div class="row"><span>${h.name}</span><span>Rs.${(h.amount||0).toLocaleString()}</span></div>`).join('')}<hr/>
  <div class="row total"><span>Amount Paid</span><span>Rs.${(data.amount||0).toLocaleString()}</span></div>
  <div class="row"><span>Method</span><span>${data.method}</span></div>
  <p style="text-align:center;color:green;font-size:18px;font-weight:bold;margin:15px 0">✓ PAYMENT RECEIVED</p>
  <div class="footer">Computer-generated receipt. No signature required.</div>
  <br/><button class="no-print" onclick="window.print()" style="width:100%;padding:10px;background:#1e3a5f;color:white;border:none;border-radius:5px;cursor:pointer">Print Receipt</button>`;
}
export function makeReportCard(student, results, school) {
  const tot = results.reduce((s,r)=>s+r.obtained,0);
  const max = results.reduce((s,r)=>s+r.maxMarks,0);
  const pct = max ? Math.round(tot/max*100) : 0;
  const g = pct>=90?'A+':pct>=80?'A':pct>=70?'B+':pct>=60?'B':'C';
  return `<h1 style="text-align:center">${school?.name||'NEXTWAY Academy'}</h1><h2>Report Card — Final Exam 2025-26</h2><hr/>
  <div class="row"><span>Name</span><span><b>${student.name}</b></span></div>
  <div class="row"><span>Admission No</span><span>${student.admissionNo||'-'}</span></div>
  <div class="row"><span>Class</span><span>${student.className||'-'}</span></div>
  <div class="row"><span>Roll No</span><span>${student.rollNo||'-'}</span></div>
  <table style="margin-top:15px"><thead><tr><th>Subject</th><th>Max</th><th>Obtained</th><th>%</th><th>Grade</th></tr></thead>
  <tbody>${results.map(r=>`<tr><td>${r.subject}</td><td>${r.maxMarks}</td><td><b>${r.obtained}</b></td><td>${Math.round(r.obtained/r.maxMarks*100)}%</td><td><b>${r.grade}</b></td></tr>`).join('')}</tbody></table>
  <p style="text-align:center;margin:15px 0;font-size:20px">Overall: <b>${g}</b> (${pct}%)</p>
  <div class="footer">Computer-generated report card | ${new Date().toLocaleDateString()}</div>
  <br/><button class="no-print" onclick="window.print()" style="width:100%;padding:10px;background:#1e3a5f;color:white;border:none;border-radius:5px;cursor:pointer">Print Report Card</button>`;
}
export function makeIDCard(student, school) {
  return `<div style="max-width:320px;margin:0 auto;border-radius:12px;overflow:hidden;border:2px solid #1e3a5f">
  <div style="background:linear-gradient(135deg,#1e3a5f,#3b82f6);padding:20px;text-align:center;color:white">
    <div style="width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:bold;margin:0 auto 8px">${student.name?.charAt(0)||'S'}</div>
    <div style="font-size:16px;font-weight:bold">${student.name}</div>
    <div style="font-size:11px;opacity:0.85">Student | ${school?.name||'NEXTWAY Academy'}</div>
  </div>
  <div style="padding:16px">
    ${[['Admission No',student.admissionNo],['Class',student.className],['Roll No',student.rollNo],['DOB',student.dob],['Blood Group',student.bloodGroup]].map(([l,v])=>`<div class="row"><span style="color:#666">${l}</span><span style="font-weight:600">${v||'-'}</span></div>`).join('')}
  </div>
  <div style="background:#f5f5f5;padding:10px;text-align:center;font-size:11px;color:#666">Valid: AY 2025-26 | ${school?.name||'NEXTWAY Academy'}</div>
  </div>
  <br/><button class="no-print" onclick="window.print()" style="width:100%;padding:10px;background:#1e3a5f;color:white;border:none;border-radius:5px;cursor:pointer">Print ID Card</button>`;
}
