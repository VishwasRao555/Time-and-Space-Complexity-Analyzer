import {
  parseJS,
  analyzeLoops,
  findFunctions,
  analyzeRecursion,
  detectAllocations,
} from "./jsAnalyzer";
import {
  analyzeLoopsGeneric,
  findFunctionsGeneric,
  analyzeRecursionGeneric,
  detectSortCalls,
  detectAllocationsGeneric,
} from "./genericAnalyzer";
import { maxCurve } from "./complexityCurves";

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
  // 2+ recursive call sites per invocation: a divide-and-conquer split
  // (halving the input, like merge sort) combines in O(n log n), not
  // exponential. Only unbounded branching without memoization blows up.
  if (halving) return "O(n log n)";
  return hasMemo ? "O(n)" : "O(2^n)";
}

function recursionSpaceCurve({ selfCallCount, halving }) {
  if (selfCallCount === 0) return "O(1)";
  return halving ? "O(log n)" : "O(n)";
}

function buildRationale({ loopResult, recursionResults, sortDetected, time }) {
  const parts = [];
  if (loopResult.linCount + loopResult.logCount > 0) {
    const depth = loopResult.linCount + loopResult.logCount;
    parts.push(
      `Detected ${depth} level${depth > 1 ? "s" : ""} of nested loop${
        depth > 1 ? "s" : ""
      } (${loopResult.linCount} linear scan${
        loopResult.linCount === 1 ? "" : "s"
      }${loopResult.logCount ? `, ${loopResult.logCount} halving loop(s)` : ""}).`
    );
  }
  const recursive = recursionResults.filter((r) => r.selfCallCount > 0);
  if (recursive.length) {
    recursive.forEach((r) => {
      parts.push(
        `Function "${r.name}" recurses ${r.selfCallCount > 1 ? r.selfCallCount + " times per call" : "once per call"}${
          r.hasMemo ? " with memoization detected" : ""
        }${r.halving ? " and halves the input each call" : ""}.`
      );
    });
  }
  if (sortDetected) {
    parts.push("A library sort call was detected, contributing an O(n log n) factor.");
  }
  if (!parts.length) {
    parts.push("No loops or recursive calls were detected; the code runs in constant time.");
  }
  parts.push(`Overall estimated time complexity: ${time}.`);
  return parts.join(" ");
}

function analyzeJSCode(code) {
  const ast = parseJS(code);
  const loopResult = analyzeLoops(ast, code);
  const fns = findFunctions(ast);
  const recursionResults = fns.map((fn) => analyzeRecursion(fn, code));
  const { allocatesLinear, allocates2D } = detectAllocations(ast, code);
  const sortDetected = /\.sort\(/.test(code);

  return finalize({
    loopResult,
    recursionResults,
    allocatesLinear,
    allocates2D,
    sortDetected,
  });
}

function analyzeGenericCode(code, lang) {
  const loopResult = analyzeLoopsGeneric(code, lang);
  const fns = findFunctionsGeneric(code, lang);
  const recursionResults = fns.map((fn) =>
    analyzeRecursionGeneric(code, lang, fn)
  );
  const { allocatesLinear, allocates2D } = detectAllocationsGeneric(code, lang);
  const sortDetected = detectSortCalls(code);

  return finalize({
    loopResult,
    recursionResults,
    allocatesLinear,
    allocates2D,
    sortDetected,
  });
}

function finalize({
  loopResult,
  recursionResults,
  allocatesLinear,
  allocates2D,
  sortDetected,
}) {
  let time = loopCurve(loopResult.linCount, loopResult.logCount);

  recursionResults.forEach((r) => {
    time = maxCurve(time, recursionCurve(r));
  });

  if (sortDetected) {
    time = maxCurve(time, "O(n log n)");
  }

  let space = "O(1)";
  if (allocates2D) space = maxCurve(space, "O(n^2)");
  else if (allocatesLinear) space = maxCurve(space, "O(n)");

  recursionResults.forEach((r) => {
    space = maxCurve(space, recursionSpaceCurve(r));
  });

  const rationale = buildRationale({
    loopResult,
    recursionResults,
    sortDetected,
    time,
  });

  return {
    time,
    space,
    rationale,
    loops: loopResult,
    recursions: recursionResults,
    sortDetected,
    allocLinear: allocatesLinear,
    alloc2D: allocates2D,
  };
}

export function analyzeCode(code, language) {
  if (!code || !code.trim()) {
    return {
      time: "O(1)",
      space: "O(1)",
      rationale: "Editor is empty — paste a function and hit Analyze.",
      loops: { linCount: 0, logCount: 0 },
      recursions: [],
      sortDetected: false,
      allocLinear: false,
      alloc2D: false,
      parserUsed: "idle",
    };
  }

  if (language === "javascript") {
    try {
      return { ...analyzeJSCode(code), parserUsed: "ast" };
    } catch {
      // fall through to generic heuristic if the snippet doesn't parse
      return { ...analyzeGenericCode(code, "java"), parserUsed: "heuristic-fallback" };
    }
  }

  return { ...analyzeGenericCode(code, language), parserUsed: "heuristic" };
}
