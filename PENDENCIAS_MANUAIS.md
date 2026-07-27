# Pendências manuais restantes

Esta lista foi atualizada depois da configuração do Supabase, aplicação das migrations, criação do admin, configuração do Auth, variáveis da Vercel e publicação em `https://viratrama.vercel.app`.

## 1. Seed de desenvolvimento

Executar `supabase/seed.sql` somente se for criado um projeto separado para desenvolvimento/playtest. Não executar no projeto de produção sem uma decisão consciente.

## 2. Mídias

Ainda faltam produzir e enviar ao bucket privado `game-media`:

- `MEDIA-OMN-TRAILER`;
- `MEDIA-OMN-ORION-01`;
- `MEDIA-OMN-VEGA-01`;
- `MEDIA-OMN-VOSS-01`;
- `MEDIA-OMN-SOFIA-01`;
- `MEDIA-OMN-END-01` até `MEDIA-OMN-END-06`.

Cada mídia deve possuir capa, legenda, transcrição e fallback acessível.

## 3. Produção física

Ainda falta produzir, imprimir, conferir e embalar:

- caixa;
- cartão Comece Aqui;
- mapa e marcadores;
- cartas de função e missões;
- cartas de inventário;
- envelopes;
- documentos do dossiê;
- três Chaves Atlas;
- QR Code final;
- guia de reorganização.

Consultar `docs/PRODUCAO_FISICA/`.

## 4. Licenças reais

Gerar os códigos de licença de produção somente quando o fluxo administrativo estiver validado. Nunca usar códigos de desenvolvimento em produção.

## 5. QR Code e domínio definitivo

O endereço temporário `https://viratrama.vercel.app` já está funcionando. Ainda falta decidir se será usado um domínio próprio e, então, gerar o QR Code físico definitivo apontando para esse endereço.

## 6. Playtest presencial

Executar uma partida completa com 3 a 6 pessoas e registrar:

- duração real;
- clareza das instruções;
- dificuldade dos puzzles;
- comportamento dos timers;
- acessibilidade;
- resistência dos materiais;
- tempo de reorganização.

## 7. Backup e operação de produção

Configurar backups regulares do Supabase, política de retenção, recuperação testada e monitoramento básico da Vercel antes da venda pública.
