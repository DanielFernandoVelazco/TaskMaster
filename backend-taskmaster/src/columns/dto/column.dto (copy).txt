// src/columns/dto/column.dto.ts
import { IsString, IsNumber, IsOptional, Min, Max, MinLength, MaxLength, IsHexColor } from 'class-validator';

export class CreateColumnDto {
    @IsString()
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    @MaxLength(30, { message: 'El nombre no puede tener más de 30 caracteres' })
    name: string;

    @IsString()
    boardId: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    order?: number;

    @IsHexColor()
    @IsOptional()
    color?: string;
}

export class UpdateColumnDto {
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    @IsOptional()
    name?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    order?: number;

    @IsHexColor()
    @IsOptional()
    color?: string;
}

export class ReorderColumnsDto {
    @IsNumber()
    @Min(0)
    newOrder: number;
}