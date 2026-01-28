import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';
import { BadRequestException } from '@nestjs/common';

export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly projectMember: Repository<ProjectMember>,
  ) {}

  findAll = async () => {
    return await this.projectRepo.find();
  };

  create(data: CreateProjectDto) {
    const Project = this.projectRepo.create(data);
    return this.projectRepo.save(Project);
  }

  async update(id: string, dto: UpdateProjectDto) {
    const { name } = dto;
    const project = await this.projectRepo.findOne({ where: { id: id } });
    if (!project) {
      throw new BadRequestException(`Project not found.`);
    }

    if (name) project.name = name;

    return this.projectRepo.save(project);
  }

  async delete(id: string) {
    const result = await this.projectRepo.softDelete(id);

    if (!result.affected) {
      throw new BadRequestException(`Project not found.`);
    }

    return true;
  }
}
