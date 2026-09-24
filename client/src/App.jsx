import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { ExamForm } from './pages/ExamForm';
import { StudentDashboard } from './pages/StudentDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, token } = useContext(AuthContext);

  return (
    <>
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to={user?.role === 'admin' ? '/admin' : '/student'} />} />

        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/create-exam" element={<ProtectedRoute requiredRole="admin"><ExamForm /></ProtectedRoute>} />
        <Route path="/admin/edit-exam/:id" element={<ProtectedRoute requiredRole="admin"><ExamForm isEdit={true} /></ProtectedRoute>} />

        <Route path="/student" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />

        <Route path="/" element={<Navigate to={token ? (user?.role === 'admin' ? '/admin' : '/student') : '/login'} />} />
      </Routes>
    </>
  );
}

export default App;