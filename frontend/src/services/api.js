import axios from 'axios';

// Get API base URL from environment or local storage or current host
const getApiBaseUrl = () => {
  // Check if custom API URL is stored in localStorage
  const customUrl = localStorage.getItem('customApiUrl');
  if (customUrl) {
    return customUrl;
  }

  // Check if API_URL is defined in environment
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Default to current host
  const protocol = window.location.protocol;
  const host = window.location.hostname;
  const port = process.env.REACT_APP_API_PORT || 8000;
  
  return `${protocol}//${host}:${port}/api`;
};

const API_BASE_URL = getApiBaseUrl();
const API_URL = `${API_BASE_URL}/repair-orders`;

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth header
const apiClient = axios.create({
  baseURL: API_BASE_URL
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const register = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Repair order endpoints
export const getAllRepairOrders = async () => {
  try {
    const response = await apiClient.get('/repair-orders');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching repair orders:', error);
    throw error;
  }
};

export const getRepairOrderById = async (id) => {
  try {
    const response = await apiClient.get(`/repair-orders/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching repair order:', error);
    throw error;
  }
};

export const createRepairOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/repair-orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating repair order:', error);
    throw error;
  }
};

export const updateRepairOrder = async (id, orderData) => {
  try {
    const response = await apiClient.put(`/repair-orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error updating repair order:', error);
    throw error;
  }
};

export const deleteRepairOrder = async (id) => {
  try {
    const response = await apiClient.delete(`/repair-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting repair order:', error);
    throw error;
  }
};

export const exportToExcel = async (year, month, store = 'all') => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/repair-orders/export/excel`, {
      params: { year, month, store },
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'blob'
    });

    // Create a blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const storeLabel = store && store !== 'all' ? `_${store}` : '';
    link.setAttribute('download', `Repair_Orders_${year}-${String(month).padStart(2, '0')}${storeLabel}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentElement.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};
