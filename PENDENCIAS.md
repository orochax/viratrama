# Pendências técnicas

Atualizado em 29 de julho de 2026.

Este arquivo registra trabalho que pode ser executado dentro do projeto. Decisões,
credenciais, produção de mídia, fabricação e configurações externas estão em
[PENDENCIAS_MANUAIS.md](./PENDENCIAS_MANUAIS.md).

## Estado confirmado

- [x] Landing page e página de produto responsivas.
- [x] Galeria de produto, história expansível e seção de conteúdo da caixa.
- [x] Formatos físico + digital e digital com preços de R$ 119,90 e R$ 59,90.
- [x] Seleção de formato, persistência local do carrinho e estado visual para formato indisponível.
- [x] Retratos dos sete personagens usados na loja.
- [x] Doze avatares de função e seis avatares padrão usados na página da missão.
- [x] Identidade da Chave Atlas, imagens de produto, banner principal e primeira imagem de transmissão da Vega.
- [x] Estrutura inicial do Supabase, motor narrativo, catálogo de transmissões, painel de mídia e testes básicos.

## Bloqueadores para produção

### Comércio

- [ ] Criar modelo persistente de pedidos, itens, clientes, endereços e status de pagamento.
- [ ] Integrar checkout e provedor de pagamento após a decisão comercial registrada nas pendências manuais.
- [ ] Calcular subtotal, total, frete e eventuais descontos no servidor; hoje o carrinho usa `localStorage`.
- [ ] Implementar estoque e frete da edição física.
- [ ] Implementar entrega da edição digital e vinculação da licença à conta compradora.
- [ ] Garantir idempotência de pagamento, confirmação por webhook, cancelamento e reembolso.

### Conta, licença e biblioteca

- [ ] Substituir as telas informativas de cadastro, entrada, recuperação de senha e conta por Supabase Auth real.
- [ ] Trocar a ativação demonstrativa por validação de licença no servidor; a tela atual aceita qualquer código preenchido.
- [ ] Conectar biblioteca e conta a licenças, compras e sessões reais.
- [ ] Implementar geração, ativação, revogação e reutilização de licenças com auditoria.

### Partida

- [ ] Substituir as rotas que ainda usam `PlaceholderPage` por fluxos funcionais.
- [ ] Criar e entrar em salas reais, persistindo anfitrião, jogadores e modos de dispositivo.
- [ ] Integrar sorteio e escolha manual de funções, avatares masculino/feminino e revelação privada.
- [ ] Conectar briefing, decisões, rotas, puzzles, pistas, inventário, mensagens, mapa, timers e finais ao estado da sessão.
- [ ] Implementar presença, reconexão, pausa, retomada, delegação e aparelho compartilhado com Supabase Realtime.
- [ ] Validar no servidor todas as transições e condições narrativas; a interface não deve ser a fonte de verdade.

### Administração e Supabase

- [ ] Transformar histórias, licenças e documentação administrativa em telas reais; atualmente são apresentações estáticas.
- [ ] Concluir autorização administrativa e auditoria em todas as rotas `/api/admin/*`.
- [ ] Criar migration para o bucket privado `game-media` e suas políticas, se ele ainda depender de criação manual.
- [ ] Validar as três migrations em um banco vazio e revisar RLS com usuários anfitrião, jogador e administrador.
- [ ] Criar `.env.example` sem segredos; o README atualmente orienta copiar um arquivo que não existe.
- [ ] Adicionar validação explícita das variáveis de ambiente de produção.

## Conteúdo e mídia

- [ ] Atualizar os arquivos `REFERENCIA_DE_CONSISTENCIA.md`: as imagens existem, mas ainda constam como pendentes.
- [ ] Registrar nos manifestos o retrato aprovado e a referência de geração de cada personagem.
- [ ] Produzir as imagens de transmissão que ainda não existem; somente `VEGA_TRANSMISSAO_01` está integrada.
- [ ] Substituir transmissões `not_recorded` por áudio, retrato e legenda aprovados.
- [ ] Revisar o pacote exato entregue na edição digital e refletir isso na página de produto.

## Qualidade e lançamento

- [ ] Adicionar testes do carrinho para formatos, preços, migração do armazenamento e itens indisponíveis.
- [ ] Cobrir autenticação, compra, ativação, criação de sala e uma partida completa com testes E2E.
- [ ] Fazer testes de permissão e isolamento entre sessões no Supabase.
- [ ] Validar acessibilidade por teclado, leitor de tela, legendas e contraste nas rotas da partida.
- [ ] Configurar observabilidade, tratamento de erros e política de retenção de logs.
- [ ] Executar uma revisão final mobile em aparelhos reais depois da integração de produção.

As ações que dependem do Supabase remoto, aprovações, fornecedores ou produção
humana não devem ser marcadas como concluídas aqui.
