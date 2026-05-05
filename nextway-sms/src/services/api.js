// ── API Base URL ───────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
console.log('🔗 API Base URL:', BASE);

// ── Token helpers ──────────────────────────────────────────────────────────
export const getToken   = () => localStorage.getItem('accessToken');
export const setToken   = (t) => localStorage.setItem('accessToken', t);
export const clearToken = () => localStorage.removeItem('accessToken');

// ── Core fetch wrapper ─────────────────────────────────────────────────────
async function request(method, path, data = null, isFormData = false) {
  const headers = {};
  const token   = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const opts = { method, headers, credentials: 'include' };
  if (data) opts.body = isFormData ? data : JSON.stringify(data);

  const res = await fetch(`${BASE}${path}`, opts);

  // Auto-refresh on 401 TOKEN_EXPIRED
  if (res.status === 401) {
    const json = await res.json().catch(() => ({}));
    if (json.code === 'TOKEN_EXPIRED') {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${getToken()}`;
        const retry = await fetch(`${BASE}${path}`, { ...opts, headers });
        if (!retry.ok) throw new ApiError(retry.status, (await retry.json().catch(() => ({}))).message);
        return retry.json();
      }
    }
    throw new ApiError(res.status, json.message || 'Unauthorized');
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json.message || 'Request failed', json.errors);
  return json;
}

async function refreshAccessToken() {
  try {
    const res  = await fetch(`${BASE}/auth/refresh`, { method: 'POST', credentials: 'include' });
    const data = await res.json();
    if (data.accessToken) { setToken(data.accessToken); return true; }
    return false;
  } catch { return false; }
}

export class ApiError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

// ── HTTP helpers ───────────────────────────────────────────────────────────
export const get    = (p)       => request('GET',    p);
export const post   = (p, d)    => request('POST',   p, d);
export const put    = (p, d)    => request('PUT',    p, d);
export const patch  = (p, d)    => request('PATCH',  p, d);
export const del    = (p)       => request('DELETE', p);

// ── AUTH ──────────────────────────────────────────────────────────────────
export const authApi = {
  login:  (email, password) => post('/auth/login', { email, password }),
  logout: ()               => post('/auth/logout'),
  me:     ()               => get('/auth/me'),
  changePassword: (currentPassword, newPassword) =>
    post('/auth/change-password', { currentPassword, newPassword }),
};

// ── STUDENTS ──────────────────────────────────────────────────────────────
export const studentsApi = {
  list:               (params = {}) => get(`/students?${new URLSearchParams(params)}`),
  get:                (id)          => get(`/students/${id}`),
  create:             (data)        => post('/students', data),
  update:             (id, data)    => put(`/students/${id}`, data),
  delete:             (id)          => del(`/students/${id}`),
  attendanceSummary:  (id)          => get(`/students/${id}/attendance-summary`),
};

// ── ATTENDANCE ────────────────────────────────────────────────────────────
export const attendanceApi = {
  list:           (params) => get(`/attendance?${new URLSearchParams(params)}`),
  mark:           (data)   => post('/attendance', data),
  studentCalendar:(id, params) => get(`/attendance/student/${id}?${new URLSearchParams(params)}`),
  monthlyReport:  (params) => get(`/attendance/report/monthly?${new URLSearchParams(params)}`),
};

// ── FEES ──────────────────────────────────────────────────────────────────
export const feesApi = {
  invoices:         (params) => get(`/fees/invoices?${new URLSearchParams(params)}`),
  invoice:          (id)     => get(`/fees/invoices/${id}`),
  generateInvoices: (data)   => post('/fees/invoices/generate', data),
  collectPayment:   (data)   => post('/fees/payments', data),
  monthlyCollection:(params) => get(`/fees/collection/monthly?${new URLSearchParams(params)}`),
};

// ── USERS / STAFF ─────────────────────────────────────────────────────────
export const usersApi = {
  list:   (params) => get(`/users?${new URLSearchParams(params)}`),
  create: (data)   => post('/users', data),
  update: (id, d)  => put(`/users/${id}`, d),
};

// ── CLASSES ────────────────────────────────────────────────────────────────
export const classesApi = {
  list:           ()       => get('/classes'),
  create:         (data)   => post('/classes', data),
  sections:       (params) => get(`/sections?${new URLSearchParams(params)}`),
  createSection:  (data)   => post('/sections', data),
  subjects:       ()       => get('/subjects'),
  createSubject:  (data)   => post('/subjects', data),
};

// ── HOMEWORK ──────────────────────────────────────────────────────────────
export const homeworkApi = {
  list:   (params) => get(`/homework?${new URLSearchParams(params)}`),
  create: (data)   => post('/homework', data),
  submit: (id, d)  => post(`/homework/${id}/submit`, d),
  grade:  (id, d)  => put(`/homework/${id}/grade`, d),
};

// ── EXAMS ─────────────────────────────────────────────────────────────────
export const examsApi = {
  list:        ()         => get('/exams'),
  create:      (data)     => post('/exams', data),
  results:     (examId)   => get(`/exams/${examId}/results`),
  enterResult: (examId, d)=> post(`/exams/${examId}/results`, d),
};

// ── LEAVES ────────────────────────────────────────────────────────────────
export const leavesApi = {
  list:   (params) => get(`/leaves?${new URLSearchParams(params)}`),
  apply:  (data)   => post('/leaves', data),
  review: (id, d)  => patch(`/leaves/${id}/review`, d),
};

// ── NOTICES ────────────────────────────────────────────────────────────────
export const noticesApi = {
  list:   ()       => get('/notices'),
  create: (data)   => post('/notices', data),
  update: (id, d)  => put(`/notices/${id}`, d),
  delete: (id)     => del(`/notices/${id}`),
};

// ── LIBRARY ────────────────────────────────────────────────────────────────
export const libraryApi = {
  books:      (params) => get(`/library/books?${new URLSearchParams(params)}`),
  addBook:    (data)   => post('/library/books', data),
  issue:      (data)   => post('/library/issues', data),
  returnBook: (id)     => patch(`/library/issues/${id}/return`, {}),
};

// ── TRANSPORT ─────────────────────────────────────────────────────────────
export const transportApi = {
  routes: () => get('/transport'),
  create: (d)=> post('/transport', d),
};

// ── HOSTEL ────────────────────────────────────────────────────────────────
export const hostelApi = {
  rooms:  ()        => get('/hostel/rooms'),
  create: (d)       => post('/hostel/rooms', d),
  assign: (id, sid) => patch(`/hostel/rooms/${id}/assign`, { studentId: sid }),
};

// ── INVENTORY ─────────────────────────────────────────────────────────────
export const inventoryApi = {
  list:   ()       => get('/inventory'),
  create: (d)      => post('/inventory', d),
  update: (id, d)  => put(`/inventory/${id}`, d),
};

// ── REPORTS ───────────────────────────────────────────────────────────────
export const reportsApi = {
  dashboardStats: () => get('/reports/dashboard-stats'),
};

// ── AUDIT ─────────────────────────────────────────────────────────────────
export const auditApi = {
  list: (params) => get(`/audit?${new URLSearchParams(params)}`),
};
