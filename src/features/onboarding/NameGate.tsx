import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function NameGate({
  error: submitError,
  isSubmitting = false,
  onSubmit,
}: {
  error?: string | null;
  isSubmitting?: boolean;
  onSubmit: (displayName: string) => Promise<void> | void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmed = name.trim();

    if (trimmed.length < 2 || trimmed.length > 24) {
      setError("Имя должно быть от 2 до 24 символов.");
      return;
    }

    setError(null);
    await onSubmit(trimmed);
  }

  return (
    <Card>
      <h1 className="text-3xl font-bold leading-tight">
        Как тебя показывать в рейтинге?
      </h1>
      <form className="mt-6 grid gap-4" onSubmit={submit}>
        <label className="grid gap-2 text-base font-semibold leading-7">
          Имя в рейтинге
          <Input
            value={name}
            disabled={isSubmitting}
            onChange={(event) => setName(event.target.value)}
            maxLength={24}
          />
        </label>
        {error ? <p className="text-[15px] leading-6 text-red-200">{error}</p> : null}
        {submitError ? <p className="text-[15px] leading-6 text-red-200">{submitError}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Создаём сессию..." : "Начать путешествие"}
        </Button>
      </form>
    </Card>
  );
}
