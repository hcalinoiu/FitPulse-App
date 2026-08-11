create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  avatar_url text,
  weight_kg numeric,
  height_cm numeric,
  goal text,
  plan text not null default 'free',
  chat_used integer not null default 0,
  chat_messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists plan text not null default 'free';
alter table public.profiles add column if not exists chat_used integer not null default 0;
alter table public.profiles add column if not exists chat_messages jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists water_target_ml integer not null default 2500;
alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles add column if not exists stripe_subscription_id text;
alter table public.profiles add column if not exists stripe_subscription_status text;
alter table public.profiles add column if not exists plan_current_period_end timestamptz;
alter table public.profiles add column if not exists plan_updated_at timestamptz;

create unique index if not exists profiles_email_unique
  on public.profiles (lower(email))
  where email <> '';

create index if not exists profiles_stripe_customer_idx
  on public.profiles (stripe_customer_id)
  where stripe_customer_id is not null;

create table if not exists public.stripe_events (
  id text primary key,
  event_type text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_date date not null,
  focus text not null,
  exercises text not null default '',
  exercise_checks jsonb not null default '{}'::jsonb,
  planned boolean not null default true,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, workout_date)
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  meal_date date not null,
  title text,
  kcal integer,
  protein_g integer,
  carbs_g integer,
  fats_g integer,
  recommendation text,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  start_date date,
  end_date date,
  reminder_days integer not null default 5,
  membership_type text,
  price numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions add column if not exists membership_type text;
alter table public.subscriptions add column if not exists price numeric;
alter table public.subscriptions add column if not exists notes text;
alter table public.subscriptions add column if not exists created_at timestamptz not null default now();

create table if not exists public.gyms (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  location text,
  schedule text,
  equipment text[] not null default '{}'::text[],
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gyms add column if not exists location text;
alter table public.gyms add column if not exists schedule text;
alter table public.gyms add column if not exists notes text;
alter table public.gyms add column if not exists created_at timestamptz not null default now();

create table if not exists public.app_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id text not null,
  workout_date date,
  focus text,
  total_volume numeric not null default 0,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, session_id)
);

create table if not exists public.personal_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  record_id text not null,
  achieved_at timestamptz,
  exercise_id text,
  record_type text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, record_id)
);

create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  photo_id text not null,
  photo_date date,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, photo_id)
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null default '',
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.workouts enable row level security;
alter table public.meals enable row level security;
alter table public.subscriptions enable row level security;
alter table public.gyms enable row level security;
alter table public.app_states enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.personal_records enable row level security;
alter table public.progress_photos enable row level security;
alter table public.support_tickets enable row level security;
alter table public.stripe_events enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "workouts_select_own" on public.workouts;
drop policy if exists "workouts_insert_own" on public.workouts;
drop policy if exists "workouts_update_own" on public.workouts;
drop policy if exists "workouts_delete_own" on public.workouts;
drop policy if exists "meals_select_own" on public.meals;
drop policy if exists "meals_insert_own" on public.meals;
drop policy if exists "meals_delete_own" on public.meals;
drop policy if exists "subscriptions_select_own" on public.subscriptions;
drop policy if exists "subscriptions_insert_own" on public.subscriptions;
drop policy if exists "subscriptions_update_own" on public.subscriptions;
drop policy if exists "gyms_select_own" on public.gyms;
drop policy if exists "gyms_insert_own" on public.gyms;
drop policy if exists "gyms_update_own" on public.gyms;
drop policy if exists "app_states_select_own" on public.app_states;
drop policy if exists "app_states_insert_own" on public.app_states;
drop policy if exists "app_states_update_own" on public.app_states;
drop policy if exists "workout_sessions_select_own" on public.workout_sessions;
drop policy if exists "workout_sessions_insert_own" on public.workout_sessions;
drop policy if exists "workout_sessions_update_own" on public.workout_sessions;
drop policy if exists "workout_sessions_delete_own" on public.workout_sessions;
drop policy if exists "personal_records_select_own" on public.personal_records;
drop policy if exists "personal_records_insert_own" on public.personal_records;
drop policy if exists "personal_records_update_own" on public.personal_records;
drop policy if exists "personal_records_delete_own" on public.personal_records;
drop policy if exists "progress_photos_select_own" on public.progress_photos;
drop policy if exists "progress_photos_insert_own" on public.progress_photos;
drop policy if exists "progress_photos_update_own" on public.progress_photos;
drop policy if exists "progress_photos_delete_own" on public.progress_photos;
drop policy if exists "support_tickets_insert_own_or_guest" on public.support_tickets;
drop policy if exists "support_tickets_select_own" on public.support_tickets;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "workouts_select_own" on public.workouts for select using (auth.uid() = user_id);
create policy "workouts_insert_own" on public.workouts for insert with check (auth.uid() = user_id);
create policy "workouts_update_own" on public.workouts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workouts_delete_own" on public.workouts for delete using (auth.uid() = user_id);

create policy "meals_select_own" on public.meals for select using (auth.uid() = user_id);
create policy "meals_insert_own" on public.meals for insert with check (auth.uid() = user_id);
create policy "meals_delete_own" on public.meals for delete using (auth.uid() = user_id);

create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);
create policy "subscriptions_insert_own" on public.subscriptions for insert with check (auth.uid() = user_id);
create policy "subscriptions_update_own" on public.subscriptions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "gyms_select_own" on public.gyms for select using (auth.uid() = user_id);
create policy "gyms_insert_own" on public.gyms for insert with check (auth.uid() = user_id);
create policy "gyms_update_own" on public.gyms for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "app_states_select_own" on public.app_states for select using (auth.uid() = user_id);
create policy "app_states_insert_own" on public.app_states for insert with check (auth.uid() = user_id);
create policy "app_states_update_own" on public.app_states for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "workout_sessions_select_own" on public.workout_sessions for select using (auth.uid() = user_id);
create policy "workout_sessions_insert_own" on public.workout_sessions for insert with check (auth.uid() = user_id);
create policy "workout_sessions_update_own" on public.workout_sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workout_sessions_delete_own" on public.workout_sessions for delete using (auth.uid() = user_id);

create policy "personal_records_select_own" on public.personal_records for select using (auth.uid() = user_id);
create policy "personal_records_insert_own" on public.personal_records for insert with check (auth.uid() = user_id);
create policy "personal_records_update_own" on public.personal_records for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "personal_records_delete_own" on public.personal_records for delete using (auth.uid() = user_id);

create policy "progress_photos_select_own" on public.progress_photos for select using (auth.uid() = user_id);
create policy "progress_photos_insert_own" on public.progress_photos for insert with check (auth.uid() = user_id);
create policy "progress_photos_update_own" on public.progress_photos for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "progress_photos_delete_own" on public.progress_photos for delete using (auth.uid() = user_id);

create policy "support_tickets_insert_own_or_guest" on public.support_tickets for insert with check (auth.uid() = user_id or user_id is null);
create policy "support_tickets_select_own" on public.support_tickets for select using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    lower(coalesce(new.email, '')),
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        name = coalesce(nullif(excluded.name, ''), public.profiles.name),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.email_registered(check_email text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where lower(email) = lower(trim(check_email))
  );
$$;

grant execute on function public.email_registered(text) to anon, authenticated;
