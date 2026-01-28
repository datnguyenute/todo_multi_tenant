import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  @ResponseMessage('List workspaces')
  list() {
    return this.workspacesService.findAll();
  }

  @Post()
  @ResponseMessage('Create workspaces')
  async register(@Body() dto: CreateWorkspaceDto) {
    return this.workspacesService.create(dto);
  }
}
