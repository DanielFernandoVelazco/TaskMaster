// src/auth/dto/auth.dto.ts
export class RegisterDto {
    email: string;
    password: string;
    name: string;
}

export class LoginDto {
    email: string;
    password: string;
}