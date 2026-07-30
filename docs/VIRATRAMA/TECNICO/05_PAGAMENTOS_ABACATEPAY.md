# Pagamentos com AbacatePay

## Arquitetura

O carrinho permanece no navegador apenas para navegacao. `POST /api/checkout`
recebe slug, formato e quantidade, consulta o catalogo do servidor e rejeita
produto indisponivel. Preco, ID da AbacatePay e total nunca sao aceitos do
navegador.

O servidor cria o pedido no Supabase antes de chamar a API v2, cadastra o
cliente, cria um Checkout `PIX` + `CARD` e usa o UUID do pedido como
`externalId`. A URL de conclusao contem um token aleatorio; somente o hash
desse token fica no banco.

## Confirmacao

`POST /api/webhooks/abacatepay` exige:

- `webhookSecret` igual a `ABACATEPAY_WEBHOOK_SECRET`;
- assinatura HMAC-SHA256 valida em `X-Webhook-Signature`;
- evento de Checkout v2 suportado;
- `externalId`, Checkout e valor iguais ao pedido.

O ID do evento e chave primaria em `payment_events`. A funcao
`process_abacate_checkout_event` registra o evento, atualiza o pedido e cria
uma licenca por unidade na mesma transacao.

Os codigos comerciais usam `OMN-XXXXXXXX-XXXXXXXX`. O banco guarda o hash para
ativacao e uma copia AES-256-GCM criptografada para entrega na pagina do
pedido. A chave fica em `LICENSE_ENCRYPTION_KEY`.

## Variaveis

```env
ABACATEPAY_API_KEY=
ABACATEPAY_DIGITAL_PRODUCT_ID=
ABACATEPAY_PHYSICAL_PRODUCT_ID=
ABACATEPAY_WEBHOOK_SECRET=
LICENSE_ENCRYPTION_KEY=
```

Nenhuma dessas variaveis pode usar o prefixo `NEXT_PUBLIC_`.

## Webhook

Depois de publicar o site em HTTPS, cadastre:

```text
https://DOMINIO/api/webhooks/abacatepay
```

Use o mesmo valor de `ABACATEPAY_WEBHOOK_SECRET` no cadastro e assine:

- `checkout.completed`
- `checkout.refunded`
- `checkout.disputed`
- `checkout.lost`

Em desenvolvimento, encaminhe o listener oficial para:

```text
http://localhost:3000/api/webhooks/abacatepay?webhookSecret=SEU_SECRET
```

## Homologacao

1. Audite o Supabase e aplique as nove migrations em ordem.
2. Confirme que a chave e os produtos AbacatePay estao no mesmo ambiente Dev mode.
3. Garanta `CHECKOUT:CREATE`, `CHECKOUT:READ`, `CUSTOMER:CREATE`,
   `CUSTOMER:READ` e `PRODUCT:READ` na chave de homologacao.
4. Compre uma versao digital e uma fisica.
5. Confirme `orders`, `payment_events`, `licenses` e `license_deliveries`.
6. Repita o mesmo webhook e confirme que nenhuma segunda licenca foi criada.
7. Simule reembolso e confirme que a licenca ficou `revoked`.

Frete, estoque fisico, postagem, e-mail e emissao fiscal continuam bloqueios
para producao.
