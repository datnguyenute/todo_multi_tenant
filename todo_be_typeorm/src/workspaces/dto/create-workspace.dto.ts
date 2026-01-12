import { IsNotEmpty } from "class-validator";

export class CreateWorkspaceDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  ownerId: string;
}