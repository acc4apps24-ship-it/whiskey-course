export function Progress({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-white/12"
      aria-label={`Прогресс ${clamped}%`}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-copper to-moss"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
