# Storage e midias

Bucket: `game-media`, privado.

Path de audio:

`operation-midnight/characters/{personagem}/audio/{codigo-em-minusculas}.mp3`

Fluxo:

1. Abra `/admin/midias`.
2. Localize o codigo, por exemplo `MEDIA-OMN-ORION-01`.
3. Envie MP3, preferencialmente 44.1 ou 48 kHz, 128 a 192 kbps.
4. Confira duracao, retrato e transcricao integral.
5. Teste em celular e aprove o asset.
6. A API emite URL assinada por 300 segundos somente para sala autorizada.

Sem MP3 aprovado, a tela mostra retrato e transcricao e permite concluir a etapa.
Replay consulta o historico e registra `transmission_replayed`, mas nunca reaplica
efeito, pontuacao ou avancos.

Transmissao coletiva toca apenas no anfitriao. Estado, pausa e progresso sao eventos
efemeros no canal Realtime `transmission:{sessionId}`; o termino narrativo depende de
um comando autoritativo separado.
