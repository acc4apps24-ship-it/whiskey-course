import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function NameGate({
  onSubmit,
}: {
  onSubmit: (displayName: string) => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();

    const trimmed = name.trim();

    if (trimmed.length < 2 || trimmed.length > 24) {
      setError("Имя должно быть от 2 до 24 символов.");
      return;
    }

    setError(null);
    onSubmit(trimmed);
  }

  return (
    <Card>
      <h1 className="text-3xl font-bold leading-tight">
        Как тебя показывать в рейтинге?
      </h1>
      <form className="mt-6 grid gap-4" onSubmit={submit}>
        <label className="grid gap-2 text-sm font-semibold">
          Имя в рейтинге
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={24}
          />
        </label>
        {error ? <p className="text-sm text-red-200">{error}</p> : null}
        <Button type="submit">Начать путешествие</Button>
      </form>
    </Card>
  );
}
