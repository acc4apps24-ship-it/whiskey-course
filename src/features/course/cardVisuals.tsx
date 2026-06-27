import type { CourseCard } from "@/content/courseTypes";

type ChapterMotifName =
  | "dram"
  | "speyside"
  | "highlands"
  | "islay"
  | "casks"
  | "tasting"
  | "detective";

type ChapterVisual = {
  aria: string;
  accent: string;
  motif: ChapterMotifName;
};

const palette = {
  background: "#0B0A09",
  darkBrown: "#171310",
  wood: "#5C3820",
  whisky: "#C97914",
  gold: "#E5B24A",
  cream: "#F8EED9",
};

const chapterVisuals: Record<string, ChapterVisual> = {
  "chapter-1-first-dram": {
    aria: "Иллюстрация главы: Первый драм",
    accent: palette.gold,
    motif: "dram",
  },
  "chapter-2-speyside": {
    aria: "Иллюстрация главы: Спейсайд",
    accent: palette.gold,
    motif: "speyside",
  },
  "chapter-3-highlands": {
    aria: "Иллюстрация главы: Хайлендс",
    accent: palette.gold,
    motif: "highlands",
  },
  "chapter-4-islay": {
    aria: "Иллюстрация главы: Айла",
    accent: palette.gold,
    motif: "islay",
  },
  "chapter-5-casks": {
    aria: "Иллюстрация главы: Бочки и выдержка",
    accent: palette.gold,
    motif: "casks",
  },
  "chapter-6-tasting": {
    aria: "Иллюстрация главы: Дегустация",
    accent: palette.gold,
    motif: "tasting",
  },
  "chapter-7-whisky-detective": {
    aria: "Иллюстрация главы: Детектив виски",
    accent: palette.gold,
    motif: "detective",
  },
};

export function getCardVisual(chapterId: string, _card: CourseCard, cardIndex: number) {
  if (cardIndex !== 0) return null;

  const visual = chapterVisuals[chapterId];
  return visual ? { type: "chapter" as const, ...visual } : null;
}

function MapTexture() {
  return (
    <>
      <path d="M-8 151 C48 122 90 156 136 128 C182 101 219 114 328 76" fill="none" stroke={palette.cream} strokeWidth="1.5" opacity="0.11" />
      <path d="M-4 43 C44 62 71 36 119 50 C174 66 206 37 326 47" fill="none" stroke={palette.cream} strokeWidth="1.2" opacity="0.08" />
      <path d="M23 23h274M23 166h274M24 23v143M296 23v143" fill="none" stroke={palette.gold} strokeWidth="1" opacity="0.2" />
      <path d="M33 132 C88 80 124 134 165 92 C201 55 246 82 287 42" fill="none" stroke={palette.whisky} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 8" opacity="0.76" />
      <circle cx="33" cy="132" r="4.5" fill={palette.gold} />
      <circle cx="165" cy="92" r="4.5" fill={palette.gold} />
      <circle cx="287" cy="42" r="4.5" fill={palette.gold} />
      <Compass x={269} y={137} />
    </>
  );
}

function Compass({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.58">
      <circle cx={x} cy={y} r="15" fill="none" stroke={palette.gold} strokeWidth="1.5" />
      <path d={`M ${x} ${y - 21} L ${x + 4} ${y} L ${x} ${y + 21} L ${x - 4} ${y} Z`} fill={palette.gold} opacity="0.72" />
      <path d={`M ${x - 21} ${y} L ${x} ${y - 4} L ${x + 21} ${y} L ${x} ${y + 4} Z`} fill={palette.cream} opacity="0.22" />
    </g>
  );
}

function TinyCask({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="0" rx="16" ry="9" fill={palette.wood} stroke={palette.gold} strokeWidth="1.7" />
      <path d="M-15 0h30M-7-8v16M7-8v16" stroke={palette.gold} strokeWidth="1.2" opacity="0.7" />
    </g>
  );
}

function TinySheep({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity="0.9">
      <circle cx="0" cy="0" r="5" fill={palette.cream} />
      <circle cx="6" cy="-2" r="3.5" fill={palette.cream} />
      <path d="M-4 5v6M3 5v6M7 2h3" stroke={palette.cream} strokeWidth="1.3" strokeLinecap="round" />
    </g>
  );
}

