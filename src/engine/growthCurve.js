import { rankOf } from "./complexityCurves";

const PAD_L = 6;
const PAD_T = 14;
const W = 256;
const H = 160;
const N = 16;

const BASE_CURVES = [
  { key: "c1", label: "O(1)", f: () => 1 },
  { key: "log", label: "O(log n)", f: (n) => Math.log2(n) + 1 },
  { key: "n", label: "O(n)", f: (n) => n },
  { key: "nlogn", label: "O(n log n)", f: (n) => n * Math.log2(n + 1) },
  { key: "n2", label: "O(n²)", f: (n) => n * n },
  { key: "exp", label: "O(2ⁿ)", f: (n) => Math.pow(2, n) },
];

const CURVE_KEY_BY_LABEL = {
  "O(1)": "c1",
  "O(log n)": "log",
  "O(n)": "n",
  "O(n log n)": "nlogn",
  "O(n^2)": "n2",
  "O(n^3)": "n3",
  "O(2^n)": "exp",
};

export function buildCurves(detectedTime) {
  const gmax = Math.log(Math.pow(2, N) + 1);
  const detKey = CURVE_KEY_BY_LABEL[detectedTime] || (rankOf(detectedTime) >= 5 ? "exp" : "n2");

  const curves = [...BASE_CURVES];
  if (detKey === "n3") {
    curves.splice(5, 0, { key: "n3", label: "O(n³)", f: (n) => n * n * n });
  }

  const out = curves.map((c) => {
    let d = "";
    let dotX = 0;
    let dotY = 0;
    for (let n = 1; n <= N; n++) {
      const r = Math.log(c.f(n) + 1) / gmax;
      const x = PAD_L + ((n - 1) / (N - 1)) * W;
      const y = PAD_T + (1 - Math.min(1, r)) * H;
      d += `${n === 1 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
      if (n === N) {
        dotX = x;
        dotY = y;
      }
    }
    const highlighted = c.key === detKey;
    return {
      key: c.key,
      label: c.label,
      d: d.trim(),
      highlighted,
      stroke: highlighted ? "var(--accent-graph)" : "rgba(245,245,245,0.1)",
      width: highlighted ? 2.4 : 1.2,
      opacity: highlighted ? 1 : 0.8,
      dotX: dotX.toFixed(1),
      dotY: dotY.toFixed(1),
      labelX: (PAD_L + W + 8).toFixed(1),
      labelY: (dotY + 3.5).toFixed(1),
      labelColor: highlighted ? "var(--accent-graph)" : "rgba(245,245,245,0.3)",
      labelWeight: highlighted ? 700 : 400,
    };
  });

  out.sort((a, b) => (a.highlighted ? 1 : 0) - (b.highlighted ? 1 : 0));
  return out;
}

export function buildGridLines() {
  return [0.25, 0.5, 0.75].map((t) => ({ y: (PAD_T + t * H).toFixed(1) }));
}

export function buildXLabels() {
  return [4, 8, 12, 16].map((n) => ({
    x: (PAD_L + ((n - 1) / 15) * W).toFixed(1),
    label: `n=${n}`,
  }));
}
