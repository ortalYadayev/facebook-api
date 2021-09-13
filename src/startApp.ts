import { createConnection } from 'typeorm';
import { FastifyInstance } from 'fastify';
import fastifyCors from 'fastify-cors';
import createFastifyInstance from './createFastifyInstance';

const startApp = async (): Promise<FastifyInstance> => {
  const app = await createFastifyInstance();

  app.register(fastifyCors, {
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  });

  await createConnection();

  try {
    await app.listen(Number(process.env.APP_PORT));
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }

  return app;
};

export default startApp;
