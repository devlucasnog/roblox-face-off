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

/**
 * Owns everything behind the battle form: the two usernames, their validation
 * errors and the request to `/api/battle`. Components using it stay purely
 * presentational.
 */
export function useBattle({ onSuccess }: UseBattleOptions) {
  const [usernames, setUsernames] = useState(INITIAL_USERNAMES);
  const [errors, setErrors] = useState<BattleFormErrors>({});

  async function startBattle(): Promise<BattleState> {
    const username1 = usernames.username1.trim();
    const username2 = usernames.username2.trim();

    const newErrors: BattleFormErrors = {};
    if (!username1) newErrors.username1 = "The Username 1 field is required.";
    if (!username2) newErrors.username2 = "The Username 2 field is required.";

    // Roblox resolves the same username twice to a single player, which would
    // produce a battle against itself that ties on every stat.
    if (username1 && username1.toLowerCase() === username2.toLowerCase()) {
      newErrors.username2 = "Choose two different players.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return { success: false };
    }

    const params = new URLSearchParams({ username1, username2 });

    try {
      const response = await fetch(`/api/battle?${params.toString()}`);

      // A crashing function or a proxy error can answer with HTML instead of
      // JSON, so parsing has to be allowed to fail without breaking the action.
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          success: false,
          error: data?.error ?? "Something went wrong. Please try again.",
        };
      }

      if (!data) {
        return { success: false, error: "Unexpected response from the server." };
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

  function setUsername(field: UsernameField, value: string) {
    setUsernames((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  /** Fills the first field, then always replaces the second one. */
  function addSuggestion(username: string) {
    setUsername(usernames.username1 ? "username2" : "username1", username);
  }

  return {
    usernames,
    errors,
    error: state.error,
    isPending,
    formAction,
    setUsername,
    addSuggestion,
  };
}

export type Battle = ReturnType<typeof useBattle>;
