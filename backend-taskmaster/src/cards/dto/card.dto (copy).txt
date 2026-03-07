// src/cards/dto/card.dto.ts
import { IsString, IsOptional, IsNumber, IsDateString, IsArray, Min, Max, MinLength, MaxLength, IsMongoId } from 'class-validator';

export class CreateCardDto {
    @IsString()
    @MinLength(2, { message: 'El título debe tener al menos 2 caracteres' })
    @MaxLength(100, { message: 'El título no puede tener más de 100 caracteres' })
    title: string;

    @IsString()
    @IsOptional()
    @MaxLength(500, { message: 'La descripción no puede tener más de 500 caracteres' })
    description?: string;

    @IsString()
    columnId: string;

    @IsOptional()
    @IsMongoId()
    assigneeId?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    order?: number;

    @IsArray()
    @IsOptional()
    labels?: string[];

    @IsDateString()
    @IsOptional()
    dueDate?: Date;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(100)
    progress?: number;

    @IsString()
    @IsOptional()
    coverImage?: string;
}

export class UpdateCardDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @IsOptional()
    title?: string;

    @IsString()
    @MaxLength(500)
    @IsOptional()
    description?: string;

    @IsOptional()
    @IsMongoId()
    assigneeId?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    order?: number;

    @IsArray()
    @IsOptional()
    labels?: string[];

    @IsDateString()
    @IsOptional()
    dueDate?: Date;

    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    progress?: number;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    coverImage?: string;
}

export class MoveCardDto {
    @IsString()
    targetColumnId: string;

    @IsNumber()
    @Min(0)
    newOrder: number;
}

export class AddWatcherDto {
    @IsMongoId()
    userId: string;
}