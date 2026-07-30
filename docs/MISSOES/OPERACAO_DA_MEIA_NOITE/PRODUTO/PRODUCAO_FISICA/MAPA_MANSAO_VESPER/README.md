# Mapa da Mansao Vesper

## Arquivos

- `MAPA_MANSAO_VESPER_BASE.png`: arte-base original em 1254 x 1254 px.
- `MAPA_MANSAO_VESPER_IMPRESSAO_50CM.png`: versao recomendada para tabuleiro de 50 x 50 cm, com margem externa de seguranca, em 6250 x 6250 px.

## Uso fisico recomendado

- Imprimir o tabuleiro em 50 x 50 cm, montado em papel-cartao ou tabuleiro dobravel.
- Usar marcadores circulares de retrato entre 18 e 20 mm.
- Reservar os retratos completos para as cartas de funcao; no mapa, usar apenas o recorte do rosto e a cor da funcao.
- Fazer um teste real com seis marcadores de equipe, cinco NPCs, dois marcadores de seguranca e o marcador Atlas antes de fabricar em escala.
- Nao imprimir setas de rota na planta principal. O aplicativo informa origem e destino, e os jogadores confirmam o movimento depois de posicionar os marcadores.

Este arquivo e o mapa operacional completo usado para movimentacao. A planta
oficial incompleta e a transparencia do puzzle PZ-02 continuam sendo pecas A3
separadas do Envelope 02. Elas devem reaproveitar a mesma linguagem visual, mas
nao podem ser substituidas por este mapa completo.

## Grafo canonico de movimento

- Social: Portao Principal -> Recepcao -> Salao de Mascaras -> Galeria -> Biblioteca.
- Servico: Entrada de Servico -> Cozinha -> Adega -> Ala Tecnica -> Biblioteca.
- Tecnica: Acesso ao Subsolo -> Sala de Sistemas -> Tunel Tecnico -> Ala Tecnica -> Biblioteca.
- Convergencia: Biblioteca -> Corredor Restrito -> Camara Atlas.
- Central de Seguranca: conectada a Ala Tecnica e Corredor Restrito.
- Extracao: Portao Principal, Garagem e Jardins.
- Escritorio de Voss: ambiente opcional de informacao, proposta e passagem de extracao.

O grafo do aplicativo e a planta fisica devem ser validados juntos. A arte nao deve ser usada como unica fonte das regras de adjacencia.

## Prompt final da arte-base

```text
Use case: infographic-diagram
Asset type: premium printable square board-game map and architectural floor plan
Primary request: create a complete top-down operational floor plan of the fictional Mansao Vesper for a physical investigative board game. It must function as a movement board for 3 to 6 players using round 20 mm portrait tokens plus NPC and security tokens.
Scene/backdrop: a perfectly square 1:1 print composition on warm pale stone-paper, with a thin dark outer border, subtle archival texture, and generous safe margins.
Style/medium: precise orthographic architectural ink drawing, premium espionage dossier aesthetic, realistic floor-plan logic, crisp vector-like linework, restrained Art Deco details. High contrast and highly legible when printed. No perspective, no isometric view, no photorealistic rooms.
Composition/framing: one coherent mansion and grounds viewed exactly from above. Use large uncluttered movement zones rather than tiny realistic rooms. Every playable zone must have enough open floor area for six 20 mm portrait tokens. Doors and corridors must make adjacency unambiguous.
Required areas: Portao Principal, Recepcao, Salao de Mascaras, Galeria, Biblioteca, Entrada de Servico, Cozinha, Adega, Ala Tecnica, Acesso ao Subsolo, Sala de Sistemas, Tunel Tecnico, Central de Seguranca, Corredor Restrito, Escritorio de Voss, Camara Atlas, Garagem and Jardins.
Gameplay details: two security patrol starting circles; one Atlas objective circle inside Camara Atlas; discreet door symbols; wide corridors; no grids; no numbered spaces; no characters or tokens on the board.
Typography: condensed architectural sans serif, horizontal labels, large and readable, each label exactly once.
Constraints: functional token space is more important than architectural realism; print-safe contrast; square 1:1; no cropped rooms; no route arrows; no hidden passage; no illegible microtext; no compass puzzle answer; no real addresses; no logos; no watermark.
Avoid: isometric perspective, 3D cutaway, dark full-bleed black background, ornate furniture clutter, stair mazes, people, cars, fantasy castle style, extra rooms, misspelled text and duplicate labels.
```
