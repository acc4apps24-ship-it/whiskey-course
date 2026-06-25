import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  clearSessionIdCookie,
  getSessionIdCookie,
  setSessionIdCookie,
} from "@/lib/cookies";
import {
  createLearningRepository,
  type LearningRepository,
  type UserSession,
} from "@/repositories/learningRepository";
import type { AppState } from "./appState";

type AppContextValue = AppState & {
  acceptAgeGate: () => void;
  createSession: (displayName: string) => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

function makeRepository(): LearningRepository {
  return createLearningRepository();
}

export function AppProvider({ children }: { children: ReactNode }) {
  const repository = useMemo(makeRepository, []);
  const isCreatingSessionRef = useRef(false);
  const [state, setState] = useState<AppState>({
    screen: "loading",
    ageAccepted: false,
    session: null,
    isCreatingSession: false,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    const sessionId = getSessionIdCookie();

    if (!sessionId) {
      setState((current) => ({ ...current, screen: "age-gate" }));
      return;
    }

    repository
      .getSession(sessionId)
      .then((session) => {
        if (!isMounted) return;

        if (!session) {
          clearSessionIdCookie();
          setState((current) => ({
            ...current,
            screen: "age-gate",
            session: null,
            isCreatingSession: false,
          }));
          return;
        }

        setState((current) => ({
          ...current,
          screen: "course",
          ageAccepted: true,
          session,
          isCreatingSession: false,
          error: null,
        }));
      })
      .catch(() => {
        if (!isMounted) return;

        setState((current) => ({
          ...current,
          screen: "age-gate",
          isCreatingSession: false,
          error: "Не удалось загрузить сессию.",
        }));
      });

    return () => {
      isMounted = false;
    };
  }, [repository]);

  const acceptAgeGate = useCallback(() => {
    setState((current) => ({
      ...current,
      ageAccepted: true,
      screen: "name-gate",
      isCreatingSession: false,
      error: null,
    }));
  }, []);

  const createSession = useCallback(
    async (displayName: string) => {
      if (isCreatingSessionRef.current) return;

      isCreatingSessionRef.current = true;
      setState((current) => ({
        ...current,
        isCreatingSession: true,
        error: null,
      }));

      try {
        const session: UserSession = await repository.createSession(displayName);
        setSessionIdCookie(session.sessionId);
        setState((current) => ({
          ...current,
          session,
          screen: "course",
          isCreatingSession: false,
          error: null,
        }));
      } catch {
        setState((current) => ({
          ...current,
          screen: "name-gate",
          isCreatingSession: false,
          error: "Не удалось создать сессию.",
        }));
      } finally {
        isCreatingSessionRef.current = false;
      }
    },
    [repository],
  );

  const value: AppContextValue = {
    ...state,
    acceptAgeGate,
    createSession,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppContext);

  if (!value) {
    throw new Error("useAppState must be used inside AppProvider");
  }

  return value;
}
