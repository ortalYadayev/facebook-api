import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import PostFactory from '../database/factories/post.factory';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column()
  content!: string;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User | undefined;

  @OneToMany(() => Like, (like) => like.post, {
    cascade: true,
  })
  likes!: Like[];

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
  })
  comments!: Comment[];

  static factory(): PostFactory {
    return new PostFactory();
  }
}
