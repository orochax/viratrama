# Prompt mestre - partida 100% funcional

```text
Execute integralmente este trabalho dentro do projeto ViraTrama. Nao entregue apenas um plano, wireframe ou simulacao: implemente, migre, conecte, teste e valide o fluxo completo ate que uma partida real da Operacao da Meia-Noite possa ser jogada do inicio ao fim. Nao deixe placeholders, dados hardcoded de demonstracao, botoes sem acao, TODOs ou telas que apenas avancam por links.

CONTEXTO

- O projeto usa Next.js 16, React, TypeScript e Supabase.
- Leia o AGENTS.md e a documentacao local relevante do Next em node_modules/next/dist/docs antes de alterar codigo.
- Leia primeiro docs/VIRATRAMA, docs/MISSOES/OPERACAO_DA_MEIA_NOITE, as migrations existentes e todo o codigo atual de sala, ativacao, narrativa, realtime e story engine.
- Preserve a landing page, loja, carrinho, identidade visual e rotas publicas existentes.
- Trabalhe mobile-first. O celular coordena a experiencia; o mapa, os envelopes, os documentos e a conversa continuam sendo o centro do jogo.
- Os arquivos finais de audio ainda nao serao fornecidos. Deixe toda a infraestrutura, catalogo, upload, player, sincronizacao, transcricao, estados e fallback prontos para que depois seja necessario apenas enviar cada arquivo de audio.
- Nao gere audios falsos. Enquanto o MP3 nao existir, a transcricao deve permitir concluir a etapa sem quebrar a partida.
- Nao faca push nem commit sem solicitacao explicita.

OBJETIVO FINAL

Um comprador deve conseguir ativar a Chave Atlas, criar conta no primeiro acesso, entrar nos acessos seguintes, abrir sua biblioteca, criar uma sala real, reunir de 3 a 6 jogadores, distribuir funcoes, revelar informacoes privadas, jogar qualquer uma das tres rotas, resolver puzzles, tomar decisoes, ouvir ou ler transmissoes, movimentar marcadores no mapa fisico, concluir a extracao, votar no destino do Atlas, receber o final correto e reorganizar o kit. Todo o progresso deve sobreviver a refresh, fechamento do navegador, troca de aparelho e reconexao.

1. CONGELAR O CONTEUDO CANONICO

- Use HISTORIA/REFINANDO_HISTORIA/REFINANDO_HISTORIA.md como fonte narrativa detalhada principal.
- Reconcile documentos antigos antes de semear o banco. Elimine divergencias entre nomes de funcoes, finais, rotas e transmissoes.
- Funcoes canonicas:
  - O Infiltrador: acessos discretos, movimentos arriscados e confirmacoes de campo.
  - A Tecnica: sistemas, codigos, dispositivos e identificacao da Chave Atlas.
  - O Observador: planejamento de rota, leitura do ambiente e alerta.
  - A Negociadora: conversas, acusacoes, propostas e Helena/Matteo/Voss.
  - O Motorista: inventario operacional, tempo e extracao.
  - A Analista: documentos, provas, Janus e passado de Orion.
- Atualize textos antigos que ainda usam Planejador, Gestor de Recursos, Especialista em Sistemas, Operador de Campo ou Analista de Inteligencia.
- Finais canonicos:
  - O Novo Atlas.
  - Transparencia Brutal.
  - Cinzas.
  - O Acordo Voss.
  - Os Donos do Segredo.
  - A Chave Errada.
  - Doze Minutos.
- Os dois ultimos sao resultados de falha. Todos os finais devem considerar chave escolhida, decisao final, extracao, tempo e flags descobertas.
- Crie conteudo estruturado e versionado para todos os atos, passos, decisoes, opcoes, efeitos, mensagens, puzzles, pistas, envelopes, itens, movimentos, transmissoes e finais. Nao deixe a historia apenas em Markdown ou arrays incompletos.

2. REMOVER O MODO DEMO DO FLUXO REAL

- Apos ativar uma licenca, nunca redirecione para /sala/demo.
- A biblioteca deve listar licencas e missoes reais do usuario.
- Criar sala deve validar: usuario autenticado, licenca ativa, historia disponivel, nenhuma sessao incompatível em andamento e kit reorganizado quando aplicavel.
- Gere room_code aleatorio, curto, nao previsivel e unico.
- Mantenha fixtures demo apenas em testes ou desenvolvimento, claramente isoladas e impossiveis de usar em producao.
- Remova contagens, horarios, inventario, arquivos e mensagens hardcoded das paginas reais.

3. AUTENTICACAO, ENTRADA E RECONEXAO

- O anfitriao usa conta Supabase e e tambem um jogador, sem acesso a spoilers.
- Participantes entram por QR Code ou codigo da sala, informam nome/apelido e escolhem aparelho proprio ou modo compartilhado. Nao obrigue participantes a criar conta.
- Em aparelho proprio, emita um token de reentrada seguro em cookie httpOnly e armazene somente seu hash no banco.
- No modo compartilhado, use codigo pessoal temporario; esconda e limpe conteudo privado antes de passar o aparelho.
- Implemente reconexao, presenca, last_seen_at, remocao e retorno do jogador.
- Nao confie em playerId, roleId, host ou sessionId enviados livremente pelo cliente. Resolva identidade e autorizacao no servidor.
- O anfitriao so inicia com 3 a 6 jogadores confirmados.

4. BANCO, MIGRATIONS E SEGURANCA

- Audite as migrations existentes. Crie somente migrations aditivas e seguras; nao apague dados existentes.
- Complete tabelas, constraints, indices, funcoes transacionais e politicas RLS para licencas, sessoes, jogadores, funcoes, missoes secretas, passos, eventos, decisoes, votos, puzzles, pistas, envelopes, inventario, mensagens, transmissoes, pontuacao, finais e reorganizacao.
- Gere tipos TypeScript reais do schema; substitua o tipo generico atual.
- Toda mutacao critica deve ser transacional, idempotente e auditavel.
- Respostas de puzzles, condicoes ocultas, alternativas bloqueadas e finais nao alcancados nunca podem ser enviados ao navegador antes da descoberta.
- Deadlines sao criados no servidor. O cliente apenas exibe o tempo restante.
- Nao grave no banco a cada segundo. Persista inicio, pausa, retomada, deadline e checkpoints necessarios.
- Valide RLS para anfitriao, participante, conteudo privado, administrador e usuario externo.

5. MAQUINA DE ESTADOS E MOTOR NARRATIVO

- Use os estados draft, lobby, role_assignment, role_reveal, prologue, active, paused, final_decision, completed e abandoned.
- Toda transicao deve ser validada no servidor e registrada como evento.
- Transforme o story engine em executor server-authoritative:
  - verifica condicoes;
  - calcula apenas opcoes visiveis;
  - valida a funcao responsavel;
  - aplica flags, alerta, inventario, score, tempo e envelopes;
  - seleciona o proximo passo;
  - publica o novo estado somente depois do commit.
- Proteja cliques duplos, requests repetidos, duas abas, dois celulares e expiracao simultanea.
- O refresh deve carregar current_step e estado persistido, nunca recomecar em Orion.

6. FLUXO COMPLETO DE PAGINAS

- /ativar: validar chave, criar ou autenticar conta e vincular licenca real.
- /biblioteca: mostrar missoes compradas, sessao em andamento, resultado anterior e acao de criar/retomar.
- /sala/[roomCode]: redirecionar para a pagina correspondente ao estado atual.
- lobby: codigo/QR, jogadores em realtime, status de conexao e confirmacao.
- participantes: gerenciar dispositivo, apelido, saida, retorno e delegacao.
- funcoes: distribuicao automatica valida para 3 a 6 ou manual pelo anfitriao.
- revelar: conteudo individual protegido, avatar masculino/feminino escolhido, habilidade, responsabilidade e missao secreta.
- briefing: confirmacao de todos, preparacao do Envelope 00 e inicio real.
- jogo: dashboard, objetivo atual, evento/transmissao/decisao/puzzle ativo e instrucao fisica.
- mapa: consulta do grafo conhecido, posicoes persistidas e confirmacao de movimentos; nao substituir o mapa fisico.
- itens: inventario real, usos, dono, estado e confirmacao de consumo.
- arquivos: somente documentos, fotos, plantas e provas desbloqueadas.
- mensagens: transmissoes e comunicacoes organizadas cronologicamente.
- pistas: tres niveis, cooldown e penalidade server-side.
- resultado: final, rota, tempo, alerta maximo, score, extracao e descobertas; informacao privada somente ao dono.
- reorganizacao: checklist dinamico apenas dos materiais abertos; liberar nova partida somente apos confirmacao forte.
- Todas as paginas devem ter loading, vazio, erro, offline/reconectando, acesso negado e estado concluido.

7. DASHBOARD REAL

- Substitua a fixture atual por dados da sessao.
- Mostre Tempo de Sala, Entrada, Extracao, Policia e Equipe.
- Tempo de Sala e crescente a partir de started_at.
- Entrada e Extracao aparecem somente quando a etapa as libera.
- Policia continua correndo durante pausa narrativa comum.
- Se police_eta_known for falso, o payload nao deve conter alarm_deadline_at; mostre DADO NAO OBTIDO.
- Mostre jogadores conectados/capacidade em realtime.
- Abaixo da faixa operacional, mostre ato, objetivo, envelope autorizado e o passo ativo.
- Preserve a navegacao inferior e o layout mobile sem overflow.

8. TRANSMISSOES E AUDIOS

- Nao use autoplay com som. O anfitriao toca em Iniciar transmissao.
- Transmissao coletiva toca audivelmente apenas no aparelho principal para evitar eco. Os outros aparelhos mostram personagem, estado, progresso e transcricao sincronizados.
- Transmissao privada toca apenas para o destinatario.
- Substitua BroadcastChannel como sincronizacao principal por Supabase Realtime. BroadcastChannel pode existir apenas como complemento local.
- Nao determine anfitriao por query string.
- O servidor controla qual transmissao esta liberada e quem pode acessa-la.
- Quando o audio termina, o card permanece na tela como Transmissao concluida. Nao troque imediatamente para a proxima fala.
- Mostre Continuar somente para quem tem autoridade. Continuar conclui a etapa uma unica vez.
- Permita pausar, retomar, silenciar, abrir transcricao e tentar novamente.
- Depois de concluida, a transmissao vai para Mensagens > Historico e pode ser reproduzida novamente.
- Replay nunca reaplica efeitos, avanca historia, muda pontuacao ou libera envelope. Registre transmission_replayed separadamente.
- Mensagens deve possuir Agora, Nao ouvidas e Historico, com filtros por personagem.
- Conteudo coletivo desbloqueado fica disponivel para a equipe. Conteudo privado somente para o destinatario. Epilogos somente depois do final correspondente.
- Se o arquivo estiver ausente ou status not_recorded, mostre retrato, transcricao integral e Confirmar leitura e continuar. A partida deve ser 100% concluivel sem MP3.
- Use storage privado e signed URLs curtas.
- Complete o painel admin para upload, substituicao, status, duracao, transcricao, retrato, legenda, aprovacao e teste de cada asset.

9. DECISOES, PUZZLES E MOVIMENTO

- Cada passo deve ter: contexto, evidencias conhecidas, fase de discussao, funcao responsavel, opcoes disponiveis, confirmacao e consequencia.
- Todos veem o contexto. Somente a funcao responsavel confirma; os demais veem Aguardando [funcao].
- Nao revele efeitos escondidos na descricao da opcao.
- Desabilite opcoes indisponiveis sem revelar condicoes secretas; quando apropriado, explique apenas o requisito publico ausente.
- Implemente inventario de quatro entre oito itens, votacao de rota como recomendacao, confirmacao de rota pelo Observador, conversas da Negociadora, puzzles da Tecnica/Analista, movimentos do Infiltrador e extracao/tempo pelo Motorista.
- Respostas de puzzle sao verificadas no servidor por hash ou funcao segura.
- Implemente ate tres pistas com cooldown e penalidade.
- O aplicativo informa origem e destino; os jogadores movem as pecas e confirmam. O servidor bloqueia movimentos fora do grafo.
- Grafo canonico:
  - Social: Portao Principal -> Recepcao -> Salao de Mascaras -> Galeria -> Biblioteca.
  - Servico: Entrada de Servico -> Cozinha -> Adega -> Ala Tecnica -> Biblioteca.
  - Tecnica: Acesso ao Subsolo -> Sala de Sistemas -> Tunel Tecnico -> Ala Tecnica -> Biblioteca.
  - Final: Biblioteca -> Corredor Restrito -> Camara Atlas.
  - Central de Seguranca liga Ala Tecnica e Corredor Restrito.
  - Escritorio de Voss e opcional e pode abrir informacao/proposta/saida.
  - Saidas: Portao Principal, Garagem e Jardins.
- Persista localizacao de cada marcador e NPC relevante.

10. VOTACAO FINAL E FINAIS

- Cada jogador vota secretamente entre Entregar a Orion, Devolver a Voss, Divulgar os arquivos, Destruir a chave ou Manter a chave.
- Aceite um voto selado por jogador. Nao mostre votos individuais nem placar parcial; mostre apenas quantos ja votaram.
- Empate abre segundo turno apenas entre opcoes empatadas.
- Persistindo empate, o Observador recebe o desempate.
- Combine decisao, true_key_identified, chave escolhida, alarme, prazo, extracao e flags para selecionar o final.
- Finalizacao deve ser idempotente, inclusive se o cronometro expirar em varios clientes.
- Reproduza ou apresente por transcricao somente o epilogo alcancado.

11. MAPA FISICO E MARCADORES

- Use como base os arquivos em:
  docs/MISSOES/OPERACAO_DA_MEIA_NOITE/PRODUTO/PRODUCAO_FISICA/MAPA_MANSAO_VESPER/
- A planta principal deve permanecer sem setas de rota para nao substituir as instrucoes do aplicativo.
- Mantenha o mapa quadrado, preparado para 50 x 50 cm.
- Marcadores de jogadores devem usar retratos circulares de 18 a 20 mm, com cor e simbolo de funcao. Gere arquivos de impressao separados, frente e verso, usando os avatares ja existentes.
- Nao confunda o mapa operacional com a planta-puzzle do Envelope 02.
- Crie separadamente a planta oficial incompleta e a transparencia A3 dos corredores ocultos. Elas devem alinhar pelos registros sem cobrir nomes.
- A pista visual da planta-puzzle do PZ-02 deve contribuir para 2317 sem escrever a resposta pronta.
- Gere uma prova digital em escala e uma prova impressa antes de considerar o mapa aprovado.

12. REALTIME, OFFLINE E CONCORRENCIA

- Use canais de presenca, estado, alertas e transmissoes vinculados ao sessionId real.
- Realtime apenas notifica; apos reconexao, recarregue o snapshot autoritativo do servidor.
- Exiba reconectando sem perder o que esta na tela.
- Nao permita que cliente offline confirme decisao critica sem resposta do servidor.
- Ao retornar, sincronize etapa, votos pendentes, timers, inventario, localizacoes e transmissao atual.

13. ACESSIBILIDADE E EXPERIENCIA

- Touch targets de no minimo 44 px, foco visivel, teclado, contraste e reduced motion.
- Transcricao integral para toda midia.
- Nao anuncie cronometros a cada segundo para leitor de tela.
- Use aria-live apenas para mudancas relevantes.
- Nao dependa somente de cor para bloqueio, urgencia ou funcao.
- Evite telas excessivamente altas; a acao atual deve aparecer cedo no mobile.
- Nao coloque instrucoes tecnicas ou explicacoes de implementacao visiveis na interface.

14. TESTES OBRIGATORIOS

- Unitarios para condicoes, efeitos, maioria, empate, deadlines, consumo idempotente, pontuacao e todos os finais.
- Integracao para auth, licenca, criacao/entrada/reentrada, RLS, passos, decisoes, puzzle, voto, audio, replay e reorganizacao.
- Playwright com multiplos contexts representando anfitriao e participantes.
- Cobrir partida completa de cada rota usando transcricao no lugar de audio.
- Cobrir refresh no meio da transmissao, decisao e timer.
- Cobrir jogador desconectado, delegacao, modo compartilhado, empate, chave errada e policia chegando.
- Verificar que nenhuma resposta, deadline oculto, missao privada ou final futuro aparece no HTML, RSC payload, JSON ou Realtime antes da liberacao.
- Validar mobile 390 px, tablet 768 px e desktop 1440 px, sem overflow ou sobreposicao.
- Rodar lint, TypeScript, testes, build e screenshots Playwright.

15. DOCUMENTACAO E ENTREGA

- Atualize mapa de paginas, fluxo, estados, regras de celulares, votacao, delegacao, timers, pistas, inventario, banco, seguranca, midias e painel admin.
- Atualize PENDENCIAS e PENDENCIAS_MANUAIS com somente o que realmente depender de producao externa, principalmente arquivos finais de audio e prova grafica/fisica.
- Crie instrucoes objetivas para adicionar os MP3 depois: nome/codigo, formato, duracao, upload, aprovacao e teste.
- Liste migrations aplicadas, variaveis de ambiente necessarias e comandos de verificacao.
- Nao declare concluido se qualquer pagina da partida ainda for placeholder ou usar fixture.

DEFINICAO DE PRONTO

O trabalho so esta concluido quando, sem editar banco manualmente e sem depender de arquivos de audio, for possivel:

1. ativar uma licenca;
2. criar uma sala real;
3. entrar com tres ou mais jogadores;
4. distribuir e revelar funcoes;
5. iniciar por Orion e depois Vega, usando transcricao;
6. jogar cada uma das tres rotas;
7. abrir somente envelopes autorizados;
8. resolver puzzles e tomar decisoes por funcao;
9. movimentar e extrair os marcadores;
10. executar votacao secreta e desempate;
11. obter o final correto;
12. consultar historico e repetir transmissoes sem efeitos duplicados;
13. atualizar/reabrir em qualquer etapa sem perder progresso;
14. concluir a reorganizacao e liberar uma nova partida;
15. passar em todas as verificacoes tecnicas, de seguranca e responsividade.

Comece auditando o estado atual e as divergencias de conteudo. Depois implemente em etapas pequenas, mantendo no maximo uma etapa em andamento, e continue ate cumprir integralmente a definicao de pronto.
```
