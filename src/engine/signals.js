export function fmt(curve) {
  return curve.replace("^2", "²").replace("^3", "³").replace("2^n", "2ⁿ");
}

export const PARSER_LABELS = {
  ast: "AST + heuristic",
  heuristic: "Indent heuristic",
  "heuristic-fallback": "Indent heuristic (fallback)",
  idle: "idle",
};

function loopCurve(linCount, logCount) {
  if (linCount === 0 && logCount === 0) return "O(1)";
  if (linCount === 0) return "O(log n)";
  if (linCount === 1 && logCount === 0) return "O(n)";
  if (linCount === 1 && logCount >= 1) return "O(n log n)";
  if (linCount === 2) return "O(n^2)";
  if (linCount === 3) return "O(n^3)";
  return `O(n^${linCount})`;
}

function recursionCurve({ selfCallCount, halving, hasMemo }) {
  if (selfCallCount === 0) return "O(1)";
  if (selfCallCount === 1) return halving ? "O(log n)" : "O(n)";
  if (halving) return "O(n log n)";
  return hasMemo ? "O(n)" : "O(2^n)";
}

export function buildSignals(result) {
  const out = [];
  const depth = result.loops.linCount + result.loops.logCount;

  if (depth > 0) {
    out.push({
      icon: "⟳",
      label: `${depth} nested loop${depth > 1 ? "s" : ""}`,
      detail: `${result.loops.linCount} linear${result.loops.logCount ? `, ${result.loops.logCount} log` : ""} scan`,
      value: fmt(loopCurve(result.loops.linCount, result.loops.logCount)),
    });
  }

  result.recursions
    .filter((x) => x.selfCallCount > 0)
    .forEach((x) => {
      out.push({
        icon: "↻",
        label: `recurse: ${x.name}`,
        detail: `${x.selfCallCount}×/call${x.hasMemo ? " · memo" : ""}${x.halving ? " · halves" : ""}`,
        value: fmt(recursionCurve(x)),
      });
    });

  if (result.sortDetected) {
    out.push({ icon: "⇅", label: "library sort", detail: "comparison sort call", value: "O(n log n)" });
  }

  if (result.alloc2D) {
    out.push({ icon: "▦", label: "2D allocation", detail: "matrix / grid buffer", value: "O(n²)" });
  } else if (result.allocLinear) {
    out.push({ icon: "▤", label: "linear allocation", detail: "array / map buffer", value: "O(n)" });
  }

  if (!out.length) {
    out.push({ icon: "·", label: "no loops or recursion", detail: "straight-line code", value: "O(1)" });
  }

  return out;
}
