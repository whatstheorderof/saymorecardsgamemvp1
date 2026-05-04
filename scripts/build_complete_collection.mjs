import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const sourcePath = path.resolve("outputs/say-more-120-card-set/say_more_120_card_master.json");
const baseOutDir = path.resolve("outputs/say-more-150-complete-collection");
const expansionOutDir = path.resolve("outputs/say-more-couples-edition");

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

const sourceRows = JSON.parse(await fs.readFile(sourcePath, "utf8")).rows;

const wildcards = [
  ["Everyone answers this card in one sentence.", "Groups", "Low", "Quickly includes the whole table."],
  ["Swap seats with someone you know least about.", "Groups", "Low", "Shifts group dynamics gently."],
  ["Ask another player to answer your current card.", "Groups", "Medium", "Creates perspective and choice."],
  ["Pick one person to ask you any question from the deck.", "Groups", "Medium", "Adds player agency and surprise."],
  ["Trade your current card with the person to your left.", "Groups", "Low", "Keeps the room playful."],
  ["Pause for ten seconds before anyone answers.", "All", "Low", "Slows the pace and deepens listening."],
  ["Choose the next category for someone else.", "Groups", "Medium", "Adds interaction while keeping structure."],
  ["Answer the next card in exactly one sentence.", "Speed", "Low", "Creates a light constraint."],
  ["Skip your answer and ask someone a follow-up instead.", "All", "Medium", "Rewards curiosity over performance."],
  ["Return to Icebreaker for one round.", "All", "Low", "Lets the group soften the intensity."],
  ["Pair up for the next answer, then share one thing you heard.", "Groups", "Medium", "Creates smaller, safer exchanges."],
  ["Everyone names one feeling in the room.", "Groups", "Medium", "Builds shared emotional awareness."],
  ["The person to your right asks one follow-up.", "Groups", "Medium", "Makes deeper listening automatic."],
  ["Draw two cards and choose the one you want to answer.", "All", "Low", "Protects consent and choice."],
  ["The group chooses: light, honest, or deep.", "Groups", "Medium", "Lets the table tune the level together."],
  ["Pass this card to someone who has not spoken recently.", "Groups", "Medium", "Opens space without forcing disclosure."],
  ["Take a breath, then answer slower than usual.", "All", "Low", "Creates presence and pacing."],
  ["After your answer, ask: what did you hear me say?", "Deep Dive", "High", "Encourages active listening."],
  ["Everyone says one word they are taking from this round.", "Groups", "Low", "Creates a simple transition."],
  ["Close this round by naming one thing you appreciate.", "Groups", "Medium", "Ends with warmth and recognition."],
];

const prompts = [
  ["Start with Icebreaker cards for one round.", "Rules", "Low", "Guides gentle entry."],
  ["Move deeper only when everyone agrees.", "Rules", "Low", "Sets consent as a game norm."],
  ["Anyone can pass, pause, or ask for a gentler card.", "Rules", "Low", "Protects safety and autonomy."],
  ["Ask one follow-up before drawing again.", "Rules", "Low", "Encourages listening."],
  ["End with each player sharing one takeaway.", "Rules", "Low", "Creates closure."],
  ["Choose Strangers, Deep Dive, Speed, or Paired Mode.", "Rules", "Low", "Frames modular play."],
  ["Before playing, choose a depth level: light, honest, or deep.", "Rules", "Low", "Helps the group calibrate."],
  ["What is shared here stays here, unless someone says otherwise.", "Rules", "Low", "Creates trust around privacy."],
  ["Use a timer when the group needs pace; ignore it when the story needs room.", "Rules", "Low", "Supports different contexts."],
  ["After the final card, ask: what changed between us?", "Rules", "Medium", "Connects gameplay to the mission."],
];

