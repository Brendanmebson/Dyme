// src/lib/jwt.js
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import 'dotenv/config';

const JWT_SECRET          = process.env.JWT_SECRET;
const JWT_EXPIRES_IN      = process.env.JWT_EXPIRES_IN      || '7d';
const JWT_REFRESH_SECRET  = process.env.JWT_REFRESH_SECRET;
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

export const signAccessToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES });

export const verifyAccessToken = (token) =>
  jwt.verify(token, JWT_SECRET);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, JWT_REFRESH_SECRET);

// Hash a refresh token before storing in DB
export const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

// ms until expiry for a given duration string (e.g. "30d")
export const parseDurationMs = (duration) => {
  const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Invalid duration: ${duration}`);
  return parseInt(match[1]) * units[match[2]];
};
