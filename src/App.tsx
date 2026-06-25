import { AppProvider, useAppState } from "@/app/AppProvider";
import { BrandedLoader } from "@/components/BrandedLoader";
import { AgeGate } from "@/features/onboarding/AgeGate";
import { NameGate } from "@/features/onboarding/NameGate";

function AppContent() {
  const app = useAppState();

  return (
    <main className="min-h-[100svh] px-5 py-6 safe-bottom">
      <section className="mx-auto flex min-h-[calc(100svh-3rem)] max-w-md flex-col justify-center">
        {app.error && app.screen !== "name-gate" ? (
          <p className="mb-4 rounded-lg border border-red-300/30 bg-red-950/40 px-4 py-3 text-sm text-red-100">
            {app.error}
          </p>
        ) : null}
        {app.screen === "loading" ? <BrandedLoader label="Готовим первый драм" /> : null}
        {app.screen === "age-gate" ? <AgeGate onAccept={app.acceptAgeGate} /> : null}
        {app.screen === "name-gate" ? (
          <NameGate
            error={app.error}
            isSubmitting={app.isCreatingSession}
            onSubmit={app.createSession}
          />
        ) : null}
        {app.screen === "course" ? (
          <div>
            <p className="text-sm text-smoke">
              С возвращением, {app.session?.displayName}.
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-none tracking-normal">
              Карта курса
            </h1>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
