// src/columns/schemas/column.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ColumnDocument = Column & Document;

@Schema({ timestamps: true })
export class Column {
    @Prop({ required: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'Board', required: true })
    boardId: Types.ObjectId;

    @Prop({ default: 0 })
    order: number; // Para ordenar las columnas

    @Prop({ default: null })
    color?: string;
}

export const ColumnSchema = SchemaFactory.createForClass(Column);