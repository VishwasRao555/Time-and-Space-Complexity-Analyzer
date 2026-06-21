// Reference Big-O growth ladder, used to rank detected complexities against
// each other (e.g. when a function has both a loop and recursion).
const CURVE_ORDER = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)", "O(n^3)", "O(2^n)"];

export function rankOf(curve) {
  const idx = CURVE_ORDER.indexOf(curve);
  return idx === -1 ? CURVE_ORDER.length - 1 : idx;
}

export function maxCurve(a, b) {
  return rankOf(a) >= rankOf(b) ? a : b;
}
