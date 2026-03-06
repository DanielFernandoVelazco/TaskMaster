// src/services/users.service.ts
import { api } from './api';
import type { User } from '../types';

export const usersService = {
    async getAll(): Promise<User[]> {
        const response = await api.get('/users');
        return response.data;
    },

    async getById(id: string): Promise<User> {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    async update(id: string, data: Partial<User>): Promise<User> {
        const response = await api.patch(`/users/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/users/${id}`);
    },

    async getTeamMembers(): Promise<User[]> {
        // Este endpoint específico para miembros del equipo
        const response = await api.get('/users/team');
        return response.data;
    },

    async inviteMember(email: string, role: string): Promise<void> {
        await api.post('/users/invite', { email, role });
    },

    async updateMemberRole(userId: string, role: string): Promise<User> {
        const response = await api.patch(`/users/${userId}/role`, { role });
        return response.data;
    },

    // Datos mock para desarrollo (cuando el backend no está listo)
    getMockMembers(): User[] {
        return [
            {
                id: '1',
                name: 'Jordan Smith',
                email: 'jordan@taskmaster.com',
                role: 'admin',
                avatar: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Elena Rodriguez',
                email: 'elena.r@taskmaster.com',
                role: 'member',
                avatar: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Marcus Chen',
                email: 'm.chen@taskmaster.com',
                role: 'viewer',
                avatar: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '4',
                name: 'Sarah Connor',
                email: 'sarah.c@taskmaster.com',
                role: 'member',
                avatar: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
        ];
    }
};