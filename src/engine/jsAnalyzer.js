import * as acorn from "acorn";
import * as walk from "acorn-walk";

const HALVING_RE = /(\/\/?\s*2\b)|(>>\s*1\b)|(\*\s*0\.5\b)/;
const MEMO_RE = /\b(memo|cache|dp|seen|visited)\b/i;
const ALLOC_RE = /\b(new\s+Array|Array\s*\(|new\s+Map|new\s+Set|\[\]|\{\})/;

function lineOf(node) {
  return node.loc ? node.loc.start.line : 0;
}

function sliceSource(code, node) {
  return code.slice(node.start, node.end);
}

const LOOP_TYPES = new Set([
  "ForStatement",
  "WhileStatement",
  "DoWhileStatement",
  "ForOfStatement",
  "ForInStatement",
]);

function loopHasHalvingPattern(code, node) {
  return HALVING_RE.test(sliceSource(code, node));
}

function loopHasMultiplicativeStep(code, node) {
  const text = sliceSource(code, node);
  return (
    /[a-zA-Z_$][\w$]*\s*(\*=|<<=)\s*2\b/.test(text) ||
    /([a-zA-Z_$][\w$]*)\s*=\s*\1\s*\*\s*2\b/.test(text)
  );
}

export function parseJS(code) {
  return acorn.parse(code, {
    ecmaVersion: "latest",
    sourceType: "module",
    locations: true,
    allowReturnOutsideFunction: true,
  });
}

export function analyzeLoops(ast, code) {
  let best = { linCount: 0, logCount: 0 };
  const stack = [];

  function record(currentStack) {
    const linCount = currentStack.filter((s) => s === "lin").length;
    const logCount = currentStack.filter((s) => s === "log").length;
    const rank = linCount * 2 + logCount;
    const bestRank = best.linCount * 2 + best.logCount;
    if (rank > bestRank) {
      best = { linCount, logCount };
    }
  }

  walk.recursive(ast, null, {
    ...Object.fromEntries(
      [...LOOP_TYPES].map((type) => [
        type,
        (node, state, c) => {
          const isLog =
            loopHasHalvingPattern(code, node) ||
            loopHasMultiplicativeStep(code, node);
          stack.push(isLog ? "log" : "lin");
          record(stack);
          if (node.body) c(node.body, state);
          if (node.init) c(node.init, state);
          if (node.test) c(node.test, state);
          if (node.update) c(node.update, state);
          stack.pop();
        },
      ])
    ),
  });

  return best;
}

export function findFunctions(ast) {
  const fns = [];

  function addFn(name, node) {
    if (name) fns.push({ name, node });
  }

  walk.simple(ast, {
    FunctionDeclaration(node) {
      addFn(node.id && node.id.name, node);
    },
    VariableDeclarator(node) {
      if (
        node.init &&
        (node.init.type === "FunctionExpression" ||
          node.init.type === "ArrowFunctionExpression") &&
        node.id.type === "Identifier"
      ) {
        addFn(node.id.name, node.init);
      }
    },
    MethodDefinition(node) {
      if (node.key && node.key.type === "Identifier") {
        addFn(node.key.name, node.value);
      }
    },
  });

  return fns;
}

export function analyzeRecursion(fn, code) {
  const { name, node } = fn;
  let selfCallCount = 0;
  let halving = false;

  walk.simple(node.body || node, {
    CallExpression(call) {
      const callee = call.callee;
      const isSelf =
        (callee.type === "Identifier" && callee.name === name) ||
        (callee.type === "MemberExpression" &&
          callee.property.type === "Identifier" &&
          callee.property.name === name);
      if (isSelf) {
        selfCallCount += 1;
        const argsText = call.arguments
          .map((a) => sliceSource(code, a))
          .join(",");
        if (HALVING_RE.test(argsText)) halving = true;
      }
    },
  });

  const bodyText = sliceSource(code, node.body || node);
  const hasMemo = MEMO_RE.test(bodyText);
  if (!halving && HALVING_RE.test(bodyText)) halving = true;

  return { name, line: lineOf(node), selfCallCount, halving, hasMemo };
}

export function detectAllocations(ast, code) {
  let allocatesLinear = false;
  let allocates2D = false;

  walk.simple(ast, {
    VariableDeclarator(node) {
      if (!node.init) return;
      const text = sliceSource(code, node.init);
      if (ALLOC_RE.test(text)) {
        allocatesLinear = true;
      }
    },
    NewExpression(node) {
      const text = sliceSource(code, node);
      if (/Array/.test(text)) allocatesLinear = true;
    },
  });

  // crude 2D detection: nested array/map literal or Array(...).fill / .map combo
  if (/Array\([^)]*\)\.fill\([^)]*\)\.map/.test(code) || /\[\s*\[\s*\]/.test(code)) {
    allocates2D = true;
  }

  return { allocatesLinear, allocates2D };
}
