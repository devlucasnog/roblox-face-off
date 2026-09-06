import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import Form from "./components/Form";
import Header from "./components/Header";
import Result from "./components/Result";
import type { BattleResult } from "./types/player";

function App() {
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(220,38,38,0.28),transparent)]"
        aria-hidden="true"
      />

      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-16">
        <motion.div
          layout
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative flex w-full flex-col items-center"
        >
          <motion.div layout transition={{ duration: 0.3, ease: "easeOut" }}>
            <Header />
          </motion.div>

          <AnimatePresence mode="popLayout">
            {battleResult ? (
              <motion.div
                key="result"
                layout
                className="w-full flex justify-center"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Result
                  playerA={battleResult.playerA}
                  playerB={battleResult.playerB}
                  onReset={() => setBattleResult(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                layout
                className="w-full flex justify-center"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Form onBattleComplete={setBattleResult} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}

export default App;
