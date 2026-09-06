import { Fragment } from "react";

import Button from "./Button";
import Input from "./Input";
import type { Battle } from "../hooks/useBattle";

const SUGGESTIONS = ["Builderman", "Shedletsky", "Roblox"];

type FormProps = {
  battle: Battle;
};

export default function Form({ battle }: FormProps) {
  const {
    usernames,
    errors,
    error,
    isPending,
    formAction,
    onSubmit,
    setUsername,
  } = battle;

  return (
    <form
      action={formAction}
      onSubmit={onSubmit}
      className="w-full max-w-3xl mx-auto text-center p-8 md:p-10 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/40"
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-0 max-w-2xl mx-auto">
        <Input
          name="username1"
          label="Username 1"
          placeholder="Enter a username"
          value={usernames.username1}
          onChange={(value) => setUsername("username1", value)}
          error={errors.username1}
          disabled={isPending}
        />
        <span className="font-display font-extrabold text-amber-400 mx-0 md:mx-5 text-center">
          VS
        </span>
        <Input
          name="username2"
          label="Username 2"
          placeholder="Enter a username"
          value={usernames.username2}
          onChange={(value) => setUsername("username2", value)}
          error={errors.username2}
          disabled={isPending}
        />
      </div>

      <p className="mt-6 text-sm text-slate-400">
        Test with:
        {SUGGESTIONS.map((suggestion, index) => (
          <Fragment key={suggestion}>
            <button
              type="button"
              className="text-sky-500 hover:text-sky-400 underline underline-offset-2 mx-1 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => battle.addSuggestion(suggestion)}
              disabled={isPending}
            >
              {suggestion}
            </button>
            {index < SUGGESTIONS.length - 1 && "·"}
          </Fragment>
        ))}
      </p>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {error}
        </p>
      )}

      <Button type="submit" className="mt-7" disabled={isPending}>
        {isPending ? "Loading..." : "Battle!"}
      </Button>
    </form>
  );
}
