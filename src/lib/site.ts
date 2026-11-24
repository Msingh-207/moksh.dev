export const SITE = {
  name: "Moksh Singh",
  domain: "moksh.dev",
  email: "singhmoksh207@gmail.com",
  github: "https://github.com/Msingh-207",
  linkedin: "https://www.linkedin.com/in/moksh-singh-2007vp7",
  /**
   * "Download CV" link. Drop your PDF at /public/resume.pdf and it is served directly.
   * Until then, next.config.ts falls back to the printable /resume page, so the link never 404s.
   */
  resume: "/resume.pdf",
  location: "Delhi NCR, India",
  timezone: "Asia/Kolkata",
  tagline: "Full-Stack Developer • Economics Undergrad • Motion & Video Editor",
  description:
    "Moksh Singh — full-stack developer at Levithan Technologies, B.A. (Hons) Economics undergrad at Dr. B. R. Ambedkar University Delhi, and DaVinci Resolve video editor.",
} as const;

export const SECTIONS = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "lab", label: "Lab" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export interface TimelineEntry {
  title: string;
  org: string;
  period?: string;
  kind: "work" | "education";
  points: string[];
  tags?: string[];
}

export const EXPERIENCE: TimelineEntry[] = [
  {
    title: "Software Developer Trainee",
    org: "Levithan Technologies Pvt. Ltd.",
    period: "Sept 2026 – Present",
    kind: "work",
    points: [
      "Building and maintaining REST APIs backed by MySQL / PostgreSQL schemas.",
      "Containerising services with Docker and shipping them through CI/CD pipelines.",
      "Learning production practices: code review, migrations, logging and incident hygiene.",
    ],
    tags: ["REST", "SQL", "Docker", "CI/CD"],
  },
  {
    title: "Video Editor",
    org: "NAQSH Studios, Gautam Buddha University",
    kind: "work",
    points: [
      "Edited short films from assembly to final cut, focusing on story structure and pacing.",
      "Handled colour grading, dialogue clean-up and delivery in DaVinci Resolve.",
    ],
    tags: ["DaVinci Resolve", "Colour", "Fairlight"],
  },
];

export const EDUCATION: TimelineEntry[] = [
  {
    title: "B.A. (Hons) Economics",
    org: "Dr. B. R. Ambedkar University Delhi",
    period: "2025 – Present",
    kind: "education",
    points: [
      "Second-year undergraduate with a quantitative focus.",
      "Coursework spans macro- and microeconomic theory, statistics and numerical methods.",
    ],
    tags: [
      "Macroeconomics",
      "Microeconomics",
      "Statistics for Economics",
      "Numerical Analysis",
      "Mathematical Methods",
    ],
  },
];

export const STACK = [
  { group: "Data & Backend", items: ["Python", "Pandas", "NumPy", "Flask", "SQL"] },
  { group: "Web & DevOps", items: ["React", "JavaScript", "HTML/CSS", "Docker", "Git"] },
  {
    group: "Creative",
    items: ["DaVinci Resolve", "Fusion", "Fairlight", "Blender", "FL Studio", "Photoshop"],
  },
];

export const WORKSTATION = {
  machine: "HP HyperX OMEN 15",
  specs: [
    { k: "CPU", v: "Intel Core i7-14650HX" },
    { k: "GPU", v: "NVIDIA RTX 5060 · 8 GB" },
    { k: "RAM", v: "24 GB DDR5" },
    { k: "OS", v: "Windows 11 + EndeavourOS (Arch)" },
  ],
  tools: ["VS Code", "Cursor", "Obsidian"],
};

export const EXPLORING = [
  { label: "Macroeconomic policy & RBI Grade B prep", detail: "Monetary policy, inflation targeting, Indian economy" },
  { label: "PyTorch fundamentals", detail: "Tensors, autograd, small models on the RTX 5060" },
  { label: "Blender 3D animation", detail: "Graph editor, rigging basics, turntables" },
  { label: "Fingerstyle guitar", detail: "Percussive technique and arrangement" },
];
