import { IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  name: string;
}

export class UpdateProjectDto {
  @IsNotEmpty()
  name: string;
}
