import type { RouteSlug } from "./public-catalog";

export { inventoryCatalog, routeLabels, type RouteSlug } from "./public-catalog";

export const STORY_SLUG = "operacao-da-meia-noite";
export const STORY_VERSION = 2;

export const canonicalRoles = [
  { slug: "infiltrador", name: "O Infiltrador", shortName: "Infiltrador", responsibility: "Confirma acessos discretos e movimentos arriscados.", ability: "Uma vez, repete um movimento bloqueado sem elevar o alerta.", secret: "Descubra quem conhecia a Câmara Atlas antes desta noite." },
  { slug: "tecnica", name: "A Técnica", shortName: "Técnica", responsibility: "Resolve sistemas, códigos e identifica a Chave Atlas.", ability: "Remove uma tentativa inválida de um puzzle técnico.", secret: "Confirme a chave verdadeira sem revelar cedo demais como fez isso." },
  { slug: "observador", name: "O Observador", shortName: "Observador", responsibility: "Confirma a rota e acompanha alterações no ambiente.", ability: "Revela uma conexão pública adjacente no mapa.", secret: "Mantenha o alerta abaixo de quatro até a Câmara Atlas." },
  { slug: "negociadora", name: "A Negociadora", shortName: "Negociadora", responsibility: "Confirma conversas, acusações e propostas.", ability: "Desbloqueia uma alternativa pública em uma negociação.", secret: "Obtenha uma verdade de Helena, Matteo ou Voss sem aceitar sua proposta." },
  { slug: "motorista", name: "O Motorista", shortName: "Motorista", responsibility: "Controla o inventário operacional, o tempo e a extração.", ability: "Uma vez, amplia o prazo de extração em dois minutos.", secret: "Retire a equipe por uma saída diferente da entrada." },
  { slug: "analista", name: "A Analista", shortName: "Analista", responsibility: "Cruza provas, Janus e o passado de Orion.", ability: "Solicita uma pista documental sem a primeira penalidade.", secret: "Encontre a ligação entre Orion e o Protocolo Janus." },
] as const;

export type RoleSlug = (typeof canonicalRoles)[number]["slug"];
export type FinalVote = "orion" | "voss" | "divulgar" | "destruir" | "manter";

export const routeGraph: Record<string, readonly string[]> = {
  "portao-principal": ["recepcao", "jardins"],
  recepcao: ["portao-principal", "salao-mascaras"],
  "salao-mascaras": ["recepcao", "galeria"],
  galeria: ["salao-mascaras", "biblioteca", "escritorio-voss"],
  "entrada-servico": ["cozinha", "garagem"],
  cozinha: ["entrada-servico", "adega"],
  adega: ["cozinha", "ala-tecnica"],
  "acesso-subsolo": ["sala-sistemas"],
  "sala-sistemas": ["acesso-subsolo", "tunel-tecnico"],
  "tunel-tecnico": ["sala-sistemas", "ala-tecnica"],
  "ala-tecnica": ["adega", "tunel-tecnico", "biblioteca", "central-seguranca"],
  biblioteca: ["galeria", "ala-tecnica", "corredor-restrito"],
  "central-seguranca": ["ala-tecnica", "corredor-restrito"],
  "escritorio-voss": ["galeria", "corredor-restrito"],
  "corredor-restrito": ["biblioteca", "central-seguranca", "escritorio-voss", "camara-atlas"],
  "camara-atlas": ["corredor-restrito"],
  garagem: ["entrada-servico"],
  jardins: ["portao-principal"],
};
export const routeStarts: Record<RouteSlug, string> = {
  social: "portao-principal", servico: "entrada-servico", tecnica: "acesso-subsolo",
};

export type StepKind = "transmission" | "loadout" | "route_vote" | "decision" |
  "movement" | "puzzle" | "instruction" | "final_vote" | "extraction";
export type CanonicalStep = {
  id: string;
  act: number;
  kind: StepKind;
  title: string;
  objective: string;
  context: string;
  responsibleRole?: RoleSlug;
  envelope?: string;
  transmissionCode?: string;
  options?: readonly { id: string; label: string; publicRequirement?: string }[];
};

