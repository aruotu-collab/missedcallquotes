# MissedCallQuotes

Turn missed calls into quote-ready jobs for UK plumbers and heating engineers.

This is the founder MVP from the strategy thread: **missed call → plumbing intake → quote-ready pack → human action → outcome tracking**. It is not an AI receptionist and not a CRM.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Members sign in with a **magic link** once Supabase is configured. Without those env vars, local demo login still works:

- Email: `dave@davesplumbing.test`
- Password: `plumber123`

### Magic link + database (Supabase)

1. In the `missedcallquotes` project, copy **Project URL** and **anon public** key into `.env.local` and Vercel as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Run `supabase/schema.sql` in the SQL editor (creates `businesses`, `leads`, `quotes` with RLS).
3. Authentication → URL configuration:
   - Site URL: `https://missedcallquotes.com`
   - Redirect URLs: `https://missedcallquotes.com/auth/callback`, `http://localhost:3000/auth/callback`, `http://localhost:3001/auth/callback`
4. Authentication → Providers → Email: enable magic links.

### Google Analytics + Search Console

1. In [Google Analytics](https://analytics.google.com/) create a GA4 property for `https://missedcallquotes.com` and copy the Measurement ID (`G-…`).
2. In [Search Console](https://search.google.com/search-console) add the URL-prefix property `https://missedcallquotes.com`, choose **HTML tag**, and copy the `content` value from the meta tag.
3. Set both on Vercel (Production) and in `.env.local`:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=paste-the-html-tag-content
```

4. Redeploy, then click **Verify** in Search Console. Submit `https://missedcallquotes.com/sitemap.xml` under Sitemaps.

## What ships in V1

- Marketing site, live SMS demo, missed-revenue calculator, founding-10 pricing
- Plumbing intake engine for the main enquiry types (boiler, leak, burst, drains, bathroom, etc.)
- Plumber dashboard: recovered revenue, needs-you queue, accept / quote / follow up / won / collected
- Quote list so the domain’s second half is visible immediately
- Simulated missed-call catcher (creates real leads) until Twilio is connected
- Twilio webhook stubs at `/api/twilio/voice` and `/api/twilio/sms`

With Supabase configured, members, jobs and quotes live in Postgres. Without it, data still lives in `.data/store.json` (ephemeral on Vercel).

## Pricing the company around

| Plan | Price | Role |
| --- | --- | --- |
| Founding 10 | £79 locked 12 months | Learning, case studies |
| Solo | £99 | Capture + qualification |
| Growth | £179 | The plan to sell |
| Multi-van | £299 | Staff + numbers |

Guarantee: if it does not generate one genuine qualified opportunity in 30 days, the next month is free. Card on install, not a 14-day tyre-kicker trial.

## First 90 days (from the thread)

1. Prove call-forwarding + caller ID on EE, O2, Vodafone and Three.
2. Recruit 10 Manchester plumbing/heating firms (1–10 engineers, already buying leads).
3. Obsess over **recovered revenue per customer per month**, not MRR.
4. Add quote follow-up next. Voice AI last.

## Before live traffic

- UK legal review (PECR/GDPR, TPS/CTPS for outbound, privacy notice, DPA)
- Keep missed-call SMS transactional — no promotions
- Deterministic safety copy for gas / CO / flooding (already in the engine)
- Connect Twilio, Stripe, and optionally OpenAI structured outputs
