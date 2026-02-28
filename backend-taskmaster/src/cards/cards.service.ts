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

    // src/cards/cards.service.ts (fragmentos corregidos)
    // ... (todo el código anterior igual hasta el método update)

    async update(id: string, userId: string, updateCardDto: UpdateCardDto): Promise<CardDocument> {
        await this.findOne(id, userId);

        const updateData: any = { ...updateCardDto };
        if (updateCardDto.assigneeId) {
            updateData.assigneeId = new Types.ObjectId(updateCardDto.assigneeId);
        }

        const updatedCard = await this.cardModel
            .findByIdAndUpdate(id, { $set: updateData }, { new: true })
            .populate('assigneeId', 'name email')
            .populate('watchers', 'name email')
            .exec();

        if (!updatedCard) {
            throw new NotFoundException('Tarjeta no encontrada después de actualizar');
        }

        return updatedCard;
    }

    async addWatcher(id: string, userId: string, watcherId: string): Promise<CardDocument> {
        await this.findOne(id, userId);

        const updatedCard = await this.cardModel
            .findByIdAndUpdate(
                id,
                { $addToSet: { watchers: new Types.ObjectId(watcherId) } },
                { new: true }
            )
            .populate('assigneeId', 'name email')
            .populate('watchers', 'name email')
            .exec();

        if (!updatedCard) {
            throw new NotFoundException('Tarjeta no encontrada después de agregar watcher');
        }

        return updatedCard;
    }

    async removeWatcher(id: string, userId: string, watcherId: string): Promise<CardDocument> {
        await this.findOne(id, userId);

        const updatedCard = await this.cardModel
            .findByIdAndUpdate(
                id,
                { $pull: { watchers: new Types.ObjectId(watcherId) } },
                { new: true }
            )
            .populate('assigneeId', 'name email')
            .populate('watchers', 'name email')
            .exec();

        if (!updatedCard) {
            throw new NotFoundException('Tarjeta no encontrada después de remover watcher');
        }

        return updatedCard;
    }

    async assignCard(id: string, userId: string, assigneeId: string): Promise<CardDocument> {
        await this.findOne(id, userId);

        const updatedCard = await this.cardModel
            .findByIdAndUpdate(
                id,
                { assigneeId: new Types.ObjectId(assigneeId) },
                { new: true }
            )
            .populate('assigneeId', 'name email')
            .populate('watchers', 'name email')
            .exec();

        if (!updatedCard) {
            throw new NotFoundException('Tarjeta no encontrada después de asignar');
        }

        return updatedCard;
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

        const updatedCard = await this.cardModel
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

        if (!updatedCard) {
            throw new NotFoundException('Tarjeta no encontrada después de actualizar progreso');
        }

        return updatedCard;
    }
}