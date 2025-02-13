import * as jwt from 'jsonwebtoken';

export const getJWTtoken = (token: string): any => {
  const decoded = jwt.decode(token, { complete: true });

  if (!decoded) {
    throw new Error('Token invalid');
  };
  
  return decoded.payload;
}