function Distillery({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 26h54V6L27-6 0 6z" fill={palette.darkBrown} stroke={palette.gold} strokeWidth="2" />
      <path d="M40 1h9v-22h-9z" fill={palette.darkBrown} stroke={palette.gold} strokeWidth="2" />
      <path d="M8 26V13h10v13M28 26V13h10v13" stroke={palette.cream} strokeWidth="1.6" opacity="0.45" />
      <path d="M48-23c12-8-4-14 8-21" fill="none" stroke={palette.cream} strokeWidth="2" strokeLinecap="round" opacity="0.42" />
    </g>
  );
}

function ChapterMotif({ motif }: { motif: ChapterMotifName }) {
  if (motif === "dram") {
    return (
      <>
        <path d="M58 119 C82 91 104 76 129 58 C155 41 179 36 206 35 C187 54 177 79 174 105 C134 100 94 109 58 119Z" fill={palette.darkBrown} stroke={palette.gold} strokeWidth="2.6" opacity="0.92" />
        <path d="M45 128 C89 87 127 123 169 81 C194 56 221 48 251 43" fill="none" stroke={palette.whisky} strokeWidth="4" strokeLinecap="round" />
        <path d="M104 112 l18-33 21 33M139 112 l28-47 31 47M181 112 l21-34 24 34" fill="none" stroke={palette.cream} strokeWidth="2.2" opacity="0.36" />
        <TinyCask x={212} y={101} scale={1.35} />
        <path d="M68 135 l6-18 6 18z" fill={palette.gold} />
        <circle cx="74" cy="114" r="4" fill={palette.cream} />
      </>
    );
  }

  if (motif === "speyside") {
    return (
      <>
        <path d="M47 134 C70 94 103 74 141 78 C180 82 208 58 252 64 C232 98 199 119 157 118 C116 117 88 137 47 134Z" fill={palette.darkBrown} stroke={palette.gold} strokeWidth="2.6" />
        <path d="M52 129 C86 107 108 133 143 106 C173 83 198 93 235 71" fill="none" stroke={palette.whisky} strokeWidth="6" strokeLinecap="round" opacity="0.75" />
        <path d="M67 143c39-18 74-17 109-3M84 133c17-16 35-21 55-19" stroke={palette.gold} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <Distillery x={170} y={98} />
        <path d="M103 93v33M86 100c18-19 25-13 35 0M92 91c13 4 21 1 29-8" stroke={palette.gold} strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="91" cy="100" r="5" fill={palette.whisky} />
        <circle cx="119" cy="94" r="5" fill={palette.whisky} />
        <TinyCask x={131} y={112} scale={0.7} />
      </>
    );
  }

  if (motif === "highlands") {
    return (
      <>
        <path d="M43 134 l38-69 24 42 43-78 52 91 32-48 45 62z" fill={palette.darkBrown} stroke={palette.gold} strokeWidth="2.8" />
        <path d="M78 68 l16 28M143 34 l24 42M220 78 l18 28" stroke={palette.cream} strokeWidth="2" opacity="0.45" />
        <path d="M47 146 C83 120 107 151 139 126 C174 97 197 129 243 100" fill="none" stroke={palette.whisky} strokeWidth="4" strokeLinecap="round" />
        <path d="M216 84h34v22h-34zM222 84v-16h7v16M239 84v-20h7v20" fill={palette.darkBrown} stroke={palette.gold} strokeWidth="1.8" />
        <Distillery x={70} y={112} />
        <TinySheep x={151} y={129} />
      </>
    );
  }

  if (motif === "islay") {
    return (
      <>
        <path d="M80 74 C120 47 174 55 201 91 C226 124 198 148 151 149 C108 150 70 127 64 101 C61 89 67 80 80 74Z" fill={palette.darkBrown} stroke={palette.gold} strokeWidth="2.7" />
        <path d="M34 138c27-20 43 12 70-7s45 10 76-7 50 9 84-11" fill="none" stroke={palette.whisky} strokeWidth="4" strokeLinecap="round" opacity="0.76" />
        <path d="M39 154c28-14 45 7 70-5s41 6 70-5 49 7 88-8" fill="none" stroke={palette.cream} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
        <path d="M220 117h22l-4-51h-14zM218 66h26l-13-18z" fill={palette.darkBrown} stroke={palette.gold} strokeWidth="2" />
        <path d="M229 83h7" stroke={palette.cream} strokeWidth="2" opacity="0.55" />
        <Distillery x={93} y={104} />
        <path d="M70 119c14-10 24-10 36 0" stroke={palette.cream} strokeWidth="2" strokeLinecap="round" opacity="0.42" />
      </>
    );
  }

  if (motif === "casks") {
    return (
      <>
        <ellipse cx="158" cy="97" rx="82" ry="55" fill={palette.darkBrown} stroke={palette.gold} strokeWidth="3" />
        <ellipse cx="158" cy="97" rx="50" ry="55" fill="rgba(201, 121, 20, 0.12)" stroke={palette.gold} strokeWidth="2" opacity="0.85" />
        <path d="M84 77h148M84 117h148M124 45c-12 37-12 67 0 104M193 45c12 37 12 67 0 104" stroke={palette.gold} strokeWidth="1.8" opacity="0.5" />
        <path d="M136 120h45v-31h-45z" fill={palette.background} stroke={palette.cream} strokeWidth="1.7" opacity="0.72" />
        <path d="M150 89v31M164 89v31M136 104h45" stroke={palette.gold} strokeWidth="1" opacity="0.58" />
        <path d="M149 82c0-15 22-15 22 0" fill="none" stroke={palette.whisky} strokeWidth="2" />
        <circle cx="160" cy="78" r="5" fill={palette.gold} opacity="0.9" />
        <path d="M51 136 C99 101 123 120 151 100 C186 75 219 93 267 55" fill="none" stroke={palette.whisky} strokeWidth="4" strokeLinecap="round" />
      </>
    );
  }

  if (motif === "tasting") {
    return (
      <>
        <path d="M64 63c34-15 62-13 92 2v83c-29-16-58-18-92-2zM156 65c30-15 61-17 99-2v83c-37-15-68-14-99 2z" fill={palette.darkBrown} stroke={palette.gold} strokeWidth="2.4" />
        <path d="M88 86h42M88 105h48M183 86h42M183 105h37M183 124h29" stroke={palette.cream} strokeWidth="2" strokeLinecap="round" opacity="0.32" />
        <path d="M120 126c11-11 24-11 37 0" stroke={palette.whisky} strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="93" cy="125" r="7" fill={palette.whisky} />
        <path d="M214 120 h22 l-4 22 c-4 8-14 8-18 0z" fill="rgba(248,238,217,0.06)" stroke={palette.gold} strokeWidth="1.8" />
        <path d="M218 136c6 4 10-4 15 1" stroke={palette.whisky} strokeWidth="4" strokeLinecap="round" />
        <path d="M238 51 l20 75" stroke={palette.cream} strokeWidth="4" strokeLinecap="round" opacity="0.62" />
        <Compass x={93} y={48} />
      </>
    );
  }

  return (
    <>
      <path d="M62 58h197v99H62z" fill={palette.darkBrown} stroke={palette.gold} strokeWidth="2.5" />
      <path d="M84 80h42v26H84zM177 76h48v31h-48zM118 122h50v23h-50zM205 122h34v21h-34z" fill={palette.background} stroke={palette.cream} strokeWidth="1.6" opacity="0.82" />
      <path d="M126 93 C153 74 161 127 202 92M126 93 C131 116 142 125 118 133M202 92 C201 114 211 126 223 132" fill="none" stroke={palette.whisky} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="151" cy="101" r="25" fill="none" stroke={palette.gold} strokeWidth="3" />
      <path d="M169 119l24 24" stroke={palette.gold} strokeWidth="5" strokeLinecap="round" />
      <path d="M77 151c18-9 34-8 49 0" stroke={palette.cream} strokeWidth="1.8" opacity="0.3" />
      <TinySheep x={235} y={91} />
    </>
  );
}

