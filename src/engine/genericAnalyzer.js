// Indentation/brace based heuristic analyzer for Python, Java and C++.
// No real parser is available for these in-browser, so complexity is
// inferred from loop keyword nesting and simple textual recursion checks.

const HALVING_RE = /(\/\/?\s*2\b)|(>>\s*1\b)|(\*\s*0\.5\b)/;
const MEMO_RE = /\b(memo|cache|dp|seen|visited)\b/i;
const SORT_RE = /\.sort\(|sorted\(|Collections\.sort|Arrays\.sort|std::sort|qsort\(/;

const LOOP_RE = {
  python: /^\s*(for|while)\b.*:\s*$/,
  java: /\b(for|while)\s*\(/,
  cpp: /\b(for|while)\s*\(/,
};

function stripComments(code, lang) {
  if (lang === "python") {
    return code.replace(/#.*$/gm, "");
  }
  return code
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
}

function indentOf(line) {
  const m = line.match(/^(\s*)/);
  return m ? m[1].replace(/\t/g, "    ").length : 0;
}

export function analyzeLoopsGeneric(code, lang) {
  const cleaned = stripComments(code, lang);
  const lines = cleaned.split("\n");
  let best = { linCount: 0, logCount: 0 };

  if (lang === "python") {
    const stack = []; // {indent, tag}
    lines.forEach((raw, idx) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      const indent = indentOf(raw);
      while (stack.length && indent <= stack[stack.length - 1].indent) {
        stack.pop();
      }
      if (LOOP_RE.python.test(raw)) {
        const blockText = functionBodyText(lines, idx, lang);
        const isLog = HALVING_RE.test(blockText) || /\*\s*2\b|<<=\s*1/.test(blockText);
        const tag = isLog ? "log" : "lin";
        stack.push({ indent, tag });
        const linCount = stack.filter((s) => s.tag === "lin").length;
        const logCount = stack.filter((s) => s.tag === "log").length;
        if (linCount * 2 + logCount > best.linCount * 2 + best.logCount) {
          best = { linCount, logCount };
        }
      }
    });
  } else {
    // brace based (java / cpp)
    let depth = 0;
    const stack = []; // {depth, tag}
    lines.forEach((raw, idx) => {
      if (LOOP_RE[lang] && LOOP_RE[lang].test(raw)) {
        const blockText = functionBodyText(lines, idx, lang);
        const isLog = HALVING_RE.test(blockText) || /\*\s*2\b|<<=\s*1/.test(blockText);
        const tag = isLog ? "log" : "lin";
        stack.push({ depth, tag });
        const linCount = stack.filter((s) => s.tag === "lin").length;
        const logCount = stack.filter((s) => s.tag === "log").length;
        if (linCount * 2 + logCount > best.linCount * 2 + best.logCount) {
          best = { linCount, logCount };
        }
      }
      const opens = (raw.match(/{/g) || []).length;
      const closes = (raw.match(/}/g) || []).length;
      for (let i = 0; i < closes; i++) {
        depth -= 1;
        while (stack.length && stack[stack.length - 1].depth > depth) {
          stack.pop();
        }
      }
      depth += opens;
    });
  }

  return best;
}

const FN_DEF_RE = {
  python: /^\s*def\s+([a-zA-Z_]\w*)\s*\(/,
  java: /\b(?:public|private|protected|static|\s)+[\w<>[\],\s]+\s+([a-zA-Z_]\w*)\s*\([^;{]*\)\s*\{/,
  cpp: /\b[\w:<>*&,\s]+\s+([a-zA-Z_]\w*)\s*\([^;{]*\)\s*\{/,
};

export function findFunctionsGeneric(code, lang) {
  const lines = code.split("\n");
  const fns = [];
  const re = FN_DEF_RE[lang];
  if (!re) return fns;

  lines.forEach((line, idx) => {
    const m = line.match(re);
    if (m && m[1] && !["if", "for", "while", "switch", "return"].includes(m[1])) {
      fns.push({ name: m[1], line: idx + 1, startIdx: idx });
    }
  });
  return fns;
}

function functionBodyText(lines, startIdx, lang) {
  if (lang === "python") {
    const startIndent = indentOf(lines[startIdx]);
    let end = lines.length;
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (lines[i].trim() && indentOf(lines[i]) <= startIndent) {
        end = i;
        break;
      }
    }
    return lines.slice(startIdx, end).join("\n");
  }
  // brace based: find matching closing brace from startIdx
  let depth = 0;
  let started = false;
  let end = lines.length;
  for (let i = startIdx; i < lines.length; i++) {
    const opens = (lines[i].match(/{/g) || []).length;
    const closes = (lines[i].match(/}/g) || []).length;
    if (opens > 0) started = true;
    depth += opens - closes;
    if (started && depth <= 0) {
      end = i + 1;
      break;
    }
  }
  return lines.slice(startIdx, end).join("\n");
}

export function analyzeRecursionGeneric(code, lang, fn) {
  const lines = code.split("\n");
  const bodyText = functionBodyText(lines, fn.startIdx, lang);
  const callRe = new RegExp(`\\b${fn.name}\\s*\\(`, "g");
  const totalCalls = (bodyText.match(callRe) || []).length;
  const selfCallCount = Math.max(0, totalCalls - 1); // subtract the definition itself
  const halving = HALVING_RE.test(bodyText);
  const hasMemo = MEMO_RE.test(bodyText);
  return { name: fn.name, line: fn.line, selfCallCount, halving, hasMemo };
}

export function detectSortCalls(code) {
  return SORT_RE.test(code);
}

export function detectAllocationsGeneric(code, lang) {
  const allocLinearRe =
    lang === "python"
      ? /\[\s*0\s*\]\s*\*\s*n|\blist\(|\bdict\(|\{\s*\}|\[\s*\]/
      : /new\s+\w+\s*\[|\bnew\s+(ArrayList|HashMap|HashSet|Vector)|std::vector|std::map|std::set/;
  const allocates2D =
    /\[\s*\[\s*\]\s*\]|\[\]\[\]|vector<vector<|new\s+\w+\s*\[[^\]]+\]\s*\[/.test(
      code
    );
  return { allocatesLinear: allocLinearRe.test(code), allocates2D };
}
