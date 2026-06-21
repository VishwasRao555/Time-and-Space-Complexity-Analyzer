import { useEffect, useState } from "react";
import "./AnalyzingOverlay.css";

const STEPS = [
  "tokenizing source...",
  "walking syntax tree...",
  "scanning loop nests...",
  "checking recursion depth...",
  "spotting memoization...",
  "estimating growth curve...",
];

export default function AnalyzingOverlay({ active }) {
  const [shown, setShown] = useState([]);

  useEffect(() => {
    if (!active) return;
    let i = 0;
    const id = setInterval(() => {
      setShown((prev) => (i === 0 ? [STEPS[0]] : [...prev, STEPS[i]]));
      i += 1;
      if (i >= STEPS.length) clearInterval(id);
    }, 260);
    return () => {
      clearInterval(id);
      setShown([]);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="analyzing-overlay">
      <div className="analyzing-scanlines" />
      <div className="analyzing-term">
        {shown.map((line, i) => (
          <div key={i} className="analyzing-line">
            <span className="analyzing-prompt">$</span> {line}
          </div>
        ))}
        <div className="analyzing-cursor-row">
          <span className="analyzing-prompt">$</span>
          <span className="analyzing-cursor" />
        </div>
      </div>
    </div>
  );
}
