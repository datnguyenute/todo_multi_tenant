import { User } from "src/users/entities/user.entity"
import { Workspace } from "./workspace.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm"

export enum WorkspaceRole {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
  VIEWER = "viewer",
}

export enum WorkspaceMemberStatus {
  ACTIVE = "active",
  INVITED = "invited",
}

@Entity("user_workspaces")
@Unique(["userId", "workspaceId"])
export class UserWorkspace {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  userId: string

  @Column()
  workspaceId: string

  @Column({
    type: "enum",
    enum: WorkspaceRole,
    default: WorkspaceRole.MEMBER,
  })
  role: WorkspaceRole  // TODO: Admin page

  @Column({
    type: "enum",
    enum: WorkspaceMemberStatus,
    default: WorkspaceMemberStatus.ACTIVE,
  })
  status: WorkspaceMemberStatus

  @ManyToOne(() => User, user => user.workspaces, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User

  @ManyToOne(() => Workspace, ws => ws.members, { onDelete: "CASCADE" })
  @JoinColumn({ name: "workspaceId" })
  workspace: Workspace

  @CreateDateColumn()
  createdAt: Date
}