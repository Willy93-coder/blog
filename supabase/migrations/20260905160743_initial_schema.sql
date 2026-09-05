-- ============================================================================
-- Blog app: full schema rebuild
--
-- This is a from-scratch recreation (drop + create) of the whole public
-- schema, written while the project still has no real data. It replaces
-- the schema that was previously applied ad-hoc through the SQL editor.
--
-- Fixes included over the previous version:
--   1. post.created_by: the creating author is now stored directly on the
--      post row (default auth.uid()). Previously the only author link was
--      post_user, populated by an AFTER INSERT trigger — which runs too
--      late for the SELECT-policy check that Postgres performs when a
--      client does INSERT ... RETURNING (i.e. supabase-js's
--      .insert(...).select()). That race made every post creation fail
--      with "new row violates row-level security policy for table post".
--   2. is_post_author, an RLS-only helper never called from the app, moved
--      to a "private" schema that PostgREST does not expose, so it can no
--      longer be reached via /rest/v1/rpc/*. is_allowlisted() stays in
--      public and exposed on purpose: useAuth.ts calls it directly via
--      $supabase.rpc('is_allowlisted') to gate access after login.
--   3. Duplicate permissive SELECT policies on post/tag/post_tag merged or
--      split by command, so only one permissive policy applies per
--      role/action (was flagged by the Supabase performance advisor).
--   4. All function calls inside policies wrapped in (select ...) so
--      Postgres can cache/initplan them instead of re-evaluating per row.
--   5. Least-privilege grants: EXECUTE revoked from PUBLIC by default and
--      re-granted only to the roles that actually need it.
--   6. Signup ("Allow new users to sign up") is open to anyone with a
--      GitHub account; only the app's client-side middleware (isAllowedUser
--      + signOut) kept non-allowlisted signups out of the studio UI. RLS
--      itself was too permissive: profile/allowed_github_user/post_user
--      used `using (true)` for any authenticated role, so a signed-up but
--      non-allowlisted user could read every profile, the full allowlist,
--      and every post/author link directly via the REST API, bypassing the
--      UI gate entirely. Fixed so those tables only expose: a user's own
--      row, allowlisted authors, or data tied to an already-published post
--      (the last case also fixes PostPublic.vue's byline, which could
--      never resolve an author for anon visitors under the old policies).
-- ============================================================================

-- 1. Drop existing objects ---------------------------------------------------

drop trigger if exists on_auth_user_created on auth.users;

drop table if exists public.post_tag cascade;
drop table if exists public.post_user cascade;
drop table if exists public.post cascade;
drop table if exists public.tag cascade;
drop table if exists public.allowed_github_user cascade;
drop table if exists public.profile cascade;

drop function if exists public.add_post_author_on_insert() cascade;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.is_allowlisted() cascade;
drop function if exists public.is_post_author(uuid) cascade;
drop function if exists public.mark_post_deletion() cascade;
drop function if exists public.mark_profile_deletion() cascade;
drop function if exists public.prevent_created_by_change() cascade;
drop function if exists public.prevent_removing_last_author() cascade;
drop function if exists public.set_published_at() cascade;
drop function if exists public.set_updated_at() cascade;

drop schema if exists private cascade;
create schema private;

-- 2. Tables -------------------------------------------------------------

create table public.profile (
  id                  uuid primary key references auth.users (id) on delete cascade,
  github_username     text,
  github_profile_url  text,
  github_avatar_url   text,
  full_name           text,
  created_at          timestamptz not null default now()
);

create table public.allowed_github_user (
  github_username  text primary key,
  created_at       timestamptz not null default now()
);

create table public.tag (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.post (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  subtitle      text,
  content       text not null,
  published     boolean not null default false,
  created_by    uuid not null references public.profile (id) default auth.uid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  published_at  timestamptz
);

create table public.post_user (
  post_id     uuid not null references public.post (id) on delete cascade,
  user_id     uuid not null references public.profile (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.post_tag (
  post_id     uuid not null references public.post (id) on delete cascade,
  tag_id      uuid not null references public.tag (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (post_id, tag_id)
);

-- 3. Indexes --------------------------------------------------------------

create index idx_post_published on public.post using btree (published_at desc) where (published = true);
create index idx_post_created_by on public.post (created_by);
create index idx_post_user_user_id on public.post_user (user_id);
create index idx_post_tag_tag_id on public.post_tag (tag_id);

-- 4. RLS helper functions (private schema, not exposed via PostgREST) -------

-- Exposed on purpose via PostgREST: called directly as
-- $supabase.rpc('is_allowlisted') from useAuth.ts after login.
create function public.is_allowlisted()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profile             p
    join public.allowed_github_user a on a.github_username = p.github_username
    where p.id = auth.uid()
  );
$$;

create function private.is_post_author(p_post_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.post_user
    where post_id = p_post_id
      and user_id = auth.uid()
  );
$$;

-- 5. Trigger functions (public schema) -------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profile (
    id,
    github_username,
    github_profile_url,
    github_avatar_url,
    full_name
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'user_name',
      new.raw_user_meta_data->>'preferred_username',
      new.raw_user_meta_data->>'login'
    ),
    'https://github.com/' || coalesce(
      new.raw_user_meta_data->>'user_name',
      new.raw_user_meta_data->>'preferred_username',
      new.raw_user_meta_data->>'login'
    ),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name'
    )
  )
  on conflict (id) do update set
    github_username    = excluded.github_username,
    github_profile_url = excluded.github_profile_url,
    github_avatar_url  = excluded.github_avatar_url,
    full_name          = excluded.full_name;

  return new;
end;
$$;

create function public.add_post_author_on_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.post_user (post_id, user_id)
  values (new.id, auth.uid())
  on conflict do nothing;

  return new;
end;
$$;

create function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function public.set_published_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (old.published is distinct from new.published) and new.published = true then
    if new.published_at is null then
      new.published_at = now();
    end if;
  end if;

  return new;
end;
$$;

create function public.prevent_created_by_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.created_by is distinct from old.created_by then
    raise exception 'created_by cannot be changed once a post is created';
  end if;

  return new;
end;
$$;

create function public.mark_post_deletion()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- true = LOCAL: cleared automatically at the end of the transaction.
  perform set_config('app.deleting_post_id', old.id::text, true);
  return old;
end;
$$;

create function public.mark_profile_deletion()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform set_config('app.deleting_profile_id', old.id::text, true);
  return old;
end;
$$;

create function public.prevent_removing_last_author()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  remaining_authors int;
begin
  -- Primary cascade detection: a BEFORE DELETE trigger on public.post sets
  -- this variable before the FK cascade fires on post_user.
  if current_setting('app.deleting_post_id', true) = old.post_id::text then
    return old;
  end if;

  -- Fallback: post row is already gone (e.g. deferred constraint path).
  if not exists (
    select 1 from public.post where id = old.post_id
  ) then
    return old;
  end if;

  select count(*) into remaining_authors
  from public.post_user
  where post_id = old.post_id
    and user_id <> old.user_id;

  if remaining_authors = 0 then
    -- Cascade from a profile deletion: delete the orphaned post instead
    -- of blocking. The post's own cascade cleans up post_user/post_tag.
    if current_setting('app.deleting_profile_id', true) = old.user_id::text then
      delete from public.post where id = old.post_id;
      return old;
    end if;

    -- Manual removal of the last author from the app: still blocked.
    raise exception 'A post must have at least one author';
  end if;

  return old;
end;
$$;

-- 6. Triggers -----------------------------------------------------------

create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute function public.handle_new_user();

create trigger trg_profile_mark_deletion
  before delete on public.profile
  for each row execute function public.mark_profile_deletion();

create trigger trg_post_updated_at
  before update on public.post
  for each row execute function public.set_updated_at();

create trigger trg_post_published_at
  before update on public.post
  for each row execute function public.set_published_at();

create trigger trg_post_immutable_created_by
  before update on public.post
  for each row execute function public.prevent_created_by_change();

create trigger trg_post_mark_deletion
  before delete on public.post
  for each row execute function public.mark_post_deletion();

create trigger trg_post_user_add_author
  after insert on public.post
  for each row execute function public.add_post_author_on_insert();

create trigger trg_post_user_prevent_last_author
  before delete on public.post_user
  for each row execute function public.prevent_removing_last_author();

create trigger trg_tag_updated_at
  before update on public.tag
  for each row execute function public.set_updated_at();

-- 7. Row Level Security ---------------------------------------------------

alter table public.profile enable row level security;
alter table public.allowed_github_user enable row level security;
alter table public.tag enable row level security;
alter table public.post enable row level security;
alter table public.post_user enable row level security;
alter table public.post_tag enable row level security;

-- profile: visible to yourself, to allowlisted authors (studio collaborator
-- list), or to anyone when the profile authored a published post (public
-- byline on PostPublic.vue)
create policy profile_select on public.profile
  for select
  to anon, authenticated
  using (
    id = (select auth.uid())
    or (select public.is_allowlisted())
    or exists (
      select 1
      from public.post_user pu
      join public.post p on p.id = pu.post_id
      where pu.user_id = profile.id
        and p.published = true
    )
  );

-- allowed_github_user: no direct table access for any client role. Only
-- is_allowlisted() (SECURITY DEFINER, bypasses RLS) needs to read this —
-- the app never queries the table directly.

-- tag: readable by everyone, writes restricted to allowlisted authors
create policy tag_select_all on public.tag
  for select
  to anon, authenticated
  using (true);

create policy tag_insert_allowlisted on public.tag
  for insert
  to authenticated
  with check ((select public.is_allowlisted()));

create policy tag_update_allowlisted on public.tag
  for update
  to authenticated
  using ((select public.is_allowlisted()))
  with check ((select public.is_allowlisted()));

create policy tag_delete_allowlisted on public.tag
  for delete
  to authenticated
  using ((select public.is_allowlisted()));

-- post: public sees published posts; authors also see their own drafts
create policy post_select on public.post
  for select
  to anon, authenticated
  using (
    published = true
    or created_by = (select auth.uid())
    or (select private.is_post_author(id))
  );

create policy post_insert_allowlisted on public.post
  for insert
  to authenticated
  with check (
    (select public.is_allowlisted())
    and created_by = (select auth.uid())
  );

create policy post_update_authors on public.post
  for update
  to authenticated
  using ((select private.is_post_author(id)))
  with check ((select private.is_post_author(id)));

create policy post_delete_authors on public.post
  for delete
  to authenticated
  using ((select private.is_post_author(id)));

-- post_user: visible for your own authorship rows, to allowlisted authors
-- (studio needs to see draft authorship), or when the linked post is
-- published (public byline on PostPublic.vue)
create policy post_user_select on public.post_user
  for select
  to anon, authenticated
  using (
    user_id = (select auth.uid())
    or (select public.is_allowlisted())
    or exists (
      select 1 from public.post p
      where p.id = post_user.post_id and p.published = true
    )
  );

create policy post_user_insert_by_author on public.post_user
  for insert
  to authenticated
  with check ((select private.is_post_author(post_id)));

create policy post_user_delete_by_author on public.post_user
  for delete
  to authenticated
  using ((select private.is_post_author(post_id)));

-- post_tag: readable when the post is published or the caller is an author
create policy post_tag_select on public.post_tag
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.post p
      where p.id = post_tag.post_id and p.published = true
    )
    or (select private.is_post_author(post_id))
  );

create policy post_tag_insert_authors on public.post_tag
  for insert
  to authenticated
  with check ((select private.is_post_author(post_id)));

create policy post_tag_update_authors on public.post_tag
  for update
  to authenticated
  using ((select private.is_post_author(post_id)))
  with check ((select private.is_post_author(post_id)));

create policy post_tag_delete_authors on public.post_tag
  for delete
  to authenticated
  using ((select private.is_post_author(post_id)));

-- 8. Least-privilege grants -------------------------------------------------

-- Supabase's default privileges auto-grant EXECUTE on every new public
-- function directly to anon/authenticated (not via the PUBLIC pseudo-role),
-- so "revoke ... from public" alone does not remove it. Revoke from all
-- three explicitly, then re-grant only to the roles that actually need it.

grant usage on schema private to authenticated, anon;

-- Exposed RPC used by useAuth.ts right after login. Also needed by anon
-- because profile_select/post_user_select call it from a policy scoped to
-- anon too; for anon it always evaluates to false (auth.uid() is null),
-- so granting it is safe.
revoke execute on function public.is_allowlisted() from public, anon, authenticated;
grant execute on function public.is_allowlisted() to authenticated, anon;

revoke execute on function private.is_post_author(uuid) from public, anon, authenticated;
grant execute on function private.is_post_author(uuid) to authenticated, anon;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to supabase_auth_admin;

revoke execute on function public.add_post_author_on_insert() from public, anon, authenticated;
grant execute on function public.add_post_author_on_insert() to authenticated;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
grant execute on function public.set_updated_at() to authenticated;

revoke execute on function public.set_published_at() from public, anon, authenticated;
grant execute on function public.set_published_at() to authenticated;

revoke execute on function public.prevent_created_by_change() from public, anon, authenticated;
grant execute on function public.prevent_created_by_change() to authenticated;

revoke execute on function public.mark_post_deletion() from public, anon, authenticated;
grant execute on function public.mark_post_deletion() to authenticated;

revoke execute on function public.mark_profile_deletion() from public, anon, authenticated;
grant execute on function public.mark_profile_deletion() to authenticated;

revoke execute on function public.prevent_removing_last_author() from public, anon, authenticated;
grant execute on function public.prevent_removing_last_author() to authenticated;

-- 9. Seed data ------------------------------------------------------------

-- Intentionally not versioned here: this repo is public, and the allowed
-- GitHub usernames are private. After running this migration, apply
-- supabase/seed.local.sql by hand (it's gitignored) to repopulate the
-- allowlist.
