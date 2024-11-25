import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACK_KEY,
});

// Request interceptor to include the accessToken
api.interceptors.request.use(
    config => {
        // Get the user data from local storage
        const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object

        // If the user exists and has an accessToken, set it in the Authorization header
        if (user && user.accessToken) {
            config.headers['Authorization'] = `Bearer ${user.accessToken}`;
        }

        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            // Redirect to the restricted page
            window.location.href = '/restricted';
        }
        return Promise.reject(error);
    }
);

export default api;

