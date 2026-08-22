import axios, { AxiosInstance } from 'axios';

const Axios: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  // baseURL: 'https://love-ring-api.vercel.app',
  // baseURL:'/',
  headers: {
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    }
  }

  const pathname = window.location.pathname;
  let token: string | null = null;

  if (pathname.startsWith("/consultant")) {
    token = localStorage.getItem("consultantToken");
    if (!token || token === "null" || token === "undefined") {
      try {
        const consultant = JSON.parse(localStorage.getItem("currentConsultant") || "{}");
        token = consultant?.token || null;
      } catch (e) {}
    }
  } else if (pathname.startsWith("/staff")) {
    token = localStorage.getItem("staffToken") || localStorage.getItem("staff_token");
    if (!token || token === "null" || token === "undefined") {
      try {
        const staff = JSON.parse(localStorage.getItem("staffUser") || localStorage.getItem("currentStaff") || "{}");
        token = staff?.token || null;
      } catch (e) {}
    }
  }

  // Fallback to admin/user token
  if (!token || token === "null" || token === "undefined") {
    token = localStorage.getItem("token") || localStorage.getItem("admin_token");
  }

  if (!token || token === "null" || token === "undefined") {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      token = auth?.token || auth?.accessToken || null;
    } catch (e) {}
  }

  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default Axios;