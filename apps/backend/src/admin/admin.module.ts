import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  controllers: [AdminController],
  providers: [AdminService, RolesGuard]
})
export class AdminModule {}
