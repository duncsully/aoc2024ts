/**
 * First day part one is almost always pretty easy. Seems like a simple combo
 * of parsing the input into two lists, sorting, and then totaling the absolute
 * values between the two lists.
 *
 * I made the mistake of using \s* instead of \s+ to split the numbers, which
 * just happened to work for the example but not the full input of course. But
 * otherwise this was as simple as I imagined.
 */
export function part1(input: string) {
  const lines = input.split("\n");

  const firstList: number[] = [];
  const secondList: number[] = [];

  lines.forEach((line) => {
    const [first, second] = line.split(/\s+/);

    firstList.push(parseInt(first, 10));
    secondList.push(parseInt(second, 10));
  });

  firstList.sort();
  secondList.sort();

  const totalDifference = firstList.reduce(
    (acc, firstNumber, i) => Math.abs(firstNumber - secondList[i]) + acc,
    0
  );

  return totalDifference;
}

/**
 * Interesting, there are possibly a few ways to optimize this. My initial
 * attempt will be to cache the total for each number but otherwise just do a
 * filter on the second list to get the first calculation. We'll see if this
 * is fast enough.
 *
 * It seems so!
 */
export function part2(input: string) {
  const lines = input.split("\n");

  // We don't need numbers immediately this time since we're not sorting them
  const firstList: string[] = [];
  const secondList: string[] = [];

  lines.forEach((line) => {
    const [first, second] = line.split(/\s+/);

    firstList.push(first);
    secondList.push(second);
  });

  const cache: Record<string, number> = {};
  const similarityScore = firstList.reduce((acc, firstNumber) => {
    cache[firstNumber] ??=
      secondList.filter((secondNumber) => firstNumber === secondNumber).length *
      +firstNumber;

    return acc + cache[firstNumber];
  }, 0);

  return similarityScore;
}
