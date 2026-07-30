-- Canonical, versioned content for Operacao da Meia-Noite.
create table if not exists public.story_endings (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  slug text not null,
  title text not null,
  summary text not null,
  epilogue_media_code text,
  conditions jsonb not null default '[]',
  is_failure boolean not null default false,
  unique(story_id, slug)
);
alter table public.story_endings enable row level security;
create policy "published endings unavailable to clients" on public.story_endings
  for select using (false);

with story as (
  select id from public.stories where slug = 'operacao-da-meia-noite'
)
insert into public.roles(story_id, slug, name, description, ability, sort_order)
select story.id, role.slug, role.name, role.description, role.ability, role.sort_order
from story cross join (values
  ('infiltrador','O Infiltrador','Acessos discretos, movimentos arriscados e confirmacoes de campo.','Repete um movimento bloqueado sem elevar o alerta.',1),
  ('tecnica','A Tecnica','Sistemas, codigos, dispositivos e identificacao da Chave Atlas.','Remove uma tentativa invalida de um puzzle tecnico.',2),
  ('observador','O Observador','Planejamento de rota, leitura do ambiente e alerta.','Revela uma conexao publica adjacente no mapa.',3),
  ('negociadora','A Negociadora','Conversas, acusacoes e propostas com Helena, Matteo e Voss.','Desbloqueia uma alternativa publica em uma negociacao.',4),
  ('motorista','O Motorista','Inventario operacional, tempo e extracao.','Amplia o prazo de extracao uma vez.',5),
  ('analista','A Analista','Documentos, provas, Janus e passado de Orion.','Solicita a primeira pista documental sem penalidade.',6)
) as role(slug,name,description,ability,sort_order)
on conflict(story_id,slug) do update set
  name=excluded.name, description=excluded.description, ability=excluded.ability, sort_order=excluded.sort_order;

with story as (select id from public.stories where slug='operacao-da-meia-noite')
insert into public.acts(story_id,number,slug,title,summary,sort_order)
select story.id, act.number, act.slug, act.title, act.summary, act.number
from story cross join (values
  (1,'convite','O Convite','Orion e Vega abrem a operacao.'),
  (2,'plano','O Plano','A equipe escolhe entre tres rotas.'),
  (3,'vesper','A Mansao Vesper','As rotas convergem e o alarme e acionado.'),
  (4,'janus','Protocolo Janus','A chave e o destino dos arquivos entram em conflito.')
) as act(number,slug,title,summary)
on conflict(story_id,slug) do update set title=excluded.title,summary=excluded.summary,sort_order=excluded.sort_order;

with story as (select id from public.stories where slug='operacao-da-meia-noite')
insert into public.envelopes(story_id,code,title,instructions,physical_manifest)
select story.id,e.code,e.title,e.instructions,e.manifest::jsonb
from story cross join (values
  ('00','Dossie da operacao','Abrir somente depois das transmissoes de Orion e Vega.','{"dossie":1,"cartoes_funcao":6,"inventario":8}'),
  ('01','Entradas','Abrir quando o aplicativo autorizar a escolha de rota.','{"convites":3,"credenciais":6,"fotos":4}'),
  ('02','Planta incompleta','Sobrepor a transparencia usando as marcas de registro.','{"planta_a3":1,"transparencia_a3":1,"registros":2}'),
  ('03','Janus','Abrir na Biblioteca depois da confirmacao do aplicativo.','{"protocolo":1,"registros":4,"chaves_atlas":2}'),
  ('04','Camara Atlas','Abrir apenas diante da Camara Atlas.','{"cartoes_decisao":5,"cartoes_extracao":3}')
) as e(code,title,instructions,manifest)
on conflict(story_id,code) do update set
  title=excluded.title,instructions=excluded.instructions,physical_manifest=excluded.physical_manifest;

with story as (select id from public.stories where slug='operacao-da-meia-noite')
insert into public.inventory_items(story_id,code,name,description,scope,max_uses,effects,physical_reference)
select story.id,i.code,i.name,i.description,'collective',1,'{}'::jsonb,'Envelope 00'
from story cross join (values
  ('cartao-visitante','Cartao de visitante','Reduz a exposicao em uma interacao social.'),
  ('kit-derivacao','Kit de derivacao','Contorna uma trava tecnica de uso unico.'),
  ('lente-azul','Lente azul','Revela marcas de seguranca em documentos.'),
  ('comunicador','Comunicador seguro','Mantem o canal com Vega estavel.'),
  ('passe-servico','Passe de servico','Autoriza uma passagem pela area de funcionarios.'),
  ('bloqueador','Bloqueador de sinal','Atrasa uma elevacao de alerta.'),
  ('microcamera','Microcamera','Registra uma evidencia de campo.'),
  ('chave-garagem','Chave da garagem','Mantem a saida da garagem disponivel.')
) as i(code,name,description)
where not exists (
  select 1 from public.inventory_items x where x.story_id=story.id and x.code=i.code
);
create unique index if not exists inventory_items_story_code_unique on public.inventory_items(story_id,code);

