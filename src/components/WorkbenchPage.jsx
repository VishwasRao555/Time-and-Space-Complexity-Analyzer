import Editor from "@monaco-editor/react";
import { LANGUAGES, SAMPLES } from "../engine/samples";
import AnalyzingOverlay from "./AnalyzingOverlay";
import "./WorkbenchPage.css";

const EXT = { javascript: "js", python: "py", java: "java", cpp: "cpp" };
const LANG_COLOR = {
  javascript: "#e8c020",
  python: "#4b8bbe",
  java: "#e07c22",
  cpp: "#3a6ea5",
};

export default function WorkbenchPage({
  language,
  setLanguage,
  code,
  setCode,
  setEditorReady,
  analyzing,
  error,
}) {
  const currentLang = LANGUAGES.find((l) => l.id === language);

  function selectLanguage(id) {
    setLanguage(id);
    setCode(SAMPLES[id]);
  }

  return (
    <div className="workbench page-enter">
      <div className="workbench-langs">
        <span className="eyebrow workbench-lang-label">LANG&gt;</span>
        {LANGUAGES.map((l) => {
          const isActive = language === l.id;
          const color = LANG_COLOR[l.id];
          return (
            <button
              key={l.id}
              className={`workbench-lang-toggle ${isActive ? "is-active" : ""}`}
              onClick={() => selectLanguage(l.id)}
              style={
                isActive
                  ? { color, borderColor: color, background: `${color}22` }
                  : { color }
              }
            >
              <span className="workbench-lang-dot" style={{ background: color }} />
              {l.label}
            </button>
          );
        })}
      </div>

      <div className="workbench-editor">
        <div className="workbench-editor-head">
          <span className="editor-dot editor-dot--red" />
          <span className="editor-dot editor-dot--yellow" />
          <span className="editor-dot editor-dot--green" />
          <span className="workbench-editor-filename">solution.{EXT[currentLang.id]}</span>
          <span className="workbench-editor-utf8">UTF-8</span>
        </div>
        <div className="workbench-editor-mount">
          <Editor
            language={currentLang.monacoId}
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value ?? "")}
            onMount={() => setEditorReady(true)}
            options={{
              fontFamily: "JetBrains Mono, Fira Code, monospace",
              fontSize: 14.5,
              lineHeight: 22,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 16 },
            }}
          />
          <AnalyzingOverlay active={analyzing} />
        </div>
        {error && <div className="workbench-error">{error}</div>}
      </div>
    </div>
  );
}
