import type { HoleSpec } from '@/components/course/CourseArt';
import type { Pt } from '@/lib/course';

export const RESUME = '/Yash_Gandhi_Resume.pdf';

export const HOLES = [
  { n: 1, id: 'home', short: 'Tee', par: 4, side: 'right' },
  { n: 2, id: 'about', short: 'About', par: 3, side: 'right' },
  { n: 3, id: 'experience', short: 'Work', par: 4, side: 'left' },
  { n: 4, id: 'projects', short: 'Projects', par: 3, side: 'right' },
  { n: 5, id: 'book', short: 'Book', par: 5, side: 'left' },
  { n: 6, id: 'blog', short: 'Blog', par: 3, side: 'right' },
  { n: 7, id: 'wellness', short: 'Wellness', par: 5, side: 'left' },
  { n: 8, id: 'listens', short: 'Listens', par: 4, side: 'right' },
  { n: 9, id: 'contact', short: 'Contact', par: 4, side: 'left' },
] as const;

export const skills = ['JS/TypeScript', 'React/Next.js', 'Node.js', 'Python', 'SQL'];
export const interests = ['Hockey', 'Golf', 'F1', 'Travelling', 'Writing', 'Weightlifting', 'Running'];

export const experiences = [
  {
    title: 'AI Engineering Intern',
    company: 'T-Mobile',
    period: 'Summer 2026',
    description: 'Built AI agents for the T-Life app, website, & customer support.',
    technologies: ['Python', 'Machine Learning', 'AI', 'SDKs'],
    logo: '/images/tmobile-mark.png',
    website: 'https://www.t-mobile.com/',
  },
  {
    title: 'Vertical Operations Intern',
    company: 'Super.com',
    period: 'Summer 2025',
    description: 'Series C startup serving as a saving app that empowers users to spend less, save more, and build credit.',
    technologies: ['Jira', 'Smartsheet', 'Snowflake', 'SQL', 'Python'],
    logo: '/images/super-mark.png',
    website: 'https://super.com',
  },
  {
    title: 'Senior Product & Operations',
    company: 'HotTakes',
    period: '2023 - 2025',
    description: 'Seed-stage startup focused on creating a free-to-play sports betting platform for users to win cash prizes without any risk.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Airtable'],
    logo: '/images/hottakes-mark.png',
    website: 'https://hottakes.com/',
  },
  {
    title: 'Private Equity Analyst',
    company: 'Lynwood Succession',
    period: 'Summer 2024',
    description: 'Contributed to due diligence reports for potential acquisitions, including financial modeling and market research.',
    technologies: ['MS Excel', 'MS Word', 'MS PowerPoint'],
    logo: '/images/lynwood-mark.png',
    website: 'https://www.cbinsights.com/company/lynwood-succession',
  },
];

export const projects = [
  {
    title: 'FlipperClaw',
    description: "An open-source pocket AI agent. A Flipper Zero is the screen and controls, an ESP32-S3 is the brain. LLM replies stream straight to the Flipper, and the agent can use its NFC, Sub-GHz and IR radios as tools.",
    link: 'https://github.com/yasher3413/flipperclaw',
    tags: ['C++', 'C', 'ESP32-S3', 'Flipper Zero', 'LLM agents'],
  },
  {
    title: 'twig',
    description: 'A lightweight macOS browser for people who keep 100+ tabs open. Built on the native webview instead of bundled Chromium, it puts idle tabs to sleep so they cost nothing until you come back to them.',
    link: 'https://github.com/yasher3413/twig',
    tags: ['Rust', 'TypeScript', 'Tauri 2', 'macOS'],
  },
  {
    title: 'Personal Assistant',
    description: 'A personal assistant that can help you with your daily tasks, schedule events, search the web, and answer your questions.',
    link: 'https://github.com/yasher3413/personal-agent',
    tags: ['TypeScript', 'Next.js', 'Anthropic Claude API', 'Vercel'],
  },
];

