export function BrandedLoader({ label }: { label: string }) {
  return (
    <div
      role="status"
      className="grid place-items-center gap-5 text-center"
      aria-live="polite"
    >
      <div
        className="loader-scene"
        role="img"
        aria-label="Бокал виски наполняется"
      >
        <div className="loader-bottle" aria-hidden="true" />
        <div className="loader-pour" aria-hidden="true" />
        <div className="loader-glass" aria-hidden="true">
          <div className="loader-liquid" />
          <div className="loader-shine" />
        </div>
      </div>
      <p className="text-sm font-semibold text-stone-300">{label}</p>
    </div>
  );
}
