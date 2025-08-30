-- Supabase schema for moisotalk (Phase 1)
-- Run in Supabase SQL editor or via CLI.

-- 1) profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text unique not null,
  gender text,
  age_group text,
  points integer not null default 100,
  created_at timestamp with time zone not null default now()
);

-- 2) chat_rooms
create table if not exists public.chat_rooms (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  is_active boolean not null default true
);

-- 3) chat_participants (junction)
create table if not exists public.chat_participants (
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamp with time zone not null default now(),
  primary key (room_id, user_id)
);

-- 4) messages
create table if not exists public.messages (
  id bigserial primary key,
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone not null default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.chat_rooms enable row level security;
alter table public.chat_participants enable row level security;
alter table public.messages enable row level security;

-- * 위까지 성공
-- profiles: users can read all basic info and manage their own row
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all" on public.profiles
  for select
  using (true);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update
  using (auth.uid() = id);

drop policy if exists "chat_rooms_select_all" on public.chat_rooms;
create policy "chat_rooms_select_all" on public.chat_rooms
  for select
  using (true);

drop policy if exists "chat_rooms_insert_auth" on public.chat_rooms;
create policy "chat_rooms_insert_auth" on public.chat_rooms
  for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "chat_rooms_update_auth" on public.chat_rooms;
create policy "chat_rooms_update_auth" on public.chat_rooms
  for update
  using (auth.role() = 'authenticated');

drop policy if exists "chat_participants_select_all" on public.chat_participants;
create policy "chat_participants_select_all" on public.chat_participants
  for select
  using (true);

drop policy if exists "chat_participants_insert_self" on public.chat_participants;
create policy "chat_participants_insert_self" on public.chat_participants
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "messages_select_room_participants" on public.messages;
create policy "messages_select_room_participants" on public.messages
  for select
  using (
    exists (
      select 1 from public.chat_participants cp
      where cp.room_id = messages.room_id
        and cp.user_id = auth.uid()
    )
  );

drop policy if exists "messages_insert_by_sender" on public.messages;
create policy "messages_insert_by_sender" on public.messages
  for insert
  with check (auth.uid() = sender_id);

-- Helpful index
create index if not exists messages_room_created_idx on public.messages(room_id, created_at desc);
