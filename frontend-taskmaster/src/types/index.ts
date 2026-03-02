// src/types/index.ts
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role?: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
}

export interface Board {
    id: string;
    name: string;
    description?: string;
    color: string;
    ownerId: User | string;
    members: User[] | string[];
    createdAt: string;
    updatedAt: string;
}

export interface Column {
    id: string;
    name: string;
    boardId: string;
    order: number;
    color?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Card {
    id: string;
    title: string;
    description?: string;
    columnId: string;
    assigneeId?: User | string;
    order: number;
    labels: string[];
    dueDate?: string;
    watchers: User[] | string[];
    status: 'todo' | 'in-progress' | 'review' | 'done';
    progress: number;
    coverImage?: string;
    createdAt: string;
    updatedAt: string;
}