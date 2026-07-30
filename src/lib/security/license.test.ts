import { afterEach, describe, expect, it } from "vitest";
import {
  createCommercialLicense,
  decryptLicenseCode,
  encryptLicenseCode,
} from "./license";

const previousKey = process.env.LICENSE_ENCRYPTION_KEY;

afterEach(() => {
  process.env.LICENSE_ENCRYPTION_KEY = previousKey;
});

describe("licenças comerciais", () => {
  it("gera código comercial com entropia maior que o código legado", () => {
    expect(createCommercialLicense().raw).toMatch(
      /^OMN-[A-F0-9]{8}-[A-F0-9]{8}$/,
    );
  });

  it("criptografa e recupera o código sem armazená-lo em texto puro", () => {
    process.env.LICENSE_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
    const code = "OMN-12345678-90ABCDEF";
    const encrypted = encryptLicenseCode(code);
    expect(encrypted).not.toContain(code);
    expect(decryptLicenseCode(encrypted)).toBe(code);
  });
});
