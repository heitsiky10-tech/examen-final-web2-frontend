import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';


import AdminDashboard from './pages/admin/Dashboard';
import Students from './pages/admin/Students';
import Courses from './pages/admin/Courses';
import Exams from './pages/admin/Exams';
import Questions from './pages/admin/Questions';
import AdminResults from './pages/admin/Results';


import AvailableExams from './pages/student/AvailableExams';
import TakeExam from './pages/student/TakeExam';
import ExamResult from './pages/student/ExamResult';
import History from './pages/student/History';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {}
        <Route path="/login" element={<Login />} />

        {}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRole="admin">
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRole="admin">
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exams"
          element={
            <ProtectedRoute allowedRole="admin">
              <Exams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exams/:examId/questions"
          element={
            <ProtectedRoute allowedRole="admin">
              <Questions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exams/:examId/results"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminResults />
            </ProtectedRoute>
          }
        />

        {}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <AvailableExams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/exams/:examId"
          element={
            <ProtectedRoute allowedRole="student">
              <TakeExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/exams/:examId/result"
          element={
            <ProtectedRoute allowedRole="student">
              <ExamResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/results"
          element={
            <ProtectedRoute allowedRole="student">
              <History />
            </ProtectedRoute>
          }
        />

        {}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;