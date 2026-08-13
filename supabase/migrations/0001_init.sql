-- Honeycomb v1 schema. Authoritative; see docs/SPEC.md.

create extension if not exists pgcrypto;

-- ---------- tables ----------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  color text not null default 'amber',
  created_at timestamptz not null default now()
);

create table public.circles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.circle_members (
  circle_id uuid not null references public.circles (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'admin')),
  joined_at timestamptz not null default now(),
  primary key (circle_id, user_id)
);

create table public.invites (
  token text primary key,
  circle_id uuid not null references public.circles (id) on delete cascade,
  created_by uuid not null references public.profiles (id),
  expires_at timestamptz,
  max_uses int,
  uses int not null default 0,
  created_at timestamptz not null default now()
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('readwise', 'folder')),
  label text not null,
  config jsonb not null default '{}'::jsonb,
  paused boolean not null default false,
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

-- Service-role only; never granted to authenticated/anon.
create table public.source_secrets (
  source_id uuid primary key references public.sources (id) on delete cascade,
  token text not null
);

create table public.source_shares (
  source_id uuid not null references public.sources (id) on delete cascade,
  circle_id uuid not null references public.circles (id) on delete cascade,
  primary key (source_id, circle_id)
);

create table public.items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  external_id text not null,
  kind text not null default 'article'
    check (kind in ('article', 'book', 'podcast', 'video', 'note', 'tweet', 'pdf', 'highlight')),
  title text not null,
  author text,
  url text,
  excerpt text,
  tags text[] not null default '{}',
  saved_at timestamptz,
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  unique (source_id, external_id)
);

create index items_user_idx on public.items (user_id, saved_at desc);
create index items_source_idx on public.items (source_id);

create table public.blends (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles (id) on delete cascade,
  trigger text not null default 'cron' check (trigger in ('first', 'cron', 'manual')),
  status text not null default 'pending' check (status in ('pending', 'done', 'failed')),
  model text,
  created_at timestamptz not null default now()
);

create index blends_circle_idx on public.blends (circle_id, created_at desc);

create table public.prompts (
  id uuid primary key default gen_random_uuid(),
  blend_id uuid not null references public.blends (id) on delete cascade,
  circle_id uuid not null references public.circles (id) on delete cascade,
  kind text not null check (kind in ('room', 'intro', 'give', 'pick')),
  body text not null,
  participants uuid[] not null default '{}',
  evidence jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index prompts_circle_idx on public.prompts (circle_id, created_at desc);

create table public.reactions (
  prompt_id uuid not null references public.prompts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('useful', 'awkward', 'discussed', 'more')),
  created_at timestamptz not null default now(),
  primary key (prompt_id, user_id, kind)
);

-- ---------- helpers ----------

create or replace function public.is_circle_member(p_circle_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.circle_members
    where circle_id = p_circle_id and user_id = auth.uid()
  );
$$;

-- Auto-create profile on signup (display name from email local part).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- RLS ----------

alter table public.profiles enable row level security;
alter table public.circles enable row level security;
alter table public.circle_members enable row level security;
alter table public.invites enable row level security;
alter table public.sources enable row level security;
alter table public.source_secrets enable row level security;
alter table public.source_shares enable row level security;
alter table public.items enable row level security;
alter table public.blends enable row level security;
alter table public.prompts enable row level security;
alter table public.reactions enable row level security;

revoke all on public.source_secrets from anon, authenticated;

-- profiles: self + anyone you share a circle with
create policy profiles_select on public.profiles for select using (
  id = auth.uid()
  or exists (
    select 1 from public.circle_members a
    join public.circle_members b on a.circle_id = b.circle_id
    where a.user_id = auth.uid() and b.user_id = profiles.id
  )
);
create policy profiles_update on public.profiles for update using (id = auth.uid());

-- circles
create policy circles_select on public.circles for select
  using (public.is_circle_member(id));

-- circle_members
create policy members_select on public.circle_members for select
  using (public.is_circle_member(circle_id));

-- invites: circle members may view (to re-copy the link)
create policy invites_select on public.invites for select
  using (public.is_circle_member(circle_id));

-- sources: owner full control
create policy sources_all on public.sources for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- source_shares: owner manages; circle members may view
create policy shares_select on public.source_shares for select using (
  public.is_circle_member(circle_id)
  or exists (select 1 from public.sources s where s.id = source_id and s.user_id = auth.uid())
);
create policy shares_write on public.source_shares for insert with check (
  exists (select 1 from public.sources s where s.id = source_id and s.user_id = auth.uid())
);
create policy shares_delete on public.source_shares for delete using (
  exists (select 1 from public.sources s where s.id = source_id and s.user_id = auth.uid())
);

-- items: owner full control; circle members read visible items of shared, unpaused sources
create policy items_owner on public.items for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy items_circle_select on public.items for select using (
  hidden = false
  and exists (
    select 1
    from public.source_shares sh
    join public.sources s on s.id = sh.source_id
    join public.circle_members m on m.circle_id = sh.circle_id
    where sh.source_id = items.source_id
      and m.user_id = auth.uid()
      and s.paused = false
  )
);

-- blends / prompts: members read; writes via service role only
create policy blends_select on public.blends for select
  using (public.is_circle_member(circle_id));
create policy prompts_select on public.prompts for select
  using (public.is_circle_member(circle_id));

-- reactions: members of the prompt's circle
create policy reactions_select on public.reactions for select using (
  exists (select 1 from public.prompts p
          where p.id = prompt_id and public.is_circle_member(p.circle_id))
);
create policy reactions_insert on public.reactions for insert with check (
  user_id = auth.uid()
  and exists (select 1 from public.prompts p
              where p.id = prompt_id and public.is_circle_member(p.circle_id))
);
create policy reactions_delete on public.reactions for delete
  using (user_id = auth.uid());
