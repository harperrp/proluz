-- Extensions
create extension if not exists pgcrypto;

-- Enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('ADMIN', 'CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL', 'CITIZEN');
  end if;

  if not exists (select 1 from pg_type where typname = 'pole_status') then
    create type public.pole_status as enum ('FUNCIONANDO', 'QUEIMADO');
  end if;

  if not exists (select 1 from pg_type where typname = 'complaint_status') then
    create type public.complaint_status as enum ('PENDENTE', 'APROVADA', 'REJEITADA');
  end if;

  if not exists (select 1 from pg_type where typname = 'maintenance_status') then
    create type public.maintenance_status as enum ('ABERTA', 'EM_EXECUCAO', 'CONCLUIDA');
  end if;

  if not exists (select 1 from pg_type where typname = 'priority_level') then
    create type public.priority_level as enum ('BAIXA', 'MEDIA', 'ALTA');
  end if;
end$$;

-- Tables
create table if not exists public.city_halls (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  state char(2) not null,
  cnpj text,
  status text not null default 'ATIVO' check (status in ('ATIVO', 'INATIVO')),
  latitude double precision not null default 0,
  longitude double precision not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'CITIZEN',
  cpf text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_city_halls (
  user_id uuid not null references public.profiles(id) on delete cascade,
  city_hall_id uuid not null references public.city_halls(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, city_hall_id)
);

create table if not exists public.lighting_points (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  city_hall_id uuid not null references public.city_halls(id) on delete restrict,
  latitude double precision not null,
  longitude double precision not null,
  address text,
  neighborhood text,
  status public.pole_status not null default 'FUNCIONANDO',
  observations text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  lighting_point_code text references public.lighting_points(code) on delete set null,
  city_hall_id uuid not null references public.city_halls(id) on delete restrict,
  latitude double precision not null,
  longitude double precision not null,
  description text not null,
  status public.complaint_status not null default 'PENDENTE',
  rejection_reason text,
  secretary_observations text,
  citizen_cpf text not null,
  citizen_name text not null,
  citizen_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.maintenance_orders (
  id uuid primary key default gen_random_uuid(),
  city_hall_id uuid not null references public.city_halls(id) on delete restrict,
  lighting_point_code text not null references public.lighting_points(code) on delete restrict,
  complaint_id uuid references public.complaints(id) on delete set null,
  status public.maintenance_status not null default 'ABERTA',
  priority public.priority_level not null default 'MEDIA',
  description text,
  assigned_to uuid references public.profiles(id) on delete set null,
  opened_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  city_hall_id uuid references public.city_halls(id) on delete set null,
  actor_user_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_user_city_halls_city_hall on public.user_city_halls(city_hall_id);
create index if not exists idx_lighting_points_city_hall on public.lighting_points(city_hall_id);
create index if not exists idx_lighting_points_status on public.lighting_points(status);
create index if not exists idx_complaints_city_hall on public.complaints(city_hall_id);
create index if not exists idx_complaints_status on public.complaints(status);
create index if not exists idx_maintenance_city_hall on public.maintenance_orders(city_hall_id);
create index if not exists idx_maintenance_status on public.maintenance_orders(status);
create index if not exists idx_activity_logs_city_hall on public.activity_logs(city_hall_id);

-- Functions
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  fallback_name text;
begin
  fallback_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    split_part(coalesce(new.email, ''), '@', 1),
    'Usuário'
  );

  insert into public.profiles (id, full_name, role)
  values (new.id, fallback_name, 'CITIZEN')
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace function public.is_admin_master()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'ADMIN'
  );
$$;

create or replace function public.user_has_role(allowed_roles public.user_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = any(allowed_roles)
  );
$$;

create or replace function public.belongs_to_city_hall(target_city_hall uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin_master()
  or exists (
    select 1
    from public.user_city_halls uch
    where uch.user_id = auth.uid()
      and uch.city_hall_id = target_city_hall
  );
$$;

create or replace function public.can_access_city_hall(target_city_hall uuid, allowed_roles public.user_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin_master()
  or (
    public.user_has_role(allowed_roles)
    and exists (
      select 1
      from public.user_city_halls uch
      where uch.user_id = auth.uid()
        and uch.city_hall_id = target_city_hall
    )
  );
$$;

-- Triggers
drop trigger if exists trg_city_halls_touch on public.city_halls;
create trigger trg_city_halls_touch before update on public.city_halls for each row execute function public.touch_updated_at();

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();

drop trigger if exists trg_lighting_points_touch on public.lighting_points;
create trigger trg_lighting_points_touch before update on public.lighting_points for each row execute function public.touch_updated_at();

drop trigger if exists trg_complaints_touch on public.complaints;
create trigger trg_complaints_touch before update on public.complaints for each row execute function public.touch_updated_at();

drop trigger if exists trg_maintenance_touch on public.maintenance_orders;
create trigger trg_maintenance_touch before update on public.maintenance_orders for each row execute function public.touch_updated_at();

drop trigger if exists trg_auth_user_created_profile on auth.users;
create trigger trg_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user();

-- Enable RLS
alter table public.city_halls enable row level security;
alter table public.profiles enable row level security;
alter table public.user_city_halls enable row level security;
alter table public.lighting_points enable row level security;
alter table public.complaints enable row level security;
alter table public.maintenance_orders enable row level security;
alter table public.activity_logs enable row level security;

-- Policies
drop policy if exists city_halls_select on public.city_halls;
create policy city_halls_select on public.city_halls
for select using (
  status = 'ATIVO'
  or public.is_admin_master()
  or exists (
    select 1
    from public.user_city_halls uch
    where uch.city_hall_id = id
      and uch.user_id = auth.uid()
  )
);

drop policy if exists city_halls_public_active_select on public.city_halls;
create policy city_halls_public_active_select on public.city_halls
 codex/finalize-public-report-and-access-separation-7ioqab
to anon

 codex/finalize-public-report-and-access-separation-v9qc6r
to anon

 main
 main
for select using (
  status = 'ATIVO'
);

drop policy if exists city_halls_admin_manage on public.city_halls;
create policy city_halls_admin_manage on public.city_halls
for all using (public.is_admin_master())
with check (public.is_admin_master());

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
for select using (
  id = auth.uid()
  or public.is_admin_master()
  or (
    public.user_has_role(array['CITY_HALL_ADMIN']::public.user_role[])
    and exists (
      select 1
      from public.user_city_halls manager_uch
      join public.user_city_halls target_uch on target_uch.city_hall_id = manager_uch.city_hall_id
      where manager_uch.user_id = auth.uid()
        and target_uch.user_id = profiles.id
    )
  )
);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
for update using (
  id = auth.uid()
  or public.is_admin_master()
)
with check (
  id = auth.uid()
  or public.is_admin_master()
);

drop policy if exists profiles_insert_admin on public.profiles;
create policy profiles_insert_admin on public.profiles
for insert with check (
  public.is_admin_master()
  or id = auth.uid()
);

drop policy if exists uch_select on public.user_city_halls;
create policy uch_select on public.user_city_halls
for select using (
  user_id = auth.uid()
  or public.is_admin_master()
  or (
    public.user_has_role(array['CITY_HALL_ADMIN']::public.user_role[])
    and public.belongs_to_city_hall(city_hall_id)
  )
);

drop policy if exists uch_manage_admin on public.user_city_halls;
create policy uch_manage_admin on public.user_city_halls
for all
using (public.is_admin_master())
with check (public.is_admin_master());

drop policy if exists poles_select on public.lighting_points;
create policy poles_select on public.lighting_points
for select using (
  public.can_access_city_hall(city_hall_id, array['CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL']::public.user_role[])
);

drop policy if exists poles_select_public_active_city_hall on public.lighting_points;
create policy poles_select_public_active_city_hall on public.lighting_points

 codex/finalize-public-report-and-access-separation-7ioqab
to anon

 codex/finalize-public-report-and-access-separation-v9qc6r
to anon

 main
 main
for select using (
  exists (
    select 1
    from public.city_halls ch
    where ch.id = lighting_points.city_hall_id
      and ch.status = 'ATIVO'
  )
);

drop policy if exists poles_insert_manage on public.lighting_points;
create policy poles_insert_manage on public.lighting_points
for insert with check (
  public.can_access_city_hall(city_hall_id, array['CITY_HALL_ADMIN', 'SECRETARY']::public.user_role[])
);

drop policy if exists poles_update_manage on public.lighting_points;
create policy poles_update_manage on public.lighting_points
for update using (
  public.can_access_city_hall(city_hall_id, array['CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL']::public.user_role[])
)
with check (
  public.can_access_city_hall(city_hall_id, array['CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL']::public.user_role[])
);

drop policy if exists poles_delete_manage on public.lighting_points;
create policy poles_delete_manage on public.lighting_points
for delete using (
  public.can_access_city_hall(city_hall_id, array['CITY_HALL_ADMIN', 'SECRETARY']::public.user_role[])
);

drop policy if exists complaints_select_internal on public.complaints;
create policy complaints_select_internal on public.complaints
for select using (
  public.can_access_city_hall(city_hall_id, array['CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL']::public.user_role[])
);

drop policy if exists complaints_insert_public on public.complaints;
create policy complaints_insert_public on public.complaints

 codex/finalize-public-report-and-access-separation-7ioqab
to anon

 codex/finalize-public-report-and-access-separation-v9qc6r
to anon

 main
 main
for insert with check (
  status = 'PENDENTE'
  and lighting_point_code is not null
  and exists (
    select 1
    from public.city_halls ch
    where ch.id = complaints.city_hall_id
      and ch.status = 'ATIVO'
  )
  and exists (
    select 1
    from public.lighting_points lp
    where lp.code = complaints.lighting_point_code
      and lp.city_hall_id = complaints.city_hall_id
  )
);

drop policy if exists complaints_update_internal on public.complaints;
create policy complaints_update_internal on public.complaints
for update using (
  public.can_access_city_hall(city_hall_id, array['CITY_HALL_ADMIN', 'SECRETARY']::public.user_role[])
)
with check (
  public.can_access_city_hall(city_hall_id, array['CITY_HALL_ADMIN', 'SECRETARY']::public.user_role[])
);

drop policy if exists maintenance_select_internal on public.maintenance_orders;
create policy maintenance_select_internal on public.maintenance_orders
for select using (
  public.can_access_city_hall(city_hall_id, array['CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL']::public.user_role[])
);

drop policy if exists maintenance_insert_internal on public.maintenance_orders;
create policy maintenance_insert_internal on public.maintenance_orders
for insert with check (
  public.can_access_city_hall(city_hall_id, array['CITY_HALL_ADMIN', 'SECRETARY']::public.user_role[])
);

drop policy if exists maintenance_update_internal on public.maintenance_orders;
create policy maintenance_update_internal on public.maintenance_orders
for update using (
  public.can_access_city_hall(city_hall_id, array['CITY_HALL_ADMIN', 'SECRETARY']::public.user_role[])
  or (
    assigned_to = auth.uid()
    and public.can_access_city_hall(city_hall_id, array['TECHNICAL']::public.user_role[])
  )
)
with check (
  public.can_access_city_hall(city_hall_id, array['CITY_HALL_ADMIN', 'SECRETARY']::public.user_role[])
  or (
    assigned_to = auth.uid()
    and public.can_access_city_hall(city_hall_id, array['TECHNICAL']::public.user_role[])
  )
);

drop policy if exists maintenance_delete_internal on public.maintenance_orders;
create policy maintenance_delete_internal on public.maintenance_orders
for delete using (
  public.can_access_city_hall(city_hall_id, array['CITY_HALL_ADMIN', 'SECRETARY']::public.user_role[])
);

drop policy if exists logs_select_internal on public.activity_logs;
create policy logs_select_internal on public.activity_logs
for select using (
  city_hall_id is null
  or public.can_access_city_hall(city_hall_id, array['CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL']::public.user_role[])
);

drop policy if exists logs_insert_internal on public.activity_logs;
create policy logs_insert_internal on public.activity_logs
for insert with check (
  city_hall_id is null
  or public.can_access_city_hall(city_hall_id, array['CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL']::public.user_role[])
);

-- Seed
insert into public.city_halls (id, name, city, state, cnpj, latitude, longitude, status)
values ('11111111-1111-1111-1111-111111111111', 'Prefeitura de Exemplo', 'Cidade Exemplo', 'MG', '12.345.678/0001-99', -15.3983, -42.3097, 'ATIVO')
on conflict (id) do nothing;

insert into public.city_halls (id, name, city, state, cnpj, latitude, longitude, status)
values ('22222222-2222-2222-2222-222222222222', 'Prefeitura de Exemplo Sul', 'Cidade Exemplo', 'MG', '98.765.432/0001-11', -15.4124, -42.2911, 'ATIVO')
on conflict (id) do nothing;

insert into public.lighting_points (code, city_hall_id, latitude, longitude, address, status)
values
  ('P-001', '11111111-1111-1111-1111-111111111111', -15.3989, -42.3091, 'Av. Principal, 200', 'QUEIMADO'),
  ('P-002', '11111111-1111-1111-1111-111111111111', -15.3994, -42.3102, 'Rua Principal, 210', 'FUNCIONANDO'),
  ('P-003', '11111111-1111-1111-1111-111111111111', -15.3976, -42.3088, 'Rua das Palmeiras, 55', 'FUNCIONANDO')
on conflict (code) do nothing;
