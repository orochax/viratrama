# Checklist completo de produção física por envelope

## Objetivo deste documento

Esta é a lista operacional para escrever, diagramar, imprimir, fabricar, embalar e conferir todo o material físico de **Operação da Meia-Noite: A Chave Atlas**.

Ela foi montada cruzando:

- a história comentada em `HISTORIA/REFINANDO_HISTORIA/REFINANDO_HISTORIA.md`;
- o Livro do Jogo;
- o fluxo atual de envelopes, puzzles, funções e decisões;
- os documentos já existentes em `PRODUTO/PRODUCAO_FISICA`;
- os conteúdos atuais do aplicativo.

### Legenda

| Status | Significado |
|---|---|
| **CANÔNICO** | O item ou a função dele está exigido pela história/gameplay atual. |
| **PROPOSTO** | O jogo exige essa função, mas o conteúdo exato ainda não foi escrito. A proposta abaixo fecha a lacuna. |
| **DECISÃO** | Existe contradição entre arquivos ou uma escolha de produção ainda não foi aprovada. Não enviar à gráfica antes de resolver. |

## Fluxo correto de abertura

```text
Materiais externos
    ↓
Envelope 00
    ↓
Envelope 01
    ↓
Envelope 02
    ↓
Somente um: 03A, 03B ou 03C
    ↓
Envelope 07
    ↓
Final no aplicativo ou Envelope FINAL, se aprovado
```

- Os três envelopes de rota precisam existir dentro da caixa.
- Em uma partida, apenas a rota confirmada pelo aplicativo é aberta.
- Nenhum título externo pode revelar o conteúdo ou a solução.
- O aplicativo deve registrar cada envelope aberto para orientar a reorganização.

---

## Travas obrigatórias antes da gráfica

| Nº | Divergência atual | Definição recomendada | Ação necessária |
|---|---|---|---|
| 1 | A lista mestra antiga fala em seis Chaves Atlas; a história e o arquivo específico das chaves usam A, B e C. | Produzir **três** dispositivos: A, B e C. | Remover qualquer referência a seis chaves no texto final e no aplicativo. |
| 2 | A história abre o Envelope 02 antes da escolha da rota; o conteúdo do aplicativo já descreveu o 02 como posterior à escolha. | O Envelope 02 vem **antes** da rota e contém planejamento, inventário e os puzzles `2317` e `JANUS`. | Corrigir a ordem no conteúdo do aplicativo. |
| 3 | A interface usa Infiltrador, Técnica, Observador, Negociadora, Motorista e Analista; a história usa nomes mecânicos diferentes. | Manter os nomes visíveis da interface e mapear cada um para uma responsabilidade narrativa. | Aprovar a tabela de funções do Envelope 00 e aplicar os mesmos nomes no site, app e impressos. |
| 4 | A história possui quatro puzzles (`CISNE`, `2317`, `JANUS`, `ATLAS-B`), mas o conteúdo inicial do app possui apenas dois puzzles de protótipo. | Os quatro puzzles comentados são a base de produção. | Implementar e testar os quatro no aplicativo antes de imprimir as pistas. |
| 5 | A história exige oito itens de inventário, mas só define claramente convite, credencial, uniforme, recurso médico e rota de fuga. | Usar os oito itens propostos neste documento. | Escrever efeitos, quantidade de usos e etapas válidas no aplicativo. |
| 6 | A lista física menciona um Envelope FINAL, mas a história encerra pelo aplicativo. | Usar o Envelope FINAL com epílogos codificados apenas se ele melhorar o teste de mesa. | Aprovar ou remover esse envelope antes de fechar a caixa. |
| 7 | Os nomes dos finais diferem entre a história refinada e o Livro do Jogo. | Adotar os nomes da história refinada ou criar uma tabela oficial de equivalência. | Travar os sete resultados antes de imprimir cartas finais. |
| 8 | As seis missões secretas não estão consolidadas em um único arquivo. | Usar as seis missões relacionadas no Envelope 00. | Definir condições exatas de conclusão e pontuação no aplicativo. |
| 9 | A lista antiga pede um marcador de Vega, mas a história mantém a coordenadora fora da mansão. | Não usar Vega no mapa; produzir marcadores de segurança para os guardas que realmente se movimentam. | Atualizar o arquivo de mapa após validar a quantidade de guardas no app. |

---

# 1. Materiais fora dos envelopes

Estes itens ficam na caixa, mas não pertencem a nenhum envelope de história.

| Código | Qtd. | Componente | Formato sugerido | Função | Status |
|---|---:|---|---|---|---|
| EXT-01 | 1 | Caixa rígida preta | Caixa com tampa, acabamento fosco | Armazenar e proteger o jogo inteiro. | CANÔNICO |
| EXT-02 | 1 | Berço ou divisórias internas | Cartão rígido/EVA sem cheiro | Separar envelopes, mapa, marcadores e Chaves Atlas. | PROPOSTO |
| EXT-03 | 1 | Cartão Comece Aqui/Constelação | A6, frente e verso | Frente narrativa com símbolo e frase; verso com preparação, URL, QR e código manual. | CANÔNICO |
| EXT-04 | 1 | Cartão de ativação da licença | 85 × 55 mm ou A7 | Código único da cópia, URL digitável e QR correspondente. | CANÔNICO |
| EXT-05 | 1 | Guia rápido do anfitrião | A5, 4 páginas | Preparar mesa, criar sala, cadastrar 3–6 jogadores, lidar com aparelho compartilhado e reorganizar. | CANÔNICO |
| EXT-06 | 1 | Cartão de ficção, segurança e acessibilidade | A6 | Explicar que pessoas, empresas, documentos e sistemas são fictícios; orientar pausa e transcrições. | PROPOSTO |
| EXT-07 | 1 | Mapa operacional da Mansão Vesper | 50 × 50 cm, quadrado e dobrável | Controlar deslocamentos durante infiltração e extração. Não é a planta-puzzle do Envelope 02. | CANÔNICO |
| EXT-08 | 6 | Marcadores da equipe | Peças com símbolo e número 1–6 | Representar os jogadores quando o grupo se divide e durante a extração. | CANÔNICO |
| EXT-09 | 5 | Marcadores de NPC | Voss, Sofia, Evelyn, Matteo e Helena | Mostrar personagens que podem mudar de posição ou rota. | PROPOSTO |
| EXT-10 | 2 | Marcadores de segurança | Guardas A e B, com símbolos diferentes | Representar mudança de ronda, bloqueio de sala e perseguição. | PROPOSTO |
| EXT-11 | 1 | Marcador de objetivo Atlas | Símbolo Atlas distinto | Indicar a Câmara Atlas ou o dispositivo transportado. | PROPOSTO |
| EXT-12 | 14 | Bases para marcadores | Plástico ou madeira | Sustentar 6 marcadores de equipe, 5 NPC, 2 guardas e 1 Atlas. | PROPOSTO |
| EXT-13 | 1 | Folha mestra de reorganização | A4, frente e verso | Conferir todos os componentes e seus destinos após a partida. | CANÔNICO |
| EXT-14 | 8 | Envelopes reutilizáveis | 00, 01, 02, 03A, 03B, 03C, 07 e FINAL | Controlar revelação de conteúdo. FINAL depende de aprovação. | DECISÃO |
| EXT-15 | 8 | Fechos reutilizáveis | Encaixe, velcro fino ou selo reposicionável | Permitir várias partidas sem rasgar os envelopes. | CANÔNICO |
| EXT-16 | 1 conjunto | Proteções internas | Saquinhos, sleeves e separadores | Proteger acetatos, fotos, cartas e os três dispositivos Atlas. | PROPOSTO |

