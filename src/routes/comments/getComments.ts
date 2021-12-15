import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { IsNull } from 'typeorm';
import { Comment } from '../../entities/comment.entity';

const ParamsSchema = { postId: Type.Number() };
type ParamsType = Static<typeof ParamsSchema>;

const getComments = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/posts/:postId/comments',
    method: 'GET',
    preValidation: app.authMiddleware,
    schema: { params: ParamsSchema },
    handler: async (request, reply) => {
      const { postId } = request.params;

      const [comments, count] = await Comment.findAndCount({
        where: {
          post: postId,
          comment: IsNull(),
        },
        relations: ['user', 'likes', 'likes.user', 'comments'],
        order: {
          id: 'ASC',
        },
      });

      if (count > 5) {
        reply.code(200).send({ count });
      }

      reply.code(200).send({ comments, count });
    },
  });
};

export default getComments;
