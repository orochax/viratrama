# Banco de dados

Migrations, na ordem:

1. `202607260001_foundation.sql`
2. `202607260002_story_content.sql`
3. `202607260003_audio_transmissions.sql`
4. `202607300001_live_game.sql`
5. `202607300002_operation_midnight_v2.sql`
6. `202607300003_private_game_media.sql`
7. `202607300004_server_authority_hardening.sql`
8. `202607300005_commerce_abacatepay.sql`

A quarta migration adiciona versao otimista, deadlines, reentrada, recibos idempotentes,
localizacoes e conteudo versionado. A quinta semeia funcoes, atos, 16 passos, envelopes,
oito itens, puzzles com respostas em hash, pistas e sete finais. A sexta cria o bucket
privado e restringe a administracao de arquivos.
 A setima revoga acesso direto do navegador a estado, respostas, votos, finais e
midias internas; somente a API com service role produz os DTOs filtrados.
 A oitava cria pedidos, itens, enderecos, eventos de pagamento, entregas e a
associacao idempotente entre uma unidade comprada e sua licenca.

`game_sessions.state` guarda o checkpoint autoritativo da execucao. Tabelas normalizadas
guardam catalogo, auditoria e historico. `claim_session_version` impede duas abas de
confirmarem o mesmo estado. `session_action_receipts` retorna o mesmo resultado quando
uma requisicao e repetida.

Convidados nunca consultam o Supabase diretamente. A API Next valida o hash do cookie
e produz um DTO sem resposta de puzzle, final futuro, voto alheio, missao privada ou
deadline policial bloqueado.
