import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';

// Auth
import Login from './pages/auth/Login';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import Students from './pages/admin/Students';
import { Fees } from './pages/admin/Fees';
import Attendance from './pages/admin/Attendance';
import {
  Teachers, Classes, Timetable, Homework, Exams,
  Transport, Hostel, Library, Inventory, Leaves,
  Communication, Events, Certificates, Reports, Settings, AuditLogs
} from './pages/admin/AdminPages';

// Teacher
import {
  TeacherDashboard, TeacherClasses, TeacherAttendance,
  TeacherHomework, TeacherResults, TeacherLeaves, TeacherTimetable
} from './pages/teacher/TeacherPages';

// Student
import {
  StudentDashboard, StudentAttendance, StudentResults,
  StudentFees, StudentHomework, StudentTimetable, AiDoubtSolver
} from './pages/student/StudentPages';

// Parent
import {
  ParentDashboard, ParentChildren, ParentFees,
  ParentAttendance, ParentResults, ParentCommunication
} from './pages/parent/ParentPages';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Admin */}
          <Route path="/admin" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="classes" element={<Classes />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="homework" element={<Homework />} />
            <Route path="exams" element={<Exams />} />
            <Route path="fees" element={<Fees />} />
            <Route path="transport" element={<Transport />} />
            <Route path="hostel" element={<Hostel />} />
            <Route path="library" element={<Library />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="communication" element={<Communication />} />
            <Route path="events" element={<Events />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="audit" element={<AuditLogs />} />
          </Route>

          {/* Teacher */}
          <Route path="/teacher" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="classes" element={<TeacherClasses />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="homework" element={<TeacherHomework />} />
            <Route path="results" element={<TeacherResults />} />
            <Route path="leaves" element={<TeacherLeaves />} />
            <Route path="timetable" element={<TeacherTimetable />} />
          </Route>

          {/* Student */}
          <Route path="/student" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="fees" element={<StudentFees />} />
            <Route path="homework" element={<StudentHomework />} />
            <Route path="timetable" element={<StudentTimetable />} />
            <Route path="ai-doubt" element={<AiDoubtSolver />} />
          </Route>

          {/* Parent */}
          <Route path="/parent" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ParentDashboard />} />
            <Route path="children" element={<ParentChildren />} />
            <Route path="fees" element={<ParentFees />} />
            <Route path="attendance" element={<ParentAttendance />} />
            <Route path="results" element={<ParentResults />} />
            <Route path="communication" element={<ParentCommunication />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
