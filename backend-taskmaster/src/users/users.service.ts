// backend-taskmaster/src/users/users.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async create(email: string, password: string, name: string): Promise<UserDocument> {
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new this.userModel({
            email,
            password: hashedPassword,
            name,
        });

        return newUser.save();
    }

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find().select('-password').exec();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<UserDocument> {
        const user = await this.userModel.findById(id).select('-password').exec();
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return user;
    }

    async update(id: string, updateData: Partial<User>): Promise<UserDocument> {
        const user = await this.userModel
            .findByIdAndUpdate(id, { $set: updateData }, { new: true })
            .select('-password')
            .exec();

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return user;
    }

    async remove(id: string): Promise<void> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException('Usuario no encontrado');
        }
    }

    async updateRole(id: string, role: string): Promise<UserDocument> {
        const user = await this.userModel
            .findByIdAndUpdate(id, { $set: { role } }, { new: true })
            .select('-password')
            .exec();

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return user;
    }

    async validateUser(email: string, password: string): Promise<UserDocument | null> {
        const user = await this.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
}