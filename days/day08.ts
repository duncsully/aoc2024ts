import { newline } from "../utils.ts";

/**
 * Another coordinates math one. Just going to store string coords in a Set,
 * should be simple.
 *
 * Yeah not gonna lie, that one was kinda boring, but JS probably makes it trivial.
 * We'll see if part 2 makes it more interesting.
 */
export function part1(input: string) {
  const rows = input.split(newline);
  /**
   * A map of node characters to a list of their coordinates represented as tuples
   */
  const nodesListMap: Record<string, [number, number][]> = {};

  // Build nodesListMap
  rows.forEach((row, y) => {
    row.split("").forEach((cell, x) => {
      if (cell !== ".") {
        const nodeList = (nodesListMap[cell] ??= []);
        nodeList.push([x, y]);
      }
    });
  });

  const antinodes = new Set<string>();
  Object.values(nodesListMap).forEach((nodes) => {
    for (let i = 0; i < nodes.length - 1; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const [x1, y1] = nodes[i];
        const [x2, y2] = nodes[j];
        const xDiff = x2 - x1;
        const yDiff = y2 - y1;

        const antinodeCandidate1x = x1 - xDiff;
        const antinodeCandidate1y = y1 - yDiff;
        if (rows[antinodeCandidate1y]?.[antinodeCandidate1x] !== undefined) {
          antinodes.add(`${antinodeCandidate1x},${antinodeCandidate1y}`);
        }

        const antinodeCandidate2x = x2 + xDiff;
        const antinodeCandidate2y = y2 + yDiff;
        if (rows[antinodeCandidate2y]?.[antinodeCandidate2x] !== undefined) {
          antinodes.add(`${antinodeCandidate2x},${antinodeCandidate2y}`);
        }
      }
    }
  });

  return antinodes.size;
}

/**
 * Alright so now we're calculating essentially the length of lines that fall
 * on each pair of nodes. We'll start with the naive solution of just adapting
 * the part 1 solution to loop until getting undefined.
 *
 * Other than a few hiccups making sure I accounted for each antenna as an
 * antinode, this went as expected.
 */
export function part2(input: string) {
  const rows = input.split(newline);
  /**
   * A map of node characters to a list of their coordinates represented as tuples
   */
  const nodesListMap: Record<string, [number, number][]> = {};

  // Build nodesListMap
  rows.forEach((row, y) => {
    row.split("").forEach((cell, x) => {
      if (cell !== ".") {
        const nodeList = (nodesListMap[cell] ??= []);
        nodeList.push([x, y]);
      }
    });
  });

  const antinodes = new Set<string>();
  Object.values(nodesListMap).forEach((nodes) => {
    if (nodes.length >= 2) {
      // Since the second loop doesn't start on the first value,
      // need to manually add
      antinodes.add(nodes[0].join(","));
    }
    for (let i = 0; i < nodes.length - 1; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        antinodes.add(nodes[j].join(","));
        const [x1, y1] = nodes[i];
        const [x2, y2] = nodes[j];
        const xDiff = x2 - x1;
        const yDiff = y2 - y1;

        let antinodeCandidate1x = x1 - xDiff;
        let antinodeCandidate1y = y1 - yDiff;
        while (rows[antinodeCandidate1y]?.[antinodeCandidate1x] !== undefined) {
          antinodes.add(`${antinodeCandidate1x},${antinodeCandidate1y}`);
          antinodeCandidate1x -= xDiff;
          antinodeCandidate1y -= yDiff;
        }

        let antinodeCandidate2x = x2 + xDiff;
        let antinodeCandidate2y = y2 + yDiff;
        while (rows[antinodeCandidate2y]?.[antinodeCandidate2x] !== undefined) {
          antinodes.add(`${antinodeCandidate2x},${antinodeCandidate2y}`);
          antinodeCandidate2x += xDiff;
          antinodeCandidate2y += yDiff;
        }
      }
    }
  });

  return antinodes.size;
}
