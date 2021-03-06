import { FastifyInstance } from 'fastify';
import { Connection, createConnection } from 'typeorm';
import { mock as nodemailerMock } from 'nodemailer';
import createFastifyInstance from '../../src/createFastifyInstance';
import { User } from '../../src/entities/user.entity';

describe('Register', () => {
  let app: FastifyInstance;
  let connection: Connection;

  beforeAll(async () => {
    app = await createFastifyInstance();
  });

  beforeEach(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    nodemailerMock.reset();
  });

  afterEach(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register and send email verification', async () => {
    const response = await app.inject({
      method: 'post',
      url: '/register',
      payload: {
        firstName: 'Ortal',
        lastName: 'Yadaev',
        email: 'ortal@gmail.com',
        username: 'ortalyad',
        password: 'password',
      },
    });

    const user = (await User.findOne({
      select: ['email', 'verifiedAt', 'password'],
      where: {
        firstName: 'Ortal',
        lastName: 'Yadaev',
        email: 'ortal@gmail.com',
      },
    })) as User;

    expect(response.statusCode).toBe(201);
    expect(await User.count()).toBe(1);
    expect(user).not.toBeNull();
    expect(User.comparePasswords('password', user.password)).toBeTruthy();

    const sentEmails = nodemailerMock.getSentMail();
    expect(sentEmails.length).toBe(1);
    expect(sentEmails[0].to).toBe(user.email);

    expect(user.verifiedAt).toBeNull();
  });

  describe("shouldn't register", () => {
    it("existing verified email - shouldn't resend verification email", async () => {
      const email = 'ortal@gmail.com';
      await User.factory().create({ email });

      const response = await app.inject({
        method: 'post',
        url: '/register',
        payload: {
          firstName: 'Ortal',
          lastName: 'Yadaev',
          email,
          password: 'password',
          username: 'ortalyad',
        },
      });

      expect(response.statusCode).toBe(422);
      expect(await User.count()).toBe(1);
      expect(nodemailerMock.getSentMail().length).toBe(0);
    });

    it("existing unverified user - shouldn't resend verification email", async () => {
      const email = 'ortal@gmail.com';
      await User.factory().unverified().create({
        email,
      });

      const response = await app.inject({
        method: 'post',
        url: '/register',
        payload: {
          firstName: 'Ortal',
          lastName: 'Yadaev',
          email,
          password: 'password',
          username: 'ortalyad',
        },
      });

      expect(response.statusCode).toBe(422);
      expect(await User.count()).toBe(1);
      expect(nodemailerMock.getSentMail().length).toBe(0);
    });

    it("existing verified username - shouldn't resend verification email", async () => {
      const username = 'ortal';
      await User.factory().create({ username });

      const response = await app.inject({
        method: 'post',
        url: '/register',
        payload: {
          firstName: 'Ortal',
          lastName: 'Yadaev',
          email: 'ortal@gmail.com',
          password: 'password',
          username,
        },
      });

      expect(response.statusCode).toBe(422);
      expect(await User.count()).toBe(1);
      expect(nodemailerMock.getSentMail().length).toBe(0);
    });

    it("existing username and unverified user  - shouldn't resend verification email", async () => {
      const username = 'ortal';
      await User.factory().unverified().create({
        username,
      });

      const response = await app.inject({
        method: 'post',
        url: '/register',
        payload: {
          firstName: 'Ortal',
          lastName: 'Yadaev',
          email: 'ortal@gmail.com',
          password: 'password',
          username,
        },
      });

      expect(response.statusCode).toBe(422);
      expect(await User.count()).toBe(1);
      expect(nodemailerMock.getSentMail().length).toBe(0);
    });

    it('invalid email', async () => {
      const response = await app.inject({
        method: 'post',
        url: '/register',
        payload: {
          firstName: 'Ortal',
          lastName: 'Yadaev',
          email: 'invalid-email',
          password: 'password',
          username: 'ortalyad',
        },
      });

      expect(response.statusCode).toBe(422);
      expect(await User.count()).toBe(0);
    });
  });
});
