// src/pages/Tasks/Tasks.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { boardsService } from '../../services/boards.service';
import { cardsService } from '../../services/cards.service';
import type { Board, Card } from '../../types';
import toast from 'react-hot-toast';

export const Tasks: React.FC = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [selectedBoard, setSelectedBoard] = useState<string>('');
    const [tasks, setTasks] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterPriority, setFilterPriority] = useState<string>('all');

    useEffect(() => {
        loadBoards();
    }, []);

    useEffect(() => {
        if (selectedBoard) {
            loadTasks(selectedBoard);
        }
    }, [selectedBoard]);

    const loadBoards = async () => {
        try {
            const data = await boardsService.getAll();
            setBoards(data);
            if (data.length > 0) {
                setSelectedBoard(data[0].id);
            }
        } catch (error) {
            toast.error('Error al cargar los proyectos');
        } finally {
            setIsLoading(false);
        }
    };

    const loadTasks = async (boardId: string) => {
        try {
            setIsLoading(true);
            const data = await cardsService.getAllByBoard(boardId);
            setTasks(data);
        } catch (error) {
            toast.error('Error al cargar las tareas');
        } finally {
            setIsLoading(false);
        }
    };

    const getPriorityColor = (labels: string[]) => {
        if (labels.includes('high')) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
        if (labels.includes('medium')) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
        if (labels.includes('low')) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done':
                return 'bg-emerald-500';
            case 'in-progress':
                return 'bg-amber-400';
            case 'review':
                return 'bg-purple-500';
            default:
                return 'bg-slate-300 dark:bg-slate-600';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'done':
                return 'Done';
            case 'in-progress':
                return 'In Progress';
            case 'review':
                return 'Review';
            default:
                return 'Todo';
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
        const matchesPriority = filterPriority === 'all' || (task.labels && task.labels.includes(filterPriority));
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;

            const updatedTask = await cardsService.update(taskId, { status: newStatus });
            setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
            toast.success('Estado actualizado');
        } catch (error) {
            toast.error('Error al actualizar el estado');
        }
    };

    if (isLoading && boards.length === 0) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                        Tasks
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage and track all your tasks across projects.
                    </p>
                </div>
                <Link
                    to={selectedBoard ? `/projects/${selectedBoard}` : '#'}
                    className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm inline-flex items-center gap-2 transition-all shadow-sm"
                >
                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    View Kanban Board
                </Link>
            </div>

            {/* Project Selector */}
            <div className="flex flex-wrap gap-3">
                <select
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                    {boards.map(board => (
                        <option key={board.id} value={board.id}>{board.name}</option>
                    ))}
                </select>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[300px]">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Search tasks..."
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                    <option value="all">All Status</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                </select>
                <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>

            {/* Tasks Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="py-4 px-6 border-b border-slate-200 dark:border-slate-800">Task</th>
                                <th className="py-4 px-6 border-b border-slate-200 dark:border-slate-800">Status</th>
                                <th className="py-4 px-6 border-b border-slate-200 dark:border-slate-800">Priority</th>
                                <th className="py-4 px-6 border-b border-slate-200 dark:border-slate-800">Due Date</th>
                                <th className="py-4 px-6 border-b border-slate-200 dark:border-slate-800">Progress</th>
                                <th className="py-4 px-6 border-b border-slate-200 dark:border-slate-800 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-500">
                                        No tasks found
                                    </td>
                                </tr>
                            ) : (
                                filteredTasks.map((task) => {
                                    const priorityColor = getPriorityColor(task.labels || []);
                                    const statusColor = getStatusColor(task.status);
                                    const statusText = getStatusText(task.status);

                                    return (
                                        <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                        {task.title}
                                                    </p>
                                                    {task.description && (
                                                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <select
                                                    value={task.status}
                                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                    className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer"
                                                >
                                                    <option value="todo">To Do</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="review">Review</option>
                                                    <option value="done">Done</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${priorityColor}`}>
                                                    {task.labels?.[0] || 'medium'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary rounded-full"
                                                            style={{ width: `${task.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-500">{task.progress}%</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <Link
                                                    to={`/projects/${selectedBoard}`}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-primary"
                                                >
                                                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                        Showing {filteredTasks.length} of {tasks.length} tasks
                    </span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs font-medium text-slate-400 cursor-not-allowed">
                            Previous
                        </button>
                        <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};