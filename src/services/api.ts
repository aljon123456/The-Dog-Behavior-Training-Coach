import axios from 'axios';
import * as mockApi from './mockApi';

// Set to true to use mock API (for testing without backend)
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create real Axios instance
const realApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
realApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
realApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Create a wrapper that uses mock or real API
const api = {
  post: async (url: string, data?: any) => {
    if (USE_MOCK_API) {
      // Route to mock API
      if (url === '/auth/signup/') {
        const response = await mockApi.mockSignUp(
          data.email,
          data.username,
          data.password
        );
        return { data: response };
      } else if (url === '/auth/signin/') {
        const response = await mockApi.mockSignIn(data.email, data.password);
        return { data: response };
      } else if (url === '/conversation/') {
        const response = await mockApi.mockCreateConversation(
          data.messages[0].content
        );
        return { data: response };
      } else if (url.startsWith('/conversation/')) {
        const convId = url.replace('/conversation/', '').replace('/', '');
        const response = await mockApi.mockSendMessage(
          convId,
          data.messages[0].content
        );
        return { data: response };
      }
    }
    return realApi.post(url, data);
  },

  get: async (url: string) => {
    if (USE_MOCK_API) {
      // Route to mock API
      if (url === '/conversations/') {
        const data = await mockApi.mockFetchConversations();
        return { data };
      } else if (url.startsWith('/conversations/')) {
        const convId = url.replace('/conversations/', '').replace('/', '');
        const data = await mockApi.mockFetchConversation(convId);
        return { data };
      }
    }
    return realApi.get(url);
  },
};

export default api;
