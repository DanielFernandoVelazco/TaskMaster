// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.validateUser(email, password);
        if (user) {
            // Convertir el documento a objeto plano y quitar la contraseña
            const userObject = user.toObject();
            const { password, ...result } = userObject;
            return result;
        }
        return null;
    }

    async register(registerDto: RegisterDto) {
        const { email, password, name } = registerDto;
        const user = await this.usersService.create(email, password, name);

        const payload = {
            sub: user._id.toString(), // Convertir ObjectId a string
            email: user.email,
            name: user.name
        };

        return {
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
            },
            access_token: this.jwtService.sign(payload),
        };
    }

    async login(loginDto: LoginDto) {
        const { email } = loginDto;
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        const payload = {
            sub: user._id.toString(),
            email: user.email,
            name: user.name
        };

        return {
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
            },
            access_token: this.jwtService.sign(payload),
        };
    }
}