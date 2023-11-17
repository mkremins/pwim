// Return a (deep) clone of any JSON-compatible `obj`.
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Return whether the character `c` is an uppercase letter.
function isUppercase(c) {
  return /[A-Z]/.test(c);
}

// Return a random item from a list.
function randNth(items) {
  return items[Math.floor(Math.random() * items.length)];
}

// Translate `num` from the scale bounded by `oldMin` and `oldMax`
// to the scale bounded by `newMin` and `newMax`.
function scale(num, [oldMin, oldMax], [newMin, newMax]) {
  const oldRange = oldMax - oldMin;
  const newRange = newMax - newMin;
  return (((num - oldMin) / oldRange) * newRange) + newMin;
}
