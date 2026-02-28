// src/columns/columns.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Column, ColumnDocument } from './schemas/column.schema';
import { CreateColumnDto, UpdateColumnDto } from './dto/column.dto';
import { BoardsService } from '../boards/boards.service';

@Injectable()
export class ColumnsService {
    constructor(
        @InjectModel(Column.name) private columnModel: Model<ColumnDocument>,
        private boardsService: BoardsService,
    ) { }

    async create(userId: string, createColumnDto: CreateColumnDto): Promise<ColumnDocument> {
        // Verificar que el usuario tiene acceso al board
        await this.boardsService.findOne(createColumnDto.boardId, userId);

        // Obtener el orden máximo actual para la nueva columna
        const maxOrderColumn = await this.columnModel
            .findOne({ boardId: new Types.ObjectId(createColumnDto.boardId) })
            .sort({ order: -1 })
            .exec();

        const newOrder = maxOrderColumn ? maxOrderColumn.order + 1 : 0;

        const newColumn = new this.columnModel({
            ...createColumnDto,
            boardId: new Types.ObjectId(createColumnDto.boardId),
            order: createColumnDto.order ?? newOrder,
        });

        return newColumn.save();
    }

    async findAllByBoard(boardId: string, userId: string): Promise<ColumnDocument[]> {
        // Verificar acceso al board
        await this.boardsService.findOne(boardId, userId);

        return this.columnModel
            .find({ boardId: new Types.ObjectId(boardId) })
            .sort({ order: 1 })
            .exec();
    }

    async findOne(id: string, userId: string): Promise<ColumnDocument> {
        const column = await this.columnModel.findById(id).exec();

        if (!column) {
            throw new NotFoundException('Columna no encontrada');
        }

        // Verificar acceso al board asociado
        await this.boardsService.findOne(column.boardId.toString(), userId);

        return column;
    }

    async update(id: string, userId: string, updateColumnDto: UpdateColumnDto): Promise<ColumnDocument> {
        await this.findOne(id, userId);

        return this.columnModel
            .findByIdAndUpdate(id, { $set: updateColumnDto }, { new: true })
            .exec();
    }

    async remove(id: string, userId: string): Promise<void> {
        await this.findOne(id, userId);

        await this.columnModel.findByIdAndDelete(id).exec();
    }

    async reorderColumn(id: string, userId: string, newOrder: number): Promise<ColumnDocument> {
        const column = await this.findOne(id, userId);
        const oldOrder = column.order;

        if (oldOrder === newOrder) {
            return column;
        }

        // Actualizar órdenes de otras columnas
        if (newOrder > oldOrder) {
            // Mover hacia abajo: las columnas entre oldOrder+1 y newOrder suben
            await this.columnModel.updateMany(
                {
                    boardId: column.boardId,
                    order: { $gt: oldOrder, $lte: newOrder }
                },
                { $inc: { order: -1 } }
            );
        } else {
            // Mover hacia arriba: las columnas entre newOrder y oldOrder-1 bajan
            await this.columnModel.updateMany(
                {
                    boardId: column.boardId,
                    order: { $gte: newOrder, $lt: oldOrder }
                },
                { $inc: { order: 1 } }
            );
        }

        // Actualizar el orden de la columna movida
        column.order = newOrder;
        return column.save();
    }
}