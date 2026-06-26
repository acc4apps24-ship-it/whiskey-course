import { lazy, Suspense, useEffect, useState } from "react";

const RIVE_LOADER_SRC = "/rive/whisky-journey-loader.riv";
const RiveLoaderCanvas = lazy(() =>
  import("./RiveLoaderCanvas").then((module) => ({
    default: module.RiveLoaderCanvas,
  })),
);

function RiveStage() {
  const [canLoadRive, setCanLoadRive] = useState(false);
  useEffect(() => {
    let isMounted = true;

    fetch(RIVE_LOADER_SRC, { method: "HEAD" })
      .then((response) => {
        if (isMounted && response.ok) {
          setCanLoadRive(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCanLoadRive(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!canLoadRive) return null;

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Suspense fallback={null}>
        <RiveLoaderCanvas src={RIVE_LOADER_SRC} />
      </Suspense>
    </div>
  );
}

function VintageFallback() {
  return (
    <div className="loader-poster" aria-hidden="true">
      <div className="loader-bokeh loader-bokeh-one" />
      <div className="loader-bokeh loader-bokeh-two" />
      <svg viewBox="0 0 390 560" className="loader-poster-art">
        <defs>
          <linearGradient id="woodGrain" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#5c3820" />
            <stop offset="0.55" stopColor="#171310" />
            <stop offset="1" stopColor="#0b0a09" />
          </linearGradient>
          <linearGradient id="whiskyGold" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#e5b24a" />
            <stop offset="0.55" stopColor="#c97914" />
            <stop offset="1" stopColor="#5c3820" />
          </linearGradient>
        </defs>

        <rect width="390" height="560" fill="#080a09" />
        <circle cx="284" cy="158" r="92" fill="#c97914" opacity="0.1" />
        <path d="M0 405 C83 370 128 418 203 386 C276 356 324 371 390 340 V560 H0 Z" fill="url(#woodGrain)" />
        <path d="M20 452 C98 428 153 461 231 423 C288 396 340 411 383 394" fill="none" stroke="#c97914" strokeWidth="2" opacity="0.32" />
        <path d="M32 490 C99 468 169 497 247 459 C299 434 346 448 390 431" fill="none" stroke="#f8eed9" strokeWidth="1" opacity="0.13" />

        <g className="loader-bottle-vintage">
          <path d="M-50 83 L164 18 C185 12 207 28 212 49 C216 66 207 84 191 90 L-20 172 Z" fill="rgba(31,20,13,0.96)" stroke="#c97914" strokeWidth="3" />
          <path d="M164 18 C187 19 202 31 211 50" fill="none" stroke="#f8eed9" strokeWidth="3" opacity="0.45" />
          <path d="M184 53 L260 41 C277 39 291 51 293 68 C294 82 284 95 270 98 L195 105 Z" fill="rgba(22,15,11,0.95)" stroke="#f8eed9" strokeWidth="2" opacity="0.82" />
          <path d="M219 56 C238 51 263 50 285 61" fill="none" stroke="#f8eed9" strokeWidth="2" opacity="0.42" />
        </g>

        <path className="loader-pour-vintage" d="M267 92 C248 151 245 195 243 265" fill="none" stroke="url(#whiskyGold)" strokeWidth="10" strokeLinecap="round" />
        <path className="loader-pour-thin" d="M280 94 C263 157 260 202 257 270" fill="none" stroke="#e5b24a" strokeWidth="3" strokeLinecap="round" opacity="0.82" />

        <g className="loader-glass-vintage">
          <path d="M111 226 H306 L277 474 C267 512 153 512 140 474 Z" fill="rgba(255,255,255,0.04)" stroke="#f8eed9" strokeWidth="4" />
          <path d="M123 336 C171 316 214 350 293 324 L278 463 C265 495 154 494 143 463 Z" fill="url(#whiskyGold)" opacity="0.84" />
          <path className="loader-liquid-wave" d="M124 335 C171 315 216 350 292 324" fill="none" stroke="#e5b24a" strokeWidth="5" strokeLinecap="round" />
          <path d="M145 250 L269 462 M187 235 L250 485 M236 235 L162 482" stroke="#f8eed9" strokeWidth="2" opacity="0.32" />
          <path d="M131 394 H286 M147 455 H271" stroke="#f8eed9" strokeWidth="2" opacity="0.24" />
          <path className="loader-glass-glint" d="M130 244 C158 251 181 253 210 248" fill="none" stroke="#f8eed9" strokeWidth="4" strokeLinecap="round" />
          <path className="loader-glass-glint-delayed" d="M274 256 C257 318 255 384 267 448" fill="none" stroke="#f8eed9" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <path d="M177 329 L220 300 L257 332 L218 366 Z" fill="rgba(248,238,217,0.17)" stroke="#f8eed9" strokeWidth="2" opacity="0.75" />
        </g>
      </svg>
    </div>
  );
}

export function BrandedLoader({ label }: { label: string }) {
  return (
    <div
      role="status"
      className="loader-shell grid place-items-center gap-5 text-center"
      aria-live="polite"
    >
      <div
        className="loader-rive-stage"
        role="img"
        aria-label="Бокал виски наполняется"
      >
        <VintageFallback />
        <RiveStage />
      </div>
      <div>
        <p className="font-serif text-2xl uppercase tracking-[0.12em] text-[#e5b24a]">
          Whisky Journey
        </p>
        <p className="mt-2 text-sm font-semibold text-stone-300">{label}</p>
      </div>
    </div>
  );
}
