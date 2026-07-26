# Operação da Meia-Noite: A Chave Atlas

Aplicativo web mobile-first para um jogo narrativo híbrido de suspense. A fundação atual inclui landing, história, ativação demo, lobby de sala e um motor determinístico testado.

## Executar localmente

Requer Node.js 20+ e npm.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

## Verificações

```bash
npm run lint
npm run build
npm test
```

O Supabase será configurado com Auth, PostgreSQL, RLS, Realtime e Storage privado. Não coloque `SUPABASE_SERVICE_ROLE_KEY` no cliente. O fluxo de produção, migrations e seed estão planejados em `TASKS.md`; credenciais não são inventadas neste repositório.

## Documentação

Consulte `docs/00_INDICE_GERAL.md` e `PENDENCIAS.md`. Assets futuros devem preservar os códigos `MEDIA-OMN-*` e os códigos físicos definidos no livro do jogo.
