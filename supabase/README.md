# Supabase

1. Crie um projeto Supabase.
2. Copie a URL e a chave anon para `.env.local`.
3. Execute `supabase db push` ou aplique `migrations/202607260001_foundation.sql` no SQL Editor.
4. Execute `seed.sql` somente em desenvolvimento.
5. Gere tipos com `npx supabase gen types typescript --project-id <id> > src/types/database.ts`.

A service role é exclusivamente server-side. O hash da licença e os timers críticos devem ser manipulados por rotas/ações de servidor.
