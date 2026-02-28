// src/boards/dto/board.dto.ts
import { IsString, IsOptional, IsHexColor, MinLength, MaxLength } from 'class-validator';

export class CreateBoardDto {
    @IsString()
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(200, { message: 'La descripción no puede tener más de 200 caracteres' })
    description?: string;

    @IsHexColor()
    @IsOptional()
    color?: string;
}

export class UpdateBoardDto {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @IsOptional()
    name?: string;

    @IsString()
    @MaxLength(200)
    @IsOptional()
    description?: string;

    @IsHexColor()
    @IsOptional()
    color?: string;
}

export class AddMemberDto {
    @IsString()
    userId: string;
}