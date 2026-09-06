import Form from "./components/Form";
import Header from "./components/Header";

function App() {
  return (
    <div className="min-h-screen bg-linear-to-b from-red-500/20 via-zinc-950 to-zinc-950">
      <Header />
      <main>
        <Form />
      </main>
    </div>
  );
}

export default App;
