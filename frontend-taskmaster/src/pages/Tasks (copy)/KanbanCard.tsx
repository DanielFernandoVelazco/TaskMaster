// src/pages/Tasks/KanbanCard.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card } from '../../types';

interface KanbanCardProps {
    card: Card;
    onDelete: () => void;
    isOverlay?: boolean;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ card, onDelete, isOverlay = false }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: card.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getPriorityColor = (labels: string[]) => {
        if (labels.includes('high')) return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
        if (labels.includes('medium')) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
        if (labels.includes('low')) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    };

    const priority = card.labels?.[0] || 'medium';
    const priorityColor = getPriorityColor([priority]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group ${isOverlay ? 'shadow-xl rotate-3 scale-105' : ''
                }`}
        >
            <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${priorityColor}`}>
                    {priority} Priority
                </span>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                >
                    <span className="material-symbols-outlined text-lg">delete</span>
                </button>
            </div>

            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
                {card.title}
            </h4>

            {card.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                    {card.description}
                </p>
            )}

            {/* Progress Bar */}
            {card.progress > 0 && (
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            Progress
                        </span>
                        <span className="text-[10px] font-bold text-primary">{card.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${card.progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Footer with Assignee and Meta */}
            <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                    {card.assigneeId ? (
                        <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {typeof card.assigneeId === 'string' ? 'A' : card.assigneeId.name?.charAt(0) || 'U'}
                        </div>
                    ) : (
                        <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-sm">person</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                    {card.dueDate && (
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span className="text-[10px] font-bold">
                                {new Date(card.dueDate).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                    {card.watchers && card.watchers.length > 0 && (
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            <span className="text-[10px] font-bold">{card.watchers.length}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};