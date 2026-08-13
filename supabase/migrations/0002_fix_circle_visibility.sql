-- Fix: items_circle_select joined sources/source_shares directly, but RLS on
-- those tables (owner-only for sources) applies inside policy subqueries too,
-- so members could never see each other's items. Route the visibility check
-- through a security-definer helper, and let members see shared sources
-- (needed by the UI to label whose library an item came from).

create or replace function public.source_feeds_my_circle(p_source_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.source_shares sh
    join public.circle_members m on m.circle_id = sh.circle_id
    join public.sources s on s.id = sh.source_id
    where sh.source_id = p_source_id
      and m.user_id = auth.uid()
      and s.paused = false
  );
$$;

drop policy items_circle_select on public.items;
create policy items_circle_select on public.items for select using (
  hidden = false and public.source_feeds_my_circle(source_id)
);

-- Members can see (not modify) sources shared into their circles, even when
-- paused — pausing hides items, not the source's existence in the share list.
create or replace function public.source_shared_to_my_circle(p_source_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.source_shares sh
    join public.circle_members m on m.circle_id = sh.circle_id
    where sh.source_id = p_source_id
      and m.user_id = auth.uid()
  );
$$;

create policy sources_circle_select on public.sources for select using (
  public.source_shared_to_my_circle(id)
);
