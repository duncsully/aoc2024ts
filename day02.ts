/**
 * Seems pretty easy, not much else to say.
 *
 * Yeah, that was simple, just not as clean as I'd like.
 */
export function part1(input: string) {
  const reports = input.split("\n").map((line) => line.split(" ").map(Number));

  const safeReports = reports.reduce((acc, report) => {
    let sign = 0;
    for (let i = 0; i < report.length - 1; i++) {
      const current = report[i];
      const next = report[i + 1];

      const diff = current - next;
      const diffSign = Math.sign(diff);
      const diffAbs = Math.abs(diff);
      if (!sign) {
        sign = diffSign;
      }
      if (sign !== diffSign || diffAbs === 0 || diffAbs > 3) {
        return acc;
      }
    }
    return acc + 1;
  }, 0);

  return safeReports;
}

/**
 * Hmm I feel like there's a hidden gotcha in this one. I think I'll take the naive
 * approach of just looping over the levels.
 *
 * As I work on this I can't help but think that this won't be optimal.
 *
 * Never mind, that worked just fine!
 */
export function part2(input: string) {
  const reports = input.split("\n").map((line) => line.split(" ").map(Number));

  const safeReports = reports.reduce((acc, report) => {
    const isSafe = report.some((_, i) => {
      const reportWithIgnoredLevel = report.toSpliced(i, 1);
      let sign = 0;
      for (let j = 0; j < reportWithIgnoredLevel.length - 1; j++) {
        const current = reportWithIgnoredLevel[j];
        const next = reportWithIgnoredLevel[j + 1];

        const diff = current - next;
        const diffSign = Math.sign(diff);
        const diffAbs = Math.abs(diff);
        if (!sign) {
          sign = diffSign;
        }
        if (sign !== diffSign || 0 === diffAbs || diffAbs > 3) {
          return false;
        }
      }
      return true;
    });
    return acc + (isSafe ? 1 : 0);
  }, 0);

  return safeReports;
}
