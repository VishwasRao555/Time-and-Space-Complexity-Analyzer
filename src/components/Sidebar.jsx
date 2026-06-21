import "./Sidebar.css";

const NAV = [
  { id: "workbench", prefix: ">_", label: "Workbench" },
  { id: "samples", prefix: "{ }", label: "Samples" },
  { id: "cheatsheet", prefix: "f(n)", label: "Cheatsheet" },
  { id: "about", prefix: " @ ", label: "About" },
];

export default function Sidebar({ page, setPage, onAnalyze, onClear, onBack }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">
          <img src="/favicon.svg" alt="" width={26} height={26} />
        </span>
        <span className="sidebar-brand-name">Time and Space Complexity Analyzer</span>
      </div>

      <button className="sidebar-back" onClick={onBack}>
        <span className="sidebar-back-arrow">←</span> Home
      </button>

      <nav className="sidebar-nav">
        {NAV.map((n) => (
          <div
            key={n.id}
            className={`sidebar-nav-item ${page === n.id ? "is-active" : ""}`}
            onClick={() => setPage(n.id)}
          >
            <span className="sidebar-nav-prefix">{n.prefix}</span>
            <span>{n.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-engine-card">
        <div className="eyebrow">// ENGINE</div>
        <div className="sidebar-engine-name">Heuristic_v1.0</div>
        <div className="sidebar-engine-actions">
          <button className="sidebar-run-btn" onClick={onAnalyze}>
            RUN_
          </button>
          <button className="sidebar-clr-btn" onClick={onClear}>
            CLR
          </button>
        </div>
      </div>

      <div className="sidebar-status">
        <span className="sidebar-status-dot" />
        LOCAL_RUN
      </div>
    </aside>
  );
}
