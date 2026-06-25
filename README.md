# Whisky Journey

Mobile-first interactive course about single malt Scotch whisky.

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Required frontend env:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_DATA_MODE=supabase`

Use `VITE_DATA_MODE=mock` only for local UI work without Supabase.
Do not commit `.env`.
Do not use Supabase `service_role` key in frontend.

## Verification

```bash
npm run test
npm run build
```