## Conteúdo mínimo do mapa operacional

O mapa deve possuir nós conectados e claramente nomeados:

1. Portão;
2. Recepção;
3. Salão de Máscaras;
4. Galeria;
5. Entrada de Serviço;
6. Cozinha;
7. Adega;
8. Ala Técnica;
9. Subsolo;
10. Sala de Segurança;
11. Biblioteca;
12. Ala Restrita;
13. Escritório de Voss;
14. Câmara Atlas;
15. Jardins;
16. Garagem/Saída.

O arquivo final do mapa precisa conter:

- legenda de conexões permitidas;
- posições iniciais para cada rota;
- rotas alternativas usadas na extração;
- coordenadas compatíveis com as instruções do aplicativo;
- nomes grandes o bastante para leitura em mesa;
- símbolos e formas, não apenas cores;
- código de produção e versão no verso.

## Organização sugerida da caixa

1. Cartão Comece Aqui no topo.
2. Guia do anfitrião e cartão de ativação abaixo dele.
3. Mapa e marcadores em compartimento próprio.
4. Envelopes em ordem numérica, com as três rotas lado a lado.
5. Envelope 07 em compartimento protegido para não denunciar o formato das chaves.
6. Folha de reorganização no fundo ou em bolso interno da tampa.

---

# 2. Envelope 00 — Formação da equipe

**Objetivo de gameplay:** apresentar a missão, distribuir responsabilidades e missões privadas e confirmar que todos estão prontos.

**Abertura:** somente quando o aplicativo autorizar no início da sessão.

| Código | Qtd. | Peça | Conteúdo obrigatório | Formato | Status |
|---|---:|---|---|---|---|
| E00-00 | 1 | Manifesto do envelope | Lista codificada de tudo que deve voltar ao Envelope 00. | A6 | CANÔNICO |
| E00-01 | 1 | Briefing da Operação | Mansão Vesper, baile, leilão clandestino, Chave Atlas, horário de meia-noite e objetivo inicial sem revelar Orion/Janus. | A5, frente e verso | CANÔNICO |
| E00-02 | 1 | Cartão de objetivo coletivo | “Identifiquem a fonte de Orion” e instrução para aguardar o aplicativo. | 63 × 88 mm | CANÔNICO |
| E00-03 | 1 | Ficha do alvo: Adrian Voss | Retrato, papel público, vínculo com a mansão, instituto e leilão; sem revelar Janus. | A4 | PROPOSTO |
| E00-04 | 1 | Ficha do artefato: Chave Atlas | Aparência geral, três fatores de autenticação e risco da transferência; sem indicar A, B ou C. | A5 | PROPOSTO |
| E00-05 a E00-10 | 6 | Cartas de função | Nome, capacidade pública, decisão exclusiva, limite e lembrete sobre conteúdo privado. | 63 × 88 mm | CANÔNICO |
| E00-11 a E00-16 | 6 | Cartas de missão secreta | Uma missão privada por jogador/função, sem prejudicar o objetivo coletivo. | 63 × 88 mm | CANÔNICO |
| E00-17 | 1 | Matriz de funções por quantidade de jogadores | Combinações válidas para 3, 4, 5 e 6 pessoas; indicar quando uma pessoa acumula responsabilidades. | A5 | CANÔNICO |

## Funções que devem ser impressas

Usar um cartão reversível por função: um lado com o avatar masculino e outro com o avatar feminino, mantendo exatamente a mesma mecânica.

| Nome visível | Responsabilidade narrativa | Decisões exclusivas | Avatares já existentes |
|---|---|---|---|
| Infiltrador/Infiltradora | Planejamento | Escolha e mudança de rota; desempate final. | `public/media/roles/infiltrador-homem.png` e `infiltrador-mulher.png` |
| Técnico/Técnica | Sistemas | Validar códigos e confirmar a Chave Atlas. | `public/media/roles/tecnica-homem.png` e `tecnica-mulher.png` |
| Observador/Observadora | Operação de campo | Confirmar movimentos arriscados e extração. | `public/media/roles/observador-homem.png` e `observador-mulher.png` |
| Negociador/Negociadora | Negociação | Escolher respostas sociais e conduzir conversas críticas. | `public/media/roles/negociador-homem.png` e `negociador-mulher.png` |
| Motorista | Gestão de recursos | Escolher quatro itens, consumir recursos e preservar a fuga. | `public/media/roles/motorista-homem.png` e `motorista-mulher.png` |
| Analista | Inteligência | Cruzar documentos, confirmar `JANUS` e apresentar conclusões. | `public/media/roles/analista-homem.png` e `analista-mulher.png` |

> **DECISÃO:** os títulos acima precisam ter forma masculina e feminina aprovada. A interface, o áudio e os impressos devem usar a mesma nomenclatura.

## Missões secretas a consolidar

1. **Proteger Sofia:** preservar a identidade ou garantir a segurança da fonte.
2. **Descobrir Janus:** revelar a participação antiga de Orion.
3. **Operação silenciosa:** manter o alerta máximo abaixo de 3.
4. **Recurso preservado:** terminar com ao menos um item relevante sem consumir.
5. **Ninguém fica para trás:** extrair toda a equipe.
6. **Desmascarar Meridian:** identificar Evelyn Cross com as provas corretas.

