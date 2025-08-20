import { randomInt } from 'crypto';

export function generatePassword(length = 6): string {
  if (length < 2) throw new Error('Password length must be >= 2');

  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const all = letters + digits;

  const pick = (pool: string) => pool[randomInt(0, pool.length)];

  const chars = [pick(letters), pick(digits)];

  for (let i = 2; i < length; i++) {
    chars.push(pick(all));
  }

  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
}
