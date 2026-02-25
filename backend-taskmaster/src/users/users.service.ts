// src/users/users.service.ts
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
        // Verificar si el usuario ya existe
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = new this.userModel({
            email,
            password: hashedPassword,
            name,
        });

        return newUser.save();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<UserDocument> {
        const user = await this.userModel.findById(id).exec();
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