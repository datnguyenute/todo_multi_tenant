// dto/add-members.dto.ts
import { IsArray, IsUUID, IsString, IsOptional, IsEnum } from 'class-validator';
import { WorkspaceRole } from '../entites/user-workspace.entity';

export class AddMembersDto {
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];

  @IsEnum(WorkspaceRole)
  @IsOptional()
  role?: WorkspaceRole;
}
