import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string) => {
  const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 hour

  res.cookie('jid', token, {
    httpOnly: true,
    expires: expiryDate,
    sameSite: 'lax',
  });
};
