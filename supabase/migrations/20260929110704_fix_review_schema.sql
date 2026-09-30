-- 1. Review fields the product promises: workload, grading fairness,
--    attendance policy and lecturer. `rating` stays as the overall score.
alter table public.reviews
  add column workload smallint not null
    check (workload between 1 and 5),
  add column grading_fairness smallint not null
    check (grading_fairness between 1 and 5),
  add column attendance text not null
    check (attendance in ('mandatory', 'tracked', 'optional')),
  add column lecturer text;

comment on column public.reviews.workload is '1 = very light, 5 = very heavy';
comment on column public.reviews.grading_fairness is '1 = very unfair, 5 = very fair';
comment on column public.reviews.attendance is 'mandatory | tracked | optional';

-- 2. Likes: one row per (review, user) instead of a free-edit counter.
alter table public.reviews drop column likes;

create table public.review_likes (
  review_id uuid not null references public.reviews (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)
);

create index review_likes_user_id_idx on public.review_likes (user_id);

alter table public.review_likes enable row level security;

create policy "Review likes are viewable by everyone"
  on public.review_likes for select
  using (true);

create policy "Users can like as themselves"
  on public.review_likes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own like"
  on public.review_likes for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- 3. Keep reviews.updated_at current on edit (same as profiles).
alter function public.set_updated_at() set search_path = '';

create trigger reviews_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- 4. Store courses.created_at with a timezone like the other tables.
alter table public.courses
  alter column created_at type timestamptz using created_at at time zone 'UTC';

-- 5. Drop the duplicate unique constraint on profiles.username.
alter table public.profiles drop constraint profiles_username_unique;

-- 6. Index reviews.user_id for "my reviews" lookups and cascades.
create index reviews_user_id_idx on public.reviews (user_id);
