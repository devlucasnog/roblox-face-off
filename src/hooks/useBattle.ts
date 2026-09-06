import { useActionState, useState } from "react";

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

export function useBattle({ onSuccess }: UseBattleOptions) {
  const [usernames, setUsernames] = useState(INITIAL_USERNAMES);
  const [errors, setErrors] = useState<BattleFormErrors>({});
  const [isFetching, setIsFetching] = useState(false);

  async function startBattle(): Promise<BattleState> {
    const username1 = usernames.username1.trim();
    const username2 = usernames.username2.trim();

    const newErrors: BattleFormErrors = {};
    if (!username1) newErrors.username1 = "The Username 1 field is required.";
    if (!username2) newErrors.username2 = "The Username 2 field is required.";

    if (username1 && username1.toLowerCase() === username2.toLowerCase()) {
      newErrors.username2 = "Choose two different players.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return { success: false };
    }

    const params = new URLSearchParams({ username1, username2 });

    setIsFetching(true);

    try {
      const response = await fetch(`/api/battle?${params.toString()}`);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          success: false,
          error: data?.error ?? "Something went wrong. Please try again.",
        };
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
    } finally {
      setIsFetching(false);
    }
  }

  const [state, formAction] = useActionState(startBattle, {
    success: false,
  });

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
    isPending: isFetching,
    formAction,
    setUsername,
    addSuggestion,
  };
}

export type Battle = ReturnType<typeof useBattle>;