Cada carta precisa informar:

- objetivo privado;
- quando o aplicativo verificará a condição;
- o que pode ser dito aos demais;
- o que não pode ser revelado;
- pontuação ou distinção recebida;
- código da missão e versão.

## Conferência de embalagem do Envelope 00

- [ ] 1 manifesto.
- [ ] 1 briefing.
- [ ] 1 objetivo coletivo.
- [ ] 1 ficha de Adrian Voss.
- [ ] 1 ficha da Chave Atlas.
- [ ] 6 cartas de função.
- [ ] 6 cartas de missão secreta.
- [ ] 1 matriz para 3–6 jogadores.
- [ ] Nenhuma carta revela `CISNE`, `JANUS`, `ATLAS-B` ou a identidade de Meridian.

---

# 3. Envelope 01 — O Cisne Branco

**Objetivo de gameplay:** identificar Sofia Vale sem expô-la.

**Puzzle principal:** PZ-01, resposta `CISNE`.

**Descoberta opcional:** `12 MINUTOS`.

| Código | Qtd. | Peça | O que precisa mostrar ou esconder | Formato | Status |
|---|---:|---|---|---|---|
| E01-00 | 1 | Manifesto do envelope | Relação de todas as peças do Envelope 01. | A6 | CANÔNICO |
| E01-01 | 1 | Convite oficial marcado | Convite para o baile Vesper com marca discreta ligada ao Cisne Branco. Não pode entregar sozinho a resposta. | A5 dobrado ou DL | CANÔNICO |
| E01-02 | 1 | Lista de convidados | Nomes, identidades de cobertura, funções e máscaras/codinomes suficientes para cruzamento. Sofia aparece sob identidade falsa. | 1–2 folhas A4 | CANÔNICO |
| E01-03 | 1 | Fotografia sem identificação | Sofia usando máscara de cisne branco, sem nome no anverso. | Foto 10 × 15 cm | CANÔNICO |
| E01-04 | 1 | Memorando interno | Regra, frase, sequência ou referência que conecta convite, lista e fotografia. | A5/A4 | CANÔNICO |
| E01-05 | 1 | Contrato da empresa de segurança | Endereço da mansão, base de resposta e tempo/deslocamento que permitam deduzir `12 MINUTOS`. | 2 folhas A4 | CANÔNICO |
| E01-06 | 1 | Anexo técnico do contrato | Tabela ou mapa simplificado necessário para a descoberta opcional, caso não caiba no contrato. | A5/A4 | PROPOSTO |

## Dependência lógica do puzzle

- O convite deve indicar **qual atributo procurar**.
- A lista deve restringir as identidades possíveis.
- A fotografia deve confirmar visualmente a pessoa e a máscara.
- O memorando deve fechar a associação sem imprimir a resposta de forma isolada.
- Pelo menos duas peças devem ser necessárias para chegar a `CISNE`.
- A dedução de `12 MINUTOS` deve usar o contrato e um dado complementar, evitando que o número apareça como resposta pronta.

## Fotos e artes deste envelope

- Criar uma variação de Sofia Vale usando máscara branca de cisne.
- Manter rosto, idade, cabelo e figurino compatíveis com a referência oficial de Sofia.
- A fotografia deve parecer material de vigilância ou registro de convidado, não um retrato promocional.
- Criar identidade visual fictícia para a Fundação Vesper e para a empresa de segurança.
- Não usar nomes, brasões, telefones, endereços ou CNPJ de empresas reais.

## Conferência de embalagem do Envelope 01

- [ ] 1 manifesto.
- [ ] 1 convite marcado.
- [ ] 1 lista de convidados completa.
- [ ] 1 fotografia de Sofia mascarada.
- [ ] 1 memorando.
- [ ] 1 contrato com todos os anexos.
- [ ] O conjunto permite `CISNE`.
- [ ] O conjunto permite opcionalmente `12 MINUTOS`.
- [ ] Nenhuma peça identifica Sofia explicitamente no mesmo lado em que aparece a fotografia.

---

# 4. Envelope 02 — Planta, equipamento e passado de Orion

**Objetivo de gameplay:** montar a planta, descobrir a janela de vigilância, escolher quatro itens, investigar Janus e planejar a rota.

**Puzzles:** PZ-02, resposta `2317`; PZ-03, resposta `JANUS`.

**Abertura:** antes da votação e confirmação da rota.

| Código | Qtd. | Peça | Conteúdo obrigatório | Formato | Status |
|---|---:|---|---|---|---|
| E02-00 | 1 | Manifesto do envelope | Relação de tudo que deve voltar ao Envelope 02. | A6 | CANÔNICO |
| E02-01 | 1 | Planta oficial incompleta | Salões públicos, serviço e parte do subsolo; pontos de registro para alinhar a transparência. | A3 dobrável | CANÔNICO |
| E02-02 | 1 | Transparência de corredores ocultos | Completar passagens ausentes sem cobrir nomes ou pistas. | Acetato A3 | CANÔNICO |
| E02-03 | 1 | Agenda da segurança | Rondas, trocas e horários usados em PZ-02. | A4 | CANÔNICO |
| E02-04 | 1 | Escala da equipe técnica | Turnos e intervenção que participa da dedução `2317`. | A4 | CANÔNICO |
| E02-05 | 1 | Ciclo fictício de câmeras | Sequência narrativa de vigilância, incluindo a janela crítica. | A4 | CANÔNICO |
| E02-06 | 1 | Registro interno de acesso | Complementar os horários e justificar a janela de 90 segundos. | A5/A4 | CANÔNICO |
| E02-07 | 1 | Ficha comparativa de rotas | Gala, Serviço e Técnica; risco, exigências e posições iniciais, sem revelar resultados. | A4 | PROPOSTO |
| E02-08 | 1 | Cartão de posicionamento inicial | Onde colocar os marcadores após a rota ser confirmada. | A5 | CANÔNICO |
| E02-09 a E02-16 | 8 | Cartas de inventário | Nome, descrição, usos, etapas válidas, efeito público e código `INV-01` a `INV-08`. | 63 × 88 mm | CANÔNICO |
| E02-17 | 1 | Painel “Carga da equipe” | Quatro espaços para apoiar as cartas escolhidas; as outras voltam ao Envelope 02. | A5/A4 rígido | PROPOSTO |
| E02-18 | 1 | Fotografia antiga de Voss e Orion | Voss jovem ao lado de Orion, com parte do rosto de Orion rasgada. | Foto 10 × 15 cm | CANÔNICO |
| E02-19 | 1 | Log criptografado do projeto | Fragmentos, iniciais e identificadores ligados a Janus. | A4 | CANÔNICO |
| E02-20 | 1 | Registro de fundação do projeto | Data e iniciais necessárias para cruzar com fotografia e log. | A4 | CANÔNICO |
| E02-21 | 1 | Ficha de investigação Janus | Área de comparação visual sem espaço obrigatório para escrita. | A5 | PROPOSTO |

