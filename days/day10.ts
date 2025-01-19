import { newline } from "../utils.ts";

/**
 * More grid walking. This one seems easy. Lots of room for optimization but as
 * usual I'll take the simple and naive approach first.
 *
 * Mmm need to make sure that a trail head with split parallel paths to the same 9
 * don't get counted multiple times.
 *
 * Plenty fast and right on the first try thankfully after having a bit of a rough
 * time with the last one. So you just know the second part will throw us a curve
 * ball, right?
 */
export function part1(input: string) {
  const grid = input.split(newline).map((row) => row.split("").map(Number));

  function getScore(
    x: number,
    y: number,
    target = 0,
    foundSummits = new Set<string>()
  ): number {
    const cell = grid[y]?.[x];
    if (cell !== target) return 0;
    const key = `${x},${y}`;
    if (cell === 9) {
      if (foundSummits.has(key)) return 0;
      foundSummits.add(key);
      return 1;
    }

    const nextTarget = target + 1;
    const leftScore = getScore(x - 1, y, nextTarget, foundSummits);
    const rightScore = getScore(x + 1, y, nextTarget, foundSummits);
    const upScore = getScore(x, y - 1, nextTarget, foundSummits);
    const downScore = getScore(x, y + 1, nextTarget, foundSummits);
    const score = leftScore + rightScore + upScore + downScore;
    return score;
  }

  return grid.reduce(
    (acc, row, y) => acc + row.reduce((acc, _, x) => acc + getScore(x, y), 0),
    0
  );
}

/**
 * Wait...will this actually be easier than the first part? Since I'm removing
 * the requirement of unique summits, now I can just count every valid path that
 * ends in a 9 like I was erroneously doing in the first part.
 *
 * Wow, that might be a first, the solution was actually a simplified version of
 * my part 1 solution. I'm not complaining!
 */
export function part2(input: string) {
  const grid = input.split(newline).map((row) => row.split("").map(Number));

  function getScore(x: number, y: number, target = 0): number {
    const cell = grid[y]?.[x];
    if (cell !== target) return 0;
    if (cell === 9) return 1;

    const nextTarget = target + 1;
    const leftScore = getScore(x - 1, y, nextTarget);
    const rightScore = getScore(x + 1, y, nextTarget);
    const upScore = getScore(x, y - 1, nextTarget);
    const downScore = getScore(x, y + 1, nextTarget);
    const score = leftScore + rightScore + upScore + downScore;
    return score;
  }

  return grid.reduce(
    (acc, row, y) => acc + row.reduce((acc, _, x) => acc + getScore(x, y), 0),
    0
  );
}
