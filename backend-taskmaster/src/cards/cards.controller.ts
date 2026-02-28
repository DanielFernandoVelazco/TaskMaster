// src/cards/cards.controller.ts
import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CardsService } from './cards.service';
import { CreateCardDto, UpdateCardDto, MoveCardDto, AddWatcherDto } from './dto/card.dto';

@Controller('cards')
@UseGuards(AuthGuard('jwt'))
export class CardsController {
    constructor(private readonly cardsService: CardsService) { }

    @Post()
    create(@Request() req, @Body() createCardDto: CreateCardDto) {
        return this.cardsService.create(req.user.userId, createCardDto);
    }

    @Get('column/:columnId')
    findAllByColumn(@Request() req, @Param('columnId') columnId: string) {
        return this.cardsService.findAllByColumn(columnId, req.user.userId);
    }

    @Get('board/:boardId')
    findAllByBoard(@Request() req, @Param('boardId') boardId: string) {
        return this.cardsService.findAllByBoard(boardId, req.user.userId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.cardsService.findOne(id, req.user.userId);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
        return this.cardsService.update(id, req.user.userId, updateCardDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.cardsService.remove(id, req.user.userId);
    }

    @Post(':id/move')
    move(@Request() req, @Param('id') id: string, @Body() moveCardDto: MoveCardDto) {
        return this.cardsService.moveCard(id, req.user.userId, moveCardDto);
    }

    @Post(':id/watchers')
    addWatcher(@Request() req, @Param('id') id: string, @Body() addWatcherDto: AddWatcherDto) {
        return this.cardsService.addWatcher(id, req.user.userId, addWatcherDto.userId);
    }

    @Delete(':id/watchers/:watcherId')
    removeWatcher(@Request() req, @Param('id') id: string, @Param('watcherId') watcherId: string) {
        return this.cardsService.removeWatcher(id, req.user.userId, watcherId);
    }

    @Post(':id/assign/:assigneeId')
    assign(@Request() req, @Param('id') id: string, @Param('assigneeId') assigneeId: string) {
        return this.cardsService.assignCard(id, req.user.userId, assigneeId);
    }

    @Patch(':id/progress/:progress')
    updateProgress(
        @Request() req,
        @Param('id') id: string,
        @Param('progress') progress: number
    ) {
        return this.cardsService.updateProgress(id, req.user.userId, progress);
    }
}