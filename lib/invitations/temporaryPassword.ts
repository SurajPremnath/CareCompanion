import { randomBytes } from "crypto";

export interface TemporaryPasswordResult {
  password: string;
  expiresAt: string;
}

class TemporaryPassword {

  /**
   * Generates a cryptographically random temporary password.
   *
   * The password is valid for 7 days from creation.
   */
  generate(): TemporaryPasswordResult {

    const password = randomBytes(18)
      .toString("base64url")
      .slice(0, 24);

    const expiresAt =
      new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString();

    return {
      password,
      expiresAt
    };
  }
}

export const temporaryPassword =
  new TemporaryPassword();