## Oito cartas de inventário

O grupo deve colocar as oito sobre a mesa e escolher exatamente quatro.

| Código | Item | Papel na história | Origem |
|---|---|---|---|
| INV-01 | Convite clonado | Abre opções na rota social e reduz questionamento na recepção. | CANÔNICO |
| INV-02 | Credencial de manutenção | Abre opções na entrada de serviço. | CANÔNICO |
| INV-03 | Uniformes de serviço | Justificam a presença da equipe em áreas internas; representados por carta, sem roupa real na caixa. | CANÔNICO |
| INV-04 | Kit médico de emergência | Resolve ou reduz uma consequência física narrativa. | CANÔNICO |
| INV-05 | Rota de fuga preparada | Libera uma alternativa na extração e é consumida quando usada. | CANÔNICO |
| INV-06 | Comunicador seguro | Permite receber ou repetir uma informação sem elevar o alerta. | PROPOSTO |
| INV-07 | Kit técnico fictício | Abre uma ação técnica prevista pelo roteiro, sem instruções reais de invasão. | PROPOSTO |
| INV-08 | Bloqueador de sinal fictício | Atrasa uma consequência ou reduz risco por um uso. | PROPOSTO |

Antes de imprimir cada carta, preencher:

- descrição curta;
- `max_uses`;
- etapas em que pode ser usada;
- condição que a habilita;
- efeito exato no estado do jogo;
- se retorna à caixa ou permanece no painel;
- texto equivalente no aplicativo;
- referência física e versão.

## Construção do PZ-02 — Janela Cega

As quatro fontes obrigatórias são:

1. agenda da segurança;
2. escala técnica;
3. uma marca inequívoca na planta;
4. ciclo fictício de câmeras.

Critérios:

- a interseção deve resultar em `2317`;
- o número não pode aparecer destacado como um código pronto;
- o jogador precisa cruzar pelo menos três fontes;
- o resultado deve liberar uma vantagem técnica de 90 segundos;
- errar não pode inutilizar ou exigir riscar o material.

## Construção do PZ-03 — Arquivo Fantasma

As fontes obrigatórias são:

1. fotografia antiga;
2. log criptografado;
3. iniciais;
4. data do primeiro projeto.

Critérios:

- o cruzamento deve resultar em `JANUS`;
- a foto precisa mostrar Voss e Orion mais jovens com consistência facial;
- o rasgo esconde parte de Orion, mas não pode tornar a dedução impossível;
- a resposta não deve estar legível em uma única linha isolada;
- a descoberta precisa alterar mensagens posteriores de Vega e Voss no aplicativo.

## Conferência de embalagem do Envelope 02

- [ ] 1 manifesto.
- [ ] 1 planta A3.
- [ ] 1 transparência A3 sem riscos.
- [ ] Agenda, escala, ciclo e registro interno.
- [ ] 1 ficha comparativa de rotas.
- [ ] 1 cartão de posicionamento.
- [ ] 8 cartas de inventário, sem duplicatas.
- [ ] 1 painel para quatro itens.
- [ ] 1 fotografia antiga.
- [ ] 1 log criptografado.
- [ ] 1 registro de fundação.
- [ ] 1 ficha Janus, se aprovada.
- [ ] O conjunto resolve `2317`.
- [ ] O conjunto resolve `JANUS`.
- [ ] O envelope não pressupõe que uma rota já foi escolhida.

---

# 5. Envelope 03A — Rota social/Gala

**Objetivo de gameplay:** entrar pela recepção, sustentar a identidade de cobertura, investigar o leilão, lidar com Matteo e poder identificar Meridian.

**Personagens centrais:** Evelyn Cross/Meridian e Matteo Ramires.

> O roteiro define a função desta rota, mas ainda não descreve todos os documentos. Os itens marcados como propostos devem ser escritos junto com as decisões sociais do aplicativo.

| Código | Qtd. | Peça | Função no gameplay | Formato | Status |
|---|---:|---|---|---|---|
| E03A-00 | 1 | Manifesto do envelope | Conferência e reorganização. | A6 | CANÔNICO |
| E03A-01 | 1 | Instrução da rota Gala | Contexto de entrada, ponto inicial e primeiro objetivo. | A5 | PROPOSTO |
| E03A-02 | 1 | Planta parcial da recepção e salão | Apoiar movimentos e mostrar áreas acessíveis nesta rota. | A4 | PROPOSTO |
| E03A-03 | 1 | Lista de mesas/credenciamento | Cruzar convidados, posições e identidades de cobertura. | A4 | PROPOSTO |
| E03A-04 | 1 | Catálogo público do baile | Criar contraste com o leilão clandestino. | Folheto A5 | PROPOSTO |
| E03A-05 | 1 | Catálogo secreto do leilão | Lotes, códigos, participantes e pistas sobre o comprador. | 2–4 páginas A5 | CANÔNICO |
| E03A-06 | 1 | Registro do lote Atlas | Horário, autenticação e intermediário da venda. | A5 | CANÔNICO |
| E03A-07 | 1 | Credencial/cartão de Evelyn Cross | Apresentá-la como consultora de arte sem revelar Meridian. | 85 × 55 mm | PROPOSTO |
| E03A-08 | 1 | Ficha de Matteo Ramires | Função no leilão, relações e pontos de pressão possíveis. | A5 | PROPOSTO |
| E03A-09 | 1 | Registro financeiro de Matteo | Dívida, transferência ou irregularidade que permita pressioná-lo. | 1–2 folhas A4 | CANÔNICO |
| E03A-10 | 1 | Prova de ligação com Meridian | Cruzamento entre Evelyn, catálogo e autorização do consórcio. Não deve revelar a resposta sozinha. | A4/A5 | CANÔNICO |
| E03A-11 | 1 | Prova com QR e código manual | Acionar no aplicativo a acusação ou investigação de Evelyn. | Integrado a E03A-10 ou cartão | PROPOSTO |
| E03A-12 | 1 | Cartão de acesso à ala restrita | Confirmar a convergência desta rota para a Biblioteca/Ala Restrita. | 63 × 88 mm | PROPOSTO |

