// ─── MOCK DATA ───────────────────────────────────────────────────────────────

export const SCHOOL = {
  name: 'NEXTWAY Academy',
  code: 'NWA001',
  city: 'Indore',
  board: 'CBSE',
  logo: 'NA',
};

export const CURRENT_USERS = {
  admin: { id: '1', name: 'Rahul Sharma', role: 'school_admin', email: 'admin@nextway.edu', avatar: 'RS', class: null },
  teacher: { id: '2', name: 'Priya Verma', role: 'teacher', email: 'priya@nextway.edu', avatar: 'PV', class: 'Class 8A' },
  student: { id: '3', name: 'Aarav Gupta', role: 'student', email: 'aarav@student.nextway.edu', avatar: 'AG', class: 'Class 8A', rollNo: 'NWA/2024/0023', admissionNo: 'ADM-2024-023' },
  parent: { id: '4', name: 'Suresh Gupta', role: 'parent', email: 'suresh@gmail.com', avatar: 'SG', children: ['Aarav Gupta'] },
};

export const STUDENTS = [
  { id: '1', name: 'Aarav Gupta', admissionNo: 'ADM-001', rollNo: '01', class: 'Class 8', section: 'A', gender: 'Male', dob: '2011-03-15', phone: '9876543210', status: 'active', attendance: 92, fees: 'paid' },
  { id: '2', name: 'Sneha Patel', admissionNo: 'ADM-002', rollNo: '02', class: 'Class 8', section: 'A', gender: 'Female', dob: '2011-07-22', phone: '9876543211', status: 'active', attendance: 88, fees: 'pending' },
  { id: '3', name: 'Riya Sharma', admissionNo: 'ADM-003', rollNo: '03', class: 'Class 9', section: 'B', gender: 'Female', dob: '2010-11-05', phone: '9876543212', status: 'active', attendance: 95, fees: 'paid' },
  { id: '4', name: 'Karan Mehta', admissionNo: 'ADM-004', rollNo: '04', class: 'Class 7', section: 'A', gender: 'Male', dob: '2012-01-18', phone: '9876543213', status: 'active', attendance: 79, fees: 'overdue' },
  { id: '5', name: 'Ananya Singh', admissionNo: 'ADM-005', rollNo: '05', class: 'Class 10', section: 'A', gender: 'Female', dob: '2009-09-30', phone: '9876543214', status: 'active', attendance: 97, fees: 'paid' },
  { id: '6', name: 'Rohit Kumar', admissionNo: 'ADM-006', rollNo: '06', class: 'Class 8', section: 'B', gender: 'Male', dob: '2011-05-12', phone: '9876543215', status: 'inactive', attendance: 65, fees: 'pending' },
  { id: '7', name: 'Pooja Agarwal', admissionNo: 'ADM-007', rollNo: '07', class: 'Class 9', section: 'A', gender: 'Female', dob: '2010-08-27', phone: '9876543216', status: 'active', attendance: 91, fees: 'paid' },
  { id: '8', name: 'Dev Joshi', admissionNo: 'ADM-008', rollNo: '08', class: 'Class 6', section: 'A', gender: 'Male', dob: '2013-12-03', phone: '9876543217', status: 'active', attendance: 84, fees: 'paid' },
];

export const TEACHERS = [
  { id: '1', name: 'Priya Verma', employeeId: 'EMP-001', subject: 'Mathematics', class: 'Class 8A, 9B', phone: '9800000001', email: 'priya@nextway.edu', joiningDate: '2020-06-01', status: 'active' },
  { id: '2', name: 'Amit Joshi', employeeId: 'EMP-002', subject: 'Science', class: 'Class 7A, 8B', phone: '9800000002', email: 'amit@nextway.edu', joiningDate: '2019-04-15', status: 'active' },
  { id: '3', name: 'Sunita Rao', employeeId: 'EMP-003', subject: 'English', class: 'Class 9A, 10A', phone: '9800000003', email: 'sunita@nextway.edu', joiningDate: '2021-07-01', status: 'active' },
  { id: '4', name: 'Rajesh Tiwari', employeeId: 'EMP-004', subject: 'Hindi', class: 'Class 6A, 7B', phone: '9800000004', email: 'rajesh@nextway.edu', joiningDate: '2018-01-10', status: 'active' },
  { id: '5', name: 'Neha Gupta', employeeId: 'EMP-005', subject: 'Social Science', class: 'Class 8A, 10B', phone: '9800000005', email: 'neha@nextway.edu', joiningDate: '2022-03-01', status: 'active' },
];

