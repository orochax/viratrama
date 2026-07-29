# Pendências manuais restantes

Atualizado em 29 de julho de 2026.

Este arquivo contém somente ações que exigem decisão humana, credenciais,
serviços externos, gravação ou fabricação. Implementação no código está em
[PENDENCIAS.md](./PENDENCIAS.md).

## Já resolvido

- [x] Retratos base dos sete personagens foram gerados e integrados.
- [x] Doze avatares das seis funções foram gerados e os padrões foram definidos.
- [x] A terceira variação da Chave Atlas foi escolhida e possui prompt mestre.
- [x] O terceiro banner vertical foi escolhido para a landing page.
- [x] Os preços exibidos foram definidos: R$ 119,90 para físico + digital e R$ 59,90 para digital.

## Supabase remoto e credenciais

- [ ] Confirmar se o projeto remoto contém somente o schema da ViraTrama. Como SQL de outro projeto já foi executado nele, comparar tabelas e migrations antes de aplicar qualquer mudança.
- [ ] Fazer backup antes de remover objetos estranhos; se a separação não for segura, usar um projeto Supabase novo.
- [ ] Comparar o histórico remoto com as migrations `202607260001`, `202607260002` e `202607260003` e aplicar somente as ausentes, na ordem.
- [ ] Criar ou confirmar o bucket privado `game-media`.
- [ ] Configurar URLs de autenticação, e-mails transacionais e política de senha no Supabase Auth.
- [ ] Cadastrar no ambiente de hospedagem as variáveis públicas e segredos sem enviá-los ao Git.

## Identidade visual e mídia

- [ ] Aprovar formalmente o retrato oficial de cada personagem e registrar ferramenta, seed ou referência de geração quando disponível.
- [ ] Aprovar as imagens finais usadas nas transmissões; atualmente somente a primeira transmissão da Vega possui imagem própria.
- [ ] Definir elenco ou solução de voz para Orion, Vega, Adrian Voss, Sofia Vale e demais falas.
- [ ] Gravar, editar, normalizar e aprovar todos os áudios listados no manifesto.
- [ ] Gerar e revisar as legendas WebVTT.
- [ ] Enviar áudio, retrato e legenda finais pelo painel `/admin/midias`.

## Produto físico e playtest

- [ ] Produzir um protótipo de caixa, envelopes, documentos, mapa, cartas, marcadores e seis Chaves Atlas.
- [ ] Escolher gráfica, materiais, acabamentos, tiragem inicial e controle de qualidade.
- [ ] Definir a URL de produção antes de gerar e imprimir o QR Code definitivo.
- [ ] Fazer playtests presenciais com 3, 4, 5 e 6 jogadores.
- [ ] Registrar duração, dificuldade, clareza das instruções, volume, falhas de sincronização e itens recolocados incorretamente.
- [ ] Validar o jogo em celulares Android e iPhone reais, incluindo aparelhos compartilhados.

## Operação comercial

- [ ] Validar margem, impostos, embalagem e frete dos preços de R$ 119,90 e R$ 59,90.
- [ ] Confirmar quais formatos estarão disponíveis no lançamento; o catálogo atualmente deixa os dois selecionáveis.
- [ ] Definir exatamente os arquivos, licença e condições de acesso da edição digital.
- [ ] Escolher provedor de pagamento, transportadora ou intermediador de frete e política de estoque.
- [ ] Definir emissão fiscal, atendimento, troca, cancelamento e reembolso.
- [ ] Publicar termos de uso, política de privacidade, política de cookies e tratamento LGPD.

## Publicação e operação

- [ ] Escolher hospedagem e domínio definitivo.
- [ ] Configurar ambiente de produção, DNS, e-mail do domínio e monitoramento.
- [ ] Configurar backups, retenção e teste de recuperação do Supabase.
- [ ] Gerar licenças reais somente depois de validar compra, ativação e fluxo administrativo.
- [ ] Realizar uma rodada fechada de lançamento antes de abrir vendas.

O site pode continuar sendo demonstrado localmente com conteúdo e transcrições,
mas compra, licenciamento e partida ainda não devem ser tratados como operação
de produção.
