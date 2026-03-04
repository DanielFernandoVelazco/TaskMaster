// src/pages/Tasks/KanbanBoard.tsx
import React, { useState, useEffect } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { columnsService } from '../../services/columns.service';
import { cardsService } from '../../services/cards.service';
import type { Column as ColumnType, Card as CardType } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

export const KanbanBoard: React.FC = () => {
    const { boardId } = useParams<{ boardId: string }>();
    const [columns, setColumns] = useState<ColumnType[]>([]);
    const [cards, setCards] = useState<CardType[]>([]);
    const [activeCard, setActiveCard] = useState<CardType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateColumn, setShowCreateColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (boardId) {
            loadBoard();
        }
    }, [boardId]);

    const loadBoard = async () => {
        if (!boardId) return;

        try {
            setIsLoading(true);
            const [columnsData, cardsData] = await Promise.all([
                columnsService.getAllByBoard(boardId),
                cardsService.getAllByBoard(boardId),
            ]);
            setColumns(columnsData.sort((a, b) => a.order - b.order));
            setCards(cardsData);
        } catch (error) {
            toast.error('Error al cargar el tablero');
        } finally {
            setIsLoading(false);
        }
    };

    const getColumnCards = (columnId: string) => {
        return cards
            .filter((card) => card.columnId === columnId)
            .sort((a, b) => a.order - b.order);
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const card = cards.find((c) => c.id === active.id);
        if (card) {
            setActiveCard(card);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveCard(null);

        if (!over) return;

        const activeCard = cards.find((c) => c.id === active.id);
        if (!activeCard) return;

        // Si se soltó sobre una columna
        const targetColumn = columns.find((c) => c.id === over.id);
        if (targetColumn) {
            if (activeCard.columnId === targetColumn.id) return;

            const targetColumnCards = getColumnCards(targetColumn.id);
            const newOrder = targetColumnCards.length;

            try {
                // Optimistic update
                const updatedCard = { ...activeCard, columnId: targetColumn.id, order: newOrder };
                setCards(cards.map((c) => (c.id === activeCard.id ? updatedCard : c)));

                await cardsService.move(activeCard.id, targetColumn.id, newOrder);
                toast.success('Tarjeta movida');
            } catch (error) {
                // Revert on error
                setCards(cards);
                toast.error('Error al mover la tarjeta');
            }
            return;
        }

        // Si se soltó sobre otra tarjeta
        const targetCard = cards.find((c) => c.id === over.id);
        if (targetCard) {
            if (activeCard.columnId !== targetCard.columnId) return;

            const columnCards = getColumnCards(activeCard.columnId);
            const oldIndex = columnCards.findIndex((c) => c.id === activeCard.id);
            const newIndex = columnCards.findIndex((c) => c.id === targetCard.id);

            if (oldIndex === newIndex) return;

            const reorderedCards = [...columnCards];
            const [movedCard] = reorderedCards.splice(oldIndex, 1);
            reorderedCards.splice(newIndex, 0, movedCard);

            // Actualizar órdenes
            const updatedCards = reorderedCards.map((card, index) => ({
                ...card,
                order: index,
            }));

            try {
                // Optimistic update
                setCards(cards.map((c) => {
                    const updated = updatedCards.find((uc) => uc.id === c.id);
                    return updated || c;
                }));

                await cardsService.move(activeCard.id, activeCard.columnId, newIndex);
                toast.success('Tarjeta reordenada');
            } catch (error) {
                // Revert on error
                setCards(cards);
                toast.error('Error al reordenar');
            }
        }
    };

    const handleCreateColumn = async () => {
        if (!newColumnName.trim() || !boardId) return;

        try {
            const newColumn = await columnsService.create({
                name: newColumnName,
                boardId,
            });
            setColumns([...columns, newColumn]);
            setNewColumnName('');
            setShowCreateColumn(false);
            toast.success('Columna creada');
        } catch (error) {
            toast.error('Error al crear la columna');
        }
    };

    const handleDeleteColumn = async (columnId: string) => {
        if (!confirm('¿Estás seguro de eliminar esta columna? Se eliminarán todas las tarjetas.')) return;

        try {
            await columnsService.delete(columnId);
            setColumns(columns.filter((c) => c.id !== columnId));
            setCards(cards.filter((c) => c.columnId !== columnId));
            toast.success('Columna eliminada');
        } catch (error) {
            toast.error('Error al eliminar la columna');
        }
    };

    const handleCreateCard = async (columnId: string, title: string) => {
        if (!title.trim() || !boardId) return;

        try {
            const newCard = await cardsService.create({
                title,
                columnId,
            });
            setCards([...cards, newCard]);
            toast.success('Tarjeta creada');
        } catch (error) {
            toast.error('Error al crear la tarjeta');
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        if (!confirm('¿Estás seguro de eliminar esta tarjeta?')) return;

        try {
            await cardsService.delete(cardId);
            setCards(cards.filter((c) => c.id !== cardId));
            toast.success('Tarjeta eliminada');
        } catch (error) {
            toast.error('Error al eliminar la tarjeta');
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <span>Projects</span>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span>Marketing Redesign 2024</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Kanban Board</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        Filters
                    </button>
                    <button
                        onClick={() => setShowCreateColumn(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">add_column_right</span>
                        Add Column
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto board-container px-8 pb-8">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-6 h-full min-w-max">
                        {columns.map((column) => (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                cards={getColumnCards(column.id)}
                                onDeleteColumn={() => handleDeleteColumn(column.id)}
                                onCreateCard={(title) => handleCreateCard(column.id, title)}
                                onDeleteCard={handleDeleteCard}
                            />
                        ))}

                        {/* Add Column Placeholder */}
                        {showCreateColumn ? (
                            <div className="w-80 flex-shrink-0 bg-white dark:bg-slate-900 rounded-xl border-2 border-primary shadow-lg p-4">
                                <input
                                    type="text"
                                    value={newColumnName}
                                    onChange={(e) => setNewColumnName(e.target.value)}
                                    placeholder="Column name..."
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent mb-3"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleCreateColumn();
                                        if (e.key === 'Escape') {
                                            setShowCreateColumn(false);
                                            setNewColumnName('');
                                        }
                                    }}
                                />
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCreateColumn}
                                        className="flex-1 px-3 py-1.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowCreateColumn(false);
                                            setNewColumnName('');
                                        }}
                                        className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <DragOverlay>
                        {activeCard ? <KanbanCard card={activeCard} isOverlay onDelete={function (): void {
                            throw new Error('Function not implemented.');
                        }} /> : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
};