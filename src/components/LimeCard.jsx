import "./LimeCard.css";

export default function LimeCard() {
  return (
    <section className="lime-card">
      <div className="lime-card-title">
        Your code never
        <br />
        leaves this tab.
      </div>
      <p className="lime-card-sub">
        Zero network calls. Parsed entirely in-browser. Heuristic estimate only.
      </p>
      <div className="lime-card-badge">↗</div>
      <div className="lime-card-slash">//</div>
    </section>
  );
}
