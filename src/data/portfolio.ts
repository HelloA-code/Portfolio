/**
 * Single source of truth for every word on the site.
 * Edit this file to update the portfolio. Search for "TODO" to find gaps.
 *
 * Links set to `null` are hidden (or shown as "coming soon") until you fill them in.
 */

export type ProjectCategory = "Web" | "ML" | "Systems" | "Web3" | "Hackathon" | "In Progress";
export type ProjectStatus = "Released" | "In progress";

export type Feature = {
  title: string;
  detail: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  /** Release year; null shows "TBA" */
  year: number | null;
  /** ISO month used for sorting "Recently Released", e.g. "2026-02" */
  released: string | null;
  status: ProjectStatus;
  genre: string;
  categories: ProjectCategory[];
  description: string;
  /** "Tracks" on the album page */
  features: Feature[];
  /** "Credits" = tech stack. Names should match entries in `skills` so Genres can link them. */
  credits: string[];
  github: string | null;
  live: string | null;
  /** Generated cover. `hue` (0-360) pins the palette, `image` overrides it with a real screenshot in /public. */
  cover?: { hue?: number; image?: string };
  linerNotes: { problem: string; approach: string; learned: string };
  /** Shows in "Top Picks for Recruiters" */
  featured: boolean;
  /** id of the track in `resumeAlbum` that plays from this album page */
  trackId?: string;
};

export const profile = {
  name: "Aditya Kumar Singh",
  shortName: "Aditya",
  tagline: "Software Engineering student · Full-stack, ML & embedded systems builder",
  location: "Pune, Maharashtra",
  email: "adi.ansh2006@gmail.com",
  siteUrl: "https://adityakumarsingh.vercel.app",
  // TODO: add /public/resume.pdf (your phone number lives only there, never on the site)
  resume: "/resume.pdf",
  /** Square photo for avatars. null shows a generated monogram. */
  photo: "/me.jpg" as string | null,
  /** Tall photo for the Profile hero (4:5). Falls back to `photo`. */
  portrait: "/me-portrait.jpg" as string | null,
  currentlyBuilding: "AI Calisthenics Tracker",
  bio: [
    "Hi, I'm Aditya.",
    "I study Software Engineering at Vishwakarma Institute of Technology, Pune.",
    "I build across the stack: web apps, machine learning and embedded systems.",
    "With mentors from Kandou.ai, my team emulated CXL memory devices end to end.",
    "Zephyr on RISC-V, OpenBMC on ARM, talking MCTP over a bridge I wrote.",
    "At HackArena 2026 I built Lumina, a personal finance tracker.",
    "At AlgoVerse by Algorand we made the Top 35 with an on-chain logistics app.",
    "FleetMind took my team to the Newton School Hackathon finals.",
    "Right now I'm teaching a webcam to count push-ups.",
    "Off the clock: strength training, calisthenics and badminton.",
    "Let's build something.",
  ],
};

export const socials: { label: string; handle: string; href: string | null }[] = [
  { label: "LinkedIn", handle: "Connect", href: "https://www.linkedin.com/in/aditya-kumar-singh-18992a32a" },
  { label: "GitHub", handle: "Follow", href: null }, // TODO: GitHub URL
  { label: "Email", handle: "adi.ansh2006@gmail.com", href: "mailto:adi.ansh2006@gmail.com" },
];

/** Contact form delivery. "mailto" needs no setup; "formspree" posts to https://formspree.io/f/<formspreeId>. */
export const contactForm: { provider: "mailto" | "formspree"; formspreeId: string | null } = {
  provider: "mailto",
  formspreeId: null, // TODO: paste your Formspree form id and switch provider to "formspree"
};

export type Education = {
  title: string;
  school: string;
  score: string;
  start: number | null;
  end: number | null;
  detail?: string;
};

export const education: Education[] = [
  {
    title: "B.Tech, Software Engineering",
    school: "Vishwakarma Institute of Technology, Pune",
    score: "CGPA 8.85",
    start: 2024,
    end: 2028,
    detail: "Sem 1: 9.25 · Sem 2: 8.85 · Sem 3: 8.24 · Sem 4: 9.1",
  },
  {
    title: "CBSE Class XII",
    school: "St. Xavier's Convent School, Lucknow",
    score: "89%",
    start: null,
    end: 2024,
  },
  {
    title: "CBSE Class X",
    school: "Lucknow Public School",
    score: "96%",
    start: null,
    end: 2022,
  },
];

export const semesters = [
  { label: "Sem 1", cgpa: 9.25 },
  { label: "Sem 2", cgpa: 8.85 },
  { label: "Sem 3", cgpa: 8.24 },
  { label: "Sem 4", cgpa: 9.1 },
];

export type SkillGenre = { slug: string; name: string; hue: number; skills: string[] };

export const skills: SkillGenre[] = [
  { slug: "languages", name: "Languages", hue: 330, skills: ["C", "C++", "Python"] },
  {
    slug: "web",
    name: "Web Development",
    hue: 190,
    skills: ["JavaScript", "TypeScript", "React.js", "Node.js", "HTML", "CSS", "Tailwind CSS", "REST APIs"],
  },
  { slug: "databases", name: "Databases", hue: 265, skills: ["SQL", "PostgreSQL", "Supabase"] },
  {
    slug: "embedded-systems",
    name: "Embedded & Systems",
    hue: 15,
    skills: ["Linux", "Zephyr RTOS", "OpenBMC", "QEMU", "Renode", "MCTP", "CXL", "UART"],
  },
  {
    slug: "data-science-ml",
    name: "Data Science & ML",
    hue: 150,
    skills: ["NumPy", "Pandas", "OpenCV", "MediaPipe", "TensorFlow", "Streamlit"],
  },
  { slug: "web3", name: "Web3", hue: 45, skills: ["Algorand", "Pera Wallet"] },
  { slug: "tools", name: "Tools", hue: 300, skills: ["Git", "GitHub", "Vercel", "Chart.js"] },
  { slug: "coursework", name: "Coursework", hue: 220, skills: ["Data Structures & Algorithms"] },
];

export const projects: Project[] = [
  {
    slug: "cxl-telemetry",
    title: "CXL Telemetry",
    subtitle: "Out-of-Band Telemetry & RAS Dashboard · Kandou.ai",
    year: null, // TODO: year
    released: null, // TODO: e.g. "2026-06"
    status: "Released",
    genre: "Industry Project · Embedded Systems",
    categories: ["Systems"],
    description:
      "Internship project with mentors from Kandou.ai: an emulator-based setup for out-of-band monitoring of CXL memory devices, with no physical server hardware needed. Built in a 4-member team.",
    features: [
      {
        title: "Emulated CXL Device",
        detail: "A CXL memory device emulated with Zephyr RTOS on an Andes AE350 (RISC-V) target in Renode.",
      },
      {
        title: "12 CXL CCI Commands",
        detail: "Including Identify, Get Health Info, Event Records and Poison List, with support for injecting test errors.",
      },
      {
        title: "Emulator Bridge",
        detail: "A Python/C bridge connecting the Renode UART (exposed as a TCP socket) to OpenBMC on ARM QEMU, passing MCTP-over-serial frames.",
      },
      { title: "OpenBMC Collector", detail: "Decodes CCI responses into JSON on the BMC side." },
      {
        title: "Live RAS Dashboard",
        detail: "Telemetry charts, an event log and alert thresholds. Errors injected on the device show up as alerts.",
      },
    ],
    credits: ["C", "Python", "Zephyr RTOS", "OpenBMC", "QEMU", "Renode", "MCTP", "CXL", "Linux", "Git"],
    github: null,
    live: null,
    cover: { hue: 15 },
    linerNotes: {
      problem: "Testing out-of-band monitoring of CXL memory normally needs real server hardware.",
      approach: "Emulate both sides (device on RISC-V in Renode, BMC on ARM in QEMU) and bridge them with MCTP over serial.",
      learned: "TODO: what did you learn?",
    },
    featured: true,
    trackId: "out-of-band",
  },
  {
    slug: "lumina",
    title: "Lumina",
    subtitle: "Smart Finance Tracker",
    year: 2026,
    released: "2026-02",
    status: "Released",
    genre: "Full-stack · FinTech",
    categories: ["Web", "Hackathon"],
    description: "Personal finance web app to record expenses, set monthly budgets and track spending, built during HackArena 2026.",
    features: [
      { title: "Authentication", detail: "User sign-up and login with Supabase." },
      { title: "Transactions & Budgets", detail: "Expenses and monthly budgets stored in PostgreSQL via Supabase." },
      { title: "Category Spending", detail: "Chart.js dashboard of spending by category." },
      { title: "Budget Usage", detail: "See how much of each monthly budget is used." },
      { title: "Monthly Trends", detail: "Spending trends month over month." },
    ],
    credits: ["React.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "REST APIs", "Chart.js"],
    github: null, // TODO
    live: null, // TODO
    cover: { hue: 275 },
    linerNotes: {
      problem: "TODO: what problem were you solving?",
      approach: "TODO: how did the team approach it during the hackathon?",
      learned: "TODO: what did you learn?",
    },
    featured: true,
    trackId: "lumina",
  },
  {
    slug: "algoverse-logistics",
    title: "On-Chain Logistics", // TODO: real project name
    subtitle: "Blockchain logistics app · AlgoVerse by Algorand",
    year: 2026,
    released: "2026-08",
    status: "Released",
    genre: "Web3 · Logistics",
    categories: ["Web", "Web3", "Hackathon"],
    description:
      "Blockchain-based logistics app built with a 3-member team at the AlgoVerse Hackathon by Algorand, finishing in the Top 35 teams.",
    features: [
      { title: "Pera Wallet Sign-in", detail: "Users sign in with their Pera Wallet." },
      { title: "On-Chain Records", detail: "Transactions are verified and recorded on Algorand." },
      { title: "Live Operations Dashboard", detail: "A dashboard for live operations data." },
    ],
    credits: ["React.js", "Tailwind CSS", "Node.js", "Algorand", "Pera Wallet", "x402", "Vercel"],
    github: null, // TODO
    live: null, // TODO
    cover: { hue: 45 },
    linerNotes: {
      problem: "TODO",
      approach: "TODO",
      learned: "TODO",
    },
    featured: true,
    trackId: "on-chain",
  },
  {
    slug: "fleetmind",
    title: "FleetMind",
    subtitle: "AI Logistics Optimisation",
    year: null, // TODO
    released: null, // TODO
    status: "Released",
    genre: "AI · Logistics",
    categories: ["ML", "Hackathon"],
    description: "AI-based logistics platform for route optimisation and fleet management. Newton School Hackathon finalist.",
    features: [
      { title: "Route Optimisation", detail: "Finds efficient delivery routes for a fleet." },
      { title: "Fleet Management", detail: "One view of vehicles, routes and assignments." },
      { title: "Hackathon Finals", detail: "Reached the finals of the Newton School Hackathon." },
    ],
    credits: [], // TODO: tech stack
    github: null, // TODO
    live: null, // TODO
    cover: { hue: 200 },
    linerNotes: {
      problem: "TODO",
      approach: "TODO",
      learned: "TODO",
    },
    featured: false,
    trackId: "fleetmind",
  },
  {
    slug: "ai-calisthenics-tracker",
    title: "AI Calisthenics Tracker",
    subtitle: "Real-time rep counting with computer vision",
    year: 2026,
    released: "2026-10",
    status: "In progress",
    genre: "Computer Vision",
    categories: ["ML", "In Progress"],
    description: "Computer vision app that identifies calisthenics exercises from webcam video and counts reps in real time.",
    features: [
      { title: "Exercise Recognition", detail: "Identifies the calisthenics exercise from webcam video." },
      { title: "Body Tracking", detail: "MediaPipe pose landmarks with OpenCV." },
      { title: "Real-time Rep Counting", detail: "Counts each rep as it happens." },
      { title: "History Dashboard (in progress)", detail: "A Streamlit dashboard for workout history and progress." },
    ],
    credits: ["Python", "OpenCV", "MediaPipe", "TensorFlow", "NumPy", "Streamlit"],
    github: null, // TODO
    live: null, // TODO
    cover: { hue: 160 },
    linerNotes: {
      problem: "TODO",
      approach: "TODO",
      learned: "TODO",
    },
    featured: true,
    trackId: "rep-counter",
  },
  {
    // Not on the current resume. Delete this object to remove it from the site.
    slug: "smart-movie-finder",
    title: "Smart Movie Finder",
    subtitle: "Movie discovery web app",
    year: null, // TODO
    released: null, // TODO
    status: "Released",
    genre: "Web App",
    categories: ["Web"],
    description: "Movie discovery web app powered by live TMDB data.",
    features: [
      { title: "Live TMDB Data", detail: "Real-time ratings, genres, release dates and overviews from the TMDB API." },
      { title: "Dynamic Search", detail: "Results update as you type." },
      { title: "Responsive UI", detail: "Works across phones, tablets and desktops." },
      { title: "Team Development", detail: "Built as a team with Git and GitHub workflows." },
    ],
    credits: ["React.js", "JavaScript", "HTML", "CSS", "TMDB API", "Git"],
    github: null, // TODO
    live: null, // TODO
    cover: { hue: 340 },
    linerNotes: {
      problem: "TODO",
      approach: "TODO",
      learned: "TODO",
    },
    featured: false,
  },
];

export type Achievement = { title: string; detail: string; tag: string; href?: string };

export const achievements: Achievement[] = [
  { title: "Newton School Hackathon", detail: "Finalist with FleetMind", tag: "Finalist", href: "/projects/fleetmind" },
  {
    title: "AlgoVerse Hackathon by Algorand",
    detail: "Top 35 teams · Aug 2026",
    tag: "Top 35",
    href: "/projects/algoverse-logistics",
  },
  { title: "Kandou.ai Industry Project", detail: "CXL out-of-band telemetry & RAS dashboard", tag: "Internship", href: "/projects/cxl-telemetry" },
  { title: "HackArena 2026", detail: "Built Lumina with my team · Feb 2026", tag: "Built", href: "/projects/lumina" },
  { title: "CBSE Class X", detail: "96%", tag: "Academic" },
  { title: "Data Science Course", detail: "Certification in progress", tag: "Ongoing" },
];

export const roles: { title: string; org: string; detail: string }[] = [
  {
    title: "Industry Project Team",
    org: "Kandou.ai",
    detail: "One of a 4-member team working with Kandou.ai mentors on CXL out-of-band telemetry.",
  },
  {
    title: "Database Volunteer",
    org: "SWD Club, VIT Pune",
    detail: "Managed volunteer and event databases for the club's social welfare activities.",
  },
];

export const hobbies: { title: string; detail: string; icon: "dumbbell" | "badminton" | "gamepad" | "code" }[] = [
  { title: "Strength Training", detail: "Getting stronger, one session at a time.", icon: "dumbbell" },
  { title: "Calisthenics", detail: "Where the rep-counter idea came from.", icon: "dumbbell" },
  { title: "Badminton", detail: "Fast feet, faster reflexes.", icon: "badminton" },
];

/* ------------------------------------------------------------------ */
/* ADITYA.EXE: The Album. The playable resume.                        */
/* Lyrics are spread evenly across each track, snapped to bars.       */
/* Set `bar` on a line to pin it. Music lives in src/lib/audio/.      */
/* ------------------------------------------------------------------ */

export type Lyric = { text: string; href?: string; bar?: number };

export type ResumeTrack = {
  id: string;
  title: string;
  about: string;
  mood: string;
  /** project slug: its cover is reused and the lyrics link to it */
  project?: string;
  hidden?: boolean;
  lyrics: Lyric[];
};

export const albumTitle = "ADITYA.EXE";

export const resumeAlbum: ResumeTrack[] = [
  {
    id: "boot-sequence",
    title: "Boot Sequence (Intro)",
    about: "Who I am",
    mood: "Slow string swell, harp arpeggio",
    lyrics: [
      { text: "// booting ADITYA.EXE" },
      { text: "Aditya Kumar Singh" },
      { text: "B.Tech Software Engineering, VIT Pune" },
      { text: "Class of 2028" },
      { text: "Web, machine learning, embedded systems" },
      { text: "Press play on the rest." },
    ],
  },
  {
    id: "nine-twenty-five",
    title: "9.25",
    about: "Academic journey",
    mood: "Hazy piano, slow beat",
    lyrics: [
      { text: "Class X: 96%", href: "/discography" },
      { text: "Class XII: 89%" },
      { text: "First semester at VIT: 9.25" },
      { text: "Then 8.85, 8.24, and back up to 9.1" },
      { text: "CGPA: 8.85" },
    ],
  },
  {
    id: "out-of-band",
    title: "Out of Band",
    about: "Kandou.ai industry project",
    mood: "Noir strings, sonar bells",
    project: "cxl-telemetry",
    lyrics: [
      { text: "An industry project with Kandou.ai", href: "/projects/cxl-telemetry" },
      { text: "Monitoring CXL memory, no server hardware needed" },
      { text: "Zephyr RTOS on a RISC-V target in Renode" },
      { text: "Twelve CCI commands, from Identify to Poison List" },
      { text: "A bridge to OpenBMC on QEMU, MCTP over serial" },
      { text: "Inject an error. Watch the alert light up." },
    ],
  },
  {
    id: "lumina",
    title: "Lumina",
    about: "Smart finance tracker",
    mood: "Glamorous strings and bells",
    project: "lumina",
    lyrics: [
      { text: "HackArena 2026" },
      { text: "Lumina: a personal finance tracker", href: "/projects/lumina" },
      { text: "Sign in, record expenses, set a monthly budget" },
      { text: "Supabase and PostgreSQL underneath" },
      { text: "Chart.js for categories, budgets and trends" },
    ],
  },
  {
    id: "rep-counter",
    title: "Rep Counter",
    about: "AI Calisthenics Tracker",
    mood: "Heavy slow kick, rising bell count",
    project: "ai-calisthenics-tracker",
    lyrics: [
      { text: "Webcam on." },
      { text: "MediaPipe finds the pose, OpenCV tracks the body" },
      { text: "Which exercise? It knows." },
      { text: "One rep. Two reps. Counted in real time." },
      { text: "Still in the studio", href: "/projects/ai-calisthenics-tracker" },
    ],
  },
  {
    id: "on-chain",
    title: "On-Chain",
    about: "AlgoVerse by Algorand",
    mood: "Shimmering harp, slow groove",
    project: "algoverse-logistics",
    lyrics: [
      { text: "AlgoVerse Hackathon by Algorand" },
      { text: "Three of us, one logistics app", href: "/projects/algoverse-logistics" },
      { text: "Sign in with Pera Wallet" },
      { text: "Every transaction verified on Algorand" },
      { text: "Top 35 teams." },
    ],
  },
  {
    id: "fleetmind",
    title: "FleetMind (Finals Mix)",
    about: "Hackathon finalist",
    mood: "Driving strings, the fastest track",
    project: "fleetmind",
    lyrics: [
      { text: "Newton School Hackathon" },
      { text: "FleetMind made the finals", href: "/projects/fleetmind" },
      { text: "AI-based logistics" },
      { text: "Route optimisation and fleet management" },
    ],
  },
  {
    id: "stack-overflow",
    title: "Stack Overflow",
    about: "Skills medley",
    mood: "Reprise of earlier themes",
    lyrics: [
      { text: "C, C++, Python", href: "/genres/languages" },
      { text: "React, Node, TypeScript, Tailwind", href: "/genres/web" },
      { text: "SQL, PostgreSQL, Supabase", href: "/genres/databases" },
      { text: "Zephyr, OpenBMC, QEMU, Renode, MCTP", href: "/genres/embedded-systems" },
      { text: "OpenCV, MediaPipe, TensorFlow", href: "/genres/data-science-ml" },
      { text: "Algorand on the side", href: "/genres/web3" },
    ],
  },
  {
    id: "off-the-clock",
    title: "Off The Clock",
    about: "Hobbies",
    mood: "Warm, slow, golden hour",
    lyrics: [
      { text: "Laptop closed." },
      { text: "Strength training" },
      { text: "Calisthenics", href: "/liner-notes" },
      { text: "Badminton" },
      { text: "Then back to building." },
    ],
  },
  {
    id: "hire-me",
    title: "Hire Me (Outro)",
    about: "Call to action",
    mood: "Rising strings, ends on a big chord",
    lyrics: [
      { text: "That's the album." },
      { text: "Open to internships and collaborations" },
      { text: "Let's talk", href: "/contact" },
      { text: "adi.ansh2006@gmail.com", href: "mailto:adi.ansh2006@gmail.com" },
      { text: "Download the resume", href: "/resume.pdf" },
      { text: "Thanks for listening." },
    ],
  },
  {
    id: "debug-mode",
    title: "Debug Mode (Bonus Track)",
    about: "Hidden track",
    mood: "Glitchy music box",
    hidden: true,
    lyrics: [
      { text: "// you found the bonus track" },
      { text: "Thanks for listening to three tracks" },
      { text: "console.log('hire this person')" },
      { text: "Exit code 0." },
    ],
  },
];

/* Helpers */

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getTrack = (id: string) => resumeAlbum.find((t) => t.id === id);
export const getGenre = (slug: string) => skills.find((g) => g.slug === slug);

/** Projects whose credits include any skill in the genre */
export const projectsForGenre = (genre: SkillGenre) =>
  projects.filter((p) => p.credits.some((c) => genre.skills.includes(c)));

export const sortedByRelease = () =>
  [...projects].sort((a, b) => (b.released ?? "").localeCompare(a.released ?? ""));
