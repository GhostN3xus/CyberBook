import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @Roles('admin')
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.usersService.updateRole(id, dto);
  }
}
