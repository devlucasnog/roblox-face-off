import { useState } from "react";

import Form from "./components/Form";
import Header from "./components/Header";
import Result from "./components/Result";
import type { BattleResult } from "./types/player";

function App() {
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

  return (
    <div className="min-h-screen bg-linear-to-b from-red-500/20 via-zinc-950 to-zinc-950">
      <Header />
      <main>
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
