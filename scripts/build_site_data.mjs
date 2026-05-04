import fs from "node:fs/promises";
import path from "node:path";

const source = JSON.parse(
  await fs.readFile("outputs/say-more-1050-online-game/say_more_1050_card_library.json", "utf8"),
).rows;

const cards = source.map((row) => ({
  id: row.ID,
  set: row.Set,
  category: row.Category,
  type: row["Card Type"],
  level: row.Level,
  mode: row["Suggested Mode"],
  depth: row.Depth,
  prompt: row.Prompt,
  note: row["Facilitator Note"],
}));

const bySet = cards.reduce((acc, card) => {
  acc[card.set] = (acc[card.set] ?? 0) + 1;
  return acc;
}, {});

const byCategory = cards.reduce((acc, card) => {
  acc[card.category] = (acc[card.category] ?? 0) + 1;
  return acc;
}, {});

await fs.mkdir("site", { recursive: true });
await fs.writeFile(
  path.join("site", "cards.js"),
  `window.SAY_MORE_CARDS = ${JSON.stringify(cards, null, 2)};\nwindow.SAY_MORE_COUNTS = ${JSON.stringify({ bySet, byCategory }, null, 2)};\n`,
  "utf8",
);

console.log(JSON.stringify({ cards: cards.length, bySet, byCategory }, null, 2));
