import api from './api';

const collectionService = {
  createRequest: async (formData) => {
    // Note: We must explicitly set the header because our global api instance defaults to application/json
    const response = await api.post('/collection/request', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMyRequests: async () => {
    const response = await api.get('/collection/my-requests');
    return response.data;
  }
};

export default collectionService;
