# My Portfolio Guide

How to update this portfolio when my resume changes, check it, and push it live safely.

- **Live site:** https://adityakumarsingh.vercel.app
- **Code:** https://github.com/HelloA-code/Portfolio
- **On my laptop:** `C:\Users\Aditya Singh\Downloads\portfolio`

---

## 0. The one rule

> **Almost everything I'll ever change is in one file: `src/data/portfolio.ts`.**
> Both themes (the music app and the horror mode) read from it. Change it once, both update.

I only need other files for: my photo (`public/`), my resume PDF (`public/`), or the music.

---

## 1. Every time: the 5-step routine

Open a terminal (PowerShell or Git Bash) and run these one at a time.

**Step 1: go to the project and get the latest code**

```bash
cd "C:\Users\Aditya Singh\Downloads\portfolio"
```

```bash
git pull
```

**Step 2: start the site on my laptop**

```bash
npm run dev
```

Open http://localhost:3000. Leave this running: the page refreshes by itself every time I save a file.

**Step 3: make my changes** (see sections 3 and 4 below), save, and look at the page.

**Step 4: check everything** (stop the dev server first with `Ctrl + C`)

```bash
npm run check
```

This runs the same checks Vercel runs. If it ends without red errors, it's safe. If it fails, read section 7.

**Step 5: save to GitHub and go live**

```bash
git add -A
```

```bash
git commit -m "content: update resume details"
```

```bash
git push
```

Vercel sees the push and puts it live in about 1 minute. Done.

---

## 2. First time on a new laptop

Install these once:

1. **Node.js** (LTS version) from https://nodejs.org
2. **Git** from https://git-scm.com
3. **VS Code** (optional but easiest) from https://code.visualstudio.com

Then:

```bash
git clone https://github.com/HelloA-code/Portfolio.git portfolio
```

```bash
cd portfolio
```

```bash
npm install
```

```bash
npm run dev
```

If `git push` asks me to log in, sign in with my GitHub account (HelloA-code) in the window that opens.

---

## 3. Where things live (the map)

| I want to change… | Open this | Look for |
| --- | --- | --- |
| Name, tagline, location, email | `src/data/portfolio.ts` | `profile` |
| About Me text (lyrics + diary) | `src/data/portfolio.ts` | `profile.bio` (one sentence per line) |
| LinkedIn / GitHub / email links | `src/data/portfolio.ts` | `socials` |
| Education, CGPA, semesters | `src/data/portfolio.ts` | `education`, `semesters` |
| Skills | `src/data/portfolio.ts` | `skills` |
| Projects | `src/data/portfolio.ts` | `projects` |
| Hackathons / achievements | `src/data/portfolio.ts` | `achievements` |
| Clubs / roles / internships | `src/data/portfolio.ts` | `roles` |
| Hobbies | `src/data/portfolio.ts` | `hobbies` |
| Album track names + lyrics | `src/data/portfolio.ts` | `resumeAlbum` |
| My photo | `public/me.jpg` (square) and `public/me-portrait.jpg` (tall) | replace the files, keep the names |
| Resume PDF | `public/resume.pdf` | add or replace the file |
| Site address | `src/data/portfolio.ts` | `profile.siteUrl` |
| Contact form delivery | `src/data/portfolio.ts` | `contactForm` |
| Music (pop score) | `src/lib/audio/tracks.ts` | one block per track |
| Music (horror score) | `src/lib/audio/horrorTracks.ts` | one block per track |
| Tempo / length of a track | `src/lib/audio/meta.ts` | `trackMeta` |

Things I normally **don't** need to touch: `src/components/`, `src/app/`, `src/store/`, `src/lib/` (except the audio files above).

### Quick tour of the folders

```
public/                 images and files served as-is (photo, resume.pdf)
src/data/portfolio.ts   ALL my content  ← 95% of edits happen here
src/app/(music)/        music-app pages (Home, Profile, Browse, ...)
src/app/mission/        horror-mode pages (Briefing, Inventory, Files, ...)
src/components/         building blocks (cards, player, sidebar, horror HUD)
src/lib/audio/          the generated music
GUIDE.md                this file
README.md               technical notes
```

**Search tip:** in VS Code, `Ctrl + P` opens any file by name, and `Ctrl + Shift + F` searches all files (search `TODO` to find blanks I still need to fill).

---

## 4. Recipes for common updates

> When editing `portfolio.ts`: keep the quotes `"..."`, the commas at the end of lines, and the brackets. Copy an existing item and change it. That's the safest way.

