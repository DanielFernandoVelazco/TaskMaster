// src/cards/cards.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Card, CardDocument } from './schemas/card.schema';
import { CreateCardDto, UpdateCardDto, MoveCardDto, AddWatcherDto } from './dto/card.dto';
import { ColumnsService } from '../columns/columns.service';

@Injectable()
export class CardsService {
    constructor(
        @InjectModel(Card.name) private cardModel: Model<CardDocument>,
        private columnsService: ColumnsService,
    ) { }

    async create(userId: string, createCardDto: CreateCardDto): Promise<CardDocument> {
        // Verificar que el usuario tiene acceso a la columna (y por ende al board)
        await this.columnsService.findOne(createCardDto.columnId, userId);

        // Obtener el orden máximo actual para la nueva tarjeta
        const maxOrderCard = await this.cardModel
            .findOne({ columnId: new Types.ObjectId(createCardDto.columnId) })
            .sort({ order: -1 })
            .exec();

        const newOrder = maxOrderCard ? maxOrderCard.order + 1 : 0;

        const newCard = new this.cardModel({
            ...createCardDto,
            columnId: new Types.ObjectId(createCardDto.columnId),
            assigneeId: createCardDto.assigneeId ? new Types.ObjectId(createCardDto.assigneeId) : null,
            order: createCardDto.order ?? newOrder,
            watchers: [], // Inicialmente sin watchers
        });

        return newCard.save();
    }

    async findAllByColumn(columnId: string, userId: string): Promise<CardDocument[]> {
        // Verificar acceso a la columna
        await this.columnsService.findOne(columnId, userId);

        return this.cardModel
            .find({ columnId: new Types.ObjectId(columnId) })
            .sort({ order: 1 })
            .populate('assigneeId', 'name email')
            .populate('watchers', 'name email')
            .exec();
    }

    async findAllByBoard(boardId: string, userId: string): Promise<CardDocument[]> {
        // Primero obtenemos todas las columnas del board
        const columns = await this.columnsService.findAllByBoard(boardId, userId);
        const columnIds = columns.map(col => col._id);

        return this.cardModel
            .find({ columnId: { $in: columnIds } })
            .sort({ order: 1 })
            .populate('assigneeId', 'name email')
            .populate('watchers', 'name email')
            .exec();
    }

    async findOne(id: string, userId: string): Promise<CardDocument> {
        const card = await this.cardModel
            .findById(id)
            .populate('assigneeId', 'name email')
            .populate('watchers', 'name email')
            .exec();

        if (!card) {
            throw new NotFoundException('Tarjeta no encontrada');
        }

        // Verificar acceso a la columna (y por ende al board)
        await this.columnsService.findOne(card.columnId.toString(), userId);

        return card;
    }

    async update(id: string, userId: string, updateCardDto: UpdateCardDto): Promise<CardDocument> {
        await this.findOne(id, userId);

        const updateData: any = { ...updateCardDto };
        if (updateCardDto.assigneeId) {
            updateData.assigneeId = new Types.ObjectId(updateCardDto.assigneeId);
        }

        return this.cardModel
            .findByIdAndUpdate(id, { $set: updateData }, { new: true })
            .populate('assigneeId', 'name email')
            .populate('watchers', 'name email')
            .exec();
    }

    async remove(id: string, userId: string): Promise<void> {
        await this.findOne(id, userId);
        await this.cardModel.findByIdAndDelete(id).exec();
    }

    async moveCard(id: string, userId: string, moveCardDto: MoveCardDto): Promise<CardDocument> {
        const card = await this.findOne(id, userId);
        const sourceColumnId = card.columnId.toString();
        const targetColumnId = moveCardDto.targetColumnId;
        const newOrder = moveCardDto.newOrder;

        // Verificar acceso a la columna destino
        await this.columnsService.findOne(targetColumnId, userId);

        // Si se mueve a una columna diferente
        if (sourceColumnId !== targetColumnId) {
            // 1. Cerrar el hueco en la columna origen
            await this.cardModel.updateMany(
                {
                    columnId: new Types.ObjectId(sourceColumnId),
                    order: { $gt: card.order }
                },
                { $inc: { order: -1 } }
            );

            // 2. Hacer espacio en la columna destino
            await this.cardModel.updateMany(
                {
                    columnId: new Types.ObjectId(targetColumnId),
                    order: { $gte: newOrder }
                },
                { $inc: { order: 1 } }
            );

            // 3. Actualizar la tarjeta
            card.columnId = new Types.ObjectId(targetColumnId);
            card.order = newOrder;
        } else {
            // Mover dentro de la misma columna
            if (card.order === newOrder) {
                return card;
            }

            if (newOrder > card.order) {
                // Mover hacia abajo
                await this.cardModel.updateMany(
                    {
                        columnId: card.columnId,
                        order: { $gt: card.order, $lte: newOrder }
                    },
                    { $inc: { order: -1 } }
                );
            } else {
                // Mover hacia arriba
                await this.cardModel.updateMany(
                    {
                        columnId: card.columnId,
                        order: { $gte: newOrder, $lt: card.order }
                    },
                    { $inc: { order: 1 } }
                );
            }

            card.order = newOrder;
        }

        return card.save();
    }

    async addWatcher(id: string, userId: string, watcherId: string): Promise<CardDocument> {
        await this.findOne(id, userId);

        return this.cardModel
            .findByIdAndUpdate(
                id,
                { $addToSet: { watchers: new Types.ObjectId(watcherId) } },
                { new: true }
            )
            .populate('assigneeId', 'name email')
            .populate('watchers', 'name email')
            .exec();
    }

    async removeWatcher(id: string, userId: string, watcherId: string): Promise<CardDocument> {
        await this.findOne(id, userId);

        return this.cardModel
            .findByIdAndUpdate(
                id,
                { $pull: { watchers: new Types.ObjectId(watcherId) } },
                { new: true }
            )
            .populate('assigneeId', 'name email')
            .populate('watchers', 'name email')
            .exec();
    }

    async assignCard(id: string, userId: string, assigneeId: string): Promise<CardDocument> {
        await this.findOne(id, userId);

        return this.cardModel
            .findByIdAndUpdate(
                id,
                { assigneeId: new Types.ObjectId(assigneeId) },
                { new: true }
            )
            .populate('assigneeId', 'name email')
            .populate('watchers', 'name email')
            .exec();
    }

    async updateProgress(id: string, userId: string, progress: number): Promise<CardDocument> {
        await this.findOne(id, userId);

        let status = 'todo';
        if (progress >= 100) {
            status = 'done';
        } else if (progress >= 50) {
            status = 'review';
        } else if (progress > 0) {
            status = 'in-progress';
        }

        return this.cardModel
            .findByIdAndUpdate(
                id,
                {
                    $set: {
                        progress,
                        status
                    }
                },
                { new: true }
            )
            .populate('assigneeId', 'name email')
            .populate('watchers', 'name email')
            .exec();
    }
}