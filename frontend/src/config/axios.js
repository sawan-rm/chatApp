import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

axiosInstance.interceptors.request.use(
    (config) => {
        console.log(`📤 [API REQUEST] ${config.method.toUpperCase()} ${config.url}`, config.data || '');
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
            console.log('🔑 [API REQUEST] Token added to request');
        } else {
            console.log('⚠️ [API REQUEST] No token found');
        }
        return config
    },
    (error) => {
        console.error('❌ [API REQUEST] Request error:', error);
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        console.log(`✅ [API RESPONSE] ${response.config.method.toUpperCase()} ${response.config.url}`, response.status, response.data);
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(`❌ [API RESPONSE] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response.status, error.response.data);
        } else if (error.request) {
            console.error('❌ [API RESPONSE] No response received:', error.message);
        } else {
            console.error('❌ [API RESPONSE] Error:', error.message);
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;   