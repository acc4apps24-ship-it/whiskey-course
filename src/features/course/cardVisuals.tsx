import type { CourseCard } from "@/content/courseTypes";

type FlavorTheme = {
  aria: string;
  accent: string;
  items: Array<"apple" | "pear" | "honey" | "vanilla" | "flower" | "grain" | "spice" | "nut" | "raisin" | "smoke" | "sea" | "berry" | "oak" | "glass">;
};

const chapterVisuals: Record<string, { aria: string; accent: string; motif: "dram" | "speyside" | "highlands" | "islay" | "casks" | "tasting" | "detective" }> = {
  "chapter-1-first-dram": {
    aria: "Иллюстрация главы: Первый драм",
    accent: "#e4a64e",
    motif: "dram",
  },
  "chapter-2-speyside": {
    aria: "Иллюстрация главы: Спейсайд",
    accent: "#b8d77b",
    motif: "speyside",
  },
  "chapter-3-highlands": {
    aria: "Иллюстрация главы: Хайлендс",
    accent: "#9fb9a8",
    motif: "highlands",
  },
  "chapter-4-islay": {
    aria: "Иллюстрация главы: Айла",
    accent: "#87b7c7",
    motif: "islay",
  },
  "chapter-5-casks": {
    aria: "Иллюстрация главы: Бочки и выдержка",
    accent: "#c98b4c",
    motif: "casks",
  },
  "chapter-6-tasting": {
    aria: "Иллюстрация главы: Дегустация",
    accent: "#d6b77d",
    motif: "tasting",
  },
  "chapter-7-detective": {
    aria: "Иллюстрация главы: Детектив виски",
    accent: "#caa36b",
    motif: "detective",
  },
};

function getFlavorTheme(card: CourseCard): FlavorTheme | null {
  if (card.type.startsWith("quiz")) return null;

  const text = `${card.title} ${card.body}`.toLowerCase();
  const items: FlavorTheme["items"] = [];

  if (/(яблок|груш|персик|фрукт)/.test(text)) items.push("apple", "pear");
  if (/(мед|цвет)/.test(text)) items.push("honey", "flower");
  if (/(ванил|карамел|кокос)/.test(text)) items.push("vanilla", "oak");
  if (/(солод|зерн|хлеб|печень)/.test(text)) items.push("grain");
  if (/(спец|прян|кори|пирог)/.test(text)) items.push("spice");
  if (/(орех|миндал|грецк)/.test(text)) items.push("nut");
  if (/(сухофрукт|изюм|шоколад)/.test(text)) items.push("raisin");
  if (/(дым|торф|копчен|костер|йод|водоросл|морск|соль)/.test(text)) {
    items.push("smoke", "sea");
  }
  if (/(ягод|красн|танин|винн)/.test(text)) items.push("berry");
  if (/(внешний вид|аромат|nose|palate|finish|послевкус|вкус|дегустац)/.test(text)) {
    items.push("glass");
  }

  const uniqueItems = Array.from(new Set(items)).slice(0, 6);
  if (uniqueItems.length === 0) return null;

  const ariaItems = uniqueItems
    .map((item) => {
      const names = {
        apple: "фрукты",
        pear: "фрукты",
        honey: "мед",
        vanilla: "ваниль",
        flower: "цветы",
        grain: "солод",
        spice: "специи",
        nut: "орехи",
        raisin: "сухофрукты",
        smoke: "дым",
        sea: "море",
        berry: "ягоды",
        oak: "ваниль",
        glass: "бокал",
      } satisfies Record<FlavorTheme["items"][number], string>;
      return names[item];
    })
    .filter((value, index, source) => source.indexOf(value) === index)
    .join(", ");

  return {
    aria: `Иллюстрация вкусов: ${ariaItems}`,
    accent: uniqueItems.includes("smoke") ? "#87b7c7" : uniqueItems.includes("berry") ? "#d47a8b" : "#e4a64e",
    items: uniqueItems,
  };
}

export function getCardVisual(chapterId: string, card: CourseCard, cardIndex: number) {
  if (cardIndex === 0) {
    return { type: "chapter" as const, ...chapterVisuals[chapterId] };
  }

  const flavorTheme = getFlavorTheme(card);
  return flavorTheme ? { type: "flavor" as const, ...flavorTheme } : null;
}

