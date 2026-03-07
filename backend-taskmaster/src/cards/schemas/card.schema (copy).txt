// src/cards/schemas/card.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CardDocument = Card & Document;

@Schema({ timestamps: true })
export class Card {
    @Prop({ required: true })
    title: string;

    @Prop({ default: '' })
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'Column', required: true })
    columnId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    assigneeId?: Types.ObjectId;

    @Prop({ default: 0 })
    order: number; // Para ordenar las tarjetas dentro de la columna

    @Prop({ type: [String], default: [] })
    labels: string[];

    @Prop({ default: null })
    dueDate?: Date;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    watchers: Types.ObjectId[];

    @Prop({ default: 'todo' }) // 'todo', 'in-progress', 'review', 'done'
    status: string;

    @Prop({ default: 0 })
    progress: number; // 0-100

    @Prop({ default: null })
    coverImage?: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);