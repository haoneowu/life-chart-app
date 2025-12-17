-- Create users table (extending auth.users)
create table public.users (
  id uuid references auth.users not null primary key,
  birth_date date,
  birth_time time,
  birth_city text,
  latitude float,
  longitude float,
  timezone text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.users enable row level security;

-- Create policies
create policy "Users can select their own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on public.users
  for insert with check (auth.uid() = id);


-- Create daily_signals table
create table public.daily_signals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  date date not null,
  momentum_score integer check (momentum_score >= 0 and momentum_score <= 100),
  volatility text check (volatility in ('calm', 'dynamic', 'intense')),
  signal_tags text[], -- Array of strings
  algo_version text,
  created_at timestamptz default now(),
  unique(user_id, date, algo_version)
);

-- Enable RLS
alter table public.daily_signals enable row level security;

-- Create policies
create policy "Users can view their own signals" on public.daily_signals
  for select using (auth.uid() = user_id);

-- Create interpretations table
create table public.interpretations (
  id uuid default gen_random_uuid() primary key,
  signal_id uuid references public.daily_signals(id) not null,
  content jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.interpretations enable row level security;

-- Create policies
create policy "Users can view interpretations for their signals" on public.interpretations
  for select using (
    exists (
      select 1 from public.daily_signals
      where daily_signals.id = interpretations.signal_id
      and daily_signals.user_id = auth.uid()
    )
  );

-- Function to handle new user signup (trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
