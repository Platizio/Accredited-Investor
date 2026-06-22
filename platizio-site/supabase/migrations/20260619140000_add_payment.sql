-- Record the Razorpay payment alongside each submission.
-- Idempotent — safe whether or not the initial migration already ran.
-- (The initial migration's CREATE TABLE also includes this column now, so this
--  is a no-op for fresh databases and an additive change for existing ones.)

alter table public.net_worth_submissions    add column if not exists payment jsonb;
alter table public.accreditation_submissions add column if not exists payment jsonb;

-- Refresh PostgREST's schema cache so the new column is usable immediately.
notify pgrst, 'reload schema';
