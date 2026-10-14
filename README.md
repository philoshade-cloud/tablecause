# TableCause

Small in-person dinners where guests back what the host is building. Phase 1: the public site Stripe reviews
(listings, host profiles, policies) and a test-mode booking flow.

## Stack

- Next.js 16 (App Router, Cache Components), Tailwind CSS 4
- Supabase (Postgres) project `tablecause` (`rwexcwwxztfptajwmgfe`, us-east-1)
- Stripe Connect, direct charges on hosts' accounts (full Dashboard, losses on Stripe)

## Run locally

```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev
```

Without database access (for example in a sandbox), run with sample data from `src/lib/fixtures.json`:

```bash
TC_FIXTURES=1 npm run dev
```

## Environment variables

| Name | What it is |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `SERVER_DB_SECRET` | Must match `public.app_secrets` row `server`. Lets the server call `server_*` functions. Rotate before launch |
| `STRIPE_SECRET_KEY` | Stripe secret key (test mode: `sk_test_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_...`) |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used in share links |
| `NEXT_PUBLIC_COMPANY_NAME`, `NEXT_PUBLIC_COMPANY_ADDRESS`, `NEXT_PUBLIC_COMPANY_UEN`, `NEXT_PUBLIC_SUPPORT_EMAIL` | Shown in the footer, contact page and policies |

## Booking flow (phase 1)

1. `/d/[code]/book` collects name, email and contribution.
2. `POST /api/bookings` creates a Customer and a SetupIntent (3D Secure requested) on the host's Stripe account and
   records the booking (`card_saved`). In test mode, hosts without a connected account fall back to the platform account.
3. Stripe Elements confirms the SetupIntent and returns to `/booking/[id]`, which stores the payment method.

Not built yet (phase 2): accounts and sign-in, host onboarding and dinner creation, the D-1 authorization hold,
live check, post-dinner confirmation and capture, emails, admin queues.

## Deploy

Import the repository into Vercel, add the environment variables above, and deploy. Do not set `TC_FIXTURES` in production.