export const CLASSES = [
  { id: '1', name: 'Class 1', sections: ['A', 'B'], students: 40, classTeacher: 'Meena Sharma' },
  { id: '2', name: 'Class 2', sections: ['A', 'B'], students: 42, classTeacher: 'Kavita Singh' },
  { id: '3', name: 'Class 6', sections: ['A', 'B'], students: 44, classTeacher: 'Rajesh Tiwari' },
  { id: '4', name: 'Class 7', sections: ['A', 'B'], students: 46, classTeacher: 'Amit Joshi' },
  { id: '5', name: 'Class 8', sections: ['A', 'B'], students: 48, classTeacher: 'Priya Verma' },
  { id: '6', name: 'Class 9', sections: ['A', 'B'], students: 45, classTeacher: 'Sunita Rao' },
  { id: '7', name: 'Class 10', sections: ['A', 'B'], students: 43, classTeacher: 'Neha Gupta' },
];

export const FEE_INVOICES = [
  { id: '1', student: 'Aarav Gupta', class: 'Class 8A', amount: 15000, paid: 15000, balance: 0, dueDate: '2026-04-30', status: 'paid', method: 'UPI' },
  { id: '2', student: 'Sneha Patel', class: 'Class 8A', amount: 15000, paid: 7500, balance: 7500, dueDate: '2026-04-30', status: 'partial', method: 'Cash' },
  { id: '3', student: 'Karan Mehta', class: 'Class 7A', amount: 14000, paid: 0, balance: 14000, dueDate: '2026-03-31', status: 'overdue', method: '-' },
  { id: '4', student: 'Riya Sharma', class: 'Class 9B', amount: 16000, paid: 16000, balance: 0, dueDate: '2026-04-30', status: 'paid', method: 'Bank Transfer' },
  { id: '5', student: 'Ananya Singh', class: 'Class 10A', amount: 18000, paid: 18000, balance: 0, dueDate: '2026-04-30', status: 'paid', method: 'Cheque' },
  { id: '6', student: 'Rohit Kumar', class: 'Class 8B', amount: 15000, paid: 0, balance: 15000, dueDate: '2026-04-30', status: 'pending', method: '-' },
];

export const ATTENDANCE_DATA = [
  { date: '2026-04-21', day: 'Mon', present: 187, absent: 13, percentage: 93.5 },
  { date: '2026-04-22', day: 'Tue', present: 182, absent: 18, percentage: 91.0 },
  { date: '2026-04-23', day: 'Wed', present: 190, absent: 10, percentage: 95.0 },
  { date: '2026-04-24', day: 'Thu', present: 178, absent: 22, percentage: 89.0 },
  { date: '2026-04-25', day: 'Fri', present: 185, absent: 15, percentage: 92.5 },
];

export const MONTHLY_ATTENDANCE = [
  { month: 'Jan', percentage: 91 }, { month: 'Feb', percentage: 88 }, { month: 'Mar', percentage: 93 },
  { month: 'Apr', percentage: 92 }, { month: 'May', percentage: 87 }, { month: 'Jun', percentage: 90 },
];

