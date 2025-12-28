import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import AdminDashboard from './pages/Admin/admindashboard.jsx';
import UserDashboard from './pages/User/UserDashboard.jsx';
import UserProfile from './pages/User/UserProfile.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Admin Protected Route */}
          <Route element={<ProtectedRoute role="ROLE_ADMIN" />}>
             <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* User Protected Route */}
          <Route element={<ProtectedRoute role="ROLE_USER" />}>
             <Route path="/dashboard" element={<UserDashboard />} />
             <Route path="/profile" element={<UserProfile />} />
          </Route>

        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
