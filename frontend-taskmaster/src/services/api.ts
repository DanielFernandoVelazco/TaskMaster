// src/services/api.ts
import axios from 'axios';
import { AuthResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Servicios de autenticación
export const authService = {
    async register(email: string, password: string, name: string): Promise<AuthResponse> {
        const response = await api.post('/auth/register', { email, password, name });
        return response.data;
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    async getProfile(): Promise<User> {
        const response = await api.post('/auth/profile');
        return response.data;
    },
};