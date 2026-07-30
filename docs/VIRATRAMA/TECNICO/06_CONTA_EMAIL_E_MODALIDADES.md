# Conta, e-mail e modalidades

## Autenticacao

O cadastro usa Supabase Auth e redireciona confirmações para `/auth/callback`.
O SMTP do projeto Supabase precisa usar um remetente verificado. A recuperação
usa `/redefinir-senha` e nunca revela se um e-mail existe.

## Pedidos de visitante

Pedidos sem conta continuam protegidos pelo token original do checkout. Depois
do pagamento, a aplicação cria um token adicional de confirmação/recuperação,
armazenado somente como hash em `order_claim_tokens`. O link pode abrir o pedido,
mostrar a licença e vincular a compra a uma conta cujo e-mail esteja confirmado.

## E-mails

`RESEND_API_KEY` e `EMAIL_FROM` habilitam a entrega transacional. Sem essas
variáveis, o modo `preview` registra o destinatário e o assunto no servidor,
mas não simula entrega ao cliente. Em produção, use `EMAIL_DELIVERY_MODE=strict`.
Cada envio possui uma chave idempotente em `email_deliveries`.

## Modalidade da partida

Uma licença digital permite somente `digital`. Uma licença física + digital
permite `digital` e `hybrid`. A escolha é feita no momento de criar a sala e é
persistida em `game_sessions.play_mode`.
