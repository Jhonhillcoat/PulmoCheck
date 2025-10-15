import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const assessmentAPI = {
  create: (data) => api.post('/assessment', data),
  uploadImage: (assessmentId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/upload/${assessmentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  analyze: (assessmentId) => api.post(`/analyze/${assessmentId}`),
};

export const doctorAPI = {
  login: (credentials) => api.post('/doctor/login', credentials),
  getAssessments: () => api.get('/doctor/assessments'),
  getAssessmentDetail: (id) => api.get(`/doctor/assessment/${id}`),
  addComment: (data) => api.post('/doctor/comment', data),
  downloadReport: (id) => {
    return axios.get(`${API_BASE_URL}/report/${id}`, {
      responseType: 'blob',
    });
  },
};

export default api;

