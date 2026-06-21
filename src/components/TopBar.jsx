import { fmt, PARSER_LABELS } from "../engine/signals";
import "./TopBar.css";

export default function TopBar({ result, analyzing, flashKey, onAnalyze }) {
  return (
    <section className="topbar">
      <div className="topbar-stat">
        <div className="eyebrow">TIME</div>
        <div key={`t-${flashKey}`} className="topbar-value topbar-value--time stat-flash">
          {fmt(result.time)}
        </div>
      </div>
      <div className="topbar-divider" />
      <div className="topbar-stat">
        <div className="eyebrow">SPACE</div>
        <div key={`s-${flashKey}`} className="topbar-value topbar-value--space stat-flash">
          {fmt(result.space)}
        </div>
      </div>
      <div className="topbar-divider" />
      <div className="topbar-stat">
        <div className="eyebrow">PARSER</div>
        <div className="topbar-parser">{PARSER_LABELS[result.parserUsed] || result.parserUsed}</div>
      </div>
      <button
        className={`topbar-analyze ${analyzing ? "is-analyzing" : ""}`}
        onClick={onAnalyze}
        disabled={analyzing}
      >
        {analyzing ? "ANALYZING…" : "[ ANALYZE ]"}
      </button>
    </section>
  );
}
