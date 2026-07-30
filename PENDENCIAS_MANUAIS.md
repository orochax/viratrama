# Pendencias manuais restantes

Atualizado em 30 de julho de 2026.

## Supabase remoto

- [ ] Fazer backup do projeto que recebeu SQL de outro produto.
- [ ] Auditar os objetos remotos antes de aplicar qualquer migration da ViraTrama.
- [ ] Preferir um projeto Supabase limpo se a origem das tabelas estranhas nao puder ser comprovada.
- [ ] Aplicar, em ordem, as dez migrations listadas em `docs/VIRATRAMA/TECNICO/01_BANCO_DE_DADOS.md`.
- [ ] Reaplicar `202607300002_operation_midnight_v2.sql` para popular o conteudo
  que ficou vazio quando a historia ainda nao existia.
- [ ] Confirmar o bucket privado `game-media` e suas politicas.
- [ ] Executar testes reais de RLS com anfitriao, convidado, admin e usuario externo.
- [ ] Configurar URLs de Auth, SMTP, politica de senha e variaveis da `.env.example`.

## Audios

- [ ] Gravar, editar e aprovar os MP3 do catalogo em `/admin/midias`.
- [ ] Usar o codigo exato do card como nome logico do asset.
- [ ] Conferir transcricao, retrato, duracao, volume e reproducao em Android e iPhone.
- [ ] Aprovar o asset no painel somente depois do teste.
- [ ] Produzir WebVTT quando houver direcao final de acessibilidade.

Sem esses arquivos, a partida continua completa pela transcricao.

## Prova fisica

- [ ] Imprimir mapa operacional de 50 x 50 cm e conferir escala dos marcadores.
- [ ] Imprimir `PLANTA_INCOMPLETA_A3` e `TRANSPARENCIA_CORREDORES_A3` a 100%.
- [ ] Conferir os quatro registros, legibilidade e alinhamento em mesa de luz.
- [ ] Imprimir frente e verso dos marcadores e validar corte de 20 mm.
- [ ] Fazer playtests presenciais com 3, 4, 5 e 6 jogadores.
- [ ] Registrar tempo, clareza, dificuldade, sincronizacao e reorganizacao.

## Publicacao e comercio

- [ ] Definir dominio, hospedagem, monitoramento, backup e recuperacao.
- [x] Criar os produtos fisico e digital no ambiente Dev mode da AbacatePay.
- [x] Atualizar os IDs locais com os produtos de Dev mode e conceder `PRODUCT:READ` a chave.
- [x] Aplicar `202607300005_commerce_abacatepay.sql` no Supabase.
- [x] Aplicar `202607300006_service_role_privileges.sql` no Supabase.
- [ ] Cadastrar webhook HTTPS da AbacatePay para `checkout.completed`,
  `checkout.refunded`, `checkout.disputed` e `checkout.lost`.
- [ ] Executar uma compra completa em Dev mode e confirmar pedido, evento e licenca.
- [ ] Definir frete, emissao fiscal, politica de estoque e fluxo de postagem.
- [ ] Trocar a chave Dev pela chave de producao apenas depois da homologacao.
- [ ] Configurar `RESEND_API_KEY`, `EMAIL_FROM` e `EMAIL_DELIVERY_MODE=strict`.
- [ ] Configurar SMTP, Site URL e Redirect URLs do Supabase Auth para `/auth/callback`.
- [ ] Validar confirmação de cadastro, recuperação de senha e e-mail de compra real.
- [ ] Publicar termos, privacidade, cookies e procedimento LGPD.
- [ ] Gerar licencas comerciais somente depois do checkout e do lote fisico aprovados.
