import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  descripttion?: string;

  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsUUID()
  @IsNotEmpty()
  assigneeId: string;

  @IsString()
  @IsNotEmpty()
  priority: string; // e.g., 'high', 'medium', 'low'

  @IsString()
  @IsOptional()
  @IsEnum(['pending', 'in-progress', 'completed'])
  status?: string;
}