export const gameSteps: readonly CanonicalStep[] = [
  { id: "orion-abertura", act: 1, kind: "transmission", title: "Canal Orion", objective: "Escutem ou leiam juntos a primeira transmissão.", context: "O Envelope 00 permanece fechado sobre a mesa.", envelope: "00", transmissionCode: "MEDIA-OMN-ORION-01" },
  { id: "vega-briefing", act: 1, kind: "transmission", title: "Vega assume o canal", objective: "Conheçam a missão antes de tocar nos materiais.", context: "A coordenadora apresenta a Mansão Vesper e o alvo da equipe.", envelope: "00", transmissionCode: "MEDIA-OMN-VEGA-01" },
  { id: "abrir-envelope-00", act: 1, kind: "instruction", title: "Abram o dossiê", objective: "O anfitrião confirma que o Envelope 00 foi aberto.", context: "Distribuam apenas os cartões indicados pelo aplicativo.", envelope: "00" },
  { id: "selecionar-equipamento", act: 1, kind: "loadout", title: "Quatro escolhas", objective: "Escolham quatro dos oito itens para levar.", context: "A equipe discute. O Motorista confirma a seleção final.", responsibleRole: "motorista", envelope: "00" },
  { id: "votar-rota", act: 2, kind: "route_vote", title: "Três entradas", objective: "Cada agente recomenda uma rota em voto aberto.", context: "A recomendação orienta a equipe, mas não substitui a decisão do Observador.", envelope: "01" },
  { id: "confirmar-rota", act: 2, kind: "decision", title: "Escolha a entrada", objective: "O Observador confirma a rota de infiltração.", context: "Social, serviço e técnica exigem abordagens diferentes.", responsibleRole: "observador", envelope: "01", options: [
    { id: "social", label: "Portão principal" }, { id: "servico", label: "Entrada de serviço" }, { id: "tecnica", label: "Acesso ao subsolo" },
  ] },
  { id: "entrada-mansao", act: 2, kind: "movement", title: "Cruzem o primeiro limite", objective: "Movam os marcadores pelo trajeto indicado e confirmem a chegada.", context: "O Infiltrador conduz a travessia e confirma o movimento físico.", responsibleRole: "infiltrador", envelope: "01" },
  { id: "contato-helena", act: 2, kind: "decision", title: "Helena Crowe observa", objective: "Decidam como responder à aproximação.", context: "Helena reconhece detalhes que não deveria conhecer.", responsibleRole: "negociadora", options: [
    { id: "pressionar", label: "Pressionar por respostas" }, { id: "cooperar", label: "Compartilhar uma informação parcial" }, { id: "desviar", label: "Desviar a conversa" },
  ] },
  { id: "planta-incompleta", act: 2, kind: "puzzle", title: "Corredores ausentes", objective: "Sobreponham a transparência à planta e informem o código encontrado.", context: "As marcas de registro alinham dois documentos do Envelope 02.", responsibleRole: "analista", envelope: "02" },
  { id: "avancar-biblioteca", act: 3, kind: "movement", title: "Convergência", objective: "Levem todos os marcadores até a Biblioteca.", context: "As três rotas convergem. Confirmem no mapa antes de prosseguir.", responsibleRole: "infiltrador", envelope: "02" },
  { id: "janus", act: 3, kind: "puzzle", title: "Protocolo Janus", objective: "Cruzem a planta, o registro e a sequência de pulsos.", context: "A Analista encontra uma assinatura ligada ao passado de Orion.", responsibleRole: "analista", envelope: "03" },
  { id: "sistema-atlas", act: 3, kind: "puzzle", title: "Assinatura Atlas", objective: "A Técnica autentica a chave e informa o código do dispositivo.", context: "Duas chaves respondem ao sistema. Apenas uma preserva a assinatura completa.", responsibleRole: "tecnica", envelope: "03" },
  { id: "alarme", act: 3, kind: "transmission", title: "O alarme muda a noite", objective: "Iniciem a contagem policial e mantenham a equipe reunida.", context: "A estimativa de chegada só aparece agora.", transmissionCode: "MEDIA-OMN-VEGA-ALERTA" },
  { id: "camara-atlas", act: 4, kind: "movement", title: "A Câmara Atlas", objective: "Movam a equipe ao Corredor Restrito e depois à Câmara Atlas.", context: "A última passagem exige confirmação em campo.", responsibleRole: "infiltrador", envelope: "04" },
  { id: "destino-atlas", act: 4, kind: "final_vote", title: "Quem fica com a verdade?", objective: "Cada jogador deposita um voto secreto.", context: "Os votos só serão abertos quando todos confirmarem.", options: [
    { id: "orion", label: "Entregar a Orion" }, { id: "voss", label: "Devolver a Voss" }, { id: "divulgar", label: "Divulgar os arquivos" }, { id: "destruir", label: "Destruir a chave" }, { id: "manter", label: "Manter a chave" },
  ] },
  { id: "extracao", act: 4, kind: "extraction", title: "Saiam antes das sirenes", objective: "O Motorista confirma a saída e todos os marcadores extraídos.", context: "A rota de saída precisa estar livre.", responsibleRole: "motorista", options: [
    { id: "portao-principal", label: "Portão Principal" }, { id: "garagem", label: "Garagem" }, { id: "jardins", label: "Jardins" },
  ] },
] as const;

