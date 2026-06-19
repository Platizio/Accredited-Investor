-- ════════════════════════════════════════════════════════════════════════
--  Platizio — Supabase schema for application form persistence
--  Matches src/lib/submissions.ts (submitNetWorth / submitAccreditation /
--  makeUploaders) and src/lib/supabase.ts (SUBMISSIONS_BUCKET = "submissions").
--
--  Security model:
--    • The browser uses the ANON key. RLS allows anon to INSERT only.
--    • There are NO select/update/delete policies for anon, so submitted
--      PII can only be read with the service_role key (server / dashboard).
--    • Uploaded documents go to a PRIVATE Storage bucket; anon can upload
--      but not list/read. Read them from the dashboard or a service_role.
--
--  Apply: paste into Supabase → SQL Editor and run, OR `supabase db push`.
--  Idempotent — safe to re-run.
-- ════════════════════════════════════════════════════════════════════════

-- ── Tables ───────────────────────────────────────────────────────────────

create table if not exists public.net_worth_submissions (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  -- applicant block (from buildApplicantPayload → applicantColumns)
  account_type       text,
  application_type   text,
  full_name          text,
  organization       text,
  email_address      text,
  phone_number       text,
  pan_card           text,
  aadhaar_number     text,
  current_address    jsonb,
  permanent_address  jsonb,
  spouse             jsonb,        -- null unless Joint – Spouse
  -- form-specific
  cert_validity      text,         -- '2-Year' | '3-Year'
  tnc_accepted       boolean,
  documents          jsonb         -- { slot: FileMeta | FileMeta[] | null }
);

create table if not exists public.accreditation_submissions (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  account_type       text,
  application_type   text,
  full_name          text,
  organization       text,
  email_address      text,
  phone_number       text,
  pan_card           text,
  aadhaar_number     text,
  current_address    jsonb,
  permanent_address  jsonb,
  spouse             jsonb,
  -- form-specific
  eligibility_path   text,         -- 'Net Worth' | 'Hybrid' | 'Income'
  cert_validity      text,
  tnc_accepted       boolean,
  documents          jsonb
);

-- ── Row-level security: anon may INSERT only ─────────────────────────────

alter table public.net_worth_submissions    enable row level security;
alter table public.accreditation_submissions enable row level security;

-- Table-level grant so the anon/authenticated roles can insert at all
-- (RLS below is what actually gates it). No SELECT grant → no reads.
grant insert on public.net_worth_submissions    to anon, authenticated;
grant insert on public.accreditation_submissions to anon, authenticated;

-- Defense in depth: explicitly remove read/update/delete from the public
-- roles in case a project's legacy default privileges pre-granted them.
-- (RLS already blocks reads since there is no SELECT policy; this also strips
--  the underlying table grant so confidentiality doesn't rely on RLS alone.)
revoke select, update, delete on public.net_worth_submissions    from anon, authenticated;
revoke select, update, delete on public.accreditation_submissions from anon, authenticated;

drop policy if exists "anon insert net worth submissions" on public.net_worth_submissions;
create policy "anon insert net worth submissions"
  on public.net_worth_submissions
  for insert to anon, authenticated
  with check (true);

drop policy if exists "anon insert accreditation submissions" on public.accreditation_submissions;
create policy "anon insert accreditation submissions"
  on public.accreditation_submissions
  for insert to anon, authenticated
  with check (true);

-- (Deliberately no SELECT/UPDATE/DELETE policies — anon cannot read PII.)

-- ── Storage: private "submissions" bucket ────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit)
values ('submissions', 'submissions', false, 5242880)   -- 5 MB (mirrors MAX_FILE_BYTES)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit;

-- Anon may upload into the submissions bucket, but has no read/list policy,
-- so documents stay private (read via dashboard / service_role).
drop policy if exists "anon upload submission documents" on storage.objects;
create policy "anon upload submission documents"
  on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'submissions');
