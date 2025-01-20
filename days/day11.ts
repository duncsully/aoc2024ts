/**
 * OK weird, it's just an array manipulation one. Probably won't be too bad in JS.
 *
 * Huh, that was pleasantly easy. There really wasn't a puzzle to that one, just
 * implementing the rules as stated, no real optimizations required. Will part 2
 * make things funky?
 */
export function part1(input: string) {
  let stones = input.split(" ").map(Number);

  for (let blinks = 0; blinks < 25; blinks++) {
    const newStones: number[] = [];
    stones.forEach((stone) => {
      if (!stone) newStones.push(1);
      else if (stone.toString().length % 2 === 0) {
        const half = stone.toString().length / 2;
        newStones.push(+stone.toString().slice(0, half));
        newStones.push(+stone.toString().slice(half));
      } else newStones.push(stone * 2024);
    });
    stones = newStones;
  }

  return stones.length;
}

/**
 * ...it's a trap, right? There's no way I can just increase the loop length
 * and it'll work fine, right? Well...only one way to find out.
 *
 * Haha nope, I quickly hit the max length for arrays. OK, I guess I'll have
 * to optimize now. Let me think through this. The order doesn't actually
 * matter because neighbors have no effect on each other. I guess I can just
 * process one stone at a time? Yeah, I can track each stone's splitting via
 * recursion and just add up the total. I suppose I can maintain a cache too.
 *
 * OK cool, that worked quite well! And yes, the cache definitely helps.
 */
export function part2(input: string) {
  const stones = input.split(" ").map(Number);

  const cache = {} as Record<string, number>;
  function count(stone: number, blinks: number): number {
    if (!blinks) return 1;
    const key = `${stone},${blinks}`;
    const cached = cache[key];
    if (cached) return cached;
    if (!stone) return count(1, blinks - 1);
    if (stone.toString().length % 2 === 0) {
      const half = stone.toString().length / 2;
      return (cache[key] =
        count(+stone.toString().slice(0, half), blinks - 1) +
        count(+stone.toString().slice(half), blinks - 1));
    }
    return (cache[key] = count(stone * 2024, blinks - 1));
  }

  return stones.reduce((acc, stone) => acc + count(stone, 75), 0);
}
