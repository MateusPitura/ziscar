import { genSalt, hashSync } from 'bcrypt';

export async function encryptPassword(password: string) {
  const salt = await genSalt(10);
  return hashSync(password, salt);
}
