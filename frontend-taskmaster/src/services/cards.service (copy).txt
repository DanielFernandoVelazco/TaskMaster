// src/services/cards.service.ts
import { api } from './api';
import type { Card } from '../types';

export const cardsService = {
    async getAllByColumn(columnId: string): Promise<Card[]> {
        const response = await api.get(`/cards/column/${columnId}`);
        return response.data;
    },

    async getAllByBoard(boardId: string): Promise<Card[]> {
        const response = await api.get(`/cards/board/${boardId}`);
        return response.data;
    },

    async getById(id: string): Promise<Card> {
        const response = await api.get(`/cards/${id}`);
        return response.data;
    },

    async create(data: Partial<Card>): Promise<Card> {
        const response = await api.post('/cards', data);
        return response.data;
    },

    async update(id: string, data: Partial<Card>): Promise<Card> {
        const response = await api.patch(`/cards/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/cards/${id}`);
    },

    async move(id: string, targetColumnId: string, newOrder: number): Promise<Card> {
        const response = await api.post(`/cards/${id}/move`, {
            targetColumnId,
            newOrder,
        });
        return response.data;
    },

    async addWatcher(id: string, userId: string): Promise<Card> {
        const response = await api.post(`/cards/${id}/watchers`, { userId });
        return response.data;
    },

    async removeWatcher(id: string, watcherId: string): Promise<Card> {
        const response = await api.delete(`/cards/${id}/watchers/${watcherId}`);
        return response.data;
    },

    async assign(id: string, assigneeId: string): Promise<Card> {
        const response = await api.post(`/cards/${id}/assign/${assigneeId}`);
        return response.data;
    },

    async updateProgress(id: string, progress: number): Promise<Card> {
        const response = await api.patch(`/cards/${id}/progress/${progress}`);
        return response.data;
    },
};