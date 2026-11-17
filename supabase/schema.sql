-- 시플 웹 1차 DB 구조. Supabase > SQL Editor 에 붙여넣고 실행하세요.

-- 회원 (카카오 로그인 사용자). 추천인 기록으로 "누가 누구를 데려왔는지" 남겨요.
create table if not exists members (
  id uuid primary key references auth.users on delete cascade,
  name text, phone text, birth_year int,
  referred_by uuid references members(id),
  created_at timestamptz default now()
);

-- 상품: 여행뿐 아니라 교육·모임·체험도 같은 구조로 등록할 수 있게 kind 를 둬요.
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'trip',          -- trip | class | meetup | experience
  title text not null, theme text not null, region text not null,
  summary text, description text,
  start_date date not null, nights int not null default 0,
  price int not null, capacity int not null,
  status text not null default 'open',        -- open | closed
  refund_policy text,
  created_at timestamptz default now()
);

-- 신청. 로그인 없이도 신청 가능 (member_id 는 선택).
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id),
  member_id uuid references members(id),
  name text not null, phone text not null, people int not null default 1,
  referrer text,                               -- 소개한 모임·사람 (자유 입력)
  status text not null default 'applied',      -- applied | paid | attended | cancelled
  created_at timestamptz default now()
);
create index if not exists applications_phone on applications(phone);

-- 회원 활동 기록: 정부지원사업 성과(참여·재참여·추천)와 향후 포인트 제도의 근거.
create table if not exists activity_logs (
  id bigint generated always as identity primary key,
  member_id uuid references members(id),
  phone text,
  action text not null,                        -- apply | attend | review | invite ...
  target_id uuid,
  created_at timestamptz default now()
);

create or replace view trips_with_count as
select t.*, coalesce((select sum(a.people) from applications a
  where a.trip_id = t.id and a.status <> 'cancelled'), 0)::int as applied
from trips t;

-- 정원 초과를 막으면서 신청과 활동 기록을 한 번에 저장
create or replace function apply_trip(p_trip uuid, p_name text, p_phone text, p_people int, p_referrer text)
returns uuid language plpgsql security definer as $$
declare v_id uuid; v_cap int; v_used int;
begin
  select capacity into v_cap from trips where id = p_trip and status = 'open' for update;
  if v_cap is null then raise exception 'closed'; end if;
  select coalesce(sum(people),0) into v_used from applications where trip_id = p_trip and status <> 'cancelled';
  if v_used + p_people > v_cap then raise exception 'full'; end if;
  insert into applications(trip_id,name,phone,people,referrer) values (p_trip,p_name,p_phone,p_people,p_referrer) returning id into v_id;
  insert into activity_logs(phone,action,target_id) values (p_phone,'apply',p_trip);
  return v_id;
end $$;

-- 성과 지표 (재참여율 등)
create or replace view kpi as
select count(distinct phone) as participants,
       count(*) filter (where status <> 'cancelled') as applications,
       (select count(*) from (select phone from applications group by phone having count(distinct trip_id) > 1) r) as repeaters,
       count(*) filter (where referrer is not null) as referred
from applications;

-- 보안: 서버(service role)만 쓰기. 공개 화면은 서버에서 읽어요.
alter table members enable row level security;
alter table trips enable row level security;
alter table applications enable row level security;
alter table activity_logs enable row level security;
create policy "trips readable" on trips for select using (true);
create policy "own member row" on members for all using (auth.uid() = id);
