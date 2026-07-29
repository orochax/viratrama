# Pendências manuais restantes

O sistema técnico de transmissões, o catálogo, o painel administrativo, a documentação e o fallback por transcrição foram implementados. Permanecem somente tarefas que exigem produção ou aprovação humana:

## Banco remoto

- Aplicar no Supabase remoto a migration `supabase/migrations/202607260003_audio_transmissions.sql`. O arquivo está pronto e validado localmente, mas a CLI deste ambiente não possui a senha/token de banco necessário para executar `supabase db push`.

## Mídias finais

- Gerar os retratos usando os prompts em `docs/MISSOES/OPERACAO_DA_MEIA_NOITE/IDENTIDADE_VISUAL/PERSONAGENS/`.
- Escolher e aprovar uma imagem oficial para cada personagem.
- Registrar seeds/referências e enviar os retratos ao bucket privado `game-media`.
- Gravar as vozes de Orion, Vega, Adrian Voss, Sofia e demais personagens necessários.
- Editar, normalizar e aprovar os áudios.
- Gerar e revisar as legendas WebVTT.
- Enviar os áudios pelo painel `/admin/midias`.

## Produção física e validação

- Produzir e imprimir caixa, envelopes, documentos, mapa, cartas, marcadores e Chaves Atlas.
- Definir e gerar o QR Code físico definitivo.
- Fazer playtest presencial com 3 a 6 jogadores.
- Conferir duração, clareza, volume, dificuldade, sincronização e acessibilidade em celulares reais.

## Operação comercial

- Gerar licenças reais somente após validar o fluxo administrativo.
- Configurar backups, retenção e recuperação do Supabase.
- Decidir domínio próprio definitivo, se desejado.

Não há pendência técnica conhecida que impeça o sistema de funcionar com transcrições e placeholders enquanto as mídias finais são produzidas.
