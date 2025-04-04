import axios from 'axios';

const instance = axios.create({
  baseURL: '/',
  withCredentials: false, 
});


instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') || window.accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('accessToken');
      localStorage.setItem('sessionExpired', 'true');
      window.location.href = '/?expired=1';
    }
    return Promise.reject(error);
  }
);

export default instance;
