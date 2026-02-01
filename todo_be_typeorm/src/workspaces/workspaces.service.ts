import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entites/workspace.entity';
import { Repository } from 'typeorm';
import { UserWorkspace, WorkspaceRole } from './entites/user-workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { NotFoundException } from '@nestjs/common';
import { AddMembersDto } from './dto/add-members.dto';

export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepo: Repository<Workspace>,
    @InjectRepository(UserWorkspace)
    private readonly userWorkspaceRepo: Repository<UserWorkspace>,
  ) {}

  findAll = async () => {
    return await this.workspaceRepo.find();
  };

  create(data: CreateWorkspaceDto) {
    const workspace = this.workspaceRepo.create(data);
    return this.workspaceRepo.save(workspace);
  }

  async findOne(id: string): Promise<Workspace> {
    const workspace = await this.workspaceRepo.findOne({ where: { id }, relations: ['members', 'members.user'] });

    if (!workspace) throw new NotFoundException(`Workspace with ID ${id} not found`);

    return workspace;
  }

  async addMembersToWorkspace(workspaceId: string, dto: AddMembersDto) {
    const { userIds, role } = dto;

    const dataToInsert = userIds.map((userId) => ({
      workspaceId, // Maps to @Column() workspaceId
      userId, // Maps to @Column() userId
      role: (role as WorkspaceRole) || WorkspaceRole.MEMBER,
    }));

    return await this.userWorkspaceRepo
      .createQueryBuilder()
      .insert()
      .into(UserWorkspace)
      // Use the array of partial entities
      .values(dataToInsert)
      // PostgreSQL specific: prevents error if user already exists
      .onConflict(`("userId", "workspaceId") DO NOTHING`)
      .execute();
  }
}
