import { genSalt, hashSync } from 'bcrypt';
import { EncryptPasswordInput } from 'src/types';
import { RemoveTimeFromDateInput } from './user.type';

export async function encryptPassword({ password }: EncryptPasswordInput) {
  const salt = await genSalt(10);
  return hashSync(password, salt);
}

export function removeTimeFromDate({ date }: RemoveTimeFromDateInput) {
  if (!date) {
    return null;
  }
  return date.toISOString().split('T')[0];
}
