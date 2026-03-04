// src/pages/Tasks/KanbanColumn.tsx
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column, Card } from '../../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
    column: Column;
    cards: Card[];
    onDeleteColumn: () => void;
    onCreateCard: (title: string) => void;
    onDeleteCard: (cardId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
    column,
    cards,
    onDeleteColumn,
    onCreateCard,
    onDeleteCard,
}) => {
    const [showCreateCard, setShowCreateCard] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');

    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    const handleCreateCard = () => {
        if (newCardTitle.trim()) {
            onCreateCard(newCardTitle);
            setNewCardTitle('');
            setShowCreateCard(false);
        }
    };

    return (
        <div
            ref={setNodeRef}
            className="w-80 flex-shrink-0 flex flex-col bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4"
        >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: column.color || '#5048e5' }}
                    ></div>
                    <h3 className="font-bold text-slate-700 dark:text-slate-300">{column.name}</h3>
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full font-bold">
                        {cards.length}
                    </span>
                </div>
                <button
                    onClick={onDeleteColumn}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">delete</span>
                </button>
            </div>

            {/* Cards Container */}
            <div className="flex-1 min-h-[200px]">
                <SortableContext
                    items={cards.map((card) => card.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {cards.map((card) => (
                            <KanbanCard
                                key={card.id}
                                card={card}
                                onDelete={() => onDeleteCard(card.id)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </div>

            {/* Create Card Input */}
            {showCreateCard ? (
                <div className="mt-4">
                    <input
                        type="text"
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        placeholder="Card title..."
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateCard();
                            if (e.key === 'Escape') {
                                setShowCreateCard(false);
                                setNewCardTitle('');
                            }
                        }}
                    />
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCreateCard}
                            className="flex-1 px-3 py-1.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Add
                        </button>
                        <button
                            onClick={() => {
                                setShowCreateCard(false);
                                setNewCardTitle('');
                            }}
                            className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setShowCreateCard(true)}
                    className="w-full mt-4 py-2 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all font-medium flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add Card
                </button>
            )}
        </div>
    );
};