import jwt, { SignOptions } from 'jsonwebtoken';

const accessSecret = process.env.JWT_ACCESS_SECRET as string;
const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

export function generateAccessToken(payload: object) {
  return jwt.sign(payload, accessSecret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  } as SignOptions);
}

export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, refreshSecret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  } as SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, accessSecret);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshSecret);
}
