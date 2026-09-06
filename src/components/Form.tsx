import { Fragment, useActionState, useState } from "react";

import Input from "./Input";

const SUGGESTIONS = ["Builderman", "Shedletsky", "Roblox"];

type FormErrors = {
  username1?: string;
  username2?: string;
};

type BattleState = {
  success: boolean;
  error?: string;
};

export default function Form() {
  const [username1, setUsername1] = useState("");
  const [username2, setUsername2] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  async function startBattle(): Promise<BattleState> {
    const trimmedUsername1 = username1.trim();
    const trimmedUsername2 = username2.trim();

    const newErrors: FormErrors = {};
    if (!trimmedUsername1)
      newErrors.username1 = "The Username 1 field is required.";
    if (!trimmedUsername2)
      newErrors.username2 = "The Username 2 field is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return { success: false };
    }

    const params = new URLSearchParams({
      username1: trimmedUsername1,
      username2: trimmedUsername2,
    });

    const response = await fetch(`/api/battle?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error ?? "Something went wrong." };
    }

    console.log(data);

    return { success: true };
  }

  const [state, formAction, isPending] = useActionState(startBattle, {
    success: false,
  });

  function handleUsername1Change(value: string) {
    setUsername1(value);
    setErrors((prev) => ({ ...prev, username1: undefined }));
  }

  function handleUsername2Change(value: string) {
    setUsername2(value);
    setErrors((prev) => ({ ...prev, username2: undefined }));
  }

  function handleAddSuggestion(username: string) {
    if (!username1) {
      handleUsername1Change(username);
    } else {
      handleUsername2Change(username);
    }
  }

  return (
    <form
      action={formAction}
      className="max-w-3xl mx-auto text-center p-6 rounded-2xl border border-zinc-700 bg-zinc-900/80"
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4 md:gap-0 max-w-2xl mx-auto">
        <Input
          name="username1"
          label="Username 1"
          value={username1}
          onChange={handleUsername1Change}
          error={errors.username1}
        />
        <span className="font-display font-extrabold text-red-600 mx-0 md:mx-5 text-center md:pb-3.5">
          VS
        </span>
        <Input
          name="username2"
          label="Username 2"
          value={username2}
          onChange={handleUsername2Change}
          error={errors.username2}
        />
      </div>

      <p className="mt-5 text-sm text-zinc-400">
        Test with:
        {SUGGESTIONS.map((suggestion, index) => (
          <Fragment key={suggestion}>
            <button
              type="button"
              className="text-sky-500 hover:text-sky-400 underline underline-offset-2 mx-1"
              onClick={() => handleAddSuggestion(suggestion)}
            >
              {suggestion}
            </button>
            {index < 2 && "·"}
          </Fragment>
        ))}
      </p>

      {state.error && (
        <p className="mt-4 text-sm text-red-500">{state.error}</p>
      )}

      <button
        type="submit"
        className="mt-7 bg-red-600 hover:bg-red-700 transition-colors text-white font-display font-bold text-base px-10 py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isPending}
      >
        {isPending ? "Loading..." : "Battle!"}
      </button>
    </form>
  );
}
