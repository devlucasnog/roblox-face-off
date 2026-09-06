import { useActionState, useEffect, useState, type FormEvent } from "react";

import type { BattleResult } from "../types/player";

export type UsernameField = "username1" | "username2";

export type BattleFormErrors = Partial<Record<UsernameField, string>>;

type BattleState = {
  success: boolean;
  error?: string;
};

type UseBattleOptions = {
  onSuccess: (result: BattleResult) => void;
};

const INITIAL_USERNAMES: Record<UsernameField, string> = {
  username1: "",
  username2: "",
};

const SKELETON_DELAY_MS = 300;

export function useBattle({ onSuccess }: UseBattleOptions) {
  const [usernames, setUsernames] = useState(INITIAL_USERNAMES);
  const [errors, setErrors] = useState<BattleFormErrors>({});
  const [isSlow, setIsSlow] = useState(false);

  function validate() {
    const username1 = usernames.username1.trim();
    const username2 = usernames.username2.trim();

    const newErrors: BattleFormErrors = {};
    if (!username1) newErrors.username1 = "The Username 1 field is required.";
    if (!username2) newErrors.username2 = "The Username 2 field is required.";

    if (username1 && username1.toLowerCase() === username2.toLowerCase()) {
      newErrors.username2 = "Choose two different players.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!validate()) {
      event.preventDefault();
      return;
    }

    setIsSlow(false);
  }

  async function startBattle(): Promise<BattleState> {
    const params = new URLSearchParams({
      username1: usernames.username1.trim(),
      username2: usernames.username2.trim(),
    });

    try {
      const response = await fetch(`/api/battle?${params.toString()}`);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const fallback =
          response.status === 429
            ? "Too many requests. Wait a few seconds and try again."
            : "Something went wrong. Please try again.";

        return { success: false, error: data?.error ?? fallback };
      }

      if (!data) {
        return {
          success: false,
          error: "Unexpected response from the server.",
        };
      }

      onSuccess(data as BattleResult);

      return { success: true };
    } catch {
      return {
        success: false,
        error:
          "Could not reach the server. Check your connection and try again.",
      };
    }
  }

  const [state, formAction, isPending] = useActionState(startBattle, {
    success: false,
  });

  useEffect(() => {
    if (!isPending) return;

    const timeout = setTimeout(() => setIsSlow(true), SKELETON_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [isPending]);

  function setUsername(field: UsernameField, value: string) {
    setUsernames((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function addSuggestion(username: string) {
    setUsername(usernames.username1 ? "username2" : "username1", username);
  }

  return {
    usernames,
    errors,
    error: state.error,
    isPending,
    showSkeleton: isPending && isSlow,
    formAction,
    onSubmit: handleSubmit,
    setUsername,
    addSuggestion,
  };
}

export type Battle = ReturnType<typeof useBattle>;
