// backend-taskmaster/src/users/users.controller.ts
import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Request, Query, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(@Request() req): Promise<User[]> {
        // Solo admins pueden ver todos los usuarios
        // Por ahora, devolvemos todos excepto el usuario actual
        return this.usersService.findAll();
    }

    @Get('team')
    async getTeamMembers(@Request() req): Promise<User[]> {
        // Obtener miembros del equipo (todos los usuarios por ahora)
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findById(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateData: Partial<User>
    ): Promise<User> {
        return this.usersService.update(id, updateData);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.usersService.remove(id);
    }

    @Patch(':id/role')
    async updateRole(
        @Param('id') id: string,
        @Body('role') role: string
    ): Promise<User> {
        return this.usersService.updateRole(id, role);
    }

    @Post('invite')
    async inviteMember(
        @Body('email') email: string,
        @Body('role') role: string
    ): Promise<{ message: string }> {
        // Aquí implementarías lógica de invitación por email
        // Por ahora, solo simulamos
        return { message: `Invitación enviada a ${email} con rol ${role}` };
    }
}