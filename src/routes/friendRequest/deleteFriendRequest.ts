import { FastifyInstance } from 'fastify';
import moment from 'moment';
import { IsNull } from 'typeorm';
import { FriendRequest } from '../../entities/friend_request.entity';

type ParamsType = { id: number };

const deleteFriendRequest = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/friend-requests/:id/delete',
    method: 'DELETE',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const { id } = request.params;

      try {
        const friendRequest = await FriendRequest.findOneOrFail({
          where: {
            id,
            sender: request.user,
            rejectedAt: IsNull(),
            deletedAt: IsNull(),
            approvedAt: IsNull(),
          },
        });

        friendRequest.deletedAt = moment().toDate();
        await friendRequest.save();

        return reply.code(200).send();
      } catch (error) {
        return reply.code(422).send();
      }
    },
  });
};

export default deleteFriendRequest;