import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string) => {
  const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 hour

  // res.set('Access-Control-Allow-Origin', 'https://jwt-auth-chi.vercel.app');
  // res.set('Access-Control-Allow-Credentials', 'true');
  // res.set("Access-Control-Allow-Headers', 'Content-Type, *");

  res.cookie('jid', token, {
    httpOnly: true,
    expires: expiryDate,
    sameSite: 'lax',
  });
};
