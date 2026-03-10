// backend-taskmaster/src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Board, BoardDocument } from '../boards/schemas/board.schema';
import { Column, ColumnDocument } from '../columns/schemas/column.schema';
import { Card, CardDocument } from '../cards/schemas/card.schema';
import { DashboardDataDto, KpiDataDto, TeamPerformanceDto, TaskStatusDto, RecentActivityDto } from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
        @InjectModel(Column.name) private columnModel: Model<ColumnDocument>,
        @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    ) { }

    async getDashboardData(userId: string): Promise<DashboardDataDto> {
        const kpi = await this.getKpiData(userId);
        const teamPerformance = await this.getTeamPerformance(userId);
        const taskStatus = await this.getTaskStatus(userId);
        const recentActivity = await this.getRecentActivity(userId);

        return {
            kpi,
            teamPerformance,
            taskStatus,
            recentActivity,
        };
    }

    private async getKpiData(userId: string): Promise<KpiDataDto> {
        const boards = await this.boardModel.find({
            $or: [
                { ownerId: new Types.ObjectId(userId) },
                { members: new Types.ObjectId(userId) }
            ]
        }).exec();

        const boardIds = boards.map(b => b._id);
        const columns = await this.columnModel.find({ boardId: { $in: boardIds } }).exec();
        const columnIds = columns.map(c => c._id);
        const cards = await this.cardModel.find({ columnId: { $in: columnIds } })
            .populate('assigneeId')
            .exec();

        const totalTasks = cards.length;
        const completedTasks = cards.filter(c => c.status === 'done').length;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        const activeMemberIds = new Set();
        cards.forEach(card => {
            if (card.assigneeId) {
                const assigneeId = card.assigneeId as any;
                activeMemberIds.add(assigneeId._id?.toString() || assigneeId.toString());
            }
        });
        const activeMembers = activeMemberIds.size;

        // Calcular ciclo promedio
        const completedCards = cards.filter(c => c.status === 'done');
        let totalCycleTime = 0;

        completedCards.forEach(card => {
            const created = card.createdAt ? new Date(card.createdAt).getTime() : Date.now();
            const completed = card.updatedAt ? new Date(card.updatedAt).getTime() : Date.now();
            const cycleDays = (completed - created) / (1000 * 60 * 60 * 24);
            totalCycleTime += cycleDays;
        });

        const avgCycleTime = completedCards.length > 0
            ? Number((totalCycleTime / completedCards.length).toFixed(1))
            : 0;

        return {
            totalTasks,
            completionRate: Number(completionRate.toFixed(1)),
            activeMembers,
            avgCycleTime,
            totalTasksTrend: 12.5,
            completionRateTrend: 2.4,
            avgCycleTimeTrend: -0.5,
        };
    }

    private async getTeamPerformance(userId: string): Promise<TeamPerformanceDto[]> {
        const boards = await this.boardModel.find({
            $or: [
                { ownerId: new Types.ObjectId(userId) },
                { members: new Types.ObjectId(userId) }
            ]
        }).exec();

        const boardIds = boards.map(b => b._id);
        const columns = await this.columnModel.find({ boardId: { $in: boardIds } }).exec();
        const columnIds = columns.map(c => c._id);
        const cards = await this.cardModel.find({ columnId: { $in: columnIds } })
            .populate('assigneeId', 'name email')
            .exec();

        const performanceMap = new Map<string, { name: string; tasks: number }>();

        cards.forEach(card => {
            if (card.assigneeId) {
                const assignee = card.assigneeId as any;
                const id = assignee._id?.toString() || assignee.toString();
                const name = assignee.name || 'Unknown';

                const current = performanceMap.get(id);
                if (current) {
                    performanceMap.set(id, { name, tasks: current.tasks + 1 });
                } else {
                    performanceMap.set(id, { name, tasks: 1 });
                }
            }
        });

        const performanceValues = Array.from(performanceMap.values());
        const maxTasks = Math.max(...performanceValues.map(p => p.tasks), 1);

        const performance = Array.from(performanceMap.entries()).map(([id, data]) => ({
            name: data.name,
            tasksCompleted: data.tasks,
            percentage: Math.round((data.tasks / maxTasks) * 100),
            initials: data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        }));

        performance.sort((a, b) => b.tasksCompleted - a.tasksCompleted);
        return performance.slice(0, 5);
    }

    private async getTaskStatus(userId: string): Promise<TaskStatusDto[]> {
        const boards = await this.boardModel.find({
            $or: [
                { ownerId: new Types.ObjectId(userId) },
                { members: new Types.ObjectId(userId) }
            ]
        }).exec();

        const boardIds = boards.map(b => b._id);
        const columns = await this.columnModel.find({ boardId: { $in: boardIds } }).exec();
        const columnIds = columns.map(c => c._id);
        const cards = await this.cardModel.find({ columnId: { $in: columnIds } }).exec();

        const totalTasks = cards.length;

        const statusMap = {
            'done': { label: 'Done', color: 'bg-primary', count: 0 },
            'in-progress': { label: 'In Progress', color: 'bg-primary/60', count: 0 },
            'review': { label: 'Review', color: 'bg-primary/30', count: 0 },
            'todo': { label: 'Todo', color: 'bg-slate-200 dark:bg-slate-700', count: 0 },
        };

        cards.forEach(card => {
            const status = card.status || 'todo';
            if (statusMap[status]) {
                statusMap[status].count += 1;
            } else {
                statusMap['todo'].count += 1;
            }
        });

        return Object.entries(statusMap).map(([status, data]) => ({
            status: data.label,
            count: data.count,
            percentage: totalTasks > 0 ? Math.round((data.count / totalTasks) * 100) : 0,
            color: data.color,
        }));
    }

    private async getRecentActivity(userId: string): Promise<RecentActivityDto[]> {
        const boards = await this.boardModel.find({
            $or: [
                { ownerId: new Types.ObjectId(userId) },
                { members: new Types.ObjectId(userId) }
            ]
        }).populate('ownerId', 'name').exec();

        const boardIds = boards.map(b => b._id);
        const columns = await this.columnModel.find({ boardId: { $in: boardIds } }).exec();
        const columnIds = columns.map(c => c._id);

        const recentCards = await this.cardModel.find({ columnId: { $in: columnIds } })
            .sort({ updatedAt: -1 })
            .limit(10)
            .populate('assigneeId', 'name')
            .exec();

        const activity: RecentActivityDto[] = [];

        recentCards.forEach(card => {
            let action = '';
            let status: string | undefined = undefined;

            if (card.status === 'done') {
                action = 'completed';
                status = 'DONE';
            } else if (card.status === 'in-progress') {
                action = 'started working on';
                status = 'IN PROGRESS';
            } else if (card.status === 'review') {
                action = 'submitted for review';
                status = 'REVIEW';
            } else {
                action = 'updated';
            }

            const column = columns.find(c => c._id.toString() === card.columnId?.toString());
            const board = column ? boards.find(b => b._id.toString() === column.boardId?.toString()) : null;

            let userName = 'System';
            let userInitials = 'SY';
            let userId = 'unknown';

            if (card.assigneeId) {
                const assignee = card.assigneeId as any;
                userName = assignee.name || 'Unknown';
                userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                userId = assignee._id?.toString() || 'unknown';
            }

            activity.push({
                id: card._id.toString(),
                user: {
                    id: userId,
                    name: userName,
                    initials: userInitials,
                },
                action,
                target: card.title,
                targetType: 'task',
                status,
                timestamp: card.updatedAt || card.createdAt || new Date(),
                project: board ? board.name : 'Unknown Project',
            });
        });

        return activity;
    }
}