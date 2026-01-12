import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entites/workspace.entity';
import { Repository } from 'typeorm';
import { UserWorkspace } from './entites/user-workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

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
}