function FlavorIcon({ item, x, y, color }: { item: FlavorTheme["items"][number]; x: number; y: number; color: string }) {
  if (item === "smoke") {
    return <path d={`M ${x} ${y + 18} C ${x - 16} ${y + 6}, ${x + 18} ${y - 4}, ${x} ${y - 18}`} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.78" />;
  }

  if (item === "sea") {
    return <path d={`M ${x - 22} ${y} C ${x - 10} ${y - 10}, ${x + 2} ${y + 10}, ${x + 16} ${y} S ${x + 36} ${y + 6}, ${x + 48} ${y - 4}`} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.75" />;
  }

  if (item === "spice") {
    return <path d={`M ${x - 14} ${y + 16} L ${x + 14} ${y - 16} M ${x - 2} ${y + 18} L ${x + 24} ${y - 8}`} stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.85" />;
  }

  if (item === "glass") {
    return <path d={`M ${x - 16} ${y - 20} L ${x + 16} ${y - 20} L ${x + 10} ${y + 20} Q ${x} ${y + 28} ${x - 10} ${y + 20} Z`} fill="rgba(255,255,255,0.08)" stroke={color} strokeWidth="3" />;
  }

  const radius = item === "honey" || item === "vanilla" ? 16 : 18;
  return (
    <g>
      <circle cx={x} cy={y} r={radius} fill={color} opacity="0.82" />
      <path d={`M ${x - 7} ${y - 3} C ${x - 1} ${y + 4}, ${x + 7} ${y - 4}, ${x + 12} ${y + 6}`} stroke="rgba(255,255,255,0.42)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  );
}

function ChapterMotif({ motif, accent }: { motif: NonNullable<ReturnType<typeof getCardVisual>> extends infer Visual ? Visual extends { motif: infer M } ? M : never : never; accent: string }) {
  if (motif === "dram") {
    return (
      <>
        <path d="M126 54h58l-11 92c-5 18-41 18-46 0z" fill="rgba(255,255,255,0.08)" stroke={accent} strokeWidth="4" />
        <path d="M137 114c16 8 28-8 43 2l-6 31c-8 11-30 10-37-1z" fill="#d89145" opacity="0.9" />
        <circle cx="78" cy="134" r="17" fill={accent} opacity="0.76" />
        <path d="M52 153c22-20 46-18 74-8" stroke="rgba(255,255,255,0.24)" strokeWidth="5" strokeLinecap="round" />
      </>
    );
  }

  if (motif === "speyside") {
    return (
      <>
        <path d="M92 41c23 8 28 24 42 35 21 17 45 13 62 35-17 12-37 14-58 9-30-7-44 4-75 2 18-20 7-52 29-81z" fill="rgba(184,215,123,0.18)" stroke={accent} strokeWidth="4" />
        <path d="M82 125c28-24 63-29 111-18" stroke="#87b7c7" strokeWidth="5" strokeLinecap="round" />
        <circle cx="77" cy="82" r="14" fill="#e4a64e" />
        <circle cx="174" cy="132" r="11" fill="#f2d27d" />
      </>
    );
  }

  if (motif === "islay") {
    return (
      <>
        <path d="M91 63c28-18 62-7 75 18 13 24 3 55-25 69-28 13-61 0-72-25-10-23-1-48 22-62z" fill="rgba(135,183,199,0.16)" stroke={accent} strokeWidth="4" />
        <path d="M52 150c26-15 42 9 68-6s41 8 71-5" stroke="#87b7c7" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        <path d="M130 125c-22-13 18-30-7-47" stroke="#d9d1bd" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.74" />
      </>
    );
  }

  if (motif === "casks") {
    return (
      <>
        <path d="M72 74c36-22 98-22 134 0v82c-37 19-96 19-134 0z" fill="rgba(201,139,76,0.25)" stroke={accent} strokeWidth="4" />
        <path d="M92 66v99M186 66v99M71 99h136M71 134h136" stroke="rgba(255,255,255,0.24)" strokeWidth="4" />
        <circle cx="133" cy="116" r="13" fill="#e4a64e" opacity="0.85" />
      </>
    );
  }

  if (motif === "tasting") {
    return (
      <>
        <path d="M118 46h50l-9 70c-5 19-34 19-41 0z" fill="rgba(255,255,255,0.08)" stroke={accent} strokeWidth="4" />
        <path d="M124 101c13 6 26-5 39 1l-4 17c-8 11-25 10-31 0z" fill="#d89145" opacity="0.9" />
        <path d="M58 150h152" stroke="rgba(255,255,255,0.2)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="73" cy="74" r="8" fill="#b8d77b" />
        <circle cx="198" cy="91" r="8" fill="#d47a8b" />
      </>
    );
  }

  if (motif === "detective") {
    return (
      <>
        <path d="M76 72h126v80H76z" fill="rgba(255,255,255,0.06)" stroke={accent} strokeWidth="4" />
        <path d="M96 96h42M96 119h70M154 91l28 30" stroke="rgba(255,255,255,0.35)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="176" cy="103" r="25" fill="none" stroke="#87b7c7" strokeWidth="5" />
      </>
    );
  }

  return (
    <>
      <path d="M56 146c38-58 78-82 139-72 4 28-10 52-41 72z" fill="rgba(159,185,168,0.18)" stroke={accent} strokeWidth="4" />
      <path d="M55 147c29-32 53-33 72-22 25 15 48 14 80-10" stroke="rgba(255,255,255,0.24)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="94" cy="86" r="12" fill="#d89145" opacity="0.82" />
    </>
  );
}

export function CardIllustration({ visual }: { visual: NonNullable<ReturnType<typeof getCardVisual>> }) {
  const isFlavor = visual.type === "flavor";
  const iconColors = ["#e4a64e", "#b8d77b", "#d47a8b", "#c98b4c", "#87b7c7", "#f2d27d"];

  return (
    <div
      role="img"
      aria-label={visual.aria}
      className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-black/20"
    >
      <svg viewBox="0 0 260 180" className="h-40 w-full" aria-hidden="true">
        <rect width="260" height="180" fill="#111815" />
        <path d="M0 142 C52 102 91 156 142 119 C187 88 214 102 260 76 V180 H0 Z" fill={visual.accent} opacity="0.14" />
        <path d="M0 154 C40 132 75 139 108 151 C145 165 188 131 260 145" fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="5" />
        {isFlavor ? (
          visual.items.map((item, index) => (
            <FlavorIcon
              key={`${item}-${index}`}
              item={item}
              x={58 + (index % 3) * 70}
              y={68 + Math.floor(index / 3) * 58}
              color={iconColors[index % iconColors.length]}
            />
          ))
        ) : (
          <ChapterMotif motif={visual.motif} accent={visual.accent} />
        )}
      </svg>
    </div>
  );
}
