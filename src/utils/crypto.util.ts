// src/auth/crypto.util.ts
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; 
const PEPPER = process.env.PASSWORD_PEPPER ?? '';
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain + PEPPER, SALT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain + PEPPER, hash);
}
