// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACK_KEY,

});

api.interceptors.request.use(
    config => {
        // Modify config if necessary
        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    error => Promise.reject(error)
);

export default api;
