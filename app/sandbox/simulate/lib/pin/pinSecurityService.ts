import "server-only";

import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";

import { promisify } from "node:util";

const scrypt =
  promisify(scryptCallback);

const SALT_LENGTH_BYTES = 16;
const HASH_LENGTH_BYTES = 32;

const SCRYPT_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 32 * 1024 * 1024,
};

const FORMAT_VERSION = "v1";

function validatePin(
  pin: string
): void {

  if (!/^\d{6}$/.test(pin)) {

    throw new Error(
      "CareVR PIN must contain exactly 6 digits."
    );

  }

}

export async function hashPin(
  pin: string
): Promise<string> {

  validatePin(pin);

  const salt =
    randomBytes(
      SALT_LENGTH_BYTES
    );

const derivedKey =
  (await scrypt(
    pin,
    salt,
    HASH_LENGTH_BYTES
  )) as Buffer;

  return [
    FORMAT_VERSION,
    salt.toString("base64url"),
    derivedKey.toString("base64url"),
  ].join(".");
}

export async function verifyPin(
  pin: string,
  storedHash: string
): Promise<boolean> {

  validatePin(pin);

  const parts =
    storedHash.split(".");

  if (
    parts.length !== 3 ||
    parts[0] !== FORMAT_VERSION
  ) {

    throw new Error(
      "Unsupported or invalid CareVR PIN hash format."
    );

  }

  const [
    ,
    encodedSalt,
    encodedHash,
  ] = parts;

  const salt =
    Buffer.from(
      encodedSalt,
      "base64url"
    );

  const expectedHash =
    Buffer.from(
      encodedHash,
      "base64url"
    );

  if (
    salt.length !==
    SALT_LENGTH_BYTES
  ) {

    throw new Error(
      "Invalid CareVR PIN salt."
    );

  }

  if (
    expectedHash.length !==
    HASH_LENGTH_BYTES
  ) {

    throw new Error(
      "Invalid CareVR PIN hash."
    );

  }

const actualHash =
  (await scrypt(
    pin,
    salt,
    HASH_LENGTH_BYTES
  )) as Buffer;

  return timingSafeEqual(
    actualHash,
    expectedHash
  );
}