import axios from 'axios';

// 1. Cấu hình base URL (Nên dùng biến môi trường để linh hoạt)
// Nếu dùng Vite thì là import.meta.env.VITE_API_URL
// Nếu '/api/v1' là proxy thì giữ nguyên
const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

const axiosWithToken = axios.create({
  baseURL: baseURL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- REQUEST INTERCEPTOR: Gắn Token vào Header ---
axiosWithToken.interceptors.request.use(
  (config) => {    
    // Cách 1: Lấy từ object 'user' (như code cũ của bạn)
    const userFromLocal = JSON.parse(localStorage.getItem('user') || "null");
    const userFromSession = JSON.parse(sessionStorage.getItem('user') || "null");
    
    // Cách 2: Lấy trực tiếp từ key 'token' (thường dùng cách này hơn)
    const tokenString = localStorage.getItem('token') || sessionStorage.getItem('token');

    // Ưu tiên lấy token, kiểm tra kỹ null/undefined
    const token = 
      userFromLocal?.access_token || 
      userFromSession?.access_token || 
      tokenString;

    const lang = sessionStorage.getItem('lang') || 'en';

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    config.headers['Accept-Language'] = lang;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- RESPONSE INTERCEPTOR: Xử lý khi Token hết hạn (401) ---
axiosWithToken.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Nếu API trả về 401 (Unauthorized), nghĩa là token sai hoặc hết hạn
    if (error.response && error.response.status === 401) {
      // Xóa sạch dữ liệu cũ để tránh loop
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Đá về trang login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// -----------------------------------------------------------

const axiosDefault = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosDefault.interceptors.request.use(
  (config) => {
    const lang = sessionStorage.getItem('lang') || 'en';
    config.headers['Accept-Language'] = lang;
    return config;
  },
  (error) => Promise.reject(error)
);

export { axiosWithToken, axiosDefault };
export default axiosWithToken;