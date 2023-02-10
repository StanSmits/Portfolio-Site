import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  config => {
    if (!(config.url.includes('/login') || config.url.includes('/register'))) {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;