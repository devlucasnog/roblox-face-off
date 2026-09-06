import Form from "./components/Form";
import Header from "./components/Header";
// import Result from "./components/Result";

function App() {
  return (
    <div className="min-h-screen bg-linear-to-b from-red-500/20 via-zinc-950 to-zinc-950">
      <Header />
      <main>
        <Form />
        {/* <Result /> */}
      </main>
    </div>
  );
}

export default App;
