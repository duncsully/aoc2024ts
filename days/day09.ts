/**
 * Well this one sounds interesting. I might have to experiment with this one but
 * no matter what I expect some array manipulation.
 *
 * Good lord, I made the simple mistake of not entering the correct input and went
 * on a wild goose chase trying to figure out what was wrong with my solution since
 * it worked for the example. That said, on one of my incorrect answers I swear I
 * thought it said my answer was too low but the correct answer was actually lower,
 * so that threw me off for a while until I tried it anyway.
 *
 * With that all out of the way, I'm otherwise happy enough with my answer.
 */
export function part1(input: string) {
  // Split into pairs of files and empty blocks
  const pairs = input.match(/.{1,2}/g);

  const blocks = pairs!.reduce<number[]>((acc, pair, id) => {
    const [fileSize, emptyBlocks = "0"] = pair;
    const emptyBlocksLength = +emptyBlocks;
    return [
      ...acc,
      ...Array(+fileSize).fill(id),
      ...Array(emptyBlocksLength).fill(NaN),
    ];
  }, []);

  let nextEmptyBlock: number;
  while ((nextEmptyBlock = blocks.findIndex(isNaN)) !== -1) {
    const blockToMove = blocks.pop()!;
    if (isNaN(blockToMove)) {
      continue;
    }
    blocks[nextEmptyBlock] = blockToMove;
  }

  return blocks.reduce((checksum, block, i) => checksum + block * i, 0);
}

/**
 * Huh, OK, gonna do some actual array splicing but I don't think this will be too bad.
 * I don't know if it'll be necessary but I have an idea for an optimization.
 *
 * Got hung up for a little bit forgetting that I couldn't ignore the empty blocks
 * anymore since they were now likely to remain in between files, affecting block
 * indices.
 *
 * Oof, this might be the first one I really ought to optimize. Took over a minute
 * to get the wrong answer.
 *
 * At least it's been fun figuring out various optimizations. Along the way I ended
 * up creating a bug-free implementation but I'm honestly not sure what the original
 * bug was...
 */
export function part2(input: string) {
  // Split into pairs of files and empty blocks
  const pairs = input.match(/.{1,2}/g);

  let files = 0;
  const blocks = pairs!.reduce<number[]>((acc, pair, id) => {
    const [fileSize, emptyBlocks = "0"] = pair;
    const emptyBlocksLength = +emptyBlocks;
    files = id;
    return [
      ...acc,
      ...Array(+fileSize).fill(id),
      ...Array(emptyBlocksLength).fill(NaN),
    ];
  }, []);

  let prevFileStart = -1;
  // Technically we're skipping the first file, but that makes sense since it
  // can't move any further left
  while (files) {
    // We're working our way from the end to the start
    const fileEnd = blocks.lastIndexOf(files, prevFileStart);
    // Due to the disk map format, we know a file can't be bigger than 9 blocks
    const fileStart = blocks.indexOf(files, fileEnd - 9);
    prevFileStart = fileStart;
    const fileLength = fileEnd - fileStart + 1;

    let continuousEmptyBlocks = 0;
    for (let i = 0; i < fileEnd; i++) {
      if (!isNaN(blocks[i])) {
        continuousEmptyBlocks = 0;
        continue;
      }
      continuousEmptyBlocks++;
      if (continuousEmptyBlocks !== fileLength) continue;

      const distance = fileEnd - i;
      // Manually "swap" to improve performance
      for (let j = fileStart; j <= fileEnd; j++) {
        blocks[j] = NaN;
        blocks[j - distance] = files;
      }
      break;
    }
    files--;
  }

  // To see the "defragmented disk"
  //console.log(blocks.join("").replaceAll("NaN", "."));

  return blocks.reduce(
    (checksum, block, i) => (isNaN(block) ? checksum : checksum + block * i),
    0
  );
}