export const EXAMS = [
  { id: '1', name: 'Unit Test 1', type: 'Unit Test', startDate: '2026-05-05', endDate: '2026-05-10', status: 'upcoming', classes: 'All Classes' },
  { id: '2', name: 'Mid Term Exam', type: 'Mid Term', startDate: '2026-06-15', endDate: '2026-06-25', status: 'upcoming', classes: 'All Classes' },
  { id: '3', name: 'Final Exam 2025', type: 'Final', startDate: '2026-03-01', endDate: '2026-03-15', status: 'completed', classes: 'All Classes' },
];

export const EXAM_RESULTS = [
  { subject: 'Mathematics', maxMarks: 100, obtained: 87, grade: 'A', teacher: 'Priya Verma' },
  { subject: 'Science', maxMarks: 100, obtained: 92, grade: 'A+', teacher: 'Amit Joshi' },
  { subject: 'English', maxMarks: 100, obtained: 78, grade: 'B+', teacher: 'Sunita Rao' },
  { subject: 'Hindi', maxMarks: 100, obtained: 82, grade: 'A', teacher: 'Rajesh Tiwari' },
  { subject: 'Social Science', maxMarks: 100, obtained: 75, grade: 'B+', teacher: 'Neha Gupta' },
];

export const HOMEWORK = [
  { id: '1', subject: 'Mathematics', class: 'Class 8A', title: 'Chapter 5 - Quadratic Equations', dueDate: '2026-04-30', assignedBy: 'Priya Verma', status: 'active', submissions: 32, total: 48 },
  { id: '2', subject: 'Science', class: 'Class 8A', title: 'Lab Report - Photosynthesis', dueDate: '2026-05-02', assignedBy: 'Amit Joshi', status: 'active', submissions: 28, total: 48 },
  { id: '3', subject: 'English', class: 'Class 9A', title: 'Essay - My Favourite Book', dueDate: '2026-04-28', assignedBy: 'Sunita Rao', status: 'due_today', submissions: 40, total: 45 },
  { id: '4', subject: 'Social Science', class: 'Class 8A', title: 'Map Work - Rivers of India', dueDate: '2026-04-25', assignedBy: 'Neha Gupta', status: 'overdue', submissions: 45, total: 48 },
];

export const LEAVE_REQUESTS = [
  { id: '1', name: 'Priya Verma', role: 'Teacher', type: 'Medical Leave', from: '2026-05-03', to: '2026-05-05', days: 3, reason: 'Medical appointment', status: 'pending' },
  { id: '2', name: 'Aarav Gupta', role: 'Student', type: 'Family Emergency', from: '2026-04-28', to: '2026-04-29', days: 2, reason: 'Family function', status: 'approved' },
  { id: '3', name: 'Amit Joshi', role: 'Teacher', type: 'Casual Leave', from: '2026-05-10', to: '2026-05-10', days: 1, reason: 'Personal work', status: 'pending' },
];

