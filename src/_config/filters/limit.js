/**
 * Take the first `count` items of an array.
 *
 * Nunjucks has no built-in "first N" filter — its `slice` divides an array
 * into N chunks rather than truncating it. Used to cap how many posts the
 * Atom and JSON feeds carry.
 *
 * @param {Array} array - the array to truncate
 * @param {number} count - maximum number of items to keep
 * @returns {Array} at most `count` items; the input unchanged if count is unset
 */
export const limit = (array, count) => {
  if (!Array.isArray(array)) return array;
  if (typeof count !== 'number' || count < 0) return array;
  return array.slice(0, count);
};
