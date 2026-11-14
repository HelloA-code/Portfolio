# Aditya Kumar Singh: The Discography

A personal portfolio styled like a music app. Projects are albums, skills are genres, achievements are charts, and the resume is **ADITYA.EXE**, an album you can actually play. Every track is synthesised live in the browser with Tone.js (no samples, no copyrighted audio).

Built with Next.js (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · Tone.js · Zustand · cmdk · lucide-react.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages are static)
npm run lint
npm run format     # prettier
```

## Update your content

Everything visible on the site lives in **`src/data/portfolio.ts`**. Search it for `TODO`:

| What | Where in `portfolio.ts` |
| --- | --- |
| Name, tagline, bio lines (About page lyrics) | `profile` |
| Site URL (SEO, sitemap, OG) | `profile.siteUrl` or env `NEXT_PUBLIC_SITE_URL` |
| Photo | put `me.jpg` in `public/`, set `profile.photo = "/me.jpg"` |
| Resume | put your PDF at `public/resume.pdf` |
| LinkedIn / GitHub / LeetCode / Codeforces | `socials` (a `null` href shows "coming soon") |
| Projects (albums) | `projects`: add an object and it appears everywhere |
| Real screenshot as a cover | `cover: { image: "/lumina.png" }` on a project |
| Skills (genres) | `skills`: project `credits` that match a skill link to its genre |
| Achievements, roles, hobbies | `achievements`, `roles`, `hobbies` |
| Contact form | `contactForm`: `"mailto"` works with no setup; for Formspree set `provider: "formspree"` and `formspreeId` |

### Adding a project

```ts
{
  slug: "my-new-thing",            // URL: /projects/my-new-thing
  title: "My New Thing",
  subtitle: "One-line pitch",
  year: 2026,
  released: "2026-11",             // used for "Recently Released"
  status: "Released",              // or "In progress"
  genre: "Web App",
  categories: ["Web"],             // filter chips on Browse
  description: "...",
  features: [{ title: "Feature", detail: "Shown when the track is clicked" }],
  credits: ["React.js", "TypeScript"],
  github: "https://github.com/...",
  live: null,
  cover: { hue: 200 },             // 0-360, pins the generated cover colours
  linerNotes: { problem: "...", approach: "...", learned: "..." },
  featured: true,                  // shows in "Top Picks for Recruiters"
}
```

## Edit the album (ADITYA.EXE)

- **Track titles and lyrics:** `resumeAlbum` in `src/data/portfolio.ts`. Lyrics are spread evenly across a track and snapped to bars. Pin a line with `bar: 4`. Add `href` to make a line a link.
- **Tempo, length, key:** `src/lib/audio/meta.ts` (`bars × 240 / bpm` = seconds).
- **The music itself:** `src/lib/audio/tracks.ts`. One `TrackSpec` per track id. Helpers:
  - `beat(c, kit(c), { kick: "x...x...x...x...", snare: "....x.......x..." })`: 16 steps per bar, `X` = accent
  - `chords(c, pad, [["C3","E3","G3"], ...], "1m", "1m")`: one chord per bar
  - `line(c, synth, "E5 . D5 C5 . . A4 .", "8n", "8n", "8m")`: melody, `.` = rest, starts at bar 8
  - `c.T.getTransport().schedule(fn, "20m")`: one-off events (e.g. the final chord)
- Tone.js is only downloaded when a visitor first presses Play.

## Shortcuts & easter eggs

- `Ctrl/⌘ K` or `/` search · `Space` play/pause · `←` `→` previous/next · `M` mute
- Type **hire** anywhere: jumps to *Hire Me (Outro)*
- **Konami code** (↑↑↓↓←→←→ B A): synthwave mode
- Listen to 3 tracks (8s+ each): unlocks a hidden bonus track
- Right-click or long-press a cover: Open / Play / GitHub / Copy link

## Horror mode (`/mission`)

A second theme of the same portfolio: a survival-horror "field dossier". It's original (no game names, logos, characters or assets) and reads the same `src/data/portfolio.ts`, so content updates show up in both themes.

| Page | What it shows |
| --- | --- |
| `/mission` Briefing | Title card, dossier with your photo, mission objectives from `achievements` |
| `/mission/inventory` | Projects packed into a case grid; hover to examine, click to inspect |
| `/mission/inventory/[slug]` | Item inspect view with pointer tilt, notes (features) and parts (credits) |
| `/mission/files` | Education, records and roles as stamped paper documents |
| `/mission/upgrades` | Skill groups with real counts: skills per group and projects using them |
| `/mission/diary` | Your `profile.bio`, typed out on a page |
| `/mission/safe-room` | Typewriter that downloads the resume, a letter-style contact form, contacts |

- **Score:** `src/lib/audio/horrorTracks.ts` re-scores every album track (same ids, tempo and length as `tracks.ts`, so lyrics stay in sync). Lyrics show as subtitles while a track plays.
- **Switching:** "Horror Mode" in the sidebar / Library tab, and the exit icon in the horror HUD. Whatever is playing restarts in the other score.
- **Styles:** `.horror`, `.h-panel`, `.h-paper`, `.h-btn` and friends at the bottom of `globals.css`.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com): **Add New → Project**, import the repo (Next.js is auto-detected).
3. Add env var `NEXT_PUBLIC_SITE_URL` = your final URL (e.g. `https://aditya.vercel.app`).
4. Deploy. Check `/sitemap.xml`, `/robots.txt` and `/opengraph-image` afterwards.

## Structure

```
src/
  data/portfolio.ts          all content + the album tracklist
  lib/audio/                 meta (tempo/lyric timing), helpers, tracks + horrorTracks (scores), engine
  store/                     Zustand player + UI stores
  components/layout/         Sidebar, TabBar, Background, NowPlayingBar/Sheet, CommandPalette
  components/music/          CoverArt, AlbumCard, TrackList, LyricsView, VisualizerRing, ...
  components/ui/             shared primitives
  components/horror/         horror-mode HUD, background, inventory, typewriter, ...
  app/(music)/               music-app pages (route group, URLs unchanged)
  app/mission/               horror-mode pages
  app/                       root layout, sitemap, robots, OG image
```
