import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { UpsertNoteDto } from './dto/upsert-note.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('notes')
@UseGuards(AuthGuard('jwt'))
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

    @Get()
  list(@Req() req: any) {
    return this.notesService.list(req.user.userId);
  }

  @Post()
  upsert(@Req() req: any, @Body() dto: UpsertNoteDto) {
    return this.notesService.upsert(req.user.userId, dto);
  }

  @Delete(':contextId')
  delete(@Req() req: any, @Param('contextId') contextId: string) {
    return this.notesService.delete(req.user.userId, contextId);
  }
}
