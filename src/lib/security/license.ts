import { createHash, randomBytes } from "node:crypto";
export function hashSecret(value: string) { return createHash("sha256").update(value).digest("hex"); }
export function createDevelopmentLicense() { const raw = `OMN-${randomBytes(2).toString("hex")}-${randomBytes(2).toString("hex")}`.toUpperCase(); return { raw, hash: hashSecret(raw), last4: raw.slice(-4) }; }
