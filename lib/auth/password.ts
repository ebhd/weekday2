import argon2 from "argon2";

const ARGON_OPTIONS: argon2.Options & { type: argon2.Options } = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 3,
  parallelism: 1,
};

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON_OPTIONS);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain, ARGON_OPTIONS);
  } catch {
    return false;
  }
}
