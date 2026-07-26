# Pendências manuais / externas

Este arquivo contém somente ações que dependem de contas, decisões ou arquivos fora do workspace. O código e a documentação executáveis continuam registrados em `TASKS.md`.

1. Criar um projeto Supabase de produção e preencher as três chaves documentadas em `.env.example` no ambiente local/Vercel.
2. Aplicar as migrations em `supabase/migrations` e executar o seed apenas no desenvolvimento.
3. Criar o primeiro anfitrião e promover o perfil a admin por procedimento seguro no Supabase.
4. Configurar redirects, confirmação de e-mail, recuperação de senha, CAPTCHA/rate limit e políticas de Auth.
5. Produzir e fazer upload dos assets `MEDIA-OMN-*`, incluindo legendas e transcrições.
6. Produzir, imprimir, conferir e embalar os componentes físicos segundo `docs/PRODUCAO_FISICA/`.
7. Gerar licenças reais pelo fluxo administrativo; não usar códigos de desenvolvimento em produção.
8. Configurar domínio/QR Code final, CDN e política de backup.
9. Executar playtest presencial e registrar ajustes de narrativa, tempo, acessibilidade e materiais.
10. Promover para Vercel após lint, testes, E2E e build.
