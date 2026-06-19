# Supabase setup (form persistence)

The application forms (`/apply/net-worth`, `/apply/accreditation`) persist to
Supabase: documents go to a private Storage bucket and a row is inserted into
the matching table. Wiring lives in `src/lib/supabase.ts` and
`src/lib/submissions.ts`.

## 1. Environment variables
Set these in `.env.local` (and in your deploy host's env):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-SUPABASE-ANON-KEY
```

Find them in Supabase → **Project Settings → API**. `supabase.ts` throws on
import if they're missing, so the build needs them present.

## 2. Apply the schema
Run `migrations/20260619120000_init_submissions.sql` either by:
- pasting it into **Supabase → SQL Editor → Run**, or
- `supabase db push` (if you use the Supabase CLI).

It creates the `net_worth_submissions` and `accreditation_submissions` tables,
the private `submissions` Storage bucket, and the RLS policies. It's idempotent.

## 3. Security model
- The browser uses the **anon** key; RLS allows **INSERT only**.
- There are **no** select/update/delete policies for anon, so submitted PII
  (PAN, Aadhaar, financials) **cannot be read** with the anon key.
- Uploaded documents live in a **private** bucket — read them from the
  dashboard or with the `service_role` key on a trusted server only.

## 4. Reading submissions
Use the Supabase dashboard (Table editor / Storage) or a server-side
`service_role` client. Never expose the `service_role` key to the browser.

## Hardening to consider (not included)
- Rate-limiting / CAPTCHA on insert (anon insert is open by design for a public form).
- A scheduled purge job to honor the 30-day deletion promise in the Terms.
