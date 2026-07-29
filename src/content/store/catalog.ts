export const operationMidnightProduct = {
  slug: "operacao-da-meia-noite",
  title: "Operação da Meia-Noite: A Chave Atlas",
  shortTitle: "A Chave Atlas",
  universe: "Operação da Meia-Noite",
  image: "/media/landing/operation-midnight-table.png",
  imageAlt:
    "Dossiê, envelopes, mapa, chave e comunicador da Operação da Meia-Noite",
  href: "/historia",
  players: "3–6 jogadores",
  duration: "90–120 minutos",
  ageRating: "18+",
  format: "Físico + digital",
  formatOptions: [
    {
      id: "physical",
      label: "Físico + digital",
      price: "R$ 119,90",
      priceInCents: 11990,
      available: true,
      description:
        "Caixa completa, materiais físicos e acesso ao aplicativo da missão.",
    },
    {
      id: "digital",
      label: "Digital",
      price: "R$ 59,90",
      priceInCents: 5990,
      available: true,
      description: "Experiência completa 100% digital. Jogue agora mesmo.",
    },
  ],
  routes: "3 rotas",
  endings: "6 finais",
  teaser:
    "Uma festa de máscaras. Um leilão clandestino. Uma chave digital capaz de revelar contas, identidades e crimes internacionais. Sua equipe tem até a meia-noite para entrar na Mansão Vesper, recuperar o artefato e decidir em quem confiar.",
} as const;

export type StoreProduct = typeof operationMidnightProduct;
export type StoreProductFormat = StoreProduct["formatOptions"][number];
