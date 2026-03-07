// backend-taskmaster/src/cards/schemas/card.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CardDocument = Card & Document;

@Schema({ timestamps: true }) // Esto ya habilita createdAt y updatedAt
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
    order: number;

    @Prop({ type: [String], default: [] })
    labels: string[];

    @Prop({ default: null })
    dueDate?: Date;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    watchers: Types.ObjectId[];

    @Prop({ default: 'todo' })
    status: string;

    @Prop({ default: 0 })
    progress: number;

    @Prop({ default: null })
    coverImage?: string;

    // Estos campos son agregados automáticamente por { timestamps: true }
    // Pero los declaramos explícitamente para TypeScript
    createdAt?: Date;
    updatedAt?: Date;
}

export const CardSchema = SchemaFactory.createForClass(Card);