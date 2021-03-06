import { BaseSeeder } from './base_seeder';
import { User } from '../../entities/user.entity';
import { Post } from '../../entities/post.entity';
import { Comment } from '../../entities/comment.entity';

function randomIndex(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export default class PostCommentSeeder implements BaseSeeder {
  public async execute(): Promise<void> {
    const users = await User.find();
    const posts = await Post.find();

    for (let i = 0; i < 50; i++) {
      const fromUserKey = randomIndex(0, users.length - 1);
      const postKey = randomIndex(0, posts.length - 1);

      await Comment.factory()
        .user(users[fromUserKey])
        .post(posts[postKey])
        .create();
    }
  }
}
