import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import createFastifyInstance from '../../../src/createFastifyInstance';
import { Post } from '../../../src/entities/post.entity';
import { User } from '../../../src/entities/user.entity';

describe('Store Post', () => {
  let app: FastifyInstance;
  let connection: Connection;

  beforeAll(async () => {
    app = await createFastifyInstance();
  });

  beforeEach(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterEach(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should add a post', async () => {
    const user = await User.factory().create();

    const response = await app.loginAs(user).inject({
      method: 'POST',
      url: `/posts`,
      payload: {
        content: 'content',
      },
    });

    expect(response.statusCode).toBe(201);
  });

  it('existing posts and should add the post', async () => {
    const user = await User.factory().create();
    await Post.factory().user(user).create();

    const response = await app.loginAs(user).inject({
      method: 'POST',
      url: `/posts`,
      payload: {
        content: 'content',
      },
    });

    expect(response.statusCode).toBe(201);
  });

  describe("shouldn't add a post", () => {
    it('there is not a content', async () => {
      const user = await User.factory().create();

      const response = await app.loginAs(user).inject({
        method: 'POST',
        url: `/posts`,
      });

      expect(response.statusCode).toBe(422);
    });
  });
});