### 4.1 New resume? Use this checklist

Go through my new resume top to bottom and update:

- [ ] `profile.tagline` (one line about me)
- [ ] `profile.bio` (About Me sentences)
- [ ] `profile.currentlyBuilding`
- [ ] `education` (scores, years; set `ongoing: true` only while still studying)
- [ ] `semesters` (add a new line each semester)
- [ ] `skills` (add or remove names)
- [ ] `projects` (add new ones, update old ones)
- [ ] `achievements` (new hackathons, ranks, certifications)
- [ ] `roles` (internships, clubs)
- [ ] `socials` (fill in any `null` links)
- [ ] `public/resume.pdf` (replace with the new PDF)
- [ ] album lyrics in `resumeAlbum` that mention changed facts

Then run the 5-step routine.

### 4.2 Add a new project

In `projects`, copy a whole block from `{` to `},` and paste it. Then change the values:

```ts
{
  slug: "my-new-project",          // the web address: /projects/my-new-project (lowercase, dashes, no spaces)
  title: "My New Project",
  subtitle: "One-line description",
  year: 2027,                      // or null if unknown
  released: "2027-03",             // year-month, used for "Recently Released"; or null
  status: "Released",              // or "In progress"
  genre: "Web App",
  categories: ["Web"],             // pick from: "Web", "ML", "Systems", "Web3", "Hackathon", "In Progress"
  description: "Two sentences about what it does.",
  features: [
    { title: "Feature name", detail: "What it does." },
  ],
  credits: ["React.js", "TypeScript"],   // tech used, spelled EXACTLY like in `skills`
  github: "https://github.com/HelloA-code/my-new-project",   // or null
  live: "https://my-new-project.vercel.app",                 // or null
  cover: { hue: 200 },             // any number 0–360 = the cover colour
  linerNotes: { problem: "...", approach: "...", learned: "..." },
  featured: true,                  // true = shows in "Top Picks for Recruiters"
},
```

It automatically appears in: Home, Browse, Albums, Profile, Discography, Genres, search, and the horror Inventory.

**Gotchas:**
- `slug` must be unique.
- `credits` names must match the spelling in `skills` exactly (`"React.js"`, not `"React"`), otherwise the project won't show up under that genre.
- Leave out `trackId` unless I also add a music track (see 4.8).

### 4.3 Update a link (GitHub, demo, LinkedIn)

Replace `null` with the link in quotes:

```ts
github: null,                                          // before
github: "https://github.com/HelloA-code/lumina",       // after
```

The "coming soon" text disappears and real buttons appear automatically.

### 4.4 Add a hackathon or achievement

In `achievements`, add a line:

```ts
{ title: "Smart India Hackathon", detail: "Winner · Dec 2027", tag: "Winner", href: "/projects/my-new-project" },
```

