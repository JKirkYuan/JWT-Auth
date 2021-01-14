import { sign } from 'jsonwebtoken';
import { User } from './entity/User';

export const createAccessToken = (user: User) => {
  return sign(
    { userId: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: '15s', // check to refresh this token when it's invalid
    }
  );
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: '7d',
    }
  );
};