export const BOOKS = [
  { id: '1', title: 'Mathematics Class 8', author: 'R.D. Sharma', isbn: '978-81-219-0123-4', category: 'Textbook', available: 8, total: 12, rack: 'A-01' },
  { id: '2', title: 'The Alchemist', author: 'Paulo Coelho', isbn: '978-0-06-112008-4', category: 'Fiction', available: 3, total: 5, rack: 'B-12' },
  { id: '3', title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', isbn: '978-81-7371-146-1', category: 'Biography', available: 0, total: 4, rack: 'C-05' },
  { id: '4', title: 'Science NCERT 9', author: 'NCERT', isbn: '978-81-7450-012-9', category: 'Textbook', available: 15, total: 20, rack: 'A-03' },
];

export const TRANSPORT_ROUTES = [
  { id: '1', name: 'Route 1 - North Zone', vehicle: 'MP09 AB 1234', driver: 'Ramesh Kumar', stops: 8, students: 32, shift: 'Both' },
  { id: '2', name: 'Route 2 - South Zone', vehicle: 'MP09 CD 5678', driver: 'Suresh Singh', stops: 6, students: 28, shift: 'Both' },
  { id: '3', name: 'Route 3 - East Zone', vehicle: 'MP09 EF 9012', driver: 'Mahesh Patel', stops: 7, students: 24, shift: 'Morning' },
];

export const NOTICES = [
  { id: '1', title: 'Annual Sports Day 2026', date: '2026-04-25', target: 'All', priority: 'high', content: 'Annual Sports Day will be held on May 15, 2026. All students must participate in at least one event.' },
  { id: '2', title: 'Parent-Teacher Meeting', date: '2026-04-22', target: 'Parents', priority: 'medium', content: 'PTM scheduled for May 3, 2026 from 9 AM to 1 PM.' },
  { id: '3', title: 'Summer Vacation Notice', date: '2026-04-20', target: 'All', priority: 'medium', content: 'School will remain closed from May 20 to June 15 for summer vacation.' },
];

export const TIMETABLE = {
  'Class 8A': {
    Monday:    ['Mathematics', 'English', 'Science', 'Break', 'Hindi', 'Social Science', 'Computer'],
    Tuesday:   ['Science', 'Mathematics', 'English', 'Break', 'Art', 'Hindi', 'Mathematics'],
    Wednesday: ['English', 'Social Science', 'Mathematics', 'Break', 'Science', 'PE', 'Hindi'],
    Thursday:  ['Hindi', 'Science', 'Social Science', 'Break', 'Mathematics', 'English', 'Library'],
    Friday:    ['Computer', 'Hindi', 'Mathematics', 'Break', 'English', 'Science', 'Social Science'],
  }
};

export const FEE_COLLECTION_DATA = [
  { month: 'Jan', collected: 285000, pending: 45000 },
  { month: 'Feb', collected: 310000, pending: 38000 },
  { month: 'Mar', collected: 295000, pending: 52000 },
  { month: 'Apr', collected: 320000, pending: 41000 },
];

export const HOSTEL_ROOMS = [
  { id: '1', roomNo: '101', building: 'Block A', floor: '1', type: 'Double', capacity: 2, occupied: 2, status: 'full' },
  { id: '2', roomNo: '102', building: 'Block A', floor: '1', type: 'Double', capacity: 2, occupied: 1, status: 'available' },
  { id: '3', roomNo: '201', building: 'Block B', floor: '2', type: 'Single', capacity: 1, occupied: 1, status: 'full' },
  { id: '4', roomNo: '301', building: 'Block A', floor: '3', type: 'Dormitory', capacity: 6, occupied: 4, status: 'available' },
];

export const INVENTORY = [
  { id: '1', name: 'Desktop Computer', category: 'Electronics', quantity: 45, unitPrice: 35000, vendor: 'TechMart', purchaseDate: '2024-04-01' },
  { id: '2', name: 'Lab Microscope', category: 'Science Equipment', quantity: 20, unitPrice: 8500, vendor: 'SciencePro', purchaseDate: '2023-08-15' },
  { id: '3', name: 'Whiteboard', category: 'Furniture', quantity: 30, unitPrice: 2500, vendor: 'OfficeHub', purchaseDate: '2024-01-10' },
];

export const AUDIT_LOGS = [
  { id: '1', user: 'Rahul Sharma', action: 'UPDATE', entity: 'Student', entityId: 'ADM-001', detail: 'Updated class assignment', ip: '192.168.1.10', time: '2026-04-28 10:32:15' },
  { id: '2', user: 'Priya Verma', action: 'CREATE', entity: 'Homework', entityId: 'HW-042', detail: 'Created new homework assignment', ip: '192.168.1.15', time: '2026-04-28 09:15:40' },
  { id: '3', user: 'Admin System', action: 'LOGIN', entity: 'User', entityId: 'EMP-001', detail: 'Successful login', ip: '192.168.1.20', time: '2026-04-28 08:45:00' },
  { id: '4', user: 'Rahul Sharma', action: 'DELETE', entity: 'Leave', entityId: 'LV-010', detail: 'Deleted cancelled leave request', ip: '192.168.1.10', time: '2026-04-27 16:20:33' },
];
