# Estados da partida

`draft -> lobby -> role_assignment -> role_reveal -> prologue -> active ->
paused -> active -> final_decision -> active -> completed`

`abandoned` encerra uma sala por operacao administrativa.

- `lobby`: aceita entrada e confirmacao.
- `role_assignment`: janela transacional de distribuicao.
- `role_reveal`: conteudo individual e prontidao.
- `prologue`: Orion, Vega, Envelope 00 e equipamento.
- `active`: rotas, movimentos, puzzles, conversas e extracao.
- `paused`: congela progressao narrativa; o deadline policial nao muda.
- `final_decision`: voto selado, segundo turno e desempate do Observador.
- `completed`: estado imutavel da historia, resultado e reorganizacao.

Cada comando inclui `Idempotency-Key`. A funcao `claim_session_version` aceita a
mudanca somente se a versao esperada ainda for atual. Todo sucesso gera `game_events`.
