import axios, { AxiosInstance } from 'axios';

const Axios: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.request.use((config) => {
  const consultantToken = localStorage.getItem("consultantToken");
  const adminToken = localStorage.getItem("token");
  const staffToken = localStorage.getItem("staffToken");

  // choose token by route
  if (window.location.pathname.startsWith("/consultant")) {
    if (consultantToken) {
      config.headers.Authorization = `Bearer ${consultantToken}`;
    }
  } else if (window.location.pathname.startsWith("/staff")) {
    if (staffToken) {
      config.headers.Authorization = `Bearer ${staffToken}`;
    }
  } else {
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  }

  return config;
});
export default Axios;