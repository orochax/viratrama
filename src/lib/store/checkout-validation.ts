import { z } from "zod";

const digits = (value: string) => value.replace(/\D/g, "");

function hasRepeatedDigits(value: string) {
  return /^(\d)\1+$/.test(value);
}

function isValidCpf(value: string) {
  const cpf = digits(value);
  if (cpf.length !== 11 || hasRepeatedDigits(cpf)) return false;

  const calculate = (length: number) => {
    const sum = cpf
      .slice(0, length)
      .split("")
      .reduce(
        (total, number, index) => total + Number(number) * (length + 1 - index),
        0,
      );
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return calculate(9) === Number(cpf[9]) && calculate(10) === Number(cpf[10]);
}

function isValidCnpj(value: string) {
  const cnpj = digits(value);
  if (cnpj.length !== 14 || hasRepeatedDigits(cnpj)) return false;
  const calculate = (length: 12 | 13) => {
    const weights =
      length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = cnpj
      .slice(0, length)
      .split("")
      .reduce(
        (total, number, index) => total + Number(number) * weights[index],
        0,
      );
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  return (
    calculate(12) === Number(cnpj[12]) && calculate(13) === Number(cnpj[13])
  );
}

export function isValidTaxId(value: string) {
  const normalized = digits(value);
  return normalized.length === 11
    ? isValidCpf(normalized)
    : isValidCnpj(normalized);
}

const requiredText = (label: string, max = 120) =>
  z.string().trim().min(2, `${label} é obrigatório`).max(max);

const addressSchema = z.object({
  recipientName: requiredText("Nome do destinatário"),
  zipCode: z
    .string()
    .transform(digits)
    .pipe(z.string().length(8, "CEP inválido")),
  street: requiredText("Rua"),
  number: z.string().trim().min(1, "Número é obrigatório").max(20),
  complement: z.string().trim().max(80).optional().default(""),
  neighborhood: requiredText("Bairro", 80),
  city: requiredText("Cidade", 80),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, "Estado inválido"),
});

export const checkoutRequestSchema = z
  .object({
    items: z
      .array(
        z.object({
          slug: z.string().trim().min(2).max(100),
          formatId: z.enum(["physical", "digital"]),
          quantity: z.number().int().min(1).max(5),
        }),
      )
      .min(1)
      .max(10),
    customer: z.object({
      name: requiredText("Nome"),
      email: z.string().trim().toLowerCase().email("E-mail inválido").max(180),
      phone: z
        .string()
        .transform(digits)
        .pipe(z.string().regex(/^\d{10,11}$/, "Celular inválido")),
      taxId: z
        .string()
        .transform(digits)
        .refine(isValidTaxId, "CPF ou CNPJ inválido"),
    }),
    shippingAddress: addressSchema.optional(),
  })
  .superRefine((value, context) => {
    if (
      value.items.some((item) => item.formatId === "physical") &&
      !value.shippingAddress
    ) {
      context.addIssue({
        code: "custom",
        path: ["shippingAddress"],
        message: "Informe o endereço de entrega",
      });
    }
  });

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
