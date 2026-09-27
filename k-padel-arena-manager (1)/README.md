# K-Padel Arena Manager — deployable version

This is the same app you've been using in chat (court booking calendar,
league scheduling, standings, member sign-up), repackaged as a small
Next.js site so it can run as a real public website on Vercel.

**What changed from the chat version:** all the data (league settings,
bookings, members, venue photos) now lives in a shared Redis database
instead of your browser's local storage — so every visitor sees the
same live data. The only thing kept device-local is "which member you're
logged in as," so one person logging in doesn't log everyone else in too.

## What you need before you start

- A GitHub account (free) — to hold the code so Vercel can deploy it
- A Vercel account (free) — sign up at vercel.com with your GitHub account, that's the easiest path
- Nothing else. You do **not** need to create any database yourself or
  hand me any API keys — Vercel injects those automatically in step 3.

## Deploy steps

1. **Push this folder to a new GitHub repo.**
   - Create a new empty repo on GitHub (e.g. `k-padel-arena`).
   - From this project folder:
     ```
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/<your-username>/k-padel-arena.git
     git push -u origin main
     ```

2. **Import the repo into Vercel.**
   - Go to vercel.com → Add New → Project → pick the repo you just pushed.
   - Framework preset should auto-detect as **Next.js**. Click **Deploy**.
   - The first deploy will succeed but the site won't work yet (no
     database connected) — that's expected, continue to step 3.

3. **Connect a free Redis database.**
   - In your new Vercel project, go to the **Storage** tab.
   - Click **Browse Marketplace**, search **Upstash**, choose the
     **Redis** integration, and pick the free tier.
   - When it asks which project to connect it to, choose this project.
     This automatically adds the `UPSTASH_REDIS_REST_URL` and
     `UPSTASH_REDIS_REST_TOKEN` environment variables for you — you
     don't need to copy/paste anything.

4. **Redeploy.**
   - Go to the **Deployments** tab → click the "..." menu on the latest
     deployment → **Redeploy** (this picks up the new environment
     variables).

5. **Open the site.**
   - Vercel gives you a URL like `k-padel-arena.vercel.app` — that's a
     real public link, no Claude account or login needed. Share it with
     anyone.

## Local development (optional)

```
npm install
cp .env.local.example .env.local   # then paste in your Upstash REST URL + token
npm run dev
```

Open http://localhost:3000.

## Notes / limits

- The free Upstash tier is generous for a small club (hundreds of
  thousands of commands/month) — plenty for booking + league data.
- Uploaded photos are auto-compressed client-side before saving, but
  very large photo libraries could eventually approach free-tier
  storage limits. If that ever becomes a problem, the fix is moving
  photos to a dedicated file store (e.g. Vercel Blob) instead of Redis
  — ask me and I can wire that in.
- If any step above fails, tell me exactly which step and the error
  message shown — that's all I need to help you fix it.
