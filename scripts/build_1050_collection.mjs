import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = path.resolve("outputs/say-more-1050-online-game");
const sourceRows = JSON.parse(
  await fs.readFile("outputs/say-more-1000-online-game/say_more_1000_card_library.json", "utf8"),
).rows;

const colName = (index) => {
  let name = "";
  let n = index;
  while (n > 0) {
    const rem = (n - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
};

const a1 = (row, col, rowCount = 1, colCount = 1) => {
  const start = `${colName(col)}${row}`;
  const end = `${colName(col + colCount - 1)}${row + rowCount - 1}`;
  return start === end ? start : `${start}:${end}`;
};

const healingPrompts = [
  "What part of you is asking for more gentleness?",
  "What is something you survived that still deserves tenderness?",
  "What does safety feel like when it is real?",
  "What is one thing your nervous system seems to know before you do?",
  "What is a small sign that you are healing?",
  "What is a small sign that you need more care?",
  "What are you learning not to blame yourself for?",
  "What are you learning to hold with more compassion?",
  "What is one wound you can name without explaining?",
  "What is one strength that came from a hard season?",
  "What do you wish someone had said to you sooner?",
  "What do you wish you could say to your younger self without rushing them?",
  "What is something you are allowed to grieve, even if it was complicated?",
  "What is something you are allowed to celebrate, even if healing is unfinished?",
  "What does rest ask of you right now?",
  "What does your body do when it finally feels safe?",
  "What is one boundary that protects your peace?",
  "What is one boundary you are still practicing?",
  "What kind of support feels possible to receive?",
  "What kind of support still feels hard to trust?",
  "What is a pattern you are trying to interrupt gently?",
  "What is a pattern you are proud of noticing sooner?",
  "What is one thing you no longer want to carry alone?",
  "What is one thing you are not ready to talk about, and what helps you honor that?",
  "What is a memory that needs more kindness around it?",
  "What is a memory that reminds you you made it through?",
  "What is one apology you are learning not to wait for?",
  "What is one apology you might owe yourself?",
  "What is one part of healing that surprised you?",
  "What is one part of healing that feels unfair?",
  "What helps you return to the present?",
  "What helps you feel connected to your body?",
  "What helps you feel connected to other people?",
  "What makes connection feel risky?",
  "What makes connection feel worth trying again?",
  "What does forgiveness mean when it does not erase what happened?",
  "What does acceptance mean when you still wish things were different?",
  "What is one way you are becoming easier to love by yourself?",
  "What is one way you are learning to ask for love from others?",
  "What is a belief about yourself that pain taught you?",
  "What is a belief about yourself that healing is teaching you?",
  "What is one thing you want to release from your story?",
  "What is one thing you want to reclaim from your story?",
  "What would a gentler next step look like?",
  "What would a braver next step look like?",
  "What would make this conversation feel safe enough?",
  "What is one thing you want witnessed, not fixed?",
  "What is one thing you want to remember on harder days?",
  "What is one thing you want to believe about the life ahead of you?",
  "What should healing make more room for in you?",
];

const healingRows = healingPrompts.map((prompt, index) => ({
  ID: `HEA-${String(index + 1).padStart(2, "0")}`,
  Set: "Healing Edition",
  Category: "Healing Edition",
  "Card Type": "Question",
  Level: index < 16 ? "Level 1" : index < 34 ? "Level 2" : "Level 3",
  "Suggested Mode": "Healing Edition",
  Depth: index < 16 ? "Low" : index < 34 ? "Medium" : "High",
  Prompt: prompt,
  "Design Treatment": "Mist Lavender / Warm Cream",
  "Facilitator Note": index < 34 ? "Suitable for gentle reflection; passing is always allowed." : "Best after trust has warmed up; passing is always allowed.",
  Rationale: "Supports gentle reflection, repair, and self-compassion without presenting as therapy.",
}));

const normalize = (row) => ({
  ID: row.ID,
  Set: row.Set,
  Category: row.Category,
  "Card Type": row["Card Type"],
  Level: row.Level,
  "Suggested Mode": row["Suggested Mode"],
  Depth: row.Depth,
  Prompt: row.Prompt,
  "Design Treatment": row["Design Treatment"],
  "Facilitator Note": row["Facilitator Note"],
  Rationale: row.Rationale,
});

const rows = [...sourceRows.map(normalize), ...healingRows];
await fs.mkdir(root, { recursive: true });

const headers = Object.keys(rows[0]);
const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csv = [headers.map(csvEscape).join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))].join("\n");
await fs.writeFile(path.join(root, "say_more_1050_card_library.csv"), csv, "utf8");
await fs.writeFile(path.join(root, "say_more_1050_card_library.json"), JSON.stringify({ rows }, null, 2), "utf8");

const countsBySet = rows.reduce((acc, row) => {
  acc[row.Set] = (acc[row.Set] ?? 0) + 1;
  return acc;
}, {});
const countsByCategory = rows.reduce((acc, row) => {
  acc[row.Category] = (acc[row.Category] ?? 0) + 1;
  return acc;
}, {});

const workbook = Workbook.create();
const overview = workbook.worksheets.add("Overview");
overview.getRange("A1:D7").values = [
  ["Say More 1050-Card Online Game Library", "", "", ""],
  ["Total Cards", rows.length, "", ""],
  ["Previous Library", 1000, "Full 20-set library", ""],
  ["New Pack", 50, "Healing Edition", ""],
  ["Product Direction", "Full online card-game library", "", ""],
  ["Safety Principle", "Pass, pause, or choose a gentler card at any time.", "", ""],
  ["Use", "Browser game, playtesting, print/source card production", "", ""],
];

const setSheet = workbook.worksheets.add("Counts by Set");
setSheet.getRange("A1:B1").values = [["Set", "Count"]];
setSheet.getRange(a1(2, 1, Object.keys(countsBySet).length, 2)).values = Object.entries(countsBySet);

const categorySheet = workbook.worksheets.add("Counts by Category");
categorySheet.getRange("A1:B1").values = [["Category", "Count"]];
categorySheet.getRange(a1(2, 1, Object.keys(countsByCategory).length, 2)).values = Object.entries(countsByCategory);

const cardSheet = workbook.worksheets.add("Cards");
cardSheet.getRange(a1(1, 1, 1, headers.length)).values = [headers];
cardSheet.getRange(a1(2, 1, rows.length, headers.length)).values = rows.map((row) => headers.map((h) => row[h]));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(path.join(root, "say_more_1050_card_library.xlsx"));

console.log(JSON.stringify({ cards: rows.length, healing: healingRows.length, root }, null, 2));
