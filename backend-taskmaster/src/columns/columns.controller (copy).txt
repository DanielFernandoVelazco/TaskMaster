// src/columns/columns.controller.ts
import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ColumnsService } from './columns.service';
import { CreateColumnDto, UpdateColumnDto, ReorderColumnsDto } from './dto/column.dto';

@Controller('columns')
@UseGuards(AuthGuard('jwt'))
export class ColumnsController {
    constructor(private readonly columnsService: ColumnsService) { }

    @Post()
    create(@Request() req, @Body() createColumnDto: CreateColumnDto) {
        return this.columnsService.create(req.user.userId, createColumnDto);
    }

    @Get('board/:boardId')
    findAllByBoard(@Request() req, @Param('boardId') boardId: string) {
        return this.columnsService.findAllByBoard(boardId, req.user.userId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.columnsService.findOne(id, req.user.userId);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
        return this.columnsService.update(id, req.user.userId, updateColumnDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.columnsService.remove(id, req.user.userId);
    }

    @Patch(':id/reorder')
    reorder(@Request() req, @Param('id') id: string, @Body() reorderDto: ReorderColumnsDto) {
        return this.columnsService.reorderColumn(id, req.user.userId, reorderDto.newOrder);
    }
}