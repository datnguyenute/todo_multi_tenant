import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { Workspace } from 'src/workspaces/entites/workspace.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// export enum TaskPriority {
//   OWNER = "owner",
//   ADMIN = "admin",
//   MEMBER = "member",
//   VIEWER = "viewer",
// }

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  assigneeId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigneeId' }) // This creates a 'assigneeId' column in DB
  assignee: User;

  @Column()
  priority: string; // TODO: Admin page

  @Column({ default: 'pending' })
  status: string; // TODO: Admin page

  @Column({ type: 'bytea', nullable: true })
  attachment: Buffer | null;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  project: Project;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
