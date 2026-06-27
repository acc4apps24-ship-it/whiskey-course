# Deployment

## Bitrix Vibecode Build Contract

Build command:

```bash
npm install
npm run build
```

Output directory:

```text
dist
```

Environment variables must be provided by GitHub/deploy secrets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_DATA_MODE=supabase`

For a temporary public demo without Supabase, omit these values or set:

- `VITE_DATA_MODE=mock`

Frontend uses Supabase anon key only. Never add Supabase service role key to GitHub, Vite env, or committed files.

## Supabase

Run `supabase/migrations/001_whisky_journey_schema.sql` in the Supabase project before deploying the frontend.

## Manual Mobile QA

Check on iPhone 12+ Safari and Chrome:

- 18+ gate blocks "Мне нет 18".
- Name validation accepts 2-24 characters.
- Returning with cookie opens course without re-entering name.
- Card player hides answer until selection.
- XP feedback appears after correct answer.
- Final Challenge remains locked until required chapters complete.
- Leaderboard loads or shows graceful fallback.
- Loader respects reduced motion.
- Bottom UI has safe-area spacing.
