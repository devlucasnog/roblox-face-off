import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import Footer from "./components/Footer";
import Form from "./components/Form";
import Header from "./components/Header";
import Result from "./components/Result";
import ResultSkeleton from "./components/ResultSkeleton";
import { useBattle } from "./hooks/useBattle";
import type { BattleResult } from "./types/player";

const SCREEN_TRANSITION = { duration: 0.3, ease: "easeOut" } as const;

const screenTransition = {
  layout: true,
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: SCREEN_TRANSITION,
} as const;

function App() {
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const battle = useBattle({ onSuccess: setBattleResult });

  const screen = battleResult
    ? "result"
    : battle.showSkeleton
      ? "loading"
      : "form";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_1100px_480px_at_50%_-5%,rgba(220,38,38,0.28),transparent)]"
        aria-hidden="true"
      />

      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-16">
        <motion.div
          layout
          transition={SCREEN_TRANSITION}
          className="relative flex w-full flex-col items-center"
        >
          <motion.div layout transition={SCREEN_TRANSITION}>
            <Header screen={screen} />
          </motion.div>

          <div
            className="w-full"
            aria-live="polite"
            aria-busy={battle.isPending}
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={screen}
                {...screenTransition}
                className="w-full flex justify-center"
              >
                {battleResult ? (
                  <Result
                    playerA={battleResult.playerA}
                    playerB={battleResult.playerB}
                    onReset={() => setBattleResult(null)}
                  />
                ) : battle.showSkeleton ? (
                  <ResultSkeleton />
                ) : (
                  <Form
                    usernames={battle.usernames}
                    errors={battle.errors}
                    error={battle.error}
                    isPending={battle.isPending}
                    formAction={battle.formAction}
                    onSubmit={battle.onSubmit}
                    onUsernameChange={battle.setUsername}
                    onSuggestionClick={battle.addSuggestion}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