`href` is optional. It makes the row clickable (link it to the project's slug). Order matters: the first item is #1 on the Charts page.

### 4.5 Add an internship or club role

In `roles`:

```ts
{ title: "Software Intern", org: "Company Name", detail: "What I worked on." },
```

### 4.6 Change my photo

1. Put a **square** photo at `public/me.jpg` (used in circles: sidebar, home, avatars).
2. Put a **tall** photo (4:5, e.g. 960×1200) at `public/me-portrait.jpg` (used on the Profile hero).
3. Keep the same file names. Done.

Tip: remove location data from phone photos before adding them (on Windows: right-click the file → Properties → Details → "Remove Properties and Personal Information").

### 4.7 Add / replace my resume PDF

Put the file at `public/resume.pdf` (exact name, lowercase). All "Download Resume" buttons use it.

My phone number should only ever be inside the PDF, never in `portfolio.ts`.

### 4.8 Edit the album (playable resume)

- **Change lyrics:** edit the `lyrics` lines of a track in `resumeAlbum`. Lines are spread across the song automatically.
- **Make a lyric line a link:** add `href`, e.g. `{ text: "See Lumina", href: "/projects/lumina" }`.
- **Add a whole new track** (advanced, 4 places, same `id` in all of them):
  1. `resumeAlbum` in `src/data/portfolio.ts` (title, lyrics)
  2. `trackMeta` in `src/lib/audio/meta.ts` (tempo and bars)
  3. `tracks` at the bottom of `src/lib/audio/tracks.ts` (pop score)
  4. `horrorTracks` at the bottom of `src/lib/audio/horrorTracks.ts` (horror score)

  Easiest: copy an existing track in each file and rename it. Or ask Claude (section 8).

### 4.9 Make the contact form deliver to my inbox

By default it opens the visitor's email app (works with no setup). To receive messages directly:

1. Create a free form at https://formspree.io and copy its id (the part after `/f/`).
2. In `portfolio.ts`, find `contactForm` and change only the two values:

```ts
  provider: "formspree",
  formspreeId: "abcdwxyz", // my id from Formspree
```

---

## 5. Pushing correctly: Git in plain words

| Command | What it means |
| --- | --- |
| `git pull` | Download the latest version from GitHub. **Always do this first.** |
| `git status` | Show what I changed (red = not saved for commit yet). |
| `git diff` | Show the exact lines I changed. Press `q` to exit. |
| `git add -A` | Pick all my changes for the next save. |
| `git commit -m "message"` | Save a snapshot with a short note. |
| `git push` | Upload my snapshots to GitHub. This makes it go live. |
| `git log --oneline -5` | Show my last 5 saves. |

### Good commit messages

Start with a type, then say what changed:

- `content: add Smart India Hackathon win`
- `content: update CGPA and semester 5`
- `feat: add new project page section`
- `fix: broken GitHub link on Lumina`
- `docs: update guide`

### Before every push, ask myself

- [ ] Did I `git pull` first?
- [ ] Did `npm run check` pass with no errors?
- [ ] Did I look at the page in the browser (desktop and phone size)?
- [ ] No phone number, passwords or private info in the code?

---

## 6. After pushing: check it went live

1. Go to https://vercel.com, open my portfolio project (the one linked to `HelloA-code/Portfolio`) → **Deployments**.
2. The top one should say **Ready** (green) after about a minute.
3. Open https://adityakumarsingh.vercel.app and press `Ctrl + Shift + R` to skip the browser cache.

If it says **Error**, click it → **Build Logs**, and see section 7.

---

## 7. When something goes wrong

**`npm run check` shows red errors**
Read the first error. It names the file and line, e.g. `src/data/portfolio.ts:120`. Usually it's:
- a missing comma `,` at the end of a line,
- a missing quote `"`,
- a typo in a category (must be one of `"Web" | "ML" | "Systems" | "Web3" | "Hackathon" | "In Progress"`),
- `status` not exactly `"Released"` or `"In progress"`.

**"Port 3000 is in use"**
Another dev server is running. Close the other terminal, or run `npm run dev -- -p 3001` and open http://localhost:3001.

**`git push` is rejected ("fetch first" / "non-fast-forward")**
GitHub has changes I don't have. Run:

```bash
git pull --rebase
```

```bash
git push
```

**I messed up a file and want it back to the last saved version** (before committing)

```bash
git restore src/data/portfolio.ts
```

**I already pushed something broken and want to undo it**

```bash
git log --oneline -5
```

Copy the id of the bad commit (e.g. `a1b2c3d`), then:

```bash
git revert a1b2c3d
```

```bash
git push
```

This adds a new commit that undoes the bad one. The site goes back to how it was.

**Build stops with `SecurityFatalError: Your version of Next.js is affected by a known security vulnerability`**
Next.js found a security fix I don't have yet. Update it (both packages together), then check again:

```bash
npm install next@latest eslint-config-next@latest
```

```bash
npm run check
```

If it passes, commit with a message like `chore: update Next.js` and push. (`npm audit` lists what the fix is for.)

**Warnings like "LF will be replaced by CRLF"**
Harmless on Windows. Ignore them.

**Weird type errors about `.next/...` files after moving pages**
Run `npx next typegen` and try again.

**The site still shows old content after deploy**
Hard refresh with `Ctrl + Shift + R`, or open it in a private window.

---

## 8. Getting help from Claude

Open Claude Code in the portfolio folder and paste one of these:

- *"Here's my updated resume [attach PDF]. Update src/data/portfolio.ts to match it, keep both themes working, run npm run check, and show me what changed before committing."*
- *"Add a new project called X with these details: … Then run the checks."*
- *"Add a new album track about my internship at X, in both the pop and horror scores."*
- *"npm run check fails with this error: [paste]. Fix it."*
- *"Commit and push my changes with a good message."*

---

## 9. Cheat sheet

```text
cd "C:\Users\Aditya Singh\Downloads\portfolio"
git pull                 # get latest
npm run dev              # preview at http://localhost:3000
# ...edit src/data/portfolio.ts, save, look...
npm run check            # lint + build, must pass
git add -A
git commit -m "content: what I changed"
git push                 # live in ~1 minute
```
