// src/boards/boards.controller.ts
import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BoardsService } from './boards.service';
import { CreateBoardDto, UpdateBoardDto, AddMemberDto } from './dto/board.dto';

@Controller('boards')
@UseGuards(AuthGuard('jwt')) // Todas las rutas requieren autenticación
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) { }

    @Post()
    create(@Request() req, @Body() createBoardDto: CreateBoardDto) {
        return this.boardsService.create(req.user.userId, createBoardDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.boardsService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.boardsService.findOne(id, req.user.userId);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
        return this.boardsService.update(id, req.user.userId, updateBoardDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.boardsService.remove(id, req.user.userId);
    }

    @Post(':id/members')
    addMember(@Request() req, @Param('id') id: string, @Body() addMemberDto: AddMemberDto) {
        return this.boardsService.addMember(id, req.user.userId, addMemberDto);
    }

    @Delete(':id/members/:memberId')
    removeMember(@Request() req, @Param('id') id: string, @Param('memberId') memberId: string) {
        return this.boardsService.removeMember(id, req.user.userId, memberId);
    }
}