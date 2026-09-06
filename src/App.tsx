import { useState } from "react";

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
        <Header />
        {battleResult ? (
          <Result
            playerA={battleResult.playerA}
            playerB={battleResult.playerB}
            onReset={() => setBattleResult(null)}
          />
        ) : (
          <Form onBattleComplete={setBattleResult} />
        )}
      </main>
    </div>
  );
}

export default App;
