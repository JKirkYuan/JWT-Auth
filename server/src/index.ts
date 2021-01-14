import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolvers } from './UserResolver';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import { User } from './entity/User';
import { createAccessToken, createRefreshToken } from './auth';
import { sendRefreshToken } from './sendRefreshToken';
import { createTypeormConn } from './utils/createTypeormConn';

(async () => {
  const app = express();
  console.log(process.env.NODE_ENV);
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === 'production'
          ? process.env.ORIGIN!
          : 'http://localhost:3000',
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.get('/', (_req, res) => {
    res.send('hello');
  });

  app.post('/refresh_token', async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: '' });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: '' });
    }

    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      return res.send({ ok: false, accessToken: '' });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  await createTypeormConn();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolvers],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log('express server started on port: ', port);
  });
})();
