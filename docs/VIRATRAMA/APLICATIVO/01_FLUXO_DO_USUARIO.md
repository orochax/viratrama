# Fluxo do usuario

1. O comprador escolhe a versao, informa seus dados e conclui o pagamento no
   Checkout hospedado da AbacatePay.
2. O webhook confirma o pedido e gera uma licenca comercial
   `OMN-XXXXXXXX-XXXXXXXX`.
3. A pagina protegida do pedido apresenta a chave; o comprador abre `/ativar`
   e vincula a licenca.
4. No primeiro uso cria nome, e-mail e senha. Depois usa somente e-mail e senha.
5. A biblioteca cria uma sala aleatoria de seis caracteres ou retoma a ativa.
6. O anfitriao compartilha `/sala/CODIGO` ou o QR correspondente.
7. Participantes entram sem conta, escolhem aparelho proprio ou compartilhado e confirmam presenca.
8. Com 3 a 6 confirmados, o anfitriao distribui as funcoes.
9. Cada aparelho revela apenas sua funcao e missao; todos confirmam o briefing.
10. Orion abre a partida. Vega fala somente depois da conclusao de Orion.
11. O servidor conduz inventario, rota, movimentos, conversas, puzzles, alarme, voto e extracao.
12. O resultado apresenta somente o final alcancado e seu epilogo.
13. A licenca fica bloqueada ate o anfitriao conferir os envelopes abertos.

Refresh, retorno ao link ou troca de pagina sempre recarregam o snapshot persistido.
Realtime apenas notifica; o snapshot HTTP continua sendo a fonte de verdade.