with story as (select id from public.stories where slug='operacao-da-meia-noite')
insert into public.story_endings(story_id,slug,title,summary,epilogue_media_code,conditions,is_failure)
select story.id,e.slug,e.title,e.summary,e.media,e.conditions::jsonb,e.failure
from story cross join (values
  ('novo-atlas','O Novo Atlas','A equipe mantem a chave verdadeira.','MEDIA-OMN-END-01','[{"vote":"manter"},{"true_key":true},{"extracted":true}]',false),
  ('transparencia-brutal','Transparencia Brutal','Os arquivos escapam para o mundo.','MEDIA-OMN-END-02','[{"vote":"divulgar"},{"true_key":true},{"extracted":true}]',false),
  ('cinzas','Cinzas','A chave e destruida antes que qualquer lado a controle.','MEDIA-OMN-END-03','[{"vote":"destruir"},{"true_key":true},{"extracted":true}]',false),
  ('acordo-voss','O Acordo Voss','Voss recupera o Atlas sob os termos da equipe.','MEDIA-OMN-END-04','[{"vote":"voss"},{"true_key":true},{"extracted":true}]',false),
  ('donos-segredo','Os Donos do Segredo','Orion recebe a chave e sela a verdade.','MEDIA-OMN-END-05','[{"vote":"orion"},{"true_key":true},{"extracted":true}]',false),
  ('chave-errada','A Chave Errada','A decisao foi tomada sobre uma copia.','MEDIA-OMN-END-06','[{"selected_true_key":false}]',true),
  ('doze-minutos','Doze Minutos','A policia chega antes da extracao.','MEDIA-OMN-END-07','[{"police_expired":true}]',true)
) as e(slug,title,summary,media,conditions,failure)
on conflict(story_id,slug) do update set
  title=excluded.title,summary=excluded.summary,epilogue_media_code=excluded.epilogue_media_code,
  conditions=excluded.conditions,is_failure=excluded.is_failure;

with payload as (
  select * from jsonb_to_recordset(
    '[
      {"act":1,"slug":"orion-abertura","type":"transmission","title":"Canal Orion","role":null,"sort":1,"content":{"objective":"Escutem ou leiam a transmissao.","media":"MEDIA-OMN-ORION-01","envelope":"00"}},
      {"act":1,"slug":"vega-briefing","type":"transmission","title":"Vega assume o canal","role":null,"sort":2,"content":{"objective":"Conhecam a missao.","media":"MEDIA-OMN-VEGA-01","envelope":"00"}},
      {"act":1,"slug":"abrir-envelope-00","type":"instruction","title":"Abram o dossie","role":null,"sort":3,"content":{"envelope":"00"}},
      {"act":1,"slug":"selecionar-equipamento","type":"loadout","title":"Quatro escolhas","role":"motorista","sort":4,"content":{"count":4}},
      {"act":2,"slug":"votar-rota","type":"route_vote","title":"Tres entradas","role":null,"sort":5,"content":{"routes":["social","servico","tecnica"]}},
      {"act":2,"slug":"confirmar-rota","type":"decision","title":"Escolha a entrada","role":"observador","sort":6,"content":{"routes":["social","servico","tecnica"]}},
      {"act":2,"slug":"entrada-mansao","type":"movement","title":"Cruzem o primeiro limite","role":"infiltrador","sort":7,"content":{"graph":"vesper-v1"}},
      {"act":2,"slug":"contato-helena","type":"decision","title":"Helena Crowe observa","role":"negociadora","sort":8,"content":{"options":["pressionar","cooperar","desviar"]}},
      {"act":2,"slug":"planta-incompleta","type":"puzzle","title":"Corredores ausentes","role":"analista","sort":9,"content":{"puzzle":"PZ-02","envelope":"02"}},
      {"act":3,"slug":"avancar-biblioteca","type":"movement","title":"Convergencia","role":"infiltrador","sort":10,"content":{"target":"biblioteca"}},
      {"act":3,"slug":"janus","type":"puzzle","title":"Protocolo Janus","role":"analista","sort":11,"content":{"puzzle":"PZ-JANUS","envelope":"03"}},
      {"act":3,"slug":"sistema-atlas","type":"puzzle","title":"Assinatura Atlas","role":"tecnica","sort":12,"content":{"puzzle":"PZ-ATLAS","envelope":"03"}},
      {"act":3,"slug":"alarme","type":"transmission","title":"O alarme muda a noite","role":null,"sort":13,"content":{"media":"MEDIA-OMN-VEGA-ALERTA","police_seconds":720}},
      {"act":4,"slug":"camara-atlas","type":"movement","title":"A Camara Atlas","role":"infiltrador","sort":14,"content":{"target":"camara-atlas","envelope":"04"}},
      {"act":4,"slug":"destino-atlas","type":"final_vote","title":"Quem fica com a verdade?","role":null,"sort":15,"content":{"sealed":true}},
      {"act":4,"slug":"extracao","type":"extraction","title":"Saiam antes das sirenes","role":"motorista","sort":16,"content":{"exits":["portao-principal","garagem","jardins"]}}
    ]'::jsonb
  ) as x(act int,slug text,type text,title text,role text,sort int,content jsonb)
), rows as (
  select a.id act_id,p.* from payload p join public.acts a on a.number=p.act
  join public.stories s on s.id=a.story_id and s.slug='operacao-da-meia-noite'
)
insert into public.story_steps(act_id,slug,type,title,content,responsible_role_slug,sort_order)
select act_id,slug,type,title,content,role,sort from rows
on conflict(act_id,slug) do update set
  type=excluded.type,title=excluded.title,content=excluded.content,
  responsible_role_slug=excluded.responsible_role_slug,sort_order=excluded.sort_order;