## Fotos e artes desta rota

- Usar o retrato oficial de Evelyn Cross em um recorte de credencial/dossiê.
- Usar o retrato oficial de Matteo Ramires em ficha de leiloeiro.
- Criar catálogo, selo do consórcio e credenciais totalmente fictícios.
- Não escrever “Meridian” diretamente na fotografia de Evelyn.

## Conferência do Envelope 03A

- [ ] 1 manifesto e 1 instrução.
- [ ] Planta parcial e credenciamento.
- [ ] Catálogo público e catálogo secreto.
- [ ] Registro do lote Atlas.
- [ ] Material de Evelyn.
- [ ] Material de Matteo e prova financeira.
- [ ] Prova suficiente para identificar Meridian.
- [ ] QR com código manual.
- [ ] Cartão de acesso à ala restrita.
- [ ] Nenhum documento das rotas 03B ou 03C está misturado.

---

# 6. Envelope 03B — Rota de serviço

**Objetivo de gameplay:** atravessar cozinha, adega e ala técnica usando cobertura de manutenção e encontrar a prova capaz de convencer Helena Crowe.

**Personagem central:** Helena Crowe.

| Código | Qtd. | Peça | Função no gameplay | Formato | Status |
|---|---:|---|---|---|---|
| E03B-00 | 1 | Manifesto do envelope | Conferência e reorganização. | A6 | CANÔNICO |
| E03B-01 | 1 | Instrução da rota de Serviço | Contexto de entrada, posição inicial e primeiro objetivo. | A5 | PROPOSTO |
| E03B-02 | 1 | Ordem de serviço fictícia | Justificar a presença da equipe sem copiar documento real. | A4 | PROPOSTO |
| E03B-03 | 1 | Manifesto de entrega/manutenção | Horário, setor, carga e responsável. | A4 | PROPOSTO |
| E03B-04 | 1 | Escala dos funcionários | Mostrar trocas, lacunas e pessoas esperadas. | A4 | CANÔNICO |
| E03B-05 | 1 | Planta parcial dos corredores de serviço | Cozinha, adega, ala técnica e desvios. | A4 | CANÔNICO |
| E03B-06 | 6 | Crachás temporários por função | Representar a cobertura dos jogadores; todos fictícios e sem campo para dados reais. | 85 × 55 mm | PROPOSTO |
| E03B-07 | 1 | Ficha funcional de Helena Crowe | Cargo, histórico, responsabilidade e cadeia de comando. | A4 | CANÔNICO |
| E03B-08 | 1 | Fotografia de identificação de Helena | Versão documental do retrato oficial. | 7 × 10 cm | PROPOSTO |
| E03B-09 | 1 | Memorando de responsabilização | Provar que Voss planeja atribuir a falha da noite a Helena. | A4 | CANÔNICO |
| E03B-10 | 1 | Registro de incidente/comunicações | Corroborar o plano de Voss e indicar uma rota falsa. | A4 | PROPOSTO |
| E03B-11 | 1 | Prova de Helena com QR e código manual | Documento específico apresentado ao aplicativo na conversa. | Integrado a E03B-09 ou cartão | CANÔNICO |
| E03B-12 | 1 | Cartão de acesso à ala restrita | Confirmar a convergência para Biblioteca/Ala Restrita. | 63 × 88 mm | PROPOSTO |

## Observações de fabricação

- “Uniformes” devem ser representados pela carta `INV-03`; não é necessário fabricar roupas.
- Os crachás podem usar os seis símbolos das funções, evitando nomes de jogadores e material consumível.
- A prova contra Voss precisa ter um identificador único para o aplicativo verificar que ela foi desbloqueada.
- O QR nunca pode ser a única forma de continuar: imprimir um código curto logo abaixo.

## Conferência do Envelope 03B

- [ ] 1 manifesto e 1 instrução.
- [ ] Ordem de serviço e manifesto.
- [ ] Escala e planta parcial.
- [ ] 6 crachás.
- [ ] Ficha e foto de Helena.
- [ ] Memorando contra Voss.
- [ ] Registro de incidente.
- [ ] Prova com QR e código manual.
- [ ] Cartão de acesso à ala restrita.
- [ ] Nenhum documento das rotas 03A ou 03C está misturado.

---

# 7. Envelope 03C — Rota técnica/Subsolo

**Objetivo de gameplay:** usar a janela de 90 segundos, atravessar o subsolo e lidar com os sinais do Protocolo Janus.

**Regra de segurança narrativa:** todos os sistemas, códigos e procedimentos devem ser fictícios. Nenhuma peça pode ensinar invasão, sabotagem ou acesso a sistemas reais.

| Código | Qtd. | Peça | Função no gameplay | Formato | Status |
|---|---:|---|---|---|---|
| E03C-00 | 1 | Manifesto do envelope | Conferência e reorganização. | A6 | CANÔNICO |
| E03C-01 | 1 | Instrução da rota Técnica | Contexto, ponto inicial, uso de `2317` e primeiro objetivo. | A5 | PROPOSTO |
| E03C-02 | 1 | Autorização fictícia de manutenção | Cobertura narrativa para acesso ao subsolo. | A4 | PROPOSTO |
| E03C-03 | 1 | Esquema parcial do subsolo | Nós, conexões e bloqueios da rota. | A4 | CANÔNICO |
| E03C-04 | 1 | Relatório de manutenção | Falhas narrativas e horários do sistema Vesper. | A4 | PROPOSTO |
| E03C-05 | 1 | Relatório/diagnóstico Janus | Respostas incomuns do protocolo à presença da equipe. | A4 | CANÔNICO |
| E03C-06 | 1 | Telemetria fictícia | Sequência visual para comparação, sem comandos reais. | A4 | PROPOSTO |
| E03C-07 | 1 | Continuação do log de acesso | Eventos após a janela cega e indícios de rastreamento. | A4 | CANÔNICO |
| E03C-08 | 1 | Fragmento de código Atlas/Janus | Evidência visual usada mais tarde, sem sintaxe operacional real. | A5 | CANÔNICO |
| E03C-09 | 1 | Régua ou transparência de decodificação | Alinhar símbolos do sistema e revelar uma pista, sem depender de cor. | Acetato A5 | PROPOSTO |
| E03C-10 | 1 | Registro de acesso restrito | Comprovar a passagem para Biblioteca/Ala Restrita. | A5 | PROPOSTO |
| E03C-11 | 1 | Cartão de acesso à ala restrita | Confirmar a convergência desta rota. | 63 × 88 mm | PROPOSTO |

