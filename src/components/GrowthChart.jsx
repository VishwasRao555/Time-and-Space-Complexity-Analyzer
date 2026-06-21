import { buildCurves, buildGridLines, buildXLabels } from "../engine/growthCurve";
import { fmt } from "../engine/signals";
import "./GrowthChart.css";

export default function GrowthChart({ result }) {
  const curves = buildCurves(result.time);
  const gridLines = buildGridLines();
  const xLabels = buildXLabels();

  return (
    <section className="growth-chart">
      <div className="growth-chart-head">
        <div className="signals-title">Growth curve</div>
        <span className="growth-chart-time">{fmt(result.time)}</span>
      </div>
      <svg viewBox="0 0 290 196" className="growth-chart-svg">
        {gridLines.map((g, i) => (
          <line key={i} x1="6" y1={g.y} x2="262" y2={g.y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {xLabels.map((xl, i) => (
          <text key={i} x={xl.x} y="191" fill="#303038" fontFamily="'JetBrains Mono',monospace" fontSize="8" textAnchor="middle">
            {xl.label}
          </text>
        ))}
        {curves.map((c) => (
          <g key={c.key}>
            {c.highlighted && (
              <path d={c.d} stroke="var(--accent-graph)" strokeWidth="6" fill="none" opacity="0.18" strokeLinecap="round" />
            )}
            <path
              d={c.d}
              stroke={c.stroke}
              strokeWidth={c.width}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={c.opacity}
            />
            {c.highlighted && <circle cx={c.dotX} cy={c.dotY} r="3.5" fill="var(--accent-graph)" />}
            <text
              x={c.labelX}
              y={c.labelY}
              fill={c.labelColor}
              fontFamily="'JetBrains Mono',monospace"
              fontSize="9"
              fontWeight={c.labelWeight}
            >
              {c.label}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}
