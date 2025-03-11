import { genSalt, hashSync } from 'bcrypt';
import { EncryptPasswordInput } from 'src/types';

export async function encryptPassword({ password }: EncryptPasswordInput) {
  const salt = await genSalt(10);
  return hashSync(password, salt);
}
