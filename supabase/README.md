# Supabase

1. Crie um projeto Supabase.
2. Copie a URL e a chave anon para `.env.local`.
3. Execute `supabase db push` ou aplique todas as migrations, em ordem, no SQL Editor.
4. Execute `seed.sql` somente em desenvolvimento.
5. Gere tipos com `npx supabase gen types typescript --project-id <id> > src/types/database.ts`.

A service role é exclusivamente server-side. O hash da licença e os timers críticos devem ser manipulados por rotas/ações de servidor.
Nao aplique migrations em um projeto que contenha tabelas desconhecidas sem
backup e auditoria. A migration `202607300005_commerce_abacatepay.sql` deve ser
seguida por `202607300006_service_role_privileges.sql` antes de testar
`/api/checkout`.
