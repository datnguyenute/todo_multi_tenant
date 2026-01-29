import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';

export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, fileBuffer?: Buffer): Promise<Task> {
    const { projectId, assigneeId, ...taskData } = createTaskDto;
    const task = this.taskRepo.create({
      ...taskData,
      attachment: fileBuffer,
      project: { id: projectId },
      assignee: { id: assigneeId },
    });

    return await this.taskRepo.save(task);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id }, relations: ['project', 'assignee'] });

    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);

    return task;
  }

  async findAllByProject(projectId: string): Promise<Task[]> {
    return await this.taskRepo.find({
      where: { project: { id: projectId } },
      relations: ['assignee'],
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, fileBuffer?: Buffer): Promise<Task> {
    const task = await this.taskRepo.preload({
      id: id,
      ...updateTaskDto,
      ...(fileBuffer && { attachment: fileBuffer }),
    });

    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);

    return await this.taskRepo.save(task);
  }

  async softDelete(id: string) {
    const result = await this.taskRepo.softDelete(id);

    if (!result.affected) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  /**
   * Recovers soft-deleted
   */
  async restore(id: string) {
    return await this.taskRepo.restore(id);
  }
}
