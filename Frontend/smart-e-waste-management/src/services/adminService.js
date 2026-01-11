import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const getAllRequests = async () => {
    const response = await axios.get(`${API_URL}/requests`, {
        headers: getAuthHeader()
    });
    return response.data;
};

const rejectRequest = async (requestId, reason) => {
    const response = await axios.put(`${API_URL}/requests/${requestId}/reject`, 
        { reason }, 
        { headers: getAuthHeader() }
    );
    return response.data;
};

const schedulePickup = async (requestId, scheduleData) => {
    // scheduleData: { pickupDate, pickupTime, pickupPersonnel }
    const response = await axios.put(`${API_URL}/requests/${requestId}/schedule`, 
        scheduleData, 
        { headers: getAuthHeader() }
    );
    return response.data;
};

// ✅ PERSONNEL MANAGEMENT
const getAllPersonnel = async () => {
    const response = await axios.get(`${API_URL}/personnel`, {
        headers: getAuthHeader()
    });
    return response.data;
};

const addPersonnel = async (personnel) => {
    const response = await axios.post(`${API_URL}/personnel`, 
        personnel, 
        { headers: getAuthHeader() }
    );
    return response.data;
};

const deletePersonnel = async (id) => {
    const response = await axios.delete(`${API_URL}/personnel/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export default {
    getAllRequests,
    rejectRequest,
    rejectRequest,
    schedulePickup,
    getAllPersonnel,
    addPersonnel,
    deletePersonnel
};
