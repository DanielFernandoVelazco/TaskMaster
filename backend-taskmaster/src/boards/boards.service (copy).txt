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
            members: [new Types.ObjectId(ownerId)],
        });
        return newBoard.save();
    }

    async findAll(userId: string): Promise<BoardDocument[]> {
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

        const hasAccess = board.ownerId._id.toString() === userId ||
            board.members.some(m => m._id.toString() === userId);

        if (!hasAccess) {
            throw new ForbiddenException('No tienes acceso a este tablero');
        }

        return board;
    }

    async update(id: string, userId: string, updateBoardDto: UpdateBoardDto): Promise<BoardDocument> {
        const board = await this.findOne(id, userId);

        if (board.ownerId._id.toString() !== userId) {
            throw new ForbiddenException('Solo el propietario puede actualizar el tablero');
        }

        const updatedBoard = await this.boardModel.findByIdAndUpdate(
            id,
            { $set: updateBoardDto },
            { new: true }
        ).exec();

        if (!updatedBoard) {
            throw new NotFoundException('Tablero no encontrado después de actualizar');
        }

        return updatedBoard;
    }

    async remove(id: string, userId: string): Promise<void> {
        const board = await this.findOne(id, userId);

        if (board.ownerId._id.toString() !== userId) {
            throw new ForbiddenException('Solo el propietario puede eliminar el tablero');
        }

        const result = await this.boardModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException('Tablero no encontrado para eliminar');
        }
    }

    async addMember(id: string, userId: string, addMemberDto: AddMemberDto): Promise<BoardDocument> {
        const board = await this.findOne(id, userId);

        if (board.ownerId._id.toString() !== userId) {
            throw new ForbiddenException('Solo el propietario puede agregar miembros');
        }

        const updatedBoard = await this.boardModel.findByIdAndUpdate(
            id,
            { $addToSet: { members: new Types.ObjectId(addMemberDto.userId) } },
            { new: true }
        ).populate('members', 'name email').exec();

        if (!updatedBoard) {
            throw new NotFoundException('Tablero no encontrado después de agregar miembro');
        }

        return updatedBoard;
    }

    async removeMember(id: string, userId: string, memberId: string): Promise<BoardDocument> {
        const board = await this.findOne(id, userId);

        if (board.ownerId._id.toString() !== userId && userId !== memberId) {
            throw new ForbiddenException('No tienes permiso para remover este miembro');
        }

        if (board.ownerId._id.toString() === memberId) {
            throw new ForbiddenException('No puedes remover al propietario del tablero');
        }

        const updatedBoard = await this.boardModel.findByIdAndUpdate(
            id,
            { $pull: { members: new Types.ObjectId(memberId) } },
            { new: true }
        ).populate('members', 'name email').exec();

        if (!updatedBoard) {
            throw new NotFoundException('Tablero no encontrado después de remover miembro');
        }

        return updatedBoard;
    }
}