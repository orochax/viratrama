# Edge/server functions

As ações críticas devem ser implementadas como rotas de servidor ou Edge Functions: `activate-license`, `create-session`, `join-session`, `advance-step`, `submit-vote`, `submit-puzzle`, `request-hint`, `trigger-alarm`, `pause-session`, `abandon-session` e `restore-kit`.

Todas devem validar o usuário, a associação com a sessão, a versão da história, a transição de estado e a idempotency key antes de escrever eventos.
