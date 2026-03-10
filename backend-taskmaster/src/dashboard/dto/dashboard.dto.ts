// backend-taskmaster/src/dashboard/dto/dashboard.dto.ts
export class KpiDataDto {
    totalTasks: number;
    completionRate: number;
    activeMembers: number;
    avgCycleTime: number;
    totalTasksTrend: number;
    completionRateTrend: number;
    avgCycleTimeTrend: number;
}

export class TeamPerformanceDto {
    name: string;
    tasksCompleted: number;
    percentage: number;
    avatar?: string;
    initials: string;
}

export class TaskStatusDto {
    status: string;
    count: number;
    percentage: number;
    color: string;
}

export class RecentActivityDto {
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
    timestamp: Date;
    project: string;
}

export class DashboardDataDto {
    kpi: KpiDataDto;
    teamPerformance: TeamPerformanceDto[];
    taskStatus: TaskStatusDto[];
    recentActivity: RecentActivityDto[];
}