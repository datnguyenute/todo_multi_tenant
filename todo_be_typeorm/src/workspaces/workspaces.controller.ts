import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  list() {
    return this.workspacesService.findAll();
  }

  @Post()
  async register(@Body() dto: CreateWorkspaceDto) {
    return this.workspacesService.create(dto);
  }
}
