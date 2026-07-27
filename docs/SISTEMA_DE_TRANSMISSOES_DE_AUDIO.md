# Sistema de transmissões de áudio

O jogo utiliza transmissões sonoras com retratos cinematográficos, legendas e transcrição. O componente `NarrativeTransmission` pode tocar em modo coletivo no aparelho do anfitrião ou individualmente com fones. O avanço narrativo é confirmado pelo servidor e pode ocorrer pelo fim do áudio ou pela confirmação explícita da transcrição.

## Fluxo

1. A história seleciona um código de mídia conforme as flags.
2. A tela apresenta personagem, função, retrato e estado de conexão.
3. O anfitrião inicia o áudio por interação explícita.
4. A legenda e o progresso aparecem em todos os aparelhos.
5. O servidor registra início, pausa, falha, conclusão ou transcrição confirmada.
6. O efeito idempotente libera a etapa seguinte.

## Produção

Use `docs/IDENTIDADE_VISUAL_PERSONAGENS/` para gerar e aprovar retratos. Use `docs/ROTEIROS_DE_AUDIO/` para gravar as falas. O painel `/admin/midias` prepara upload privado para o bucket `game-media` e registra os metadados em `media_assets`.

## Segurança

O bucket é privado. URLs assinadas e uploads administrativos são emitidos no servidor. O cliente não recebe service role. A migration `202607260003_audio_transmissions.sql` cria os eventos idempotentes e amplia os metadados de mídia.

## Fallback

Mídia ausente ou falha de rede não trava a sessão: o jogador abre a transcrição e confirma a leitura. A confirmação fica registrada como evento separado de uma conclusão por áudio.

## Limitação conhecida

Os arquivos reais de áudio e as imagens oficiais ainda precisam ser produzidos e enviados manualmente. O código, catálogo, painel, segurança e documentação estão preparados para recebê-los.
