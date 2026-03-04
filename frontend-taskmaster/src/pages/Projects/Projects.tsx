// src/pages/Projects/Projects.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { boardsService } from '../../services/boards.service';
import type { Board } from '../../types';
import toast from 'react-hot-toast';

export const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Board[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '', color: '#5048e5' });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setIsLoading(true);
            const data = await boardsService.getAll();
            setProjects(data);
        } catch (error) {
            toast.error('Error al cargar los proyectos');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateProject = async () => {
        if (!newProject.name.trim()) {
            toast.error('El nombre del proyecto es requerido');
            return;
        }

        try {
            const created = await boardsService.create(newProject);
            setProjects([...projects, created]);
            setShowCreateModal(false);
            setNewProject({ name: '', description: '', color: '#5048e5' });
            toast.success('Proyecto creado exitosamente');
        } catch (error) {
            toast.error('Error al crear el proyecto');
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

        try {
            await boardsService.delete(id);
            setProjects(projects.filter(p => p.id !== id));
            toast.success('Proyecto eliminado');
        } catch (error) {
            toast.error('Error al eliminar el proyecto');
        }
    };

    const getProjectProgress = (project: Board) => {
        return Math.floor(Math.random() * 100);
    };

    const getProjectStatus = (progress: number) => {
        if (progress >= 75) return {
            label: 'On Track',
            color: 'bg-emerald-500',
            textColor: 'text-emerald-700 dark:text-emerald-400',
            bgColor: 'bg-emerald-100 dark:bg-emerald-900/30'
        };
        if (progress >= 40) return {
            label: 'At Risk',
            color: 'bg-amber-500',
            textColor: 'text-amber-700 dark:text-amber-400',
            bgColor: 'bg-amber-100 dark:bg-amber-900/30'
        };
        return {
            label: 'Overdue',
            color: 'bg-rose-500',
            textColor: 'text-rose-700 dark:text-rose-400',
            bgColor: 'bg-rose-100 dark:bg-rose-900/30'
        };
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                        Projects
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage your team's projects and track their progress.
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm inline-flex items-center gap-2 transition-all shadow-sm"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    New Project
                </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                    const progress = getProjectProgress(project);
                    const status = getProjectStatus(progress);

                    return (
                        <div
                            key={project.id}
                            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="p-6">
                                {/* Header with color */}
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                                        style={{ backgroundColor: project.color || '#5048e5' }}
                                    >
                                        <span className="material-symbols-outlined text-xl">folder</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Link
                                            to={`/projects/${project.id}`}
                                            className="p-1.5 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">visibility</span>
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteProject(project.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                    {project.name}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                                    {project.description || 'No description provided'}
                                </p>

                                {/* Progress Bar */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-slate-500">Progress</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%`, backgroundColor: project.color || '#5048e5' }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Status and Members */}
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${status.bgColor} ${status.textColor}`}>
                                        {status.label}
                                    </span>
                                    <div className="flex -space-x-2">
                                        {/* Usamos React.Fragment para agrupar elementos con keys */}
                                        <React.Fragment key={`${project.id}-members`}>
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={`${project.id}-member-${i}`}
                                                    className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-primary/10 flex items-center justify-center text-primary font-bold text-xs"
                                                >
                                                    {String.fromCharCode(64 + i)}
                                                </div>
                                            ))}
                                            <div
                                                key={`${project.id}-member-more`}
                                                className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs"
                                            >
                                                +2
                                            </div>
                                        </React.Fragment>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Create Project Card - Ahora como div con key */}
                <div
                    key="create-project-card"
                    onClick={() => setShowCreateModal(true)}
                    className="bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary hover:bg-primary/5 transition-all group p-6 flex flex-col items-center justify-center gap-3 min-h-[280px] cursor-pointer"
                >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl">add</span>
                    </div>
                    <p className="text-sm font-bold text-slate-400 group-hover:text-primary transition-colors">
                        Create New Project
                    </p>
                </div>
            </div>

            {/* Create Project Modal */}
            {showCreateModal && (
                <div key="create-project-modal" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-xl">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            Create New Project
                        </h3>

                        <div className="space-y-4">
                            <div key="project-name-field">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Project Name *
                                </label>
                                <input
                                    type="text"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="e.g., Marketing Redesign"
                                    autoFocus
                                />
                            </div>

                            <div key="project-description-field">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Brief description of the project..."
                                    rows={3}
                                />
                            </div>

                            <div key="project-color-field">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Color Theme
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={newProject.color}
                                        onChange={(e) => setNewProject({ ...newProject, color: e.target.value })}
                                        className="w-10 h-10 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                                    />
                                    <span className="text-sm text-slate-500">Choose a color for your project</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                key="cancel-button"
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                key="create-button"
                                onClick={handleCreateProject}
                                className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Create Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};