/**
 * Rotates clockwise from current direction.
 */
const turn = ([rowDiff, cellDiff]: [number, number, number?]): [
  number,
  number
] => {
  if (rowDiff === 0) {
    return [cellDiff === -1 ? -1 : 1, 0];
  }
  return [0, rowDiff === 1 ? -1 : 1];
};

/**
 * Another grid one, huh? There's probably a smarter way to do this but I guess
 * I'll start with "walking" the grid according to the rules.
 *
 * Yep, that seemed to work fine. I had the most grief in making sure my turn
 * function was correct. I had fun building a visualizer for the path while
 * debugging.
 */
export function part1(input: string) {
  // Coords will be in the format "row,cell"
  const visited = new Set<string>();

  const rows = input.split(/\r?\n/);

  let direction: [number, number] = [-1, 0];

  const startingRow = rows.findIndex((row) => row.includes("^"));
  const startingCell = rows[startingRow].indexOf("^");

  let position: [number, number] = [startingRow, startingCell];

  while (rows[position[0]]?.[position[1]] !== undefined) {
    visited.add(position.join(","));
    const next: [number, number] = [
      position[0] + direction[0],
      position[1] + direction[1],
    ];

    if (rows[next[0]]?.[next[1]] === "#") {
      direction = turn(direction);
      continue;
    }
    position = next;
  }

  // Visualizes the path
  /* rows.forEach((row, y) =>
    console.log(
      row.replaceAll(/./g, (char, x) => (visited.has(`${y},${x}`) ? "X" : char))
    )
  ); */

  return visited.size;
}

/**
 * Yeesh...OK. I'll be a little worried about optimization here but we'll start
 * with a brute force solution. I'll need to figure out if we've started a loop
 * so I think I'll store axis of movement for each coord since you can cross a
 * coord but if you're going in the same axis, it means you had to have looped.
 *
 * Ugh...OK so technically it's possible to turn around, which means crossing over
 * the same point in the same axis, but not necessarily a loop. I think I'll store
 * direction and not just axis.
 *
 * Phew, that worked without that many modifications. That said, it did give me
 * literal pause for how long it took for the answer to come back, but it was in
 * a matter of seconds. This could definitely be optimized, but good enough for now.
 */
export function part2(input: string) {
  const rows = input.split(/\r?\n/).map((row) => row.split(""));

  const startingRow = rows.findIndex((row) => row.includes("^"));
  const startingCell = rows[startingRow].indexOf("^");

  let totalPossible = 0;
  rows.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === ".") {
        // Coords will be in the format "row,cell,dir" where dir is 0 for up and increments clockwise
        const visited = new Set<string>();
        const obstacle = `${y},${x}`;
        let direction: [number, number] = [-1, 0];
        let dir = 0;

        let position: [number, number] = [startingRow, startingCell];

        while (rows[position[0]]?.[position[1]] !== undefined) {
          const key = `${position.join(",")},${dir}`;
          if (visited.has(key)) {
            totalPossible++;
            break;
          }
          visited.add(key);
          const next: [number, number] = [
            position[0] + direction[0],
            position[1] + direction[1],
          ];

          if (rows[next[0]]?.[next[1]] === "#" || obstacle === next.join(",")) {
            direction = turn(direction);
            dir += dir === 3 ? -3 : 1;
            continue;
          }
          position = next;
        }
      }
    });
  });

  return totalPossible;
}
