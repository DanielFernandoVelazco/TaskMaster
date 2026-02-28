// src/boards/boards.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Board, BoardDocument } from './schemas/board.schema';
import { CreateBoardDto, UpdateBoardDto, AddMemberDto } from './dto/board.dto';

@Injectable()
export class BoardsService {
    constructor(
        @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    ) { }

    async create(ownerId: string, createBoardDto: CreateBoardDto): Promise<BoardDocument> {
        const newBoard = new this.boardModel({
            ...createBoardDto,
            ownerId: new Types.ObjectId(ownerId),
            members: [new Types.ObjectId(ownerId)], // El owner es miembro por defecto
        });
        return newBoard.save();
    }

    async findAll(userId: string): Promise<BoardDocument[]> {
        // Retorna todos los boards donde el usuario es owner o miembro
        return this.boardModel.find({
            $or: [
                { ownerId: new Types.ObjectId(userId) },
                { members: new Types.ObjectId(userId) }
            ]
        }).populate('ownerId', 'name email').exec();
    }

    async findOne(id: string, userId: string): Promise<BoardDocument> {
        const board = await this.boardModel.findById(id)
            .populate('ownerId', 'name email')
            .populate('members', 'name email')
            .exec();

        if (!board) {
            throw new NotFoundException('Tablero no encontrado');
        }

        // Verificar que el usuario tiene acceso al board
        const hasAccess = board.ownerId._id.toString() === userId ||
            board.members.some(m => m._id.toString() === userId);

        if (!hasAccess) {
            throw new ForbiddenException('No tienes acceso a este tablero');
        }

        return board;
    }

    async update(id: string, userId: string, updateBoardDto: UpdateBoardDto): Promise<BoardDocument> {
        const board = await this.findOne(id, userId);

        // Solo el owner puede actualizar el board
        if (board.ownerId._id.toString() !== userId) {
            throw new ForbiddenException('Solo el propietario puede actualizar el tablero');
        }

        return this.boardModel.findByIdAndUpdate(
            id,
            { $set: updateBoardDto },
            { new: true }
        ).exec();
    }

    async remove(id: string, userId: string): Promise<void> {
        const board = await this.findOne(id, userId);

        // Solo el owner puede eliminar el board
        if (board.ownerId._id.toString() !== userId) {
            throw new ForbiddenException('Solo el propietario puede eliminar el tablero');
        }

        await this.boardModel.findByIdAndDelete(id).exec();
    }

    async addMember(id: string, userId: string, addMemberDto: AddMemberDto): Promise<BoardDocument> {
        const board = await this.findOne(id, userId);

        // Solo el owner puede agregar miembros
        if (board.ownerId._id.toString() !== userId) {
            throw new ForbiddenException('Solo el propietario puede agregar miembros');
        }

        return this.boardModel.findByIdAndUpdate(
            id,
            { $addToSet: { members: new Types.ObjectId(addMemberDto.userId) } },
            { new: true }
        ).populate('members', 'name email').exec();
    }

    async removeMember(id: string, userId: string, memberId: string): Promise<BoardDocument> {
        const board = await this.findOne(id, userId);

        // Solo el owner puede remover miembros (o un miembro puede removerse a sí mismo)
        if (board.ownerId._id.toString() !== userId && userId !== memberId) {
            throw new ForbiddenException('No tienes permiso para remover este miembro');
        }

        // No permitir remover al owner
        if (board.ownerId._id.toString() === memberId) {
            throw new ForbiddenException('No puedes remover al propietario del tablero');
        }

        return this.boardModel.findByIdAndUpdate(
            id,
            { $pull: { members: new Types.ObjectId(memberId) } },
            { new: true }
        ).populate('members', 'name email').exec();
    }
}