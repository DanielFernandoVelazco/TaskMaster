// src/services/users.service.ts
import { api } from './api';
import type { User } from '../types';

export const usersService = {
    async getAll(): Promise<User[]> {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            console.log('Error getting users, using mock data');
            return this.getMockMembers();
        }
    },

    async getById(id: string): Promise<User> {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.log(`Error getting user ${id}, using mock data`);
            return this.getMockMembers().find(m => m.id === id) || this.getMockMembers()[0];
        }
    },

    async update(id: string, data: Partial<User>): Promise<User> {
        try {
            const response = await api.patch(`/users/${id}`, data);
            return response.data;
        } catch (error) {
            console.log(`Error updating user ${id}, simulating success`);
            // Simulamos una respuesta exitosa
            return { ...this.getMockMembers().find(m => m.id === id), ...data } as User;
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(`/users/${id}`);
        } catch (error) {
            console.log(`Error deleting user ${id}, simulating success`);
            // Simulamos éxito
            return;
        }
    },

    async getTeamMembers(): Promise<User[]> {
        try {
            const response = await api.get('/users/team');
            return response.data;
        } catch (error) {
            console.log('Error getting team members, using mock data');
            return this.getMockMembers();
        }
    },

    async inviteMember(email: string, role: string): Promise<void> {
        try {
            await api.post('/users/invite', { email, role });
        } catch (error) {
            console.log(`Error inviting ${email}, simulating success`);
            // Simulamos éxito
            return;
        }
    },

    async updateMemberRole(userId: string, role: string): Promise<User> {
        try {
            const response = await api.patch(`/users/${userId}/role`, { role });
            return response.data;
        } catch (error) {
            console.log(`Error updating role for user ${userId}, using mock data`);
            const mockUser = this.getMockMembers().find(m => m.id === userId);
            if (mockUser) {
                return { ...mockUser, role } as User;
            }
            throw error;
        }
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
            {
                id: '5',
                name: 'Alex Rivera',
                email: 'alex.r@taskmaster.com',
                role: 'admin',
                avatar: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
        ];
    }
};