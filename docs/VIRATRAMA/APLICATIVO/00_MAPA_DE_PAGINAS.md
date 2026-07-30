# Mapa de paginas

## Compra e conta

- `/`: loja ViraTrama.
- `/historia`: produto Operacao da Meia-Noite.
- `/ativar`: validacao da Chave Atlas, cadastro no primeiro acesso e login nos seguintes.
- `/carrinho`: identificacao, endereco quando fisico e inicio do Checkout AbacatePay.
- `/pedido/[orderId]`: confirmacao do pagamento, rastreio e entrega protegida da licenca.
- `/entrar`, `/cadastro`, `/recuperar-senha`, `/conta`: Supabase Auth real.
- `/biblioteca`: licencas do usuario, partida em andamento, resultado e bloqueio por reorganizacao.
- `/entrar-sala`: entrada de participante por codigo.

## Sala

- `/sala/[roomCode]`: resolve a identidade do aparelho e encaminha ao estado atual.
- `lobby`, `participantes`: entrada, presenca e confirmacao de 3 a 6 pessoas.
- `funcoes`, `revelar`, `briefing`: distribuicao, revelacao privada e preparo do Envelope 00.
- `jogo`: dashboard e executor do passo autoritativo.
- `mapa`, `inventario`, `arquivos`, `mensagens`, `pistas`: consultas do estado desbloqueado.
- `resultado`, `reorganizacao`: final alcancado e liberacao forte do kit.

O menu inferior da partida permanece disponivel no celular. Nenhuma rota de sala usa
fixture ou `PlaceholderPage`.

## Administracao

- `/admin`: contagens reais.
- `/admin/historias`: versao e catalogo canonico.
- `/admin/licencas`: geracao de lotes; o codigo completo aparece somente uma vez.
- `/admin/midias`: upload privado, transcricao, aprovacao e substituicao.
- `/admin/documentacao`: indice operacional.
