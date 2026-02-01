import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { ResponseMessage } from 'src/decorator/customize';
import { AddMembersDto } from './dto/add-members.dto';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  @ResponseMessage('List workspaces')
  list() {
    return this.workspacesService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Workspace detail')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.workspacesService.findOne(id);
  }

  @Post()
  @ResponseMessage('Create workspaces')
  async register(@Body() dto: CreateWorkspaceDto) {
    return this.workspacesService.create(dto);
  }

  @Post(':id/users/batch')
  async addMembers(@Param('id', ParseUUIDPipe) workspaceId: string, @Body() addMembersDto: AddMembersDto) {
    return await this.workspacesService.addMembersToWorkspace(workspaceId, addMembersDto);
  }
}
