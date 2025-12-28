import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../../services/authService';

const ProtectedRoute = ({ role }) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentUser.role !== role) {
     // Optional: Redirect to unauthorized page or home
     return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
