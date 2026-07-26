insert into public.stories (slug,title,subtitle,trailer_copy,age_rating,min_players,max_players,duration_min,duration_max,status)
values ('operacao-da-meia-noite','Operação da Meia-Noite: A Chave Atlas','A verdade muda de mãos à meia-noite.','Uma festa de máscaras. Uma mansão blindada. Um leilão que nunca deveria existir.', '18+',3,6,90,120,'published')
on conflict (slug) do update set status='published';

-- Licenças reais devem ser geradas por uma função administrativa com hash do código.
-- Não inclua código de produção ou segredo no seed.
