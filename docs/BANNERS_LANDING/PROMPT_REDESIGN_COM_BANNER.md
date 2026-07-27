# Prompt mestre - landing page ViraTrama

```text
Reformule completamente a landing page da ViraTrama neste projeto, executando a implementação, os testes e os ajustes visuais até o final.

BANNER_ESCOLHIDO: 3. docs/BANNERS_LANDING/03-produto-fisico.png

Opcoes disponiveis:
1. docs/BANNERS_LANDING/01-poster-espionagem.png
2. docs/BANNERS_LANDING/02-orion-vs-voss.png
3. docs/BANNERS_LANDING/03-produto-fisico.png
4. docs/BANNERS_LANDING/04-baile-mansao-vesper.png
5. docs/BANNERS_LANDING/05-transmissao-interceptada.png
6. docs/BANNERS_LANDING/06-dossie-vivo.png

O banner escolhido para esta versao e a opcao 3. Preserve as outras cinco opcoes para uso futuro.

CONTEXTO DO PRODUTO

A ViraTrama e uma loja de experiencias investigativas narrativas. Ela deve comportar varias historias e missoes independentes no futuro. Atualmente existe somente "Operacao da Meia-Noite: A Chave Atlas", que sera o primeiro produto em destaque. A pagina deve apresentar a marca ViraTrama, vender a proposta da experiencia e funcionar como catalogo de missoes, sem parecer uma pagina exclusiva de uma unica historia.

Use o site sobinvestigacao.com e o screenshot fornecido somente como referencia de ritmo, hierarquia comercial, impacto visual e ordem das secoes. Nao copie identidade, textos, composicoes, logotipo ou elementos proprietarios. O resultado precisa ser original e coerente com a ViraTrama.

DIRECAO VISUAL

- Crie uma estetica cinematografica, editorial, investigativa e premium, com leitura clara de loja.
- Use preto e carvao como base, marfim para textos, vinho escuro como cor de acao, latao envelhecido em detalhes e azul-gelo pontual na tecnologia da narrativa.
- Evite aparencia de SaaS, cyberpunk, cassino, quadro policial com fios vermelhos, gore, gradientes decorativos, esferas luminosas, excesso de cards e excesso de bordas arredondadas.
- Use tipografia editorial serifada combinada com uma sans forte ou condensada para titulos comerciais. Nao use letter-spacing negativo.
- Cards devem ter raio maximo de 6px. Nao coloque cards dentro de cards.
- Use icones Lucide nos controles sempre que houver um equivalente.

ESTRUTURA OBRIGATORIA

1. Barra de anuncio no topo
- Crie uma faixa curta e configuravel para comunicados comerciais.
- Nao invente frete gratis, desconto, prazo ou politica. Se o projeto nao tiver uma campanha real cadastrada, use uma mensagem institucional verdadeira ou deixe a faixa preparada para ser ocultada.

2. Cabecalho
- No mobile: botao de menu, marca ViraTrama centralizada e icone do carrinho.
- No desktop: marca em destaque, navegacao curta e acesso ao carrinho.
- Preserve as rotas e fluxos existentes, incluindo /ativar, /entrar, /biblioteca, /historia e paginas de sala.

3. Banner principal
- Use exatamente o arquivo definido em BANNER_ESCOLHIDO.
- Copie o ativo selecionado para uma pasta apropriada em public/media/landing e carregue-o com next/image.
- Exiba-o como banner real e responsivo, nao como uma foto de fundo generica. A imagem deve ser o principal sinal visual da primeira dobra.
- Defina enquadramentos desktop e mobile que mantenham personagens e materiais importantes visiveis, sem distorcer ou achatar a imagem.
- Sobreponha em HTML, com contraste e legibilidade: ViraTrama, "Operacao da Meia-Noite", uma frase curta sobre a missao e um CTA para conhecer a experiencia.
- Nao grave titulo, preco, CTA ou texto comercial dentro da imagem.
- Deixe uma indicacao visual da proxima secao em todas as alturas de viewport.

4. Carrossel de diferenciais
- Logo depois do banner, crie uma faixa horizontal de cards que avancam automaticamente a cada 3 segundos.
- Inclua controles manuais com setas e indicadores, navegacao por teclado, rotulos ARIA e foco visivel.
- Pause no hover, no foco e durante interacao por toque. Respeite prefers-reduced-motion.
- O carrossel nao pode mudar a altura da pagina nem causar layout shift.
- Use diferenciais reais da ViraTrama: "A historia ocupa a mesa", "Todos entram na trama", "Cada decisao deixa marca", "Personagens atravessam a tela", "Segredos dentro da equipe" e "Experiencia fisica + digital".
- Escreva uma descricao curta e concreta para cada diferencial, sem promessas ou numeros inventados.

5. Catalogo de missoes
- Use a chamada "MISSOES DISPONIVEIS" e o titulo "Escolha sua missao".
- Modele os produtos em uma estrutura de dados reutilizavel, pois novas historias serao adicionadas depois.
- Exiba atualmente apenas "Operacao da Meia-Noite: A Chave Atlas".
- O card do produto deve ter imagem forte, selo de disponibilidade, titulo, sinopse curta, genero e somente informacoes documentadas no projeto, como jogadores, duracao e classificacao.
- Trate a missao como uma experiencia hibrida fisica + digital. Nao crie seletores separados de midia fisica e digital se isso nao existir no produto.
- Mostre preco, estoque, frete e botao de adicionar ao carrinho somente se esses dados e o fluxo de compra ja existirem no projeto. Caso contrario, use "Ver missao" ou "Em breve".
- Nao invente dificuldade, preco, desconto, avaliacao, depoimentos, quantidade vendida ou prazo de entrega.

6. Conteudo de apoio
- Depois do catalogo, implemente secoes enxutas para: como funciona em quatro etapas, experiencia fisica + digital, personagens da Operacao da Meia-Noite, para quem e a experiencia, perguntas frequentes e CTA final.
- A marca ViraTrama deve continuar sendo a protagonista; a Operacao da Meia-Noite e o produto atual.
- Use conteudo ja existente no repositorio como fonte de verdade. Nao invente mecanicas, finais, recursos ou beneficios.

REQUISITOS DE IMPLEMENTACAO

- Antes de editar codigo, leia a documentacao relevante desta versao em node_modules/next/dist/docs, pois o projeto usa uma versao do Next.js com mudancas importantes.
- Reaproveite componentes, estilos, fontes, dados, rotas e convencoes ja presentes sempre que forem adequados.
- Implemente responsividade mobile-first e garanta que textos, controles, imagens e cards nao se sobreponham nem estourem seus containers.
- Use dimensoes estaveis, aspect-ratio e limites responsivos para evitar saltos de layout.
- Garanta semantica HTML, contraste, textos alternativos, foco visivel, operacao por teclado e estados de hover/focus/disabled.
- Nao quebre a experiencia jogavel nem os fluxos internos existentes.

VALIDACAO OBRIGATORIA

- Execute lint, build e os testes existentes.
- Inicie o projeto e valide a pagina com Playwright em 390x844, 768x1024 e 1440x900.
- Inspecione screenshots, console do navegador, carregamento das imagens e interacoes do carrossel.
- Corrija clipping, overflow horizontal, sobreposicoes, imagens mal enquadradas, textos ilegíveis e erros de console antes de concluir.
- Ao final, informe objetivamente os arquivos alterados, as validacoes executadas e qualquer limitacao real encontrada.
```
