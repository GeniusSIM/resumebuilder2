# ResumeSaaS Pro – Advanced Resume & Cover Letter Builder

**What’s new (vs MVP):**
- Multiple billing options: Stripe subscriptions + PayPal (sandbox-ready), webhooks set plan=PRO
- Advanced ATS checker with match score (keyword coverage + structure)
- AI-assisted tailoring & cover letters (OpenAI optional with offline fallback)
- Multiple ATS-safe resume templates + themes switcher
- Cover letter template gallery
- Job Application Tracker
- DOCX export (in addition to PDF)

## Quick start

```bash
pnpm i
cp .env.example .env
# fill Stripe/PayPal/OpenAI envs as needed
pnpm prisma:push
pnpm dev
```

Stripe test webhook:
```bash
pnpm webhooks
```

## Notes
- AI features will run locally with simple suggestions if `OPENAI_API_KEY` is not set.
- Stripe/PayPal envs are optional; the app runs without them but upgrade flows will be disabled.
