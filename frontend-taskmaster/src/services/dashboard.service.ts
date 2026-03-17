// frontend-taskmaster/src/services/dashboard.service.ts
import { api } from './api';

export interface KpiData {
    totalTasks: number;
    completionRate: number;
    activeMembers: number;
    avgCycleTime: number;
    totalTasksTrend: number;
    completionRateTrend: number;
    avgCycleTimeTrend: number;
}

export interface TeamPerformance {
    name: string;
    tasksCompleted: number;
    percentage: number;
    initials: string;
}

export interface TaskStatus {
    status: string;
    count: number;
    percentage: number;
    color: string;
}

export interface RecentActivity {
    id: string;
    user: {
        id: string;
        name: string;
        initials: string;
    };
    action: string;
    target: string;
    targetType: 'task' | 'project' | 'comment';
    status?: string;
    timestamp: string;
    project: string;
}

export interface DashboardData {
    kpi: KpiData;
    teamPerformance: TeamPerformance[];
    taskStatus: TaskStatus[];
    recentActivity: RecentActivity[];
}

export const dashboardService = {
    async getDashboardData(): Promise<DashboardData> {
        try {
            const response = await api.get('/dashboard');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    }
};