with story as (select id from public.stories where slug='operacao-da-meia-noite'),
puzzle_seed(slug,step_slug,answer,max_attempts) as (values
  ('planta-incompleta','planta-incompleta','2317',5),
  ('janus','janus','ORION',4),
  ('sistema-atlas','sistema-atlas','ATLAS-7',4)
)
insert into public.puzzles(story_id,step_id,slug,answer_hash,normalization_rule,max_attempts,metadata)
select story.id,st.id,p.slug,encode(digest(p.answer,'sha256'),'hex'),'trim_upper',p.max_attempts,'{}'
from story cross join puzzle_seed p
join public.story_steps st on st.slug=p.step_slug
join public.acts a on a.id=st.act_id and a.story_id=story.id
where not exists (select 1 from public.puzzles x where x.story_id=story.id and x.slug=p.slug);
create unique index if not exists puzzles_story_slug_unique on public.puzzles(story_id,slug);

with hint_seed(slug,level,content,penalty,cooldown) as (values
  ('planta-incompleta',1,'Alinhem primeiro as quatro marcas de registro.',3,30),
  ('planta-incompleta',2,'Procurem os numeros formados pelos vazios.',6,45),
  ('planta-incompleta',3,'Leiam da entrada social em direcao a Camara Atlas.',9,60),
  ('janus',1,'Janus olha para o passado e para o futuro.',3,30),
  ('janus',2,'As iniciais dos registros formam um nome.',6,45),
  ('janus',3,'O nome pertence a quem abriu o primeiro canal.',9,60),
  ('sistema-atlas',1,'Compare os pulsos azuis das duas chaves.',3,30),
  ('sistema-atlas',2,'A assinatura valida repete sete intervalos.',6,45),
  ('sistema-atlas',3,'Informe o protocolo seguido do numero de intervalos.',9,60)
)
insert into public.hints(puzzle_id,level,content,penalty,cooldown)
select p.id,h.level,h.content,h.penalty,h.cooldown
from hint_seed h join public.puzzles p on p.slug=h.slug
join public.stories s on s.id=p.story_id and s.slug='operacao-da-meia-noite'
where not exists (select 1 from public.hints x where x.puzzle_id=p.id and x.level=h.level);

with story as (select id from public.stories where slug='operacao-da-meia-noite')
insert into public.story_versions(story_id,version,content,checksum,published_at)
select story.id,2,jsonb_build_object(
  'roles',(select jsonb_agg(to_jsonb(r) - 'id' - 'story_id') from public.roles r where r.story_id=story.id),
  'acts',(select jsonb_agg(to_jsonb(a) - 'id' - 'story_id' order by a.number) from public.acts a where a.story_id=story.id),
  'steps',(select jsonb_agg(to_jsonb(st) - 'id' - 'act_id' order by st.sort_order) from public.story_steps st join public.acts a on a.id=st.act_id where a.story_id=story.id),
  'endings',(select jsonb_agg(to_jsonb(e) - 'id' - 'story_id') from public.story_endings e where e.story_id=story.id)
),encode(digest('operacao-da-meia-noite:v2','sha256'),'hex'),now()
from story
on conflict(story_id,version) do update set
  content=excluded.content,checksum=excluded.checksum,published_at=excluded.published_at;

update public.stories set version=2 where slug='operacao-da-meia-noite';
