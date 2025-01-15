/**
 * Seems a fairly classic grid problem. I think I'll approach this
 * by only counting three directions: right, down, and down-right.
 * I'll check for X and then check for M, A, and S, else for S and
 * then A, M, and X.
 *
 * Dur, need to also check up-right
 *
 * Meh, not very clean. I could DRY it a little but at least it's readable.
 */
export function part1(input: string) {
  const rows = input.split("\n");

  let total = 0;

  rows.forEach((row, y) => {
    row.split("").forEach((cell, x) => {
      if (cell === "X") {
        // Check right
        if (row[x + 1] === "M" && row[x + 2] === "A" && row[x + 3] === "S") {
          total++;
        }
        // Check down
        if (
          rows[y + 1]?.[x] === "M" &&
          rows[y + 2]?.[x] === "A" &&
          rows[y + 3]?.[x] === "S"
        ) {
          total++;
        }
        // Check down-right
        if (
          rows[y + 1]?.[x + 1] === "M" &&
          rows[y + 2]?.[x + 2] === "A" &&
          rows[y + 3]?.[x + 3] === "S"
        ) {
          total++;
        }
        // Check up-right
        if (
          rows[y - 1]?.[x + 1] === "M" &&
          rows[y - 2]?.[x + 2] === "A" &&
          rows[y - 3]?.[x + 3] === "S"
        ) {
          total++;
        }
      } else if (cell === "S") {
        // Check right
        if (row[x + 1] === "A" && row[x + 2] === "M" && row[x + 3] === "X") {
          total++;
        }
        // Check down
        if (
          rows[y + 1]?.[x] === "A" &&
          rows[y + 2]?.[x] === "M" &&
          rows[y + 3]?.[x] === "X"
        ) {
          total++;
        }
        // Check down-right
        if (
          rows[y + 1]?.[x + 1] === "A" &&
          rows[y + 2]?.[x + 2] === "M" &&
          rows[y + 3]?.[x + 3] === "X"
        ) {
          total++;
        }
        // Check up-right
        if (
          rows[y - 1]?.[x + 1] === "A" &&
          rows[y - 2]?.[x + 2] === "M" &&
          rows[y - 3]?.[x + 3] === "X"
        ) {
          total++;
        }
      }
    });
  });

  return total;
}

/**
 * Ugh, OK, this doesn't seem too tricky but might be more conditional logic.
 * I think I'll look for "A" since it should always be the center.
 *
 * OK, that wasn't so bad. It actually ended up cleaner than part 1.
 */
export function part2(input: string) {
  const rows = input.split("\n");

  let total = 0;

  const check = new Set(["M", "S"]);

  rows.forEach((row, y) => {
    row.split("").forEach((cell, x) => {
      if (cell !== "A") return;

      // Check top-left and bottom-right
      const topLeft = rows[y - 1]?.[x - 1];
      const bottomRight = rows[y + 1]?.[x + 1];
      const firstDiagonalValid =
        check.has(topLeft) && check.has(bottomRight) && topLeft !== bottomRight;

      // Check top-right and bottom-left
      const topRight = rows[y - 1]?.[x + 1];
      const bottomLeft = rows[y + 1]?.[x - 1];
      const secondDiagonalValid =
        check.has(topRight) && check.has(bottomLeft) && topRight !== bottomLeft;
      if (firstDiagonalValid && secondDiagonalValid) {
        total++;
      }
    });
  });

  return total;
}
