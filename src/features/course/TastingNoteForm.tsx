import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type TastingNoteDraft = {
  appearance?: string;
  nose?: string;
  palate?: string;
  finish?: string;
  association?: string;
};

const fields: { key: keyof TastingNoteDraft; label: string }[] = [
  { key: "appearance", label: "Внешний вид" },
  { key: "nose", label: "Аромат (Nose)" },
  { key: "palate", label: "Вкус (Palate)" },
  { key: "finish", label: "Послевкусие (Finish)" },
  { key: "association", label: "Самая заметная ассоциация" },
];

function compactNote(note: TastingNoteDraft): TastingNoteDraft {
  return Object.fromEntries(
    Object.entries(note)
      .map(([key, value]) => [key, value?.trim()])
      .filter(([, value]) => value),
  ) as TastingNoteDraft;
}

export function TastingNoteForm({
  onSave,
}: {
  onSave: (note: TastingNoteDraft) => Promise<void>;
}) {
  const [note, setNote] = useState<TastingNoteDraft>({});
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      await onSave(compactNote(note));
    } catch {
      setError("Не удалось сохранить заметку. Текст остался на месте, попробуйте ещё раз.");
    }
  }

  function update(field: keyof TastingNoteDraft, value: string) {
    setNote((current) => ({ ...current, [field]: value }));
  }

  return (
    <form className="mt-6 grid gap-3" onSubmit={submit}>
      <p className="text-sm leading-6 text-stone-300">
        Практика опциональна: можно использовать реальный виски, описание бутылки или
        безалкогольную альтернативу. Маленький глоток, вода рядом, не садиться за руль.
      </p>
      {fields.map((field) => (
        <label className="grid gap-1 text-sm" key={field.key}>
          {field.label}
          <Input
            value={note[field.key] ?? ""}
            onChange={(event) => update(field.key, event.target.value)}
          />
        </label>
      ))}
      {error ? <p className="text-sm text-red-200">{error}</p> : null}
      <Button type="submit">Сохранить заметку</Button>
    </form>
  );
}
