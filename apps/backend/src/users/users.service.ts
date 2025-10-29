import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true }
    });
  }

  async updateRole(id: string, dto: UpdateRoleDto) {
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.update({ where: { id }, data: { role: dto.role } });
  }
}