export const endingCatalog = [
  { slug: "novo-atlas", title: "O Novo Atlas", summary: "A equipe mantém a chave verdadeira e assume o peso de decidir o que a rede se tornará." },
  { slug: "transparencia-brutal", title: "Transparência Brutal", summary: "Os arquivos escapam para o mundo. A verdade chega inteira, sem controle e sem volta." },
  { slug: "cinzas", title: "Cinzas", summary: "A chave é destruída antes que qualquer lado possa controlar o arquivo." },
  { slug: "acordo-voss", title: "O Acordo Voss", summary: "Voss recupera o Atlas, mas a equipe sai com uma concessão que pode mudar a próxima noite." },
  { slug: "donos-segredo", title: "Os Donos do Segredo", summary: "Orion recebe a chave e sela novamente uma verdade que já conhecia perto demais." },
  { slug: "chave-errada", title: "A Chave Errada", summary: "A decisão foi tomada sobre uma cópia. O Atlas verdadeiro continua em circulação." },
  { slug: "doze-minutos", title: "Doze Minutos", summary: "As sirenes chegam antes da extração. Restam doze minutos apagados dos registros oficiais." },
] as const;

export const endingMediaCodes: Record<(typeof endingCatalog)[number]["slug"], string> = {
  "novo-atlas": "MEDIA-OMN-END-01",
  "transparencia-brutal": "MEDIA-OMN-END-02",
  cinzas: "MEDIA-OMN-END-03",
  "acordo-voss": "MEDIA-OMN-END-04",
  "donos-segredo": "MEDIA-OMN-END-05",
  "chave-errada": "MEDIA-OMN-END-06",
  "doze-minutos": "MEDIA-OMN-END-07",
};

export const puzzleDefinitions = {
  "planta-incompleta": { answer: "2317", maxAttempts: 5, hints: ["Alinhem primeiro as quatro marcas de registro.", "Procurem os números formados pelos vazios, não pelas paredes.", "Leiam da entrada social em direção à Câmara Atlas."] },
  janus: { answer: "ORION", maxAttempts: 4, hints: ["Janus olha para o passado e para o futuro.", "As iniciais dos registros formam um nome.", "O nome pertence a quem abriu o primeiro canal."] },
  "sistema-atlas": { answer: "ATLAS-7", maxAttempts: 4, hints: ["Compare os pulsos azuis das duas chaves.", "A assinatura válida repete sete intervalos.", "Informe o nome do protocolo seguido do número de intervalos."] },
} as const;

export function getStep(id: string) {
  return gameSteps.find((step) => step.id === id) ?? gameSteps[0];
}
export function nextStepId(id: string) {
  const index = gameSteps.findIndex((step) => step.id === id);
  return gameSteps[index + 1]?.id ?? null;
}
