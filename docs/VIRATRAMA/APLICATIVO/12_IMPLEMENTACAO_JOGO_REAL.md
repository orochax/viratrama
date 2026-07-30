# Implementacao da partida real

## Fonte de verdade

- Catalogo: `src/content/operation-midnight/canonical.ts`.
- Executor puro: `src/features/story-engine/runtime.ts`.
- Persistencia e DTO privado: `src/lib/game/session-service.ts`.
- API: `src/app/api/rooms`.
- Interface: `RoomProvider`, `RoomScreens`, `GameShell` e `LiveDashboard`.

## Seguranca

- Host e resolvido por `auth.getUser()`.
- Convidado e resolvido pelo hash do cookie `vt_room_{CODIGO}`.
- A API ignora qualquer identidade enviada no corpo.
- Puzzles sao validados apenas no servidor.
- Votos finais individuais e alternativas futuras nao entram no snapshot.
- Deadline policial nao entra no JSON antes de `police_eta_known`.

## Concorrencia e reconexao

- Cada sessao possui `version`.
- Cada comando possui chave idempotente.
- O commit usa comparacao de versao no banco.
- Depois do commit, Realtime envia apenas a nova versao.
- Todo aparelho recarrega o snapshot filtrado; polling recupera canais perdidos.

## Verificacao local

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

As migrations devem ser aplicadas primeiro em um Supabase isolado ou previamente
auditado. Nao aplique automaticamente sobre o projeto remoto contaminado por SQL de
outro produto.
