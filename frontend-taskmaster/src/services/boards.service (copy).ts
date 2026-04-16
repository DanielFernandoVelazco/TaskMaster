// src/services/boards.service.ts
import { api } from './api';
import type { Board } from '../types';

export const boardsService = {
    async getAll(): Promise<Board[]> {
        const response = await api.get('/boards');
        return response.data;
    },

    async getById(id: string): Promise<Board> {
        const response = await api.get(`/boards/${id}`);
        return response.data;
    },

    async create(data: Partial<Board>): Promise<Board> {
        const response = await api.post('/boards', data);
        return response.data;
    },

    async update(id: string, data: Partial<Board>): Promise<Board> {
        const response = await api.patch(`/boards/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/boards/${id}`);
    },

    async addMember(boardId: string, userId: string): Promise<Board> {
        const response = await api.post(`/boards/${boardId}/members`, { userId });
        return response.data;
    },

    async removeMember(boardId: string, memberId: string): Promise<Board> {
        const response = await api.delete(`/boards/${boardId}/members/${memberId}`);
        return response.data;
    },
};