const couples = [
  ["What does home feel like with me?", "Love & Affection", "Medium", "Centers warmth and belonging."],
  ["What do I do that makes you feel most loved?", "Love & Affection", "Medium", "Makes love languages concrete."],
  ["What is one small habit of mine you secretly appreciate?", "Love & Affection", "Low", "Invites noticing."],
  ["When do you feel closest to me?", "Love & Affection", "Medium", "Identifies closeness cues."],
  ["What is a compliment from me that would land right now?", "Love & Affection", "Medium", "Creates immediate repair or affection."],
  ["What is something about us that still feels tender in a good way?", "Love & Affection", "High", "Names softness in the relationship."],
  ["What is one ordinary moment with me you want more of?", "Love & Affection", "Medium", "Turns intimacy into small actions."],
  ["How do you know I am really listening?", "Love & Affection", "Medium", "Builds relational awareness."],
  ["What conflict pattern are we slowly outgrowing?", "Conflict & Growth", "High", "Frames conflict as progress."],
  ["What do you need from me when we disagree?", "Conflict & Growth", "High", "Practical conflict support."],
  ["What is a repair attempt from me that works?", "Conflict & Growth", "Medium", "Builds a shared repair language."],
  ["What do you wish I understood about your stress?", "Conflict & Growth", "High", "Invites empathy around pressure."],
  ["What topic do we avoid, and what would make it safer?", "Conflict & Growth", "High", "Names avoidance with consent."],
  ["What is one apology you still remember from us?", "Conflict & Growth", "High", "Explores repair history."],
  ["What boundary would help us love each other better?", "Conflict & Growth", "High", "Reframes boundaries as care."],
  ["When do you feel alone even when we are together?", "Conflict & Growth", "High", "Directly addresses loneliness inside closeness."],
  ["What dream do you want us to protect together?", "Dreams & Desires", "Medium", "Future-facing intimacy."],
  ["What kind of life are we quietly building?", "Dreams & Desires", "Medium", "Creates shared narrative."],
  ["What is one adventure you want with me, big or small?", "Dreams & Desires", "Low", "Light future planning."],
  ["What part of your future do you want me to understand better?", "Dreams & Desires", "High", "Supports individual identity."],
  ["What are you afraid to want too much?", "Dreams & Desires", "High", "Deep desire and vulnerability."],
  ["What would make the next year feel meaningful for us?", "Dreams & Desires", "Medium", "Converts vision into time horizon."],
  ["What do you hope we never stop doing?", "Dreams & Desires", "Medium", "Protects rituals."],
  ["What would a braver version of us choose?", "Dreams & Desires", "High", "Bold decision prompt."],
  ["What is a memory of us that changed how you saw me?", "Shared Memories", "High", "Story and perception."],
  ["What is a small moment from our beginning you still keep?", "Shared Memories", "Medium", "Nostalgic and tender."],
  ["When did we surprise ourselves as a pair?", "Shared Memories", "Medium", "Builds shared pride."],
  ["What is a hard season we handled better than we knew?", "Shared Memories", "High", "Resilience reflection."],
  ["What photo of us deserves a longer story?", "Shared Memories", "Low", "Accessible memory cue."],
  ["What should we thank our past selves for?", "Shared Memories", "Medium", "Closes with gratitude and continuity."],
];

const addRows = (items, category, prefix, cardType, designTreatment) =>
  items.map(([prompt, mode, depth, rationale], index) => ({
    ID: `${prefix}-${String(index + 1).padStart(2, "0")}`,
    Category: category,
    "Card Type": cardType,
    Level: index < 10 ? "Level 1" : index < 20 ? "Level 2" : "Level 3",
    "Suggested Mode": mode,
    Depth: depth,
    Prompt: prompt,
    "Design Treatment": designTreatment,
    "Facilitator Note": depth === "High" ? "Best after trust has warmed up; passing is always allowed." : "Suitable for early playtesting.",
    Rationale: rationale,
  }));

const baseRows = [
  ...sourceRows,
  ...addRows(wildcards, "Wildcard", "WIL", "Wildcard", "Charcoal / Cream"),
  ...addRows(prompts, "Prompt / Rules", "RUL", "Prompt", "Soft Cream / Charcoal"),
];

const expansionRows = addRows(couples, "Couples Edition", "COU", "Expansion", "Rose Clay / Deep Teal");

const writeCollection = async ({ outDir, filenameBase, title, rows }) => {
  await fs.mkdir(outDir, { recursive: true });
  const headers = Object.keys(rows[0]);
  const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [headers.map(csvEscape).join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))].join("\n");
  await fs.writeFile(path.join(outDir, `${filenameBase}.csv`), csv, "utf8");
  await fs.writeFile(path.join(outDir, `${filenameBase}.json`), JSON.stringify({ rows }, null, 2), "utf8");

  const workbook = Workbook.create();
  const overview = workbook.worksheets.add("Overview");
  const counts = rows.reduce((acc, row) => {
    acc[row.Category] = (acc[row.Category] ?? 0) + 1;
    return acc;
  }, {});
  const summary = [
    [title, "", "", ""],
    ["Total Cards", rows.length, "", ""],
    ["Categories", Object.keys(counts).length, "", ""],
    ["Use", "Playtesting, print prep, Canva layout, manufacturing review", "", ""],
  ];
  overview.getRange("A1:D4").values = summary;
  const countSheet = workbook.worksheets.add("Category Counts");
  countSheet.getRange("A1:B1").values = [["Category", "Count"]];
  countSheet.getRange(a1(2, 1, Object.keys(counts).length, 2)).values = Object.entries(counts);

  const cardsSheet = workbook.worksheets.add("Cards");
  cardsSheet.getRange(a1(1, 1, 1, headers.length)).values = [headers];
  cardsSheet.getRange(a1(2, 1, rows.length, headers.length)).values = rows.map((row) => headers.map((h) => row[h]));
  const output = await SpreadsheetFile.exportXlsx(workbook);
  await output.save(path.join(outDir, `${filenameBase}.xlsx`));
};

await writeCollection({
  outDir: baseOutDir,
  filenameBase: "say_more_150_complete_collection",
  title: "Say More 150-Card Complete Base Collection",
  rows: baseRows,
});

await writeCollection({
  outDir: expansionOutDir,
  filenameBase: "say_more_couples_edition_30_cards",
  title: "Say More Couples Edition 30-Card Expansion",
  rows: expansionRows,
});

console.log(JSON.stringify({
  base: {
    outDir: baseOutDir,
    cards: baseRows.length,
    categoryCounts: baseRows.reduce((acc, row) => {
      acc[row.Category] = (acc[row.Category] ?? 0) + 1;
      return acc;
    }, {}),
  },
  expansion: {
    outDir: expansionOutDir,
    cards: expansionRows.length,
  },
}, null, 2));
