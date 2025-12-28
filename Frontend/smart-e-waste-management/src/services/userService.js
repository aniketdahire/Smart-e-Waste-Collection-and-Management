import api from './api';

const userService = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  approveUser: async (userId, isApprove) => {
    const response = await api.post('/admin/users/approve', {
      userId,
      approve: isApprove,
    });
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/admin/users/${userId}/status?status=${status}`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (formData) => {
    const response = await api.put('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default userService;
