import api from './api';

const emitAuthChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth-change'));
  }
};

const authService = {
  login: async (username, password) => {
    const response = await api.post('/public/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      emitAuthChange();
    }
    return response.data;
  },

  register: async (userData) => {
    return api.post('/public/users/register', userData);
  },

  sendOtp: async (email) => {
    return api.post('/public/send-otp', { email });
  },

  verifyOtp: async (data) => {
    return api.post('/public/verify-otp', data);
  },

  resetPassword: async (username, tempPassword, newPassword) => {
    // The backend expects { username, tempPassword, newPassword }
    return api.post('/public/reset-password', { username, tempPassword, newPassword });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    emitAuthChange();
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return {
      role: localStorage.getItem('role'),
    };
  },
  
  isAuthenticated: () => {
      return !!localStorage.getItem('token');
  },
  
  isAdmin: () => {
      return localStorage.getItem('role') === 'ROLE_ADMIN';
  }
};

export default authService;
