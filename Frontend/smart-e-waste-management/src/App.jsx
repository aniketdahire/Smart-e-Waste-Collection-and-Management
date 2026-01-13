import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Impact from './pages/Impact.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

// Admin Pages
import AdminLayout from './components/layout/AdminLayout.jsx';
import UserLayout from './components/layout/UserLayout.jsx';
import AdminDashboard from './pages/Admin/admindashboard.jsx';
import UserManagement from './pages/Admin/UserManagement.jsx';
import RequestManagement from './pages/Admin/RequestManagement.jsx';
import PersonnelManagement from './pages/Admin/PersonnelManagement.jsx';

// User Pages
import UserDashboard from './pages/User/UserDashboard.jsx';
import RequestCollection from './pages/Collection/RequestCollection';
import MyRequests from './pages/Collection/MyRequests';
import History from './pages/Collection/History';
import UserProfile from './pages/User/UserProfile.jsx';

// Personnel Pages
import PersonnelDashboard from './pages/Personnel/PersonnelDashboard';
import PersonnelLayout from './components/layout/PersonnelLayout.jsx';

import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/impact" element={<Layout><Impact /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Admin Protected Route */}
          <Route element={<ProtectedRoute role="ROLE_ADMIN" />}>
             <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="requests" element={<RequestManagement />} />
                <Route path="personnel" element={<PersonnelManagement />} />
             </Route>
          </Route>

          {/* User Protected Route */}
          <Route element={<ProtectedRoute role="ROLE_USER" />}>
             <Route path="/dashboard" element={<UserDashboard />} />
             <Route path="/request-collection" element={<RequestCollection />} />
             <Route path="/my-requests" element={<MyRequests />} />
             <Route path="/history" element={<History />} />
             <Route path="/profile" element={<UserLayout><UserProfile /></UserLayout>} />
          </Route>


          {/* Personnel Routes */}
          <Route path="/personnel-dashboard" element={<PersonnelLayout><PersonnelDashboard /></PersonnelLayout>} />
          <Route path="/personnel-profile" element={<PersonnelLayout><UserProfile /></PersonnelLayout>} />

        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
