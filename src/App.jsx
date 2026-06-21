import { useState } from "react";
import Landing from "./components/Landing";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import WorkbenchPage from "./components/WorkbenchPage";
import SamplesPage from "./components/SamplesPage";
import CheatsheetPage from "./components/CheatsheetPage";
import AboutPage from "./components/AboutPage";
import RightStack from "./components/RightStack";
import { analyzeCode } from "./engine/analyze";
import { SAMPLES } from "./engine/samples";
import "./App.css";

const IDLE_RESULT = {
  time: "O(1)",
  space: "O(1)",
  rationale: "Hit RUN_ or [ANALYZE] to scan the snippet currently in the editor.",
  loops: { linCount: 0, logCount: 0 },
  recursions: [],
  sortDetected: false,
  allocLinear: false,
  alloc2D: false,
  parserUsed: "idle",
};

function App() {
  const [view, setView] = useState("landing"); // landing | app
  const [page, setPage] = useState("workbench"); // workbench | samples | cheatsheet | about

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(SAMPLES.javascript);
  const [, setEditorReady] = useState(false);

  const [result, setResult] = useState(IDLE_RESULT);
  const [error, setError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [flashKey, setFlashKey] = useState(0);

  function runAnalysis() {
    if (analyzing) return;
    setPage("workbench");
    setAnalyzing(true);
    setError("");

    setTimeout(() => {
      try {
        setResult(analyzeCode(code, language));
      } catch {
        setError("Couldn't analyze this snippet. Check it for syntax issues and try again.");
      }
      setFlashKey((k) => k + 1);
      setAnalyzing(false);
    }, 1700);
  }

  function clearEditor() {
    setCode("");
    setResult(IDLE_RESULT);
    setError("");
  }

  function loadSample(id) {
    setLanguage(id);
    setCode(SAMPLES[id]);
    setPage("workbench");
  }

  if (view === "landing") {
    return <Landing onLaunch={() => setView("app")} />;
  }

  return (
    <div className="app-shell">
      <div className="app-frame app-frame--enter">
        <Sidebar
          page={page}
          setPage={setPage}
          onAnalyze={runAnalysis}
          onClear={clearEditor}
          onBack={() => setView("landing")}
        />

        <div className="main-grid">
          <TopBar result={result} analyzing={analyzing} flashKey={flashKey} onAnalyze={runAnalysis} />

          <div className="main-left">
            {page === "workbench" && (
              <WorkbenchPage
                language={language}
                setLanguage={setLanguage}
                code={code}
                setCode={setCode}
                setEditorReady={setEditorReady}
                analyzing={analyzing}
                error={error}
              />
            )}
            {page === "samples" && <SamplesPage onLoadSample={loadSample} />}
            {page === "cheatsheet" && <CheatsheetPage />}
            {page === "about" && <AboutPage />}
          </div>

          {page === "workbench" && <RightStack result={result} />}
        </div>
      </div>
    </div>
  );
}

export default App;
