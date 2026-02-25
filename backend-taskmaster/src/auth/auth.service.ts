// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.validateUser(email, password);
        if (user) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }

    async register(registerDto: RegisterDto) {
        const { email, password, name } = registerDto;
        const user = await this.usersService.create(email, password, name);

        const payload = {
            sub: user._id,
            email: user.email,
            name: user.name
        };

        return {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
            access_token: this.jwtService.sign(payload),
        };
    }

    async login(loginDto: LoginDto) {
        const { email } = loginDto;
        const user = await this.usersService.findByEmail(email);

        const payload = {
            sub: user._id,
            email: user.email,
            name: user.name
        };

        return {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
            access_token: this.jwtService.sign(payload),
        };
    }
}