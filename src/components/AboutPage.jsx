import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about page-enter scroll-thin">
      <div className="about-intro">
        <div className="eyebrow">// ABOUT</div>
        <div className="about-title">Time and Space Complexity Analyzer</div>
        <div className="about-sub">v1.0</div>
      </div>

      <div className="about-stack">
        <div className="about-card">
          <div className="eyebrow about-card-label">WHAT IT DOES</div>
          <p className="about-card-text">
            Paste any function in JavaScript, Python, Java or C++ and the engine
            estimates its Big-O time and space complexity entirely in your
            browser. No code ever leaves your machine.
          </p>
        </div>
        <div className="about-card">
          <div className="eyebrow about-card-label">HOW IT WORKS</div>
          <p className="about-card-text">
            The heuristic engine counts loop nesting depth, detects recursive
            call patterns, checks for memoization identifiers, spots halving
            operations, and identifies common allocation patterns. JavaScript
            additionally gets a real AST pass via Acorn for higher accuracy.
          </p>
        </div>
        <div className="about-card">
          <div className="eyebrow about-card-label">LIMITATIONS</div>
          <p className="about-card-text">
            This is an educated guess — not a formal proof. Amortized
            complexity, side effects, and runtime-dependent branching are not
            accounted for. Treat verdicts as a starting point.
          </p>
        </div>

        <div className="about-stats">
          <div className="about-stat">
            <div className="about-stat-value">4</div>
            <div className="eyebrow">Languages</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-value">0</div>
            <div className="eyebrow">Network Calls</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-value about-stat-value--sm">100%</div>
            <div className="eyebrow">Browser</div>
          </div>
        </div>

        <div className="about-author">
          <div className="about-author-rule" />
          <div className="eyebrow about-author-label">// CRAFTED BY</div>
          <div className="about-author-name">VISHWAS RAO CH</div>
          <div className="about-author-tag">
            <span className="about-author-bracket">&lt;</span>
            Engineer · Builder · Analyst
            <span className="about-author-bracket">/&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
