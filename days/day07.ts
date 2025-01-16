import { newline } from "../utils.ts";

/**
 * Ah OK, doesn't seem too bad. The interesting part will be determining how to
 * test every possible permutation of operators. This seems like an (awful)
 * excuse to try out a bitmask?
 *
 * Eck, had to do some debugging to figure out that my bitmask math was off, first
 * using the wrong value as the bitmask and then not accounting for starting on index
 * 1 for the second reduce since I did want to start with the first operand in
 * the accumulator. Answer is big! I'm worried for the second part.
 */
export function part1(input: string) {
  const lines = input.split(newline);

  return lines.reduce((total, line) => {
    const [testValueStr, operandsStr] = line.split(": ");
    const testValue = Number(testValueStr);
    const operands = operandsStr.split(" ").map(Number);

    // Every operand will be either added or multiplied, so we can use a bitmask
    // to test every possible permutation. e.g. If there are 3 operands, there
    // will be 2 operators that can be + or * each, so 2^2. We'll consider
    // 0 as add and 1 as multiply. So for 3 operands a, b, and c, we'll test:
    // | bitMask | formula  |
    // |---------|----------|
    // | 0 (00)  | a + b + c|
    // | 1 (01)  | a + b * c|
    // | 2 (10)  | a * b + c|
    // | 3 (11)  | a * b * c|
    const totalPermutations = 2 ** (operands.length - 1);
    for (
      let operatorPermutation = 0;
      operatorPermutation < totalPermutations;
      operatorPermutation++
    ) {
      // Probably one of the few more legitimate uses of reduce
      const result = operands.reduce((acc, operand, operatorIndex) => {
        // Optimization to prevent further calculations if we've already surpassed
        // the test value
        if (acc > testValue) return acc;
        // We start at index 1 so we need to subtract 1
        const bitMask = 1 << (operatorIndex - 1);
        const multiply = operatorPermutation & bitMask;
        return multiply ? acc * operand : acc + operand;
      });
      if (result === testValue) return total + testValue;
    }
    return total;
  }, 0);
}

enum Operator {
  Add = "0",
  Multiply = "1",
  Concat = "2",
}

/**
 * Aaaaah, ruining my bitmask fun, eh? Well...I guess I could use a ternary
 * system somehow? TIL that .toString(3) is a thing...OK, stubborn solution
 * here I come!
 *
 * Alright alright, that actually worked out without that many modifications
 * thanks to my tritmask hack, and it even ran fast enough. I just needed to
 * remember to padStart the value being tritmasked
 */
export function part2(input: string) {
  const lines = input.split(newline);

  return lines.reduce((total, line) => {
    const [testValueStr, operandsStr] = line.split(": ");
    const testValue = Number(testValueStr);
    const operands = operandsStr.split(" ").map(Number);

    // Every operand will be added, multiplied, or concatenated so we can use a
    // poor man's tritmask to test every possible permutation. e.g. If there are
    // 3 operands, there will be 2 operators that can be +, *, or concat each,
    // so 2^3. We'll consider 0 as add, 1 as multiply, and 2 as concat. So for 3
    // operands a, b, and c, we'll test:
    // | tritMask| formula  |
    // |---------|----------|
    // | 0 (00)  | a + b + c|
    // | 1 (01)  | a + b * c|
    // | 2 (02)  | a + b | c|
    // | 3 (10)  | a * b + c|
    // | 4 (11)  | a * b * c|
    // | 5 (12)  | a * b | c|
    // | 6 (20)  | a | b + c|
    // | 7 (21)  | a | b * c|
    // | 8 (22)  | a | b | c|
    const totalPermutations = 3 ** (operands.length - 1);
    for (
      let operatorPermutation = 0;
      operatorPermutation < totalPermutations;
      operatorPermutation++
    ) {
      const operatorPermutationStr = operatorPermutation
        .toString(3)
        .padStart(operands.length - 1, "0");
      // Probably one of the few more legitimate uses of reduce
      const result = operands.reduce((acc, operand, operatorIndex) => {
        // Optimization to prevent further calculations if we've already surpassed
        // the test value
        if (acc > testValue) return acc;
        // We start at index 1 so we need to subtract 1
        const tritMask = operatorIndex - 1;
        const operator = operatorPermutationStr[tritMask];

        switch (operator) {
          case Operator.Add:
            return acc + operand;
          case Operator.Multiply:
            return acc * operand;
          case Operator.Concat:
            return Number(`${acc}${operand}`);
          default:
            return acc;
        }
      });
      if (result === testValue) return total + testValue;
    }
    return total;
  }, 0);
}
