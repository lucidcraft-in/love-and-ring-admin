import axios, { AxiosInstance } from 'axios';

const Axios: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config;
});

export default Axios;