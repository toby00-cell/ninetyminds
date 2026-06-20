# NinetyMinds

A football scouting platform connecting grassroots Nigerian athletes with scouts, clubs, and academies. Players build a public profile with stats, highlights, and video; scouts browse, save, and message players directly through the platform.

**Live:** [ninetyminds.naijathreads.workers.dev](https://ninetyminds.naijathreads.workers.dev)

<img width="1440" height="900" alt="Screenshot 2026-06-20 at 18 52 52" src="https://github.com/user-attachments/assets/aaeb7e7f-5d10-495e-9a90-61e219d8d57a" />
<img width="1440" height="900" alt="Screenshot 2026-06-20 at 18 53 17" src="https://github.com/user-attachments/assets/3c69060a-ff74-4080-aba5-10d6bca9b69c" />
<img width="1440" height="900" alt="Screenshot 2026-06-20 at 18 53 24" src="https://github.com/user-attachments/assets/4989cdba-2172-4c21-afcc-641638dca2cd" />


## Features

**For athletes**
- Public profile with bio, stats (caps, goals, assists), position, club, city, and a scout rating
- Photo upload and YouTube video highlight links
- Profile completion tracker
- Trial application tracking
- Inbox to receive and reply to scout messages

**For scouts**
- Browse and filter featured players
- Save players to a personal shortlist
- Compare players side by side
- Leaderboard of top-rated players
- Contact players directly (sent under their real authenticated identity, pulled from their scout profile — not free-typed)
- Inbox to track every conversation they've started

**Shared**
- Global search across players, scouts, stories, and clubs
- Stories / blog section (wellness, scouting features, player journeys)
- Wellness Hub with mental health resources for players
- Admin dashboard (restricted by email)

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React + TypeScript |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS v4 |
| Database & Auth | Supabase (Postgres + Row Level Security) |
| Hosting | Cloudflare Workers |
| Payments | Paystack |
| Image storage | Cloudinary / Supabase Storage |
| Email | Resend |

---

## Project structure

```
src/
  routes/
    index.tsx                  # Home
    login.tsx
    register/
      athlete.tsx
      scout.tsx
      success.tsx
    dashboard/
      index.tsx                 # Athlete or scout dashboard
      admin.tsx
    dashboard-messages.tsx       # Shared inbox (athletes + scouts)
    players/
      $playerId.tsx              # Public player profile + contact form
    featured-players.tsx
    compare.tsx
    leaderboard.tsx
    clubs.tsx
    stories/
      index.tsx
      $storyId.tsx
    wellness-hub.tsx
    search.tsx
  lib/
    supabase-browser.ts          # Supabase client
    api/
      players.functions.ts       # Server functions (loaders)
```

---

## Database schema (Supabase / Postgres)

Core tables:

- **players** — athlete profiles, linked to `auth.users` via `user_id`. Includes `slug`, `stats` (jsonb), `video_urls` (text[]), `rating`.
- **scouts** — scout profiles, linked to `auth.users` via `user_id`. One scout profile per account (`unique` constraint on `user_id`).
- **messages** — two-way conversation thread between a scout and a player. A thread is identified by `(scout_user_id, to_player_slug)`. `sender_type` (`'scout' | 'player'`) marks who sent each row.
- **applications** — trial applications submitted by players to clubs.
- **saved_players** — scout's shortlist of saved player profiles.

All tables have Row Level Security enabled. Scouts can only read/write their own threads and profile; players can only read/write messages addressed to them and their own profile.

---

## Local development

### Prerequisites
- Node.js 18+
- A Supabase project (free tier is fine to start)
- Cloudflare account (for deployment via Wrangler)

### Setup

```bash
git clone <repo-url>
cd ninetyminds
npm install
```

Create a `.env` file:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
RESEND_API_KEY=your-resend-key
PAYSTACK_PUBLIC_KEY=your-paystack-key
```

Run the dev server:

```bash
npm run dev
```

### Database setup

Run the SQL migrations in `supabase/migrations/` (in order) via the Supabase SQL editor, or with the Supabase CLI:

```bash
supabase db push
```

---

## Deployment

Deployed to Cloudflare Workers via Wrangler:

```bash
npm run build
npx wrangler deploy
```

Domain is managed through Cloudflare DNS (registered via Qserver).

---

## Known limitations / roadmap

- [ ] Tighten RLS on `applications` and `saved_players` (currently more permissive than ideal)
- [ ] Move admin access check off the client (`email === ADMIN_EMAIL` is currently frontend-only)
- [ ] Add database indexes on `players.slug`, `messages.to_player_slug`, `messages.scout_user_id`
- [ ] Add error monitoring (e.g. Sentry) and structured logging
- [ ] Add rate limiting on message sending and the contact form
- [ ] Image CDN / responsive image sizing for player photos
- [ ] Automated database backups beyond Supabase's default retention

---

## License

Private project — not currently open source.
