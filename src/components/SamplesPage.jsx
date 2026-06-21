import { LANGUAGES, SAMPLES } from "../engine/samples";
import "./SamplesPage.css";

const EXT = { javascript: "js", python: "py", java: "java", cpp: "cpp" };
const LABEL = { javascript: "JavaScript", python: "Python", java: "Java", cpp: "C++" };
const LANG_COLOR = { javascript: "#f7df1e", python: "#4b8bbe", java: "#e07c22", cpp: "#f34b7d" };
const LANG_BG = {
  javascript: "rgba(247,223,30,0.1)",
  python: "rgba(75,139,190,0.1)",
  java: "rgba(224,124,34,0.1)",
  cpp: "rgba(243,75,125,0.1)",
};

function preview(code) {
  return code.split("\n").slice(0, 4).join("\n");
}

export default function SamplesPage({ onLoadSample }) {
  return (
    <div className="samples page-enter scroll-thin">
      <div className="samples-intro">
        <div className="eyebrow">// SAMPLES</div>
        <div className="samples-title">Load an example</div>
        <div className="samples-sub">Click any snippet to load &amp; run analysis in the workbench.</div>
      </div>

      <div className="samples-grid">
        {LANGUAGES.map((l) => (
          <div key={l.id} className="sample-card">
            <div className="sample-card-head">
              <span
                className="sample-card-badge"
                style={{ background: LANG_BG[l.id], color: LANG_COLOR[l.id] }}
              >
                {LABEL[l.id]}
              </span>
              <span className="sample-card-ext">solution.{EXT[l.id]}</span>
            </div>
            <div className="sample-card-preview">{preview(SAMPLES[l.id])}</div>
            <div className="sample-card-foot">
              <button className="sample-card-load" onClick={() => onLoadSample(l.id)}>
                LOAD &amp; RUN →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
