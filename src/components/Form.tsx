import { useActionState } from "react";

import Input from "./Input";

const SUGGESTIONS = ["Builderman", "Shedletsky", "Roblox"];

type BattleState = {
  success: boolean;
};

async function startBattle(
  _prevState: BattleState,
  formData: FormData,
): Promise<BattleState> {
  const data = Object.fromEntries(formData.entries());
  console.log(data);

  return { success: true };
}

export default function Form() {
  const [, formAction, isPending] = useActionState(startBattle, {
    success: false,
  });

  function handleAddSuggestion(username: string) {
    console.log(username);
  }

  return (
    <form
      action={formAction}
      className="max-w-3xl mx-auto text-center p-6 rounded-2xl border border-zinc-700 bg-zinc-900/80"
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4 md:gap-0 max-w-2xl mx-auto">
        <Input name="username1" label="Username 1" />

        <span className="font-display font-extrabold text-red-600 mx-0 md:mx-5 text-center md:pb-3.5">
          VS
        </span>

        <Input name="username2" label="Username 2" />
      </div>

      <p className="mt-5 text-sm text-zinc-400">
        Test with:
        {SUGGESTIONS.map((suggestion, index) => (
          <div key={suggestion}>
            <button
              type="button"
              className="text-sky-500 hover:text-sky-400 underline underline-offset-2 mx-1"
              onClick={() => handleAddSuggestion(suggestion)}
            >
              {suggestion}
            </button>
            {index < 2 && "·"}
          </div>
        ))}
      </p>

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
