import { useState } from "react";
import { DiJavascript1, DiJava, DiPython } from "react-icons/di";
import { SiCplusplus, SiC } from "react-icons/si";
import Laptop3D from "./Laptop3D";
import Reveal from "./Reveal";
import "./Landing.css";

const LANG_ICONS = [
  { Icon: DiJavascript1, color: "#e8c020", label: "JavaScript" },
  { Icon: DiPython, color: "#4b8bbe", label: "Python" },
  { Icon: DiJava, color: "#e07c22", label: "Java" },
  { Icon: SiCplusplus, color: "#3a6ea5", label: "C++" },
  { Icon: SiC, color: "#5a78b0", label: "C" },
];

const FEATURES = [
  {
    k: "01",
    title: "Real AST pass",
    body: "JavaScript is parsed with Acorn into a true syntax tree — loops, recursion and allocations are read from structure, not guesswork.",
  },
  {
    k: "02",
    title: "Heuristic engine",
    body: "Python, Java and C++ run through an indent & brace heuristic that counts nesting depth, spots halving loops and memoization.",
  },
  {
    k: "03",
    title: "100% in-browser",
    body: "Zero network calls. Your code never leaves the tab — every Big-O verdict is computed locally on your machine.",
  },
];

export default function Landing({ onLaunch }) {
  const [launching, setLaunching] = useState(false);

  function handleLaunch() {
    if (launching) return;
    setLaunching(true);
    setTimeout(onLaunch, 720);
  }

  return (
    <div className={`landing ${launching ? "is-launching" : ""}`}>
      <div className="landing-scroll">
        {/* ---------------- HERO ---------------- */}
        <section className="hero-section">
          <nav className="hero-nav">
            <div className="hero-brand">
              <span className="hero-brand-mark">
                <img src="/favicon.svg" alt="" width={30} height={30} />
              </span>
              <span className="hero-brand-name">Time and Space Complexity Analyzer</span>
            </div>
          </nav>

          <div className="hero-stage">
            <Laptop3D />
          </div>

          <div className="hero-caption">
            <h1 className="hero-headline">Know what your code costs.</h1>
            <p className="hero-subline">
              Drop in a function — JavaScript, Python, Java, C or C++ — and the
              engine weighs every loop, call and buffer into a Big-O verdict.
            </p>
            <button className="hero-launch" onClick={handleLaunch}>
              <span>Launch Workbench</span>
              <span className="hero-launch-arrow">→</span>
            </button>
          </div>

          <div className="hero-scroll-hint">
            <span>scroll</span>
            <span className="hero-scroll-line" />
          </div>
        </section>

        {/* ---------------- FEATURES ---------------- */}
        <section className="feat-section">
          <Reveal className="feat-head">
            <span className="feat-eyebrow">// About the engine</span>
            <h2 className="feat-title">
              Built for every loop.
              <br />
              Trusted on every Big-O.
            </h2>
            <p className="feat-sub">
              A focused analyzer that reads your code the way a reviewer would —
              structurally, not statistically.
            </p>
          </Reveal>

          <div className="feat-grid">
            {FEATURES.map((f, i) => (
              <Reveal key={f.k} className="feat-card" delay={i * 110}>
                <span className="feat-card-k">{f.k}</span>
                <h3 className="feat-card-title">{f.title}</h3>
                <p className="feat-card-body">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------- LANGUAGE STRIP ---------------- */}
        <section className="strip-section">
          <Reveal className="strip-inner">
            <span className="strip-label">Speaks your language</span>
            <div className="strip-icons">
              {LANG_ICONS.map(({ Icon, color, label }) => (
                <div key={label} className="strip-icon" title={label}>
                  <Icon size={30} color={color} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ---------------- CTA ---------------- */}
        <section className="cta-section">
          <Reveal className="cta-inner">
            <h2 className="cta-title">Ready to weigh your code?</h2>
            <p className="cta-sub">No sign-up. No upload. Just paste and analyze.</p>
            <button className="hero-launch hero-launch--lg" onClick={handleLaunch}>
              <span>Open the Workbench</span>
              <span className="hero-launch-arrow">→</span>
            </button>
            <div className="cta-foot">Time and Space Complexity Analyzer — v1.0</div>
          </Reveal>
        </section>
      </div>

      <div className="landing-curtain" />
    </div>
  );
}
