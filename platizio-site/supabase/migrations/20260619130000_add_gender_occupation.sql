-- Add gender + occupation to accreditation submissions.
-- Idempotent — safe whether or not the initial migration already ran.
-- (The initial migration's CREATE TABLE also includes these now, so this is a
--  no-op for fresh databases and an additive change for existing ones.)

alter table public.accreditation_submissions add column if not exists gender     text;
alter table public.accreditation_submissions add column if not exists occupation text;
