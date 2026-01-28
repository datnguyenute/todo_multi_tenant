import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ResponseMessage } from 'src/decorator/customize';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ResponseMessage('List Projects')
  list() {
    return this.projectsService.findAll();
  }

  @Post()
  @ResponseMessage('Create Projects')
  async register(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Patch(':id')
  @ResponseMessage('Update project')
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @ResponseMessage('Delete project')
  async delete(@Param('id') id: string) {
    return this.projectsService.delete(id);
  }
}
