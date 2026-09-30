-- 1. Optional short bio shown on the account page and in the profile popover
alter table public.profiles
  add column bio text check (char_length(bio) <= 160);

-- 2. Username format: 3-20 of a-z 0-9 _ . (stored lowercase).
--    NOT VALID so existing rows are not re-checked; every new write must pass.
alter table public.profiles
  add constraint profiles_username_format
  check (username ~ '^[a-z0-9_.]{3,20}$') not valid;

-- 3. Generate usernames that always satisfy the format above
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  base_username text;
  final_username text;
  attempt int := 0;
begin
  -- Everything before @, reduced to allowed characters
  base_username := regexp_replace(
    lower(split_part(new.email, '@', 1)), '[^a-z0-9_.]', '', 'g'
  );
  -- Leave room for a numeric suffix within the 20 character limit
  base_username := left(base_username, 16);
  if length(base_username) < 3 then
    base_username := left(
      base_username || 'user' || substr(replace(new.id::text, '-', ''), 1, 6),
      16
    );
  end if;

  final_username := base_username;
  while exists (select 1 from public.profiles where username = final_username) loop
    attempt := attempt + 1;
    final_username := base_username || attempt::text;
  end loop;

  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    final_username,
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'avatar_url'), '')
  );

  return new;
end;
$$;

-- 4. Only these email domains may create an account (email and Google)
create or replace function public.enforce_email_domain()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(lower(split_part(new.email, '@', 2)), '') not in
     ('gmail.com', 'mail.ru', 'outlook.com', 'xmu.edu.my') then
    raise exception 'Email domain not allowed'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger enforce_email_domain
  before insert on auth.users
  for each row execute function public.enforce_email_domain();

-- Trigger functions must not be callable through the API
revoke execute on function public.enforce_email_domain() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- 5. Avatars: images only, 2 MB max
update storage.buckets
set file_size_limit = 2097152,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'avatars';