export function CardIllustration({ visual }: { visual: NonNullable<ReturnType<typeof getCardVisual>> }) {
  return (
    <div
      role="img"
      aria-label={visual.aria}
      className="mt-5 overflow-hidden rounded-xl border border-[#E5B24A]/20 bg-[#0B0A09] shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
    >
      <svg viewBox="0 0 320 190" className="h-44 w-full" aria-hidden="true">
        <rect width="320" height="190" fill={palette.background} />
        <radialGradient id={`chapter-glow-${visual.motif}`} cx="42%" cy="50%" r="70%">
          <stop offset="0%" stopColor={palette.wood} stopOpacity="0.45" />
          <stop offset="58%" stopColor={palette.darkBrown} stopOpacity="0.24" />
          <stop offset="100%" stopColor={palette.background} stopOpacity="0" />
        </radialGradient>
        <rect width="320" height="190" fill={`url(#chapter-glow-${visual.motif})`} />
        <MapTexture />
        <ChapterMotif motif={visual.motif} />
        <TinyCask x={42} y={47} scale={0.65} />
        <TinySheep x={55} y={153} />
        <path d="M18 176h284" stroke={visual.accent} strokeWidth="1" opacity="0.32" />
        <circle cx="291" cy="176" r="2.5" fill={palette.gold} opacity="0.7" />
      </svg>
    </div>
  );
}
