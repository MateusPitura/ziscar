import { genSalt, hashSync } from 'bcrypt';

export async function encryptPassword(password: string) {
  const salt = await genSalt(10);
  return hashSync(password, salt);
}

export function generateRandomPassword() {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (x) => chars[x % chars.length]).join('');
}
