import { z } from "zod";
export const licenseCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    /^OMN-(?:[A-Z0-9]{4}-[A-Z0-9]{4}|[A-Z0-9]{8}-[A-Z0-9]{8})$/,
    "Use o formato informado no cartão ou no pedido",
  );
export const roomCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{6}$/, "Código de sala inválido");
export function normalizeCode(value: string) {
  return value.replace(/[^a-z0-9]/gi, "").toUpperCase();
}
