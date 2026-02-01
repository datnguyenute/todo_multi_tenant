import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ResponseMessage } from 'src/decorator/customize';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Post()
  @ResponseMessage('Create task')
  @UseInterceptors(FileInterceptor('file')) // Matches the key in form-data
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.taskService.create(createTaskDto);
  }

  @Get('project/:projectId')
  @ResponseMessage('List Task')
  async findAll(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return await this.taskService.findAllByProject(projectId);
  }

  @Get(':id')
  @ResponseMessage('Task detail')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.taskService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file')) // Matches the key in form-data
  @ResponseMessage('Edit task')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return await this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ResponseMessage('Delete task')
  async remove(@Param('id') id: string) {
    return await this.taskService.softDelete(id);
  }

  @Post(':id/restore')
  @ResponseMessage('Restore task')
  async restore(@Param('id') id: string) {
    return await this.taskService.restore(id);
  }
}
