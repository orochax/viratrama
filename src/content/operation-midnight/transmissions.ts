export type TransmissionKind =
  | "recruitment" | "briefing" | "operational" | "recording" | "intercepted"
  | "incoming_call" | "ultimatum" | "alert" | "extraction" | "revelation"
  | "epilogue" | "defeat";

export type AudioTransmission = {
  code: string;
  characterSlug: string;
  characterName: string;
  role: string;
  kind: TransmissionKind;
  title: string;
  transcript: string;
  audioPath: string;
  portraitPath: string;
  theme: "orion" | "vega" | "voss" | "sofia" | "neutral";
  requiresCompletion: boolean;
  completionRule: "host_or_transcript" | "host_only" | "all_players";
  condition?: { flag: string; equals: boolean };
  effects?: string[];
  status: "not_recorded" | "placeholder";
};

const root = "operation-midnight";
const portrait = (slug: string) => `${root}/characters/${slug}/portraits/main.webp`;
const audio = (slug: string, code: string) => `${root}/characters/${slug}/audio/${code.toLowerCase()}.mp3`;

export const transmissions: AudioTransmission[] = [
  { code: "MEDIA-OMN-ORION-01", characterSlug: "orion", characterName: "Orion", role: "Contratante da operação", kind: "recruitment", title: "A operação que não existe", transcript: "Se vocês estão vendo esta gravação, aceitaram uma operação que não existe. Entrem. Recuperem a Chave Atlas. Saiam. O resto pertence a mim.", audioPath: audio("orion", "MEDIA-OMN-ORION-01"), portraitPath: "media/characters/orion.png", theme: "orion", requiresCompletion: true, completionRule: "host_or_transcript", effects: ["recruitment_completed"], status: "not_recorded" },
  { code: "MEDIA-OMN-VEGA-01", characterSlug: "vega", characterName: "Vega", role: "Coordenadora operacional", kind: "briefing", title: "Três entradas", transcript: "A mansão tem três entradas. Escolham a rota social, de serviço ou técnica. Mantenham a equipe junta e confirmem a fonte antes de abrir qualquer material.", audioPath: audio("vega", "MEDIA-OMN-VEGA-01"), portraitPath: "media/characters/vega.png", theme: "vega", requiresCompletion: true, completionRule: "host_or_transcript", effects: ["briefing_completed"], status: "not_recorded" },
  { code: "MEDIA-OMN-VEGA-02", characterSlug: "vega", characterName: "Vega", role: "Coordenadora operacional", kind: "operational", title: "A rota está comprometida", transcript: "O plano mudou. Não se afastem da rota sem avisar. O comprador chegou antes do previsto e cada minuto agora altera o que ainda é possível.", audioPath: audio("vega", "MEDIA-OMN-VEGA-02"), portraitPath: portrait("vega"), theme: "vega", requiresCompletion: false, completionRule: "host_or_transcript", status: "not_recorded" },
  { code: "MEDIA-OMN-VOSS-01", characterSlug: "voss", characterName: "Adrian Voss", role: "Anfitrião da Mansão Vesper", kind: "incoming_call", title: "Chamada criptografada", transcript: "Orion lhes contou quem criou o Atlas? Entreguem a chave e apenas trocarão o nome do homem no controle.", audioPath: audio("voss", "MEDIA-OMN-VOSS-01"), portraitPath: portrait("adrian-voss"), theme: "voss", requiresCompletion: true, completionRule: "host_or_transcript", status: "not_recorded" },
  { code: "MEDIA-OMN-SOFIA-01", characterSlug: "sofia", characterName: "Sofia Vale", role: "Arquivista infiltrada", kind: "recording", title: "Cisne Branco", transcript: "Se vocês encontraram esta gravação, ainda existe uma chance. Confirmem o Cisne Branco antes de confiar em qualquer pessoa dentro da mansão.", audioPath: audio("sofia", "MEDIA-OMN-SOFIA-01"), portraitPath: portrait("sofia-vale"), theme: "sofia", requiresCompletion: true, completionRule: "host_or_transcript", status: "not_recorded" },
  { code: "MEDIA-OMN-ORION-PAST", characterSlug: "orion", characterName: "Orion", role: "Contratante da operação", kind: "revelation", title: "O primeiro Atlas", transcript: "Sim, eu participei do primeiro Atlas. Eu construí uma ferramenta. Voss construiu um mercado em torno dela. Terminem a missão e terão oportunidade de fazer perguntas.", audioPath: audio("orion", "MEDIA-OMN-ORION-PAST"), portraitPath: portrait("orion"), theme: "orion", requiresCompletion: false, completionRule: "host_or_transcript", condition: { flag: "orion_past_discovered", equals: true }, status: "not_recorded" },
  { code: "MEDIA-OMN-END-01", characterSlug: "orion", characterName: "Orion", role: "Contratante da operação", kind: "epilogue", title: "O Novo Atlas", transcript: "Voss perdeu o controle. O Atlas, agora, pertence a alguém que sabe exatamente como usá-lo.", audioPath: audio("orion", "MEDIA-OMN-END-01"), portraitPath: portrait("orion"), theme: "orion", requiresCompletion: false, completionRule: "host_or_transcript", status: "not_recorded" },
  { code: "MEDIA-OMN-END-02", characterSlug: "vega", characterName: "Vega", role: "Coordenadora operacional", kind: "epilogue", title: "Transparência Brutal", transcript: "O arquivo foi liberado. A verdade veio à luz, mas ninguém conseguiu controlar o que ela atingiu.", audioPath: audio("vega", "MEDIA-OMN-END-02"), portraitPath: portrait("vega"), theme: "vega", requiresCompletion: false, completionRule: "host_or_transcript", status: "not_recorded" },
  { code: "MEDIA-OMN-END-03", characterSlug: "sofia", characterName: "Sofia Vale", role: "Arquivista infiltrada", kind: "epilogue", title: "Cinzas", transcript: "A chave deixou de existir. Talvez ninguém controle o Atlas novamente. Talvez ninguém descubra tudo o que foi perdido.", audioPath: audio("sofia-vale", "MEDIA-OMN-END-03"), portraitPath: portrait("sofia-vale"), theme: "sofia", requiresCompletion: false, completionRule: "host_or_transcript", status: "not_recorded" },
  { code: "MEDIA-OMN-END-04", characterSlug: "voss", characterName: "Adrian Voss", role: "Anfitrião da Mansão Vesper", kind: "epilogue", title: "O Acordo Voss", transcript: "O acordo foi cumprido. A noite termina, mas o arquivo continua nas mãos do homem que construiu seu império sobre segredos.", audioPath: audio("voss", "MEDIA-OMN-END-04"), portraitPath: portrait("adrian-voss"), theme: "voss", requiresCompletion: false, completionRule: "host_or_transcript", status: "not_recorded" },
  { code: "MEDIA-OMN-END-05", characterSlug: "orion", characterName: "Orion", role: "Contratante da operação", kind: "epilogue", title: "Os Donos do Segredo", transcript: "A equipe manteve a chave. Pela primeira vez, o Atlas não pertenceu a Orion, Voss ou Meridian. Pertenceu àqueles que o roubaram.", audioPath: audio("orion", "MEDIA-OMN-END-05"), portraitPath: portrait("orion"), theme: "orion", requiresCompletion: false, completionRule: "host_or_transcript", status: "not_recorded" },
  { code: "MEDIA-OMN-END-06", characterSlug: "voss", characterName: "Adrian Voss", role: "Anfitrião da Mansão Vesper", kind: "defeat", title: "A Chave Errada", transcript: "A confirmação durou oito segundos. Depois, a cópia revelou tudo: a localização de vocês, o esconderijo de Orion e a verdadeira chave nas mãos do comprador.", audioPath: audio("voss", "MEDIA-OMN-END-06"), portraitPath: portrait("adrian-voss"), theme: "voss", requiresCompletion: false, completionRule: "host_or_transcript", status: "not_recorded" },
  { code: "MEDIA-OMN-END-07", characterSlug: "vega", characterName: "Vega", role: "Coordenadora operacional", kind: "defeat", title: "Doze Minutos", transcript: "A operação terminou exatamente como eu temia. Doze minutos foram suficientes para a mansão fechar todas as saídas.", audioPath: audio("vega", "MEDIA-OMN-END-07"), portraitPath: portrait("vega"), theme: "vega", requiresCompletion: false, completionRule: "host_or_transcript", status: "not_recorded" },
];

export function getTransmission(code: string) { return transmissions.find((item) => item.code === code); }
