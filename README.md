# Time & Space Complexity Analyzer

A client-side React app that estimates the Big-O time and space complexity of
pasted DSA code in JavaScript, Python, Java or C++. No backend, no database —
everything runs in the browser.

## Stack

- React + Vite
- Monaco Editor for the code input
- Acorn (AST) for JavaScript analysis; indentation/brace heuristics for
  Python, Java and C++
- React Three Fiber for the animated 3D background
- Recharts for the complexity growth graph

## Run locally

```bash
npm install
npm run dev
```

## How it works

The analysis engine (`src/engine`) inspects loop nesting depth, recursion
(with or without memoization), halving patterns (e.g. binary search), and
common allocations to estimate time and space complexity. It's a heuristic
estimator, not a real interpreter — treat results as an educated guess, the
same way a human skimming the code would.
