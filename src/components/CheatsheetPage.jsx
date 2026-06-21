import "./CheatsheetPage.css";

const ROWS = [
  { fmt: "O(1)", cls: "Constant", example: "Hash lookup, array index", color: "#43d17a", bars: 1 },
  { fmt: "O(log n)", cls: "Logarithmic", example: "Binary search, BST ops", color: "#74d36a", bars: 2 },
  { fmt: "O(n)", cls: "Linear", example: "Array traversal, linear scan", color: "#b6d84e", bars: 3 },
  { fmt: "O(n log n)", cls: "Linearithmic", example: "Merge sort, heap sort", color: "#f0c041", bars: 4 },
  { fmt: "O(n²)", cls: "Quadratic", example: "Bubble sort, nested loops", color: "#f59a3e", bars: 5 },
  { fmt: "O(n³)", cls: "Cubic", example: "Floyd-Warshall, 3-deep nesting", color: "#ef6f53", bars: 6 },
  { fmt: "O(2ⁿ)", cls: "Exponential", example: "Recursive fib, power sets", color: "#ee4d4d", bars: 7 },
];

export default function CheatsheetPage() {
  return (
    <div className="cheatsheet page-enter scroll-thin">
      <div className="cheatsheet-intro">
        <div className="eyebrow">// REFERENCE</div>
        <div className="cheatsheet-title">Big-O cheat sheet</div>
        <div className="cheatsheet-sub">Ordered fastest → slowest growth. Lower rank is better.</div>
      </div>

      <div className="cheatsheet-head-row">
        <div className="eyebrow">NOTATION</div>
        <div className="eyebrow">CLASS</div>
        <div className="eyebrow">EXAMPLE USE</div>
        <div className="eyebrow">GROWTH</div>
      </div>

      {ROWS.map((row) => (
        <div key={row.fmt} className="cheatsheet-row">
          <div className="cheatsheet-notation" style={{ color: row.color }}>
            {row.fmt}
          </div>
          <div className="cheatsheet-class">{row.cls}</div>
          <div className="cheatsheet-example">{row.example}</div>
          <div className="cheatsheet-bar-track">
            <div
              className="cheatsheet-bar-fill"
              style={{ width: `${(row.bars / 7) * 100}%`, background: row.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
