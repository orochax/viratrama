import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

export function hashSecret(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function createDevelopmentLicense() {
  const raw =
    `OMN-${randomBytes(2).toString("hex")}-${randomBytes(2).toString("hex")}`.toUpperCase();
  return { raw, hash: hashSecret(raw), last4: raw.slice(-4) };
}

export function createCommercialLicense() {
  const value = randomBytes(8).toString("hex").toUpperCase();
  const raw = `OMN-${value.slice(0, 8)}-${value.slice(8)}`;
  return { raw, hash: hashSecret(raw), last4: raw.slice(-4) };
}

function licenseEncryptionKey() {
  const encoded = process.env.LICENSE_ENCRYPTION_KEY;
  if (!encoded) throw new Error("LICENSE_ENCRYPTION_KEY não configurada");
  const key = Buffer.from(encoded, "base64");
  if (key.length !== 32) {
    throw new Error("LICENSE_ENCRYPTION_KEY deve conter 32 bytes em base64");
  }
  return key;
}

export function encryptLicenseCode(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", licenseEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  return [
    "v1",
    iv.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function decryptLicenseCode(value: string) {
  const [version, iv, tag, encrypted] = value.split(".");
  if (version !== "v1" || !iv || !tag || !encrypted) {
    throw new Error("Código de licença criptografado inválido");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    licenseEncryptionKey(),
    Buffer.from(iv, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
