import dotenv from 'dotenv';
dotenv.config();
import { ApolloServer } from 'apollo-server';
import typeormConfig from './typeorm.config';
import { schema } from './schema';
import { Context } from './types/Context';
import { auth } from './middlewares/auth';

const boot = async () => {
  const conn = await typeormConfig.initialize();

  const server = new ApolloServer({
    schema,
    context: ({ req }): Context => {
      const token = req?.headers?.authorization
        ? auth(req.headers.authorization)
        : null;

      return { conn, userId: token?.userId };
    },
  });

  server.listen(process.env.PORT).then(({ url }) => {
    console.log(`Listening on ${url}`);
  });
};

boot();
