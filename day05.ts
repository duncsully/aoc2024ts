const newline = /\r?\n/;

/**
 * This one could be fun. I'll need to play around and see what seems like the
 * best way to tackle it as I go.
 *
 * Well I needed to contend with newlines being wonky in Windows but otherwise
 * I felt good about this solution.
 */
export function part1(input: string) {
  const [rulesSection, updatesSection] = input.split(/\r?\n\r?\n/);

  const rules = rulesSection.split(newline);
  // Build a dictionary of pages to array of pages that can't appear after them
  const pageToInvalidFollowingPages = rules.reduce<Record<string, string[]>>(
    (acc, rule) => {
      const [before, after] = rule.split("|");
      const set = (acc[after] ??= []);
      set.push(before);
      return acc;
    },
    {}
  );

  const updates = updatesSection.split(newline);

  return updates.reduce((total, update) => {
    const pages = update.split(",");
    const invalidPages = new Set();
    if (
      pages.every((page) => {
        if (invalidPages.has(page)) return false;
        pageToInvalidFollowingPages[page]?.forEach((invalidPage) =>
          invalidPages.add(invalidPage)
        );

        return true;
      })
    ) {
      const middlePage = +pages[(pages.length - 1) / 2];
      return total + middlePage;
    }

    return total;
  }, 0);
}

/**
 * Funny, I thought about sorting as a solution for the first part but figured
 * it'd be inefficient, but now it's part of the requirement for this solution.
 * Eh, just gonna copy the first part and modify it.
 */
export function part2(input: string) {
  const [rulesSection, updatesSection] = input.split(/\r?\n\r?\n/);

  const rules = rulesSection.split(newline);
  // Build a dictionary of pages to array of pages that can't appear after them
  const pageToInvalidFollowingPages = rules.reduce<Record<string, string[]>>(
    (acc, rule) => {
      const [before, after] = rule.split("|");
      const set = (acc[after] ??= []);
      set.push(before);
      return acc;
    },
    {}
  );

  const updates = updatesSection.split(newline);

  return updates.reduce((total, update) => {
    const pages = update.split(",");
    const invalidPages = new Set();
    if (
      pages.every((page) => {
        if (invalidPages.has(page)) return false;
        pageToInvalidFollowingPages[page]?.forEach((invalidPage) =>
          invalidPages.add(invalidPage)
        );

        return true;
      })
    ) {
      return total;
    }

    pages.sort((a, b) => {
      if (pageToInvalidFollowingPages[a]?.includes(b)) return 1;
      if (pageToInvalidFollowingPages[b]?.includes(a)) return -1;
      return 0;
    });

    const middlePage = +pages[(pages.length - 1) / 2];
    return total + middlePage;
  }, 0);
}
