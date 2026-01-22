import axios, { AxiosInstance } from 'axios';

const Axios: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.request.use(function (config) {
  // Check for admin token first, then consultant token
  const token = localStorage.getItem('token') || localStorage.getItem('consultantToken');

  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config;
});

export default Axios;