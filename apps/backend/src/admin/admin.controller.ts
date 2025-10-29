import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.adminService.getDashboard();
  }

  @Get('audit-logs')
  auditLogs() {
    return this.adminService.listAuditLogs();
  }
}
