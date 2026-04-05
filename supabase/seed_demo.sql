-- Seed comercial para demonstração do IluminaCity
-- Execute no SQL Editor do Supabase com role de serviço/admin.

create extension if not exists pgcrypto;

-- =====================================================
-- 1) Prefeitura principal
-- =====================================================
insert into public.city_halls (id, name, city, state, cnpj, status, latitude, longitude)
values (
  '11111111-1111-1111-1111-111111111111',
  'Prefeitura de Montes Claros',
  'Montes Claros',
  'MG',
  '12.345.678/0001-90',
  'ATIVO',
  -16.7282,
  -43.8578
)
on conflict (id) do update set
  name = excluded.name,
  city = excluded.city,
  state = excluded.state,
  cnpj = excluded.cnpj,
  status = excluded.status,
  latitude = excluded.latitude,
  longitude = excluded.longitude;

-- =====================================================
-- 2) Quatro usuários reais (auth + profiles)
-- =====================================================
-- Senha padrão demo: Demo@123456
with demo_users as (
  select * from (
    values
      ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'admin@iluminacity.demo', 'Administrador Geral', 'ADMIN'::public.user_role),
      ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'prefeitura@iluminacity.demo', 'Admin Prefeitura', 'CITY_HALL_ADMIN'::public.user_role),
      ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'secretaria@iluminacity.demo', 'Secretária Municipal', 'SECRETARY'::public.user_role),
      ('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'tecnico@iluminacity.demo', 'Técnico de Campo', 'TECHNICAL'::public.user_role)
  ) as t(id, email, full_name, role)
), ins_auth as (
  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  select
    d.id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    d.email,
    crypt('Demo@123456', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('full_name', d.full_name),
    now(),
    now(),
    '',
    '',
    '',
    ''
  from demo_users d
  where not exists (select 1 from auth.users u where u.id = d.id)
  returning id, email
)
insert into auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at, last_sign_in_at)
select
  gen_random_uuid(),
  d.id,
  d.id::text,
  jsonb_build_object('sub', d.id::text, 'email', d.email),
  'email',
  now(),
  now(),
  now()
from demo_users d
where not exists (
  select 1 from auth.identities i where i.user_id = d.id and i.provider = 'email'
);

insert into public.profiles (id, full_name, role, cpf)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Administrador Geral', 'ADMIN', '100.000.000-01'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Admin Prefeitura', 'CITY_HALL_ADMIN', '100.000.000-02'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Secretária Municipal', 'SECRETARY', '100.000.000-03'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Técnico de Campo', 'TECHNICAL', '100.000.000-04')
on conflict (id) do update set
  full_name = excluded.full_name,
  role = excluded.role,
  cpf = excluded.cpf;

insert into public.user_city_halls (user_id, city_hall_id)
values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111')
on conflict (user_id, city_hall_id) do nothing;

-- =====================================================
-- 3) 40 postes de demonstração
-- =====================================================
insert into public.lighting_points (code, city_hall_id, latitude, longitude, status, address, neighborhood, observations)
select
  format('P-%s', lpad(gs::text, 3, '0')),
  '11111111-1111-1111-1111-111111111111',
  -16.7282 + ((gs % 10) * 0.0017),
  -43.8578 + ((gs % 8) * 0.0014),
  case when gs % 5 = 0 then 'QUEIMADO'::public.pole_status else 'FUNCIONANDO'::public.pole_status end,
  format('Rua %s, %s', (array['São José', 'Minas Gerais', 'Bahia', 'Paraná', 'Goiás', 'Amazonas'])[1 + (gs % 6)], 100 + gs),
  (array['Centro', 'Vila Nova', 'Jardim América', 'Santos Reis'])[1 + (gs % 4)],
  case when gs % 7 = 0 then 'Necessita inspeção periódica' else null end
from generate_series(1, 40) gs
on conflict (code) do update set
  city_hall_id = excluded.city_hall_id,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  status = excluded.status,
  address = excluded.address,
  neighborhood = excluded.neighborhood,
  observations = excluded.observations;

