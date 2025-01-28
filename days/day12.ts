import { newline } from "../utils.ts";

/**
 * Eck, I'm getting flashbacks to similar problems from last year. I had to look
 * up formulas to get the right answers. And having gaps allowed? OK, let me try
 * to think calmly... So I'll just have to use a pretty standard recursive crawl
 * to find a "plot" since multiple disconnected plots of a single type can exist.
 * The perimeter of a plot is basically the sum of all subperimeters for each point
 * which is basically 4 - the number of neighbors of the same type. I don't know
 * if there is a more efficient way, but that's what we're going with.
 *
 * Yep, this separates the babies from the adult children... I got there eventually,
 * lots of subtle bugs to work out, and honestly the end solution feels messy but it
 * makes logical sense to me at least. Fingers crossed part 2 doesn't dial it up to 11.
 */
export function part1(input: string) {
  const rows = input.split(newline);

  const plotStartCandidates = new Set(["0,0"]);
  /** So we don't recount a plot */
  const plotted = new Set<string>();

  let total = 0;

  while (plotStartCandidates.size) {
    const [x, y] =
      plotStartCandidates.values().next().value?.split(",").map(Number) ?? [];

    const type = rows[y][x];
    const plot = new Set<string>();

    const crawl = (x: number, y: number): number => {
      const cell = rows[y]?.[x];
      if (cell !== type) {
        const nextKey = `${x},${y}`;
        if (cell !== undefined && !plotted.has(nextKey))
          plotStartCandidates.add(nextKey);
        return 1;
      }
      const key = `${x},${y}`;
      if (plot.has(key)) return 0;

      plot.add(key);
      plotted.add(key);
      plotStartCandidates.delete(key);

      return (
        crawl(x + 1, y) + crawl(x - 1, y) + crawl(x, y + 1) + crawl(x, y - 1)
      );
    };

    const perimeter = crawl(x, y);
    const area = plot.size;
    total += perimeter * area;
  }

  return total;
}

/**
 * Uuuuugh, I might need to do some actual perimeter tracing after all. Or...?
 *
 * There have to be the same number of corners as sides. It might be easier for
 * me to check for how many corners there are?
 *
 * OK, after doing some comment doodles and some truth tables, I think I have
 * the logic worked out.
 *
 * Yep, that one deserves an Hallelujah. I'm glad there were a lot of test cases
 * because I wouldn't have gotten this on the first try otherwise.
 */
export function part2(input: string) {
  const rows = input.split(newline);

  const plotStartCandidates = new Set(["0,0"]);
  /** So we don't recount a plot */
  const plotted = new Set<string>();

  let total = 0;

  while (plotStartCandidates.size) {
    const [x, y] =
      plotStartCandidates.values().next().value?.split(",").map(Number) ?? [];

    const type = rows[y][x];
    const plot = new Set<string>();

    let sides = 0;

    const crawl = (x: number, y: number): number => {
      const cell = rows[y]?.[x];
      if (cell !== type) {
        const nextKey = `${x},${y}`;
        if (cell !== undefined && !plotted.has(nextKey))
          plotStartCandidates.add(nextKey);
        return 1;
      }
      const key = `${x},${y}`;
      if (plot.has(key)) return 0;

      plot.add(key);
      plotted.add(key);
      plotStartCandidates.delete(key);

      const up = crawl(x, y - 1);
      const down = crawl(x, y + 1);
      const left = crawl(x - 1, y);
      const right = crawl(x + 1, y);

      const upLeft = rows[y - 1]?.[x - 1];
      const upRight = rows[y - 1]?.[x + 1];
      const downLeft = rows[y + 1]?.[x - 1];
      const downRight = rows[y + 1]?.[x + 1];

      // A plot is an outside corner in a diagonal direction if the two shared
      // neighboring plots are not the same type. It's an inside corner if
      // the diagonal is not the same type and the two shared neighbors are.
      if ((up && left) || (upLeft !== type && !up && !left)) sides++;
      if ((up && right) || (upRight !== type && !up && !right)) sides++;
      if ((down && left) || (downLeft !== type && !down && !left)) sides++;
      if ((down && right) || (downRight !== type && !down && !right)) sides++;

      return 0;
    };

    crawl(x, y);
    const area = plot.size;
    total += sides * area;
  }

  return total;
}
