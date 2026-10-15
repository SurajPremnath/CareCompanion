import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH_BYTES = 32;
const IV_LENGTH_BYTES = 12;
const AUTH_TAG_LENGTH_BYTES = 16;
const FORMAT_VERSION = "v1";
const LOOKUP_HASH_ALGORITHM = "sha256";

function getEncryptionKey(): Buffer {

  const encodedKey =
    process.env.CAREVR_ENCRYPTION_KEY;

  if (!encodedKey) {

    throw new Error(
      "CAREVR_ENCRYPTION_KEY is not configured."
    );

  }

  const key =
    Buffer.from(
      encodedKey,
      "base64"
    );

  if (
    key.length !==
    KEY_LENGTH_BYTES
  ) {

    throw new Error(
      "CAREVR_ENCRYPTION_KEY must decode to exactly 32 bytes."
    );

  }

  return key;
}

function getLookupHashKey(): Buffer {

  const encodedKey =
    process.env.CAREVR_LOOKUP_HASH_KEY;

  if (!encodedKey) {

    throw new Error(
      "CAREVR_LOOKUP_HASH_KEY is not configured."
    );

  }

  const key =
    Buffer.from(
      encodedKey,
      "base64"
    );

  if (key.length !== KEY_LENGTH_BYTES) {

    throw new Error(
      "CAREVR_LOOKUP_HASH_KEY must decode to exactly 32 bytes."
    );

  }

  return key;
}

export function createLookupHash(
  value: string
): string {

  if (typeof value !== "string") {

    throw new Error(
      "Lookup hash value must be a string."
    );

  }

  const normalizedValue =
    value.trim().toLowerCase();

  if (!normalizedValue) {

    throw new Error(
      "Lookup hash value cannot be empty."
    );

  }

  const key =
    getLookupHashKey();

  return createHmac(
    LOOKUP_HASH_ALGORITHM,
    key
  )
    .update(normalizedValue, "utf8")
    .digest("base64url");
}

export function encryptValue(
  value: string
): string {

  if (typeof value !== "string") {

    throw new Error(
      "Encryption value must be a string."
    );

  }

  const key =
    getEncryptionKey();

  const iv =
    randomBytes(
      IV_LENGTH_BYTES
    );

  const cipher =
    createCipheriv(
      ALGORITHM,
      key,
      iv
    );

  const ciphertext =
    Buffer.concat([
      cipher.update(value, "utf8"),
      cipher.final(),
    ]);

  const authTag =
    cipher.getAuthTag();

  return [
    FORMAT_VERSION,
    iv.toString("base64url"),
    authTag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
}

export function decryptValue(
  encryptedValue: string
): string {

  if (
    typeof encryptedValue !==
    "string"
  ) {

    throw new Error(
      "Encrypted value must be a string."
    );

  }

  const parts =
    encryptedValue.split(".");

  if (
    parts.length !== 4 ||
    parts[0] !== FORMAT_VERSION
  ) {

    throw new Error(
      "Unsupported or invalid encrypted value format."
    );

  }

  const [
    ,
    encodedIv,
    encodedAuthTag,
    encodedCiphertext,
  ] = parts;

  const iv =
    Buffer.from(
      encodedIv,
      "base64url"
    );

  const authTag =
    Buffer.from(
      encodedAuthTag,
      "base64url"
    );

  const ciphertext =
    Buffer.from(
      encodedCiphertext,
      "base64url"
    );

  if (
    iv.length !==
    IV_LENGTH_BYTES
  ) {

    throw new Error(
      "Invalid encryption IV."
    );

  }

  if (
    authTag.length !==
    AUTH_TAG_LENGTH_BYTES
  ) {

    throw new Error(
      "Invalid encryption authentication tag."
    );

  }

  const key =
    getEncryptionKey();

  const decipher =
    createDecipheriv(
      ALGORITHM,
      key,
      iv
    );

  decipher.setAuthTag(
    authTag
  );

  const plaintext =
    Buffer.concat([
      decipher.update(
        ciphertext
      ),
      decipher.final(),
    ]);

  return plaintext.toString(
    "utf8"
  );
}