## Conferência do Envelope 03C

- [ ] 1 manifesto e 1 instrução.
- [ ] Autorização e esquema do subsolo.
- [ ] Relatório, diagnóstico e telemetria.
- [ ] Log e fragmento Atlas/Janus.
- [ ] Transparência sem riscos.
- [ ] Registro e cartão de acesso.
- [ ] Todas as referências técnicas são ficcionais.
- [ ] Nenhum documento das rotas 03A ou 03B está misturado.

---

# 8. Envelope 07 — As três Chaves Atlas

**Objetivo de gameplay:** comparar três dispositivos e identificar a chave verdadeira.

**Puzzle:** PZ-04, resposta correta `ATLAS-B`.

| Código | Qtd. | Peça | Conteúdo obrigatório | Formato | Status |
|---|---:|---|---|---|---|
| E07-00 | 1 | Manifesto do envelope | Conferência rigorosa das três chaves e documentos. | A6 | CANÔNICO |
| E07-01 | 1 | Instrução de autenticação | Explicar quais registros comparar sem antecipar a solução. | A5 | CANÔNICO |
| E07-02 | 1 | Chave Atlas A | Cópia incompleta; diferenças físicas verificáveis. | Prop 3D/acrílico ou peça rígida | CANÔNICO |
| E07-03 | 1 | Chave Atlas B | Dispositivo verdadeiro; deve coincidir com todas as provas. | Prop 3D/acrílico ou peça rígida | CANÔNICO |
| E07-04 | 1 | Chave Atlas C | Armadilha Janus; possui sinais verificáveis de rastreamento. | Prop 3D/acrílico ou peça rígida | CANÔNICO |
| E07-05 | 1 | Folha de assinaturas Atlas | Padrões, microdetalhes e referência do dispositivo legítimo. | A4 | CANÔNICO |
| E07-06 | 1 | Registro biométrico fictício | Um dos três fatores de autenticação; nunca usar biometria real. | A4 | CANÔNICO |
| E07-07 | 1 | Fragmento final do log/código | Distinguir cópia, original e armadilha. | A5/A4 | CANÔNICO |
| E07-08 | 1 | Mensagem impressa de Sofia | Informação final para reconhecer o dispositivo correto. | A5 | CANÔNICO |
| E07-09 | 1 | Base de comparação A/B/C | Três áreas para posicionar os dispositivos sem escrever neles. | A4 rígido | PROPOSTO |
| E07-10 | 1 | Folha de extração | Resumo visual das saídas, espaços para marcadores extraídos e lembrete para seguir a rota indicada pelo aplicativo. | A4 rígido | CANÔNICO |
| E07-11 | 3 | Sleeves ou nichos identificados | Proteger e conferir A, B e C separadamente. | Sob medida | PROPOSTO |

## Regras visuais das chaves

- As três devem usar o mesmo prompt mestre e a mesma construção básica.
- A referência oficial é `IDENTIDADE_VISUAL/OBJETOS/CHAVE_ATLAS/PROMPT_MESTRE_CHAVE_ATLAS.md`.
- A, B e C devem parecer variantes da mesma fabricação, não três produtos diferentes.
- As diferenças precisam combinar forma, gravação, posição de detalhe e padrão; nunca somente cor.
- A letra externa A/B/C identifica a escolha, mas não pode indicar qual é a verdadeira.
- A chave B deve passar em todas as verificações.
- A chave A deve falhar na assinatura final.
- A chave C deve apresentar o indício físico ligado ao Protocolo Janus.
- As peças não podem conectar, armazenar dados ou imitar um dispositivo funcional real.

## Conferência do Envelope 07

- [ ] 1 manifesto.
- [ ] 1 instrução.
- [ ] Exatamente 1 Atlas A.
- [ ] Exatamente 1 Atlas B.
- [ ] Exatamente 1 Atlas C.
- [ ] Folha de assinaturas.
- [ ] Registro biométrico fictício.
- [ ] Fragmento final.
- [ ] Mensagem de Sofia.
- [ ] Base de comparação, se aprovada.
- [ ] Folha de extração.
- [ ] Três proteções individuais.
- [ ] O puzzle pode ser resolvido sem depender apenas de cor.
- [ ] A chave B foi conferida por duas pessoas antes de fechar a caixa.

---

# 9. Envelope FINAL — Epílogo físico opcional

**Status geral:** DECISÃO.

O aplicativo já calcula e mostra o resultado. Este envelope só deve existir se o teste demonstrar que abrir um epílogo físico melhora o encerramento. Para não causar spoilers, todos os cartões externos usam apenas códigos.

| Código | Qtd. | Peça | Resultado | Formato | Status |
|---|---:|---|---|---|---|
| EFIN-00 | 1 | Manifesto do envelope | Relação dos sete resultados. | A6 | DECISÃO |
| EFIN-01 | 1 | Instrução de abertura | Abrir apenas o código mostrado pelo aplicativo. | A6 | DECISÃO |
| EFIN-02 | 1 | Epílogo F-01 | Entrega da chave verdadeira a Orion: “O Novo Atlas”. | A5 dobrado e lacrado | DECISÃO |
| EFIN-03 | 1 | Epílogo F-02 | Divulgação dos arquivos: “Transparência Brutal”. | A5 dobrado e lacrado | DECISÃO |
| EFIN-04 | 1 | Epílogo F-03 | Destruição da chave: “Cinzas”. | A5 dobrado e lacrado | DECISÃO |
| EFIN-05 | 1 | Epílogo F-04 | Devolução a Voss: “O Acordo Voss”. | A5 dobrado e lacrado | DECISÃO |
| EFIN-06 | 1 | Epílogo F-05 | Equipe mantém a chave: “Os Donos do Segredo”. | A5 dobrado e lacrado | DECISÃO |
| EFIN-07 | 1 | Epílogo F-06 | Cópia ou armadilha escolhida: “A Chave Errada”. | A5 dobrado e lacrado | DECISÃO |
| EFIN-08 | 1 | Epílogo F-07 | Cronômetro policial encerrado: “Doze Minutos”. | A5 dobrado e lacrado | DECISÃO |
| EFIN-09 | 1 | Cartão de reorganização | Encaminhar ao checklist gerado pelo aplicativo. | A6 | DECISÃO |

Se este envelope for removido:

- os sete textos permanecem apenas no aplicativo;
- a caixa passa a ter sete envelopes;
- a folha mestra e o berço interno devem ser atualizados;
- o app não deve instruir nenhuma abertura após o Envelope 07.

---

# 10. Banco completo de fotos e artes

## Imagens existentes que podem servir de base

| Personagem/objeto | Arquivo-base existente | Uso físico previsto |
|---|---|---|
| Adrian Voss | `IDENTIDADE_VISUAL/PERSONAGENS/ADRIAN_VOSS/Adrian Voss.png` | Ficha, registro de fundação e fotografia antiga. |
| Sofia Vale | `IDENTIDADE_VISUAL/PERSONAGENS/SOFIA_VALE/Sofia Vale.png` | Base facial para a foto mascarada e mensagem final. |
| Evelyn Cross | `IDENTIDADE_VISUAL/PERSONAGENS/EVELYN_CROSS_MERIDIAN/Evelyn Cross.png` | Credencial, dossiê e lista do leilão. |
| Matteo Ramires | `IDENTIDADE_VISUAL/PERSONAGENS/MATTEO_RAMIRES/Matteo Ramires.png` | Ficha do leiloeiro e registro financeiro. |
| Helena Crowe | `IDENTIDADE_VISUAL/PERSONAGENS/HELENA_CROWE/Helena Crowe.png` | Ficha funcional e prova de serviço. |
| Orion | `IDENTIDADE_VISUAL/PERSONAGENS/ORION/Orion.png` | Base facial para a fotografia antiga. |
| Vega | `IDENTIDADE_VISUAL/PERSONAGENS/VEGA/Vega.png` | Transmissões digitais; não exige foto física no mapa. |
| Chave Atlas | `IDENTIDADE_VISUAL/OBJETOS/CHAVE_ATLAS/CHAVE_ATLAS_OFICIAL.png` | Referência visual para A, B e C. |
| 12 avatares de função | `public/media/roles/*.png` | Seis cartas reversíveis de função. |

## Imagens que ainda precisam ser criadas ou adaptadas

| Prioridade | Imagem | Requisito |
|---|---|---|
| Alta | Sofia no baile com máscara de cisne branco | Mesmo rosto da referência; aparência de foto de vigilância/registro; sem nome. |
| Alta | Voss jovem ao lado de Orion jovem | Mesmos personagens, aparência de foto antiga, parte do rosto de Orion fisicamente rasgada na arte ou no acabamento. |
| Alta | Planta oficial incompleta da Mansão Vesper | Arquitetura consistente com o mapa; alinhamento exato com o acetato. |
| Alta | Overlay de corredores secretos | Fundo transparente real; marcas de registro; não cobrir textos. |
| Alta | Variações A, B e C da Chave Atlas | Mesma construção visual, microdiferenças ligadas às provas. |
| Média | Foto documental de Evelyn | Recorte neutro compatível com credencial de consultora de arte. |
| Média | Foto documental de Matteo | Recorte compatível com ficha do leiloeiro. |
| Média | Foto documental de Helena | Recorte compatível com arquivo funcional de segurança. |
| Média | Macros/diagramas das assinaturas Atlas | Mostrar os detalhes comparados no PZ-04. |
| Média | Selos e logotipos fictícios | Fundação Vesper, segurança, consórcio, Atlas e Janus. |
| Baixa | Texturas de desgaste e carimbos | Aplicar com moderação, sem prejudicar leitura ou pistas. |

Nenhuma imagem de marketing deve ser enviada diretamente à gráfica como evidência sem:

- ajuste de resolução e sangria;
- remoção de textos promocionais;
- conferência de consistência dos rostos e da Chave Atlas;
- código de produção;
- teste impresso no tamanho final.

---

# 11. Lista consolidada de documentos

Esta tabela permite conferir se algum tipo de documento ficou sem responsável.

| Tipo | Onde fica |
|---|---|
| Briefing da missão | Envelope 00 |
| Objetivo coletivo | Envelope 00 |
| Funções e missões secretas | Envelope 00 |
| Ficha de Adrian Voss e ficha da Chave Atlas | Envelope 00 |
| Convite original marcado | Envelope 01 |
| Lista de convidados | Envelope 01 |
| Foto de Sofia mascarada | Envelope 01 |
| Memorando Cisne Branco | Envelope 01 |
| Contrato e anexo de segurança | Envelope 01 |
| Planta oficial incompleta | Envelope 02 |
| Overlay de corredores ocultos | Envelope 02 |
| Agenda da segurança | Envelope 02 |
| Escala técnica | Envelope 02 |
| Ciclo de câmeras fictício | Envelope 02 |
| Registro interno de acesso | Envelope 02 |
| Oito cartas de inventário | Envelope 02 |
| Painel para quatro itens | Envelope 02 |
| Fotografia Voss/Orion | Envelope 02 |
| Log criptografado e registro do projeto | Envelope 02 |
| Catálogos e registro do leilão | Envelope 03A |
| Credencial de Evelyn e ficha de Matteo | Envelope 03A |
| Registro financeiro e prova Meridian | Envelope 03A |
| Ordem de serviço e manifesto | Envelope 03B |
| Escala, crachás e mapa de serviço | Envelope 03B |
| Ficha de Helena e prova contra Voss | Envelope 03B |
| Autorização e esquema do subsolo | Envelope 03C |
| Relatório Janus, diagnóstico, telemetria e logs | Envelope 03C |
| Três Chaves Atlas | Envelope 07 |
| Assinatura, biometria, log e mensagem de Sofia | Envelope 07 |
| Folha de extração | Envelope 07 |
| Sete epílogos codificados | Envelope FINAL, se aprovado |
| Guia, licença, mapa e reorganização | Fora dos envelopes |

---

# 12. Padrão obrigatório para cada arquivo impresso

Todo documento de evidência deve ter:

- código único do componente;
- versão;
- envelope de destino no verso ou em área não narrativa;
- título e emissor dentro do universo;
- data e horário coerentes com a cronologia;
- assinatura, rubrica ou identificador quando a dedução exigir;
- margens de segurança e 3 mm de sangria;
- contraste suficiente em impressão doméstica e gráfica;
- texto mínimo legível sob luz ambiente;
- resposta e pista conferidas contra o aplicativo.

Todo QR deve ter:

- código manual legível logo abaixo;
- URL ou ação registrada na planilha mestra;
- teste em Android e iPhone;
- área livre ao redor;
- tamanho final testado;
- destino que não exponha conteúdo antes da autorização;
- funcionamento sem login administrativo.

Todo componente reutilizável deve:

- funcionar sem rasgar, recortar ou escrever;
- poder ser limpo e reorganizado;
- sobreviver a pelo menos 20 ciclos de protótipo;
- ter destino de embalagem inequívoco;
- não revelar solução no verso;
- evitar pistas dependentes apenas de cor.

---

# 13. Quantidades mínimas consolidadas

As páginas dos documentos ainda variam, mas a primeira unidade completa deve conter no mínimo:

| Categoria | Quantidade |
|---|---:|
| Caixa rígida | 1 |
| Berço/divisória | 1 |
| Envelopes sem FINAL | 7 |
| Envelope FINAL opcional | 1 |
| Mapa operacional quadrado 50 × 50 cm | 1 |
| Planta investigativa A3 | 1 |
| Overlay A3 | 1 |
| Overlay técnico A5 | 1 |
| Marcadores da equipe | 6 |
| Marcadores de NPC | 5 |
| Marcadores de segurança | 2 |
| Marcador Atlas | 1 |
| Bases de marcador | 14 |
| Cartas de função reversíveis | 6 |
| Cartas de missão secreta | 6 |
| Cartas de inventário | 8 |
| Chaves Atlas físicas | 3 |
| Fotos narrativas mínimas | 5 |
| Crachás da rota de serviço | 6 |
| Cartões de acesso de rota | 3 |
| Folha de extração | 1 |
| Manifestos internos | 7, ou 8 com FINAL |
| Epílogos físicos opcionais | 7 |
| Guias/cartões externos | 4 |

> O total de folhas só deve ser fechado depois que catálogos, contratos, logs e epílogos estiverem diagramados. Não orçar apenas pela quantidade de “documentos”, pois vários têm duas ou mais páginas.

---

# 14. Testes obrigatórios antes da produção

## Teste de conteúdo

- [ ] PZ-01 é solucionável apenas com o Envelope 01 e resulta em `CISNE`.
- [ ] A descoberta opcional resulta em `12 MINUTOS`.
- [ ] PZ-02 é solucionável apenas com o Envelope 02 e resulta em `2317`.
- [ ] PZ-03 é solucionável apenas com o Envelope 02 e resulta em `JANUS`.
- [ ] Cada rota pode ser concluída sem abrir as outras duas.
- [ ] A rota social permite identificar Evelyn como Meridian.
- [ ] A rota de serviço contém a prova correta para Helena.
- [ ] A rota técnica reconhece a vantagem de `2317`.
- [ ] PZ-04 resulta em `ATLAS-B` por evidências, não por cor ou sorte.
- [ ] A Chave A gera cópia incompleta.
- [ ] A Chave C ativa a armadilha Janus.
- [ ] As cinco escolhas finais e os dois resultados de falha estão sincronizados.

## Teste físico

- [ ] Acetato A3 alinha perfeitamente com a planta.
- [ ] Documentos cabem nos envelopes sem dobra improvisada.
- [ ] Os envelopes abrem e fecham repetidamente.
- [ ] Marcadores ficam estáveis no mapa.
- [ ] Fotos não grudam nem riscam.
- [ ] As três Chaves Atlas entram e saem sem dano.
- [ ] Textos permanecem legíveis no tamanho final.
- [ ] QR e códigos manuais funcionam.
- [ ] Nenhum verso entrega uma solução.
- [ ] A caixa fecha sem pressionar os dispositivos.

## Teste de partida cega

- [ ] Um grupo que não conhece a história entende o Comece Aqui.
- [ ] O grupo abre os envelopes na ordem correta.
- [ ] O grupo entende as seis responsabilidades.
- [ ] Três, quatro, cinco e seis jogadores possuem combinações válidas de função.
- [ ] A escolha de quatro itens é clara.
- [ ] O grupo sabe onde mover os marcadores.
- [ ] Nenhuma pista exige conhecimento externo.
- [ ] Nenhuma rota fica bloqueada por item que não poderia ter sido escolhido.
- [ ] Os áudios possuem transcrição digital acessível.
- [ ] A reorganização completa leva menos de dez minutos.

---

# 15. Ordem recomendada de produção

1. Aprovar as nove travas deste documento.
2. Congelar nomes de funções, missões, itens, puzzles, rotas e finais.
3. Escrever o texto integral de cada documento.
4. Criar uma matriz ligando cada pista à resposta e ao estado do aplicativo.
5. Implementar os quatro puzzles e os oito itens no app.
6. Fazer protótipo simples em preto e branco.
7. Rodar uma partida cega de cada rota.
8. Corrigir pistas ambíguas, becos sem saída e divergências com o app.
9. Produzir fotos, mapas, overlays, selos e arte final.
10. Diagramar todos os arquivos com código e versão.
11. Imprimir uma prova colorida no tamanho real.
12. Testar QR, contraste, corte, dobra, encaixe e durabilidade.
13. Fabricar os três dispositivos Atlas.
14. Montar uma unidade piloto completa.
15. Jogar novamente as três rotas usando somente a unidade piloto.
16. Conferir peça por peça com os manifestos.
17. Somente então fechar orçamento e lote de gráfica.

---

# 16. Critério para considerar a caixa pronta

A produção física só está pronta quando:

- todos os itens desta lista estiverem marcados como aprovados ou formalmente removidos;
- nenhuma linha permanecer como DECISÃO;
- cada pista tiver uma função testada;
- aplicativo e material impresso usarem os mesmos códigos, nomes e respostas;
- cada rota tiver passado por uma partida cega;
- a caixa puder ser reorganizada sem consultar a solução da história;
- duas pessoas diferentes conferirem o conteúdo final;
- a versão impressa corresponder à versão publicada do aplicativo.
