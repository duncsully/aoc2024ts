import { Ask } from "@sallai/ask";
import { writeText } from "https://deno.land/x/copy_paste/mod.ts";

if (import.meta.main) {
  const ask = new Ask();

  const dayChoices = Array.from({ length: 11 }, (_, i) => ({
    value: `day${String(i + 1).padStart(2, "0")}`,
    message: `Day ${i + 1}`,
  }));

  const answers = await ask.prompt([
    {
      name: "day",
      type: "select",
      message: "Which day would you like to run?",
      choices: dayChoices,
      default: dayChoices.at(-1)!.value,
    },
    {
      name: "part",
      type: "select",
      message: "Which part would you like to run?",
      choices: [
        { value: "part1", message: "Part 1" },
        { value: "part2", message: "Part 2" },
      ],
    },
    {
      name: "input",
      type: "input",
      message: "Where is the input file?",
      default: "./input.txt",
    },
  ]);

  const { day, part, input } = answers;
  const inputText = await Deno.readTextFile(input);

  const solver = await import(`./days/${day}.ts`);

  const start = performance.now();
  const result = await solver[part](inputText);
  const end = performance.now();

  console.log("The answer is:");
  console.log(result);
  console.log(`Took ${end - start}ms`);

  // TODO: This seems to get skipped when passing --allow-read
  const { copy } = await ask.confirm({
    message: "Would you like to copy the answer to the clipboard?",
    name: "copy",
  });
  if (copy) {
    await writeText(result);
    console.log("Copied to clipboard!");
  }

  Deno.exit();
}
