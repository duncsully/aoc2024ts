/**
 * Looks like RegEx to the rescue. I think it'll be pretty straightforward.
 * Also interestingly perhaps one of the only times I won't need to parse into
 * an array of lines.
 *
 * Wow, I think my comment is longer than the solver. I didn't mean to code golf
 * but it was satisfying how succinctly this could be solved.
 */

const mulInstructionFactorsRegex = /mul\((\d+),(\d+)\)/g;
export function part1(input: string) {
  return input
    .matchAll(mulInstructionFactorsRegex)
    .reduce((sum, [, a, b]) => sum + +a * +b, 0);
}

/**
 * I was a little scared at first that my regex strat would completely break down
 * but I think I came up with a clever solution. I'm going to try removing
 * don't().*do() and then just running the same regex as part 1.
 *
 * OK, so I needed to modify the regex a bit to deal with newlines and account for
 * the possibility of there being a don't() without any more do()s (though this)
 * didn't happen in my input, I wanted to be safe). But this otherwise did work!
 */
export function part2(input: string) {
  const transformedInput = input.replaceAll(/don't\(\).*?(do\(\)|$)/gs, "");
  return transformedInput
    .matchAll(mulInstructionFactorsRegex)
    .reduce((sum, [, a, b]) => sum + +a * +b, 0);
}
