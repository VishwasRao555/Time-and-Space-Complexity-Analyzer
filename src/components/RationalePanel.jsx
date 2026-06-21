import "./RationalePanel.css";

export default function RationalePanel({ result }) {
  return (
    <section className="rationale-panel">
      <div className="eyebrow">// RATIONALE</div>
      <p className="rationale-text">{result.rationale}</p>
    </section>
  );
}
