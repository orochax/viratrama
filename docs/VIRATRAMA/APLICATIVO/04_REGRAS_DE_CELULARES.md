# Regras de celulares

- O anfitriao usa conta Supabase e tambem recebe uma funcao.
- Participantes nao criam conta. Um token aleatorio fica em cookie `httpOnly`; apenas
  o SHA-256 e salvo no jogador.
- O modo proprio mantem funcao, missao e voto naquele aparelho.
- O modo compartilhado emite um codigo pessoal temporario. Conteudo privado deve ser
  fechado antes de passar o aparelho.
- Somente o aparelho do anfitriao reproduz uma transmissao coletiva com som.
- Outros aparelhos recebem estado e progresso por Supabase Realtime.
- A perda de Realtime ativa sincronizacao HTTP; acoes criticas ficam bloqueadas offline.
- `last_seen_at` e renovado em janela de 20 segundos, sem escrita por segundo.
- O cliente nunca escolhe `playerId`, `sessionId`, host ou funcao com autoridade.
