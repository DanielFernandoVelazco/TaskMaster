// src/boards/schemas/board.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BoardDocument = Board & Document;

@Schema({ timestamps: true })
export class Board {
    @Prop({ required: true })
    name: string;

    @Prop({ default: '' })
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    ownerId: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    members: Types.ObjectId[];

    @Prop({ default: '#5048e5' }) // Color primary por defecto
    color: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);