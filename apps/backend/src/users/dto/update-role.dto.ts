import { IsEnum } from 'class-validator';

export class UpdateRoleDto {
  @IsEnum(['admin', 'editor', 'viewer'], { message: 'role must be admin, editor or viewer' })
  role!: 'admin' | 'editor' | 'viewer';
}
