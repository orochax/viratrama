insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values (
  'game-media',
  'game-media',
  false,
  52428800,
  array['audio/mpeg','image/webp','image/avif','image/jpeg','image/png','text/vtt']
)
on conflict(id) do update set
  public=false,
  file_size_limit=excluded.file_size_limit,
  allowed_mime_types=excluded.allowed_mime_types;

create policy "admins read game media"
on storage.objects for select to authenticated
using (
  bucket_id='game-media' and exists (
    select 1 from public.profiles p where p.id=auth.uid() and p.is_admin=true
  )
);

create policy "admins manage game media"
on storage.objects for all to authenticated
using (
  bucket_id='game-media' and exists (
    select 1 from public.profiles p where p.id=auth.uid() and p.is_admin=true
  )
)
with check (
  bucket_id='game-media' and exists (
    select 1 from public.profiles p where p.id=auth.uid() and p.is_admin=true
  )
);
