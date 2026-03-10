// src/pages/Dashboard/Dashboard.tsx
import React from 'react';

export const Dashboard: React.FC = () => {
    return (
        <div className="p-8 space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Tasks</p>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">assignment</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">1,284</h3>
                        <span className="text-emerald-500 text-sm font-bold flex items-center mb-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            12.5%
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">vs last month 1,141</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Completion Rate</p>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">check_circle</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">84%</h3>
                        <span className="text-emerald-500 text-sm font-bold flex items-center mb-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            4.2%
                        </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4">
                        <div className="bg-primary h-full rounded-full" style={{ width: '84%' }}></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Avg. Cycle Time</p>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">timer</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">3.2d</h3>
                        <span className="text-red-500 text-sm font-bold flex items-center mb-1">
                            <span className="material-symbols-outlined text-sm">trending_down</span>
                            0.5d
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Increased from 2.7d</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Sprints</p>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">rocket_launch</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">04</h3>
                        <span className="text-slate-400 text-sm font-medium mb-1">current</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">122 tasks currently in sprint</p>
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
                        <button className="text-sm text-primary font-semibold hover:underline">View Details</button>
                    </div>
                    <div className="flex items-end justify-between h-64 px-4 gap-4">
                        {[
                            { name: 'Sarah', tasks: 80, color: 'bg-primary' },
                            { name: 'John', tasks: 65, color: 'bg-primary' },
                            { name: 'Elena', tasks: 95, color: 'bg-primary' },
                            { name: 'Marcus', tasks: 40, color: 'bg-primary' },
                            { name: 'Lisa', tasks: 75, color: 'bg-primary' },
                        ].map((member) => (
                            <div key={member.name} className="flex-1 flex flex-col items-center gap-3 group">
                                <div className="w-full bg-primary/20 rounded-t-lg relative flex flex-col justify-end" style={{ height: `${member.tasks}%` }}>
                                    <div className={`${member.color} w-full h-full rounded-t-lg transition-all group-hover:opacity-80`}></div>
                                </div>
                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border-2 border-white shadow-sm">
                                    {member.name.charAt(0)}
                                </div>
                                <p className="text-xs font-medium text-slate-500">{member.name}</p>
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
                            <svg className="w-full h-full transform -rotate-90">
                                <circle className="text-slate-100 dark:text-slate-800" cx="50%" cy="50%" fill="transparent" r="40%" stroke="currentColor" strokeWidth="24"></circle>
                                <circle className="text-primary" cx="50%" cy="50%" fill="transparent" r="40%" stroke="currentColor" strokeDasharray="251" strokeDashoffset="50" strokeWidth="24"></circle>
                                <circle className="text-primary/60" cx="50%" cy="50%" fill="transparent" r="40%" stroke="currentColor" strokeDasharray="251" strokeDashoffset="180" strokeWidth="24"></circle>
                                <circle className="text-primary/30" cx="50%" cy="50%" fill="transparent" r="40%" stroke="currentColor" strokeDasharray="251" strokeDashoffset="230" strokeWidth="24"></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">1,284</p>
                                <p className="text-xs text-slate-500 font-medium">Total</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full bg-primary"></span>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Done (65%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full bg-primary/60"></span>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">In Progress (20%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full bg-primary/30"></span>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Review (10%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Todo (5%)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h4>
                    <button className="text-sm font-medium text-primary bg-primary/5 px-3 py-1 rounded-lg">View All</button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {/* Activity Item 1 */}
                    <div className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 dark:text-slate-100 font-medium truncate">
                                <span className="font-bold">John Doe</span> moved <span className="font-semibold text-primary">"API Integration v2"</span> to{' '}
                                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md text-xs font-bold">
                                    DONE
                                </span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1">2 hours ago • Project: Phoenix Core</p>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600">
                            <span className="material-symbols-outlined text-sm">more_vert</span>
                        </button>
                    </div>

                    {/* Activity Item 2 */}
                    <div className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            SS
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 dark:text-slate-100 font-medium truncate">
                                <span className="font-bold">Sarah Smith</span> added a comment on <span className="font-semibold text-primary">"Dashboard UI Review"</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1 italic">"The contrast on the status labels looks much better now, thanks!"</p>
                            <p className="text-xs text-slate-500 mt-1">4 hours ago • Project: Analytics Design</p>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600">
                            <span className="material-symbols-outlined text-sm">more_vert</span>
                        </button>
                    </div>

                    {/* Activity Item 3 */}
                    <div className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            EK
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 dark:text-slate-100 font-medium truncate">
                                <span className="font-bold">Elena K.</span> assigned <span className="font-semibold text-primary">"Database Migration"</span> to{' '}
                                <span className="font-bold text-slate-700 dark:text-slate-300">Marcus Wright</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1">6 hours ago • Project: Infra Update</p>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600">
                            <span className="material-symbols-outlined text-sm">more_vert</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};