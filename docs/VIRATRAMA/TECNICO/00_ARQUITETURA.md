# Arquitetura

Next.js App Router entrega páginas e ações de servidor. Supabase fornece Auth, PostgreSQL, Realtime e Storage privado. O motor narrativo recebe um estado, verifica condições em uma lista fechada de operadores e produz efeitos idempotentes persistíveis; `eval` é proibido.

O servidor é autoritativo para decisões críticas, timers e transições. O cliente pode exibir um contador local temporário, mas reconcilia sempre pelo deadline persistido.
