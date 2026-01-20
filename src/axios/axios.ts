import axios, { AxiosInstance } from 'axios';

const Axios: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    'If-Modified-Since': '0',
  },
}); 

Axios.interceptors.request.use(function (config) {
  let token = localStorage.getItem('userInfo');

  config.headers['Authorization'] = 'Bearer ' + token;
  return config;
});

export default Axios;