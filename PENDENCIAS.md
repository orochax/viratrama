# Pendencias tecnicas

Atualizado em 30 de julho de 2026.

## Partida

- [x] Ativacao, Supabase Auth, biblioteca e criacao de sala real.
- [x] Entrada sem conta, cookie de reentrada, aparelho proprio e codigo compartilhado.
- [x] Funcoes, revelacao privada, delegacao, presenca, pausa e reconexao.
- [x] Motor autoritativo, versao otimista, idempotencia e auditoria.
- [x] Orion antes de Vega, transcricao sem MP3 e historico sem efeitos repetidos.
- [x] Tres rotas, grafo, inventario, puzzles, pistas, voto, desempate, extracao e sete finais.
- [x] Resultado, epilogo e reorganizacao obrigatoria do kit.
- [x] Dashboard, Realtime, fallback HTTP, estados offline e navegacao mobile.
- [x] Planta-puzzle, transparencia, prova digital e marcadores frente/verso.
- [x] Lint, TypeScript, 32 testes unitarios, build e 14 testes Playwright.

## Comercio

- [x] Modelar pedidos, itens, cliente, endereco, pagamento e entrega na migration de comercio.
- [x] Integrar Checkout hospedado v2 da AbacatePay com PIX, cartao e reconciliacao.
- [x] Processar webhook assinado e idempotente para pagamento, disputa e reembolso.
- [x] Entregar licenca criptografada somente depois do pagamento aprovado.
- [x] Validar produtos, disponibilidade, quantidade e precos no servidor.
- [ ] Aplicar a migration de comercio no Supabase auditado e executar compra completa em Dev mode.
- [ ] Integrar calculo de frete, estoque por kit e emissao fiscal antes da producao.
- [ ] Adicionar tela administrativa para postagem, rastreio e reembolso.
- [ ] Configurar e-mail transacional para confirmacao e recuperacao do link do pedido.

## Operacao futura

- [ ] Atualizar Next/PostCSS/Sharp quando houver versao compativel que encerre os
  advisories atuais; `npm audit --omit=dev` reporta 3 vulnerabilidades altas e sugere
  um downgrade incorreto do Next, que nao deve ser aplicado.
- [ ] Adicionar observabilidade de producao, alertas e politica de retencao de logs.
- [ ] Criar testes de carga para muitos canais Realtime simultaneos.
- [ ] Adicionar exportacao administrativa de eventos e resultados anonimizados.

Tudo que exige banco remoto, credencial, voz, grafica, aparelho real ou decisao
comercial esta em [PENDENCIAS_MANUAIS.md](./PENDENCIAS_MANUAIS.md).
