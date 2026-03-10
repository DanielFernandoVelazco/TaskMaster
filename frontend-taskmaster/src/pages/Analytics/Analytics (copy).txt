// src/pages/Analytics/Analytics.tsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';

type TimeRange = 'daily' | 'weekly' | 'monthly';

export const Analytics: React.FC = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
    const [isLoading, setIsLoading] = useState(false);

    // Datos simulados para las gráficas
    const kpiData = {
        totalTasks: 1284,
        completionRate: 87.2,
        activeMembers: 24,
        avgResolution: 4.2,
    };

    const taskTrendData = [
        { date: '01 Oct', completed: 24, target: 20 },
        { date: '07 Oct', completed: 32, target: 28 },
        { date: '14 Oct', completed: 28, target: 25 },
        { date: '21 Oct', completed: 35, target: 30 },
        { date: '28 Oct', completed: 42, target: 35 },
        { date: '31 Oct', completed: 38, target: 32 },
    ];

    const projectHealthData = {
        onTrack: 8,
        atRisk: 3,
        overdue: 1,
        total: 12,
    };

    const productivityData = [
        { name: 'Sarah Miller', tasks: 42, percentage: 85 },
        { name: 'Jason Chen', tasks: 38, percentage: 76 },
        { name: 'Elena Rodriguez', tasks: 31, percentage: 62 },
        { name: 'David Park', tasks: 29, percentage: 58 },
        { name: 'Lisa Thompson', tasks: 18, percentage: 36 },
    ];

    const projectsData = [
        { name: 'Rebranding 2024', velocity: 8.4, status: 'on-track', icon: 'rocket_launch', color: 'indigo' },
        { name: 'Mobile App v2', velocity: 12.1, status: 'at-risk', icon: 'devices', color: 'blue' },
        { name: 'Security Audit', velocity: 2.2, status: 'overdue', icon: 'shield', color: 'rose' },
        { name: 'Docs Update', velocity: 15.0, status: 'on-track', icon: 'menu_book', color: 'emerald' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'on-track':
                return {
                    label: 'ON TRACK',
                    bg: 'bg-emerald-100 dark:bg-emerald-500/10',
                    text: 'text-emerald-700 dark:text-emerald-400',
                };
            case 'at-risk':
                return {
                    label: 'AT RISK',
                    bg: 'bg-amber-100 dark:bg-amber-500/10',
                    text: 'text-amber-700 dark:text-amber-400',
                };
            case 'overdue':
                return {
                    label: 'OVERDUE',
                    bg: 'bg-rose-100 dark:bg-rose-500/10',
                    text: 'text-rose-700 dark:text-rose-400',
                };
            default:
                return {
                    label: 'UNKNOWN',
                    bg: 'bg-slate-100 dark:bg-slate-800',
                    text: 'text-slate-700 dark:text-slate-400',
                };
        }
    };

    const handleExportReport = () => {
        setIsLoading(true);
        setTimeout(() => {
            toast.success('Reporte exportado exitosamente');
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header with Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                        Analytics
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Track your team's performance and project metrics.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Time Range Selector */}
                    <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1">
                        <button
                            onClick={() => setTimeRange('daily')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${timeRange === 'daily'
                                    ? 'bg-primary text-white'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                                }`}
                        >
                            Daily
                        </button>
                        <button
                            onClick={() => setTimeRange('weekly')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${timeRange === 'weekly'
                                    ? 'bg-primary text-white'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                                }`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setTimeRange('monthly')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${timeRange === 'monthly'
                                    ? 'bg-primary text-white'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                                }`}
                        >
                            Monthly
                        </button>
                    </div>

                    {/* Date Range Picker */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-medium cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-lg text-slate-400">calendar_today</span>
                        <span>Oct 1, 2023 - Oct 31, 2023</span>
                        <span className="material-symbols-outlined text-lg text-slate-400">expand_more</span>
                    </div>

                    {/* Export Button */}
                    <button
                        onClick={handleExportReport}
                        disabled={isLoading}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-lg">download</span>
                        {isLoading ? 'Exporting...' : 'Export Report'}
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Tasks */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Tasks</p>
                            <h3 className="text-2xl font-bold mt-1">{kpiData.totalTasks.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-primary">task</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-medium text-emerald-600">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span className="ml-1">+12.5% from last month</span>
                    </div>
                </div>

                {/* Completion Rate */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completion Rate</p>
                            <h3 className="text-2xl font-bold mt-1">{kpiData.completionRate}%</h3>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-medium text-emerald-600">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span className="ml-1">+2.4% from last month</span>
                    </div>
                </div>

                {/* Active Members */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Members</p>
                            <h3 className="text-2xl font-bold mt-1">{kpiData.activeMembers}</h3>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-primary">groups</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-medium text-slate-500">
                        <span className="material-symbols-outlined text-sm">remove</span>
                        <span className="ml-1">Same as last month</span>
                    </div>
                </div>

                {/* Avg Resolution */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg. Resolution</p>
                            <h3 className="text-2xl font-bold mt-1">{kpiData.avgResolution}d</h3>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-primary">schedule</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-medium text-rose-600">
                        <span className="material-symbols-outlined text-sm">trending_down</span>
                        <span className="ml-1">-0.5d from last month</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Task Completion Trend */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold text-base">Task Completion Trend</h4>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 text-xs font-medium">
                                <span className="size-3 rounded-full bg-primary"></span>
                                <span>Completed</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium">
                                <span className="size-3 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                <span>Target</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Bars */}
                    <div className="relative h-64">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div key={i} className="border-b border-slate-100 dark:border-slate-800 h-0 w-full"></div>
                            ))}
                        </div>

                        {/* Bars */}
                        <div className="relative h-full flex items-end gap-2 px-2">
                            {taskTrendData.map((item, index) => {
                                const maxValue = 50;
                                const completedHeight = (item.completed / maxValue) * 100;
                                const targetHeight = (item.target / maxValue) * 100;

                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                        <div className="w-full flex flex-col justify-end h-48 gap-1">
                                            <div
                                                className="w-full bg-primary/20 rounded-t relative group"
                                                style={{ height: `${targetHeight}%` }}
                                            >
                                                <div
                                                    className="absolute bottom-0 w-full bg-primary/60 rounded-t"
                                                    style={{ height: `${(item.target / maxValue) * 100}%` }}
                                                >
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                                                        Target: {item.target}
                                                    </div>
                                                </div>
                                                <div
                                                    className="absolute bottom-0 w-full bg-primary rounded-t"
                                                    style={{ height: `${(item.completed / maxValue) * 100}%` }}
                                                >
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                                                        Completed: {item.completed}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Project Health */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h4 className="font-bold text-base mb-6">Project Health</h4>
                    <div className="space-y-6">
                        {/* Donut Chart */}
                        <div className="flex items-center justify-center relative py-4">
                            <svg className="size-48 transform -rotate-90">
                                <circle
                                    className="text-slate-100 dark:text-slate-800"
                                    cx="96"
                                    cy="96"
                                    fill="transparent"
                                    r="84"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                />
                                <circle
                                    className="text-primary"
                                    cx="96"
                                    cy="96"
                                    fill="transparent"
                                    r="84"
                                    stroke="currentColor"
                                    strokeDasharray="527.5"
                                    strokeDashoffset={527.5 * (1 - projectHealthData.onTrack / projectHealthData.total)}
                                    strokeWidth="12"
                                />
                                <circle
                                    className="text-amber-400"
                                    cx="96"
                                    cy="96"
                                    fill="transparent"
                                    r="84"
                                    stroke="currentColor"
                                    strokeDasharray="527.5"
                                    strokeDashoffset={
                                        527.5 * (1 - (projectHealthData.atRisk + projectHealthData.onTrack) / projectHealthData.total)
                                    }
                                    strokeWidth="12"
                                />
                                <circle
                                    className="text-rose-500"
                                    cx="96"
                                    cy="96"
                                    fill="transparent"
                                    r="84"
                                    stroke="currentColor"
                                    strokeDasharray="527.5"
                                    strokeDashoffset="0"
                                    strokeWidth="12"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold">{projectHealthData.total}</span>
                                <span className="text-xs text-slate-400 uppercase tracking-wider">Total</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-full bg-emerald-500"></span>
                                    <span className="text-sm font-medium">On Track</span>
                                </div>
                                <span className="text-sm font-bold">{projectHealthData.onTrack}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-full bg-amber-400"></span>
                                    <span className="text-sm font-medium">At Risk</span>
                                </div>
                                <span className="text-sm font-bold">{projectHealthData.atRisk}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-full bg-rose-500"></span>
                                    <span className="text-sm font-medium">Overdue</span>
                                </div>
                                <span className="text-sm font-bold">{projectHealthData.overdue}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Productivity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Productivity per Member */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold text-base">Productivity per Member</h4>
                        <span className="text-xs text-slate-400">Tasks Completed</span>
                    </div>
                    <div className="space-y-4">
                        {productivityData.map((member, index) => (
                            <div key={index} className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{member.name}</span>
                                    <span className="text-slate-500">{member.tasks} tasks</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-500"
                                        style={{ width: `${member.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Project Breakdown Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                        <h4 className="font-bold text-base">Project Breakdown</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs uppercase text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-6 py-3">Project</th>
                                    <th className="px-6 py-3 text-center">Velocity</th>
                                    <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {projectsData.map((project, index) => {
                                    const status = getStatusBadge(project.status);
                                    const velocityTrend = project.status === 'on-track' ? 'arrow_upward' : project.status === 'at-risk' ? 'trending_flat' : 'arrow_downward';
                                    const velocityColor = project.status === 'on-track' ? 'text-emerald-500' : project.status === 'at-risk' ? 'text-slate-400' : 'text-rose-500';

                                    return (
                                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`size-8 rounded bg-${project.color}-500/10 flex items-center justify-center text-${project.color}-500`}>
                                                        <span className="material-symbols-outlined text-sm">{project.icon}</span>
                                                    </div>
                                                    <span className="text-sm font-medium">{project.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center justify-center text-xs font-bold ${velocityColor}`}>
                                                    <span className="material-symbols-outlined text-sm">{velocityTrend}</span>
                                                    {project.velocity}/wk
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-2 py-1 text-[10px] font-bold rounded ${status.bg} ${status.text}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Recent Activity (simplified from Dashboard) */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h4>
                    <button className="text-sm font-medium text-primary bg-primary/5 px-3 py-1 rounded-lg hover:bg-primary/10 transition-colors">
                        View All
                    </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {/* Activity Item 1 */}
                    <div className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 dark:text-slate-100 font-medium truncate">
                                <span className="font-bold">John Doe</span> completed{' '}
                                <span className="font-semibold text-primary">"API Integration v2"</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1">2 hours ago • Project: Phoenix Core</p>
                        </div>
                        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md text-xs font-bold">
                            DONE
                        </span>
                    </div>

                    {/* Activity Item 2 */}
                    <div className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            SS
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 dark:text-slate-100 font-medium truncate">
                                <span className="font-bold">Sarah Smith</span> commented on{' '}
                                <span className="font-semibold text-primary">"Dashboard UI Review"</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1">4 hours ago • Project: Analytics Design</p>
                        </div>
                    </div>

                    {/* Activity Item 3 */}
                    <div className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            MW
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 dark:text-slate-100 font-medium truncate">
                                <span className="font-bold">Marcus Wright</span> started{' '}
                                <span className="font-semibold text-primary">"Database Migration"</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1">6 hours ago • Project: Infra Update</p>
                        </div>
                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-md text-xs font-bold">
                            IN PROGRESS
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};