export const posts = [
  {
    title: '42.2 km to almost finding myself',
    excerpt: 'something that changed me more than the finish line ever did',
    date: 'Nov 19, 2025',
    readTime: '7 min read',
    link: 'https://open.substack.com/pub/yashgandhi/p/422-km-to-almost-finding-myself?utm_campaign=post-expanded-share&utm_medium=web',
    tags: ['Achievement', 'Decision Making', 'Personal Growth'],
  },
  {
    title: 'independence vs isolation',
    excerpt: 'a thin line between standing strong and standing alone',
    date: 'Sep 16, 2025',
    readTime: '5 min read',
    link: 'https://open.substack.com/pub/yashgandhi/p/independence-vs-isolation?utm_campaign=post-expanded-share&utm_medium=web',
    tags: ['Psychology', 'Lifestyle', 'Behavior'],
  },
  {
    title: '7 Countries. 17 Cities. 10 Weeks. 0 Days Off.',
    excerpt: 'How I Worked Full Time and Still Saw the World This Summer Without Taking a Single Day of PTO',
    date: 'Jul 29, 2025',
    readTime: '8 min read',
    link: 'https://open.substack.com/pub/yashgandhi/p/7-countries-17-cities-10-weeks-0?r=3cbkg2&utm_campaign=post&utm_medium=web&showWelcomeOnShare=false',
    tags: ['Personal', 'Growth', 'Reflection'],
  },
];

export const GOODREADS_URL = 'https://www.goodreads.com/book/show/236654175-to-have-it-figured-out';

export const contacts = [
  { label: 'LinkedIn', handle: 'in/yashgandhi34', href: 'https://www.linkedin.com/in/yashgandhi34/' },
  { label: 'GitHub', handle: 'yasher3413', href: 'https://github.com/yasher3413' },
  { label: 'Email', handle: 'yashgandhi2023@gmail.com', href: 'mailto:yashgandhi2023@gmail.com' },
];

/* ── The course. Holes are drawn in a 400×600 plan, tee at the bottom. ── */

export const heroSpec: HoleSpec = {
  w: 800,
  h: 560,
  line: [[110, 478], [270, 424], [430, 330], [565, 228], [662, 132]],
  width: 80,
  shots: [[668, 124]],
  green: [664, 126, 64, 44],
  bunkers: [[478, 404, 36, 18], [598, 78, 24, 13], [735, 180, 22, 12], [330, 300, 28, 14]],
  water: [[330, 488, 88, 44]],
  trees: [[60, 380, 26], [96, 350, 18], [200, 530, 22], [760, 330, 30], [720, 380, 20], [520, 120, 26], [480, 160, 18], [770, 60, 22], [250, 250, 20]],
  yards: 412,
  seed: 11,
  hillCount: 5,
};

/** Hole 1 stood up for phones: tee at the bottom centre, so a pull-back runs straight down with room to spare. */
export const heroSpecTall: HoleSpec = {
  w: 400,
  h: 620,
  line: [[200, 585], [190, 470], [150, 360], [190, 250], [245, 130]],
  width: 70,
  shots: [[248, 122]],
  green: [245, 125, 52, 38],
  bunkers: [[118, 300, 24, 14], [300, 152, 18, 11], [190, 78, 20, 10], [118, 468, 20, 12]],
  water: [[322, 410, 40, 52]],
  trees: [[345, 598, 18], [342, 545, 20], [68, 150, 22], [40, 382, 16], [362, 205, 18], [362, 478, 14]],
  yards: 412,
  seed: 11,
  hillCount: 4,
};

export type CaddieNote = { dot: Pt; end: Pt; text: Pt; lines: string[]; anchor: 'start' | 'end'; size: number };

/** Hole 1's caddie notes for each layout, in drawing units. */
export const heroNotes: Record<'wide' | 'tall', CaddieNote[]> = {
  wide: [
    { dot: [124, 488], end: [168, 522], text: [172, 530], lines: ['you are here: Toronto'], anchor: 'start', size: 30 },
    { dot: [330, 300], end: [238, 236], text: [232, 228], lines: ['Business & CS,', 'Western'], anchor: 'end', size: 28 },
    { dot: [566, 226], end: [560, 150], text: [560, 116], lines: ['just played: AI engineering', "@ T-Mobile, summer '26"], anchor: 'end', size: 28 },
  ],
  tall: [
    { dot: [186, 590], end: [140, 568], text: [134, 552], lines: ['you are here:', 'Toronto'], anchor: 'end', size: 24 },
    { dot: [118, 300], end: [74, 262], text: [18, 234], lines: ['Business & CS,', 'Western'], anchor: 'start', size: 24 },
    { dot: [194, 262], end: [244, 270], text: [250, 262], lines: ['just played:', 'AI engineering', "@ T-Mobile, '26"], anchor: 'start', size: 23 },
  ],
};

