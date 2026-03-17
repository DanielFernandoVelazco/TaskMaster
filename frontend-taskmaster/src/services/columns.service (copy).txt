// src/services/columns.service.ts
import { api } from './api';
import type { Column } from '../types';

export const columnsService = {
    async getAllByBoard(boardId: string): Promise<Column[]> {
        const response = await api.get(`/columns/board/${boardId}`);
        return response.data;
    },

    async getById(id: string): Promise<Column> {
        const response = await api.get(`/columns/${id}`);
        return response.data;
    },

    async create(data: Partial<Column>): Promise<Column> {
        const response = await api.post('/columns', data);
        return response.data;
    },

    async update(id: string, data: Partial<Column>): Promise<Column> {
        const response = await api.patch(`/columns/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/columns/${id}`);
    },

    async reorder(id: string, newOrder: number): Promise<Column> {
        const response = await api.patch(`/columns/${id}/reorder`, { newOrder });
        return response.data;
    },
};