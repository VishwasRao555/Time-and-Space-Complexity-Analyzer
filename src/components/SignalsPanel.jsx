import { buildSignals } from "../engine/signals";
import "./SignalsPanel.css";

export default function SignalsPanel({ result }) {
  const signals = buildSignals(result);

  return (
    <section className="signals-panel">
      <div className="signals-head">
        <div className="signals-title">Detected</div>
        <span className="signals-count">{String(signals.length).padStart(2, "0")} found</span>
      </div>
      {signals.map((s, i) => (
        <div key={i} className="signal-row">
          <span className="signal-icon">{s.icon}</span>
          <div className="signal-text">
            <div className="signal-label">{s.label}</div>
            <div className="signal-detail">{s.detail}</div>
          </div>
          <span className="signal-value">{s.value}</span>
        </div>
      ))}
    </section>
  );
}
