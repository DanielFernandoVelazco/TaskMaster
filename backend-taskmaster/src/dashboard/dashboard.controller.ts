// backend-taskmaster/src/dashboard/dashboard.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get()
    async getDashboardData(@Request() req) {
        console.log(`📊 Usuario ${req.user.userId} solicitó datos del dashboard`);
        return this.dashboardService.getDashboardData(req.user.userId);
    }
}