export const specs: Record<string, HoleSpec> = {
  about: {
    w: 400, h: 600,
    line: [[200, 560], [232, 410], [180, 252], [205, 110]],
    width: 70,
    shots: [[230, 412], [178, 256], [205, 106]],
    green: [205, 104, 50, 36],
    bunkers: [[268, 140, 20, 12], [148, 92, 16, 10]],
    water: [[96, 350, 50, 66]],
    trees: [[335, 480, 24], [358, 438, 16], [58, 520, 22], [322, 262, 18], [60, 180, 20]],
    yards: 168, seed: 2,
  },
  experience: {
    w: 400, h: 600,
    line: [[300, 566], [292, 442], [222, 322], [142, 208], [150, 96]],
    width: 66,
    shots: [[292, 444], [220, 322], [144, 206], [150, 92]],
    green: [150, 90, 46, 34],
    bunkers: [[218, 402, 22, 13], [92, 258, 16, 24], [202, 104, 18, 11]],
    trees: [[362, 300, 24], [342, 250, 18], [58, 420, 26], [88, 470, 18], [262, 200, 20], [340, 130, 22]],
    yards: 436, seed: 3,
  },
  projects: {
    w: 400, h: 600,
    line: [[118, 566], [168, 420], [248, 272], [260, 118]],
    width: 66,
    shots: [[168, 420], [246, 276], [260, 114]],
    green: [260, 112, 52, 34],
    bunkers: [[314, 160, 20, 12], [202, 80, 16, 10], [116, 300, 22, 14]],
    water: [[322, 420, 48, 62]],
    trees: [[50, 440, 22], [72, 400, 15], [350, 290, 20], [80, 150, 24]],
    yards: 187, seed: 4,
  },
  book: {
    w: 400, h: 600,
    line: [[200, 572], [118, 450], [210, 330], [292, 210], [220, 90]],
    width: 60,
    shots: [[122, 446], [288, 214], [220, 86]],
    green: [220, 86, 48, 32],
    bunkers: [[64, 376, 16, 22], [248, 290, 20, 12], [170, 64, 16, 10], [268, 118, 14, 9]],
    water: [[312, 432, 40, 58]],
    trees: [[340, 330, 22], [60, 250, 26], [100, 200, 16], [350, 540, 20]],
    yards: 186, seed: 5,
  },
  blog: {
    w: 400, h: 600,
    line: [[90, 562], [162, 430], [298, 330], [300, 180], [232, 94]],
    width: 64,
    shots: [[164, 428], [300, 252], [232, 92]],
    green: [232, 92, 50, 34],
    bunkers: [[212, 380, 20, 12], [352, 206, 14, 22], [184, 118, 14, 10]],
    trees: [[330, 470, 26], [48, 360, 22], [120, 240, 24], [150, 200, 16]],
    yards: 205, seed: 6,
  },
  wellness: {
    w: 400, h: 600,
    line: [[200, 576], [252, 470], [168, 350], [242, 230], [190, 90]],
    width: 50,
    shots: [[170, 352], [190, 88]],
    green: [190, 88, 40, 28],
    bunkers: [[296, 440, 16, 10], [118, 300, 14, 20], [240, 104, 14, 9]],
    water: [[70, 470, 44, 54]],
    trees: [[330, 330, 22], [352, 290, 15], [70, 200, 24], [310, 170, 18], [340, 560, 18]],
    yards: 46151, seed: 7, hillCount: 4,
  },
  listens: {
    w: 400, h: 600,
    line: [[320, 562], [250, 440], [258, 300], [170, 190], [122, 96]],
    width: 66,
    shots: [[250, 440], [244, 292], [122, 94]],
    green: [122, 94, 46, 34],
    bunkers: [[190, 124, 18, 11], [300, 250, 16, 22]],
    water: [[104, 376, 56, 48]],
    trees: [[360, 420, 22], [60, 250, 20], [320, 140, 24], [60, 540, 20]],
    yards: 390, seed: 8,
  },
  contact: {
    w: 400, h: 600,
    line: [[100, 566], [160, 420], [208, 284], [270, 112]],
    width: 70,
    shots: [[204, 296], [270, 108]],
    green: [270, 108, 54, 38],
    bunkers: [[330, 150, 18, 12], [210, 80, 18, 10], [262, 360, 18, 12]],
    trees: [[330, 470, 24], [50, 330, 22], [80, 230, 16], [130, 130, 20]],
    yards: 405, seed: 9,
  },
};

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yashgandhi.org';