-- =====================================================
-- 4) Denúncias distribuídas por meses
-- =====================================================
with poles as (
  select code, latitude, longitude
  from public.lighting_points
  where city_hall_id = '11111111-1111-1111-1111-111111111111'
  order by code
  limit 40
), complaint_seed as (
  select
    p.code,
    p.latitude,
    p.longitude,
    gs,
    (now() - ((gs % 8) || ' months')::interval - ((gs % 24) || ' days')::interval) as created_at,
    case
      when gs % 4 = 0 then 'REJEITADA'::public.complaint_status
      when gs % 3 = 0 then 'APROVADA'::public.complaint_status
      else 'PENDENTE'::public.complaint_status
    end as status
  from poles p
  join generate_series(1, 36) gs on true
  where ((substring(p.code from 3)::int + gs) % 9 = 0)
)
insert into public.complaints (
  city_hall_id,
  lighting_point_code,
  latitude,
  longitude,
  description,
  status,
  rejection_reason,
  secretary_observations,
  citizen_cpf,
  citizen_name,
  citizen_phone,
  created_at,
  updated_at
)
select
  '11111111-1111-1111-1111-111111111111',
  c.code,
  c.latitude,
  c.longitude,
  format('Poste %s apagado e rua escura no período noturno.', c.code),
  c.status,
  case when c.status = 'REJEITADA' then 'Denúncia duplicada' else null end,
  case when c.status = 'APROVADA' then 'Aprovada para execução técnica' else null end,
  format('200.000.%s-%s', lpad((c.gs % 999)::text, 3, '0'), lpad((c.gs % 99)::text, 2, '0')),
  format('Cidadão %s', c.gs),
  format('(38) 99999-%s', lpad((1000 + c.gs)::text, 4, '0')),
  c.created_at,
  c.created_at + interval '2 hours'
from complaint_seed c
where not exists (
  select 1
  from public.complaints x
  where x.lighting_point_code = c.code
    and date_trunc('day', x.created_at) = date_trunc('day', c.created_at)
);

-- =====================================================
-- 5) Ordens de manutenção com variação de prioridade/status
-- =====================================================
with selected_complaints as (
  select id, city_hall_id, lighting_point_code, created_at
  from public.complaints
  where city_hall_id = '11111111-1111-1111-1111-111111111111'
    and lighting_point_code is not null
  order by created_at desc
  limit 28
)
insert into public.maintenance_orders (
  city_hall_id,
  lighting_point_code,
  complaint_id,
  status,
  priority,
  description,
  assigned_to,
  opened_at,
  completed_at
)
select
  sc.city_hall_id,
  sc.lighting_point_code,
  sc.id,
  case
    when row_number() over (order by sc.created_at desc) % 4 = 0 then 'CONCLUIDA'::public.maintenance_status
    when row_number() over (order by sc.created_at desc) % 3 = 0 then 'EM_EXECUCAO'::public.maintenance_status
    else 'ABERTA'::public.maintenance_status
  end,
  case
    when row_number() over (order by sc.created_at desc) % 5 = 0 then 'ALTA'::public.priority_level
    when row_number() over (order by sc.created_at desc) % 2 = 0 then 'MEDIA'::public.priority_level
    else 'BAIXA'::public.priority_level
  end,
  format('OS para inspeção e reparo do poste %s.', sc.lighting_point_code),
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  sc.created_at + interval '1 day',
  case
    when row_number() over (order by sc.created_at desc) % 4 = 0 then sc.created_at + interval '3 day'
    else null
  end
from selected_complaints sc
where not exists (
  select 1 from public.maintenance_orders mo where mo.complaint_id = sc.id
);

-- Atualiza status dos postes de ordens concluídas
update public.lighting_points lp
set status = 'FUNCIONANDO'
where lp.code in (
  select mo.lighting_point_code
  from public.maintenance_orders mo
  where mo.status = 'CONCLUIDA'
);

-- =====================================================
-- 6) Activity logs para relatórios
-- =====================================================
insert into public.activity_logs (city_hall_id, actor_user_id, entity_type, entity_id, action, details, created_at)
select
  '11111111-1111-1111-1111-111111111111',
  case
    when gs % 4 = 0 then 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid
    when gs % 4 = 1 then 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid
    else 'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid
  end,
  (array['complaint', 'maintenance_order', 'lighting_point'])[1 + (gs % 3)],
  format('entity-%s', gs),
  (array['CREATE', 'UPDATE', 'APPROVE', 'COMPLETE'])[1 + (gs % 4)],
  jsonb_build_object(
    'message', format('Evento operacional %s', gs),
    'channel', 'dashboard',
    'severity', (array['info', 'warning', 'success'])[1 + (gs % 3)]
  ),
  now() - ((gs % 10) || ' days')::interval - ((gs % 12) || ' hours')::interval
from generate_series(1, 90) gs
where not exists (
  select 1 from public.activity_logs al
  where al.entity_id = format('entity-%s', gs)
    and al.action = (array['CREATE', 'UPDATE', 'APPROVE', 'COMPLETE'])[1 + (gs % 4)]
);
