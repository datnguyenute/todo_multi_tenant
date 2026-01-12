import { User } from 'src/users/entities/user.entity';
import { Column,  Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserWorkspace } from './user-workspace.entity';

@Entity("workspaces")
export class Workspace {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column()
  ownerId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "ownerId" })
  owner: User

  @OneToMany(() => UserWorkspace, uw => uw.workspace)
  members: UserWorkspace[]
}