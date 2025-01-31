import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from './MyContext';

// bearer 120425awlgawef

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization) throw new Error('not authenticated');

  try {
    const token = authorization.split(' ')[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!); // payload contains userId
    context.payload = payload as any;
  } catch (err) {
    console.error(err);
    throw new Error('not authenticated');
  }

  return next(); // returns the next resolver
};
