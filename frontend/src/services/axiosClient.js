
import axios from 'axios';

const axiosWithToken = axios.create({
  baseURL: '/api/v1',
  timeout: 5000,
});

axiosWithToken.interceptors.request.use(
    (config) => {
    const token = JSON.parse(localStorage.getItem('user') || "null")?.access_token ||
  JSON.parse(sessionStorage.getItem('user') || "null")?.access_token
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
 },
    (error) => {
        return Promise.reject(error);
    }
);


const axiosDefault = axios.create({
  baseURL: '/api/v1',
  timeout: 5000,
});


export { axiosWithToken, axiosDefault };

export default axiosWithToken
