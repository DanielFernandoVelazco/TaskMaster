// frontend-taskmaster/src/pages/Dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService, type DashboardData } from '../../services/dashboard.service';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            const dashboardData = await dashboardService.getDashboardData();
            setData(dashboardData);
        } catch (error) {
            console.error('Error loading dashboard:', error);
            toast.error('Error al cargar los datos del dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-8 text-center text-slate-500">
                No data available
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Tasks */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Tasks</p>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">assignment</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{data.kpi.totalTasks.toLocaleString()}</h3>
                        <span className={`text-sm font-bold flex items-center mb-1 ${data.kpi.totalTasksTrend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            <span className="material-symbols-outlined text-sm">
                                {data.kpi.totalTasksTrend >= 0 ? 'trending_up' : 'trending_down'}
                            </span>
                            {Math.abs(data.kpi.totalTasksTrend)}%
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">vs last month</p>
                </div>

                {/* Completion Rate */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Completion Rate</p>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">check_circle</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{data.kpi.completionRate}%</h3>
                        <span className={`text-sm font-bold flex items-center mb-1 ${data.kpi.completionRateTrend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            <span className="material-symbols-outlined text-sm">
                                {data.kpi.completionRateTrend >= 0 ? 'trending_up' : 'trending_down'}
                            </span>
                            {Math.abs(data.kpi.completionRateTrend)}%
                        </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4">
                        <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${data.kpi.completionRate}%` }}
                        ></div>
                    </div>
                </div>

                {/* Avg Cycle Time */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Avg. Cycle Time</p>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">timer</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{data.kpi.avgCycleTime}d</h3>
                        <span className={`text-sm font-bold flex items-center mb-1 ${data.kpi.avgCycleTimeTrend < 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            <span className="material-symbols-outlined text-sm">
                                {data.kpi.avgCycleTimeTrend < 0 ? 'trending_down' : 'trending_up'}
                            </span>
                            {Math.abs(data.kpi.avgCycleTimeTrend)}d
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">vs last month</p>
                </div>

                {/* Active Members */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Members</p>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">group</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{data.kpi.activeMembers}</h3>
                        <span className="text-slate-400 text-sm font-medium mb-1">active</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">members with activity</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Team Performance Bar Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">Team Performance</h4>
                            <p className="text-sm text-slate-500">Tasks completed per member</p>
                        </div>
                        <Link
                            to="/team"
                            className="text-sm text-primary font-semibold hover:underline"
                        >
                            View Details
                        </Link>
                    </div>
                    <div className="flex items-end justify-between h-64 px-4 gap-4">
                        {data.teamPerformance.map((member) => (
                            <div key={member.name} className="flex-1 flex flex-col items-center gap-3 group">
                                <div className="w-full bg-primary/20 rounded-t-lg relative flex flex-col justify-end" style={{ height: `${member.percentage}%` }}>
                                    <div className="bg-primary w-full h-full rounded-t-lg transition-all group-hover:opacity-80"></div>
                                </div>
                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border-2 border-white shadow-sm">
                                    {member.initials}
                                </div>
                                <p className="text-xs font-medium text-slate-500">{member.name.split(' ')[0]}</p>
                                <span className="text-xs text-slate-400">{member.tasksCompleted} tasks</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tasks by Status Doughnut Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-6">Tasks by Status</h4>
                    <div className="flex-1 flex flex-col items-center justify-center relative">
                        {/* Custom CSS Doughnut using SVG */}
                        <div className="size-48 relative">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {/* Background circle */}
                                <circle
                                    className="text-slate-100 dark:text-slate-800"
                                    cx="50"
                                    cy="50"
                                    fill="transparent"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                />
                                {/* Status segments */}
                                {data.taskStatus.map((status, index) => {
                                    // Calcular el offset basado en los porcentajes acumulados
                                    const previousPercentages = data.taskStatus
                                        .slice(0, index)
                                        .reduce((acc, s) => acc + s.percentage, 0);

                                    const circumference = 2 * Math.PI * 40; // 2πr
                                    const dashArray = (status.percentage / 100) * circumference;
                                    const dashOffset = circumference - (previousPercentages / 100) * circumference;

                                    return (
                                        <circle
                                            key={status.status}
                                            className={status.color}
                                            cx="50"
                                            cy="50"
                                            fill="transparent"
                                            r="40"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                                            strokeDashoffset={dashOffset}
                                            strokeLinecap="butt"
                                        />
                                    );
                                })}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {data.taskStatus.reduce((acc, s) => acc + s.count, 0)}
                                </p>
                                <p className="text-xs text-slate-500 font-medium">Total</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {data.taskStatus.map((status) => (
                            <div key={status.status} className="flex items-center gap-2">
                                <span className={`size-3 rounded-full ${status.color}`}></span>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    {status.status} ({status.percentage}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h4>
                    <Link
                        to="/tasks"
                        className="text-sm font-medium text-primary bg-primary/5 px-3 py-1 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                        View All
                    </Link>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.recentActivity.map((activity) => (
                        <div key={activity.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {activity.user.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-900 dark:text-slate-100 font-medium truncate">
                                    <span className="font-bold">{activity.user.name}</span>{' '}
                                    {activity.action}{' '}
                                    <span className="font-semibold text-primary">"{activity.target}"</span>
                                    {activity.status && (
                                        <>
                                            {' '}to{' '}
                                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${activity.status === 'DONE'
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                                }`}>
                                                {activity.status}
                                            </span>
                                        </>
                                    )}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {new Date(activity.timestamp).toLocaleString()} • Project: {activity.project}
                                </p>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined text-sm">more_vert</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};