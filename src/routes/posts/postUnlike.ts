import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { Post } from '../../entities/post.entity';
import { Like } from '../../entities/like.entity';

const ParamsSchema = { postId: Type.Number() };
type ParamsType = Static<typeof ParamsSchema>;

const postUnlike = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/posts/:postId/likes',
    method: 'DELETE',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      let post: Post;
      const { postId } = request.params;

      try {
        post = await Post.findOneOrFail({
          where: {
            id: postId,
          },
          relations: ['likes'],
        });
      } catch (error) {
        return reply.code(404).send({
          message: "The post doesn't exist",
        });
      }

      try {
        const like = await Like.findOneOrFail({
          where: {
            post,
            user: request.user,
          },
        });

        await Like.delete(like.id);

        return reply.code(200).send();
      } catch (error) {
        return reply.code(200).send();
      }
    },
  });
};

export default postUnlike;
