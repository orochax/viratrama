export type RouteSlug = "social" | "servico" | "tecnica";

export const routeLabels: Record<RouteSlug, string> = {
  social: "Rota social",
  servico: "Rota de serviço",
  tecnica: "Rota técnica",
};

export const inventoryCatalog = [
  { id: "cartao-visitante", name: "Cartão de visitante", description: "Reduz a exposição em uma interação social." },
  { id: "kit-derivacao", name: "Kit de derivação", description: "Contorna uma trava técnica de uso único." },
  { id: "lente-azul", name: "Lente azul", description: "Revela marcas de segurança em documentos." },
  { id: "comunicador", name: "Comunicador seguro", description: "Mantém o canal com Vega estável." },
  { id: "passe-servico", name: "Passe de serviço", description: "Autoriza uma passagem pela área de funcionários." },
  { id: "bloqueador", name: "Bloqueador de sinal", description: "Atrasa uma elevação de alerta." },
  { id: "microcamera", name: "Microcâmera", description: "Registra uma evidência de campo." },
  { id: "chave-garagem", name: "Chave da garagem", description: "Mantém a saída da garagem disponível." },
] as const;
