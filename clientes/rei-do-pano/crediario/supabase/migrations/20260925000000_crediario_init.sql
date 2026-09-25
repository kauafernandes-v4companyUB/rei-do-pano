-- Crediário Fácil Rei do Pano: leads, papéis de usuário e checagem de papel.
-- A tabela leads não é acessível por anon/authenticated: só as Edge Functions (service role) leem e escrevem.

create extension if not exists pgcrypto;

-- Papéis ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin');
  end if;
end$$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;
revoke all on table public.user_roles from anon, authenticated;

-- security definer: consulta user_roles sem depender de políticas RLS (evita recursão).
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  );
$$;

revoke all on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
grant execute on function public.has_role(uuid, public.app_role) to service_role;

-- Leads ----------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 2 and 120),
  email text not null check (char_length(email) between 3 and 254),
  whatsapp text not null check (whatsapp ~ '^[0-9]{10,11}$'),
  interesse text not null default 'Não informado',
  origem text not null default 'lp_crediario',
  cidade text not null default 'Vilhena',
  estado text not null default 'RO',
  pais text not null default 'Brasil',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  consentimento boolean not null default false,
  consentimento_em timestamptz,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_ip_created_at_idx on public.leads (ip, created_at desc);

alter table public.leads enable row level security;
revoke all on table public.leads from anon, authenticated;
-- Nenhuma policy: com RLS ligado e sem grants, anon/authenticated não leem nem escrevem.

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_touch_updated_at on public.leads;
create trigger leads_touch_updated_at
  before update on public.leads
  for each row execute function public.touch_updated_at();
