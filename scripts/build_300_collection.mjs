import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = path.resolve("outputs/say-more-300-online-game");
const baseRows = JSON.parse(
  await fs.readFile("outputs/say-more-150-complete-collection/say_more_150_complete_collection.json", "utf8"),
).rows;
const couplesRows = JSON.parse(
  await fs.readFile("outputs/say-more-couples-edition/say_more_couples_edition_30_cards.json", "utf8"),
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

const pack = (setName, category, prefix, designTreatment, prompts) =>
  prompts.map(([prompt, mode, depth, rationale], index) => ({
    ID: `${prefix}-${String(index + 1).padStart(2, "0")}`,
    Set: setName,
    Category: category,
    "Card Type": "Expansion",
    Level: index < 10 ? "Level 1" : index < 20 ? "Level 2" : "Level 3",
    "Suggested Mode": mode,
    Depth: depth,
    Prompt: prompt,
    "Design Treatment": designTreatment,
    "Facilitator Note": depth === "High" ? "Best after trust has warmed up; passing is always allowed." : "Suitable for early playtesting.",
    Rationale: rationale,
  }));

const teams = pack("Teams Edition", "Teams Edition", "TEA", "Slate Teal / Cream", [
  ["What is one thing this team does really well?", "Teams", "Low", "Starts with shared strength."],
  ["What helps you do your best work?", "Teams", "Low", "Invites practical support."],
  ["What drains your energy faster than people realize?", "Teams", "Medium", "Builds empathy around capacity."],
  ["What kind of recognition feels meaningful to you?", "Teams", "Medium", "Improves appreciation rituals."],
  ["What is a work value you refuse to outgrow?", "Teams", "Medium", "Surfaces principles."],
  ["When do you feel most trusted at work?", "Teams", "Medium", "Names trust conditions."],
  ["What is a skill people on this team should ask you about?", "Teams", "Low", "Maps hidden expertise."],
  ["What is one meeting habit you would happily retire?", "Teams", "Low", "Useful and playful."],
  ["What does psychological safety look like in a normal week?", "Teams", "High", "Turns a concept into behavior."],
  ["What do you need from teammates when pressure is high?", "Teams", "High", "Supports stressful moments."],
  ["What is something you find hard to say in work settings?", "Teams", "High", "Invites brave communication."],
  ["What is one assumption people make about your working style?", "Teams", "Medium", "Clarifies collaboration."],
  ["How do you prefer to receive hard feedback?", "Teams", "High", "Improves repair and learning."],
  ["What is one decision this team should make more clearly?", "Teams", "Medium", "Focuses process improvement."],
  ["What is one thing we should stop rewarding by accident?", "Teams", "High", "Surfaces culture debt."],
  ["What is a sign you are close to burning out?", "Teams", "High", "Encourages prevention."],
  ["What is one problem we are solving better than we used to?", "Teams", "Medium", "Builds momentum."],
  ["What is a question this team avoids asking?", "Teams", "High", "Creates constructive tension."],
  ["Where do we overcomplicate things?", "Teams", "Medium", "Improves execution."],
  ["What would make handoffs between us smoother?", "Teams", "Low", "Practical collaboration card."],
  ["What is one small experiment this team should try?", "Teams", "Low", "Turns talk into action."],
  ["Who on this team helped you recently, and how?", "Teams", "Medium", "Creates visible appreciation."],
  ["What do you wish new people understood about this team?", "Teams", "Medium", "Useful onboarding insight."],
  ["What is a team ritual worth protecting?", "Teams", "Low", "Keeps positive culture alive."],
  ["If this team ran a cafe together, who would do what?", "Teams", "Low", "Playful role reflection."],
  ["What is one thing we could celebrate more often?", "Teams", "Low", "Lightens team culture."],
  ["What is one tension we can name without solving tonight?", "Teams", "High", "Allows safe acknowledgement."],
  ["What should we thank our future selves for fixing now?", "Teams", "Medium", "Forward-looking action."],
  ["What is one promise this team should make to itself?", "Teams", "High", "Strong closing prompt."],
  ["What would make this room feel more human?", "Teams", "Medium", "Mission-aligned workplace prompt."],
]);

const family = pack("Family Edition", "Family Edition", "FAM", "Sage / Clay", [
  ["What story from our family gets told the most?", "Family", "Low", "Easy shared memory."],
  ["What is one family tradition you hope continues?", "Family", "Low", "Names continuity."],
  ["What is one tradition you would gently redesign?", "Family", "Medium", "Invites change without attack."],
  ["Who in the family taught you something without realizing it?", "Family", "Medium", "Creates recognition."],
  ["What meal, smell, or place feels like family to you?", "Family", "Low", "Sensory and accessible."],
  ["What is something our family is good at surviving?", "Family", "Medium", "Builds resilience narrative."],
  ["What is something our family is still learning to talk about?", "Family", "High", "Names growth edge."],
  ["What did you need more of growing up?", "Family", "High", "Deep care prompt."],
  ["What did you receive growing up that still protects you?", "Family", "Medium", "Balances with gratitude."],
  ["What is one thing younger people here understand better than older people think?", "Family", "Medium", "Bridges generations."],
  ["What is one thing older people here understand better than younger people think?", "Family", "Medium", "Bridges generations."],
  ["What is a family phrase you can hear in someone's voice?", "Family", "Low", "Playful recognition."],
  ["What is something you want to ask across generations?", "Family", "Medium", "Encourages curiosity."],
  ["When do you feel most accepted by this family?", "Family", "High", "Names belonging."],
  ["When do you feel least understood by this family?", "Family", "High", "Names distance carefully."],
  ["What is one family role you are ready to loosen?", "Family", "High", "Supports growth."],
  ["What is one family role you are proud to carry?", "Family", "Medium", "Honors identity."],
  ["What is a memory with us that you hope no one forgets?", "Family", "Medium", "Shared memory card."],
  ["What apology would help families like ours grow?", "Family", "High", "Allows general framing for safety."],
  ["What does care look like to you when words are hard?", "Family", "High", "Practical love language."],
  ["What is something you wish we celebrated about each other?", "Family", "Medium", "Encourages appreciation."],
  ["What is something you want to learn from someone at this table?", "Family", "Low", "Direct curiosity."],
  ["What is one story you want future family members to know?", "Family", "Medium", "Legacy prompt."],
  ["What is a hard season our family came through?", "Family", "High", "Resilience and reflection."],
  ["What is one boundary that helps family feel healthier?", "Family", "High", "Healthy structure."],
  ["What does forgiveness mean in a family?", "Family", "High", "Big but broad."],
  ["What is one small way we could stay closer?", "Family", "Medium", "Actionable closeness."],
  ["What is a question you have never asked someone older than you?", "Family", "Medium", "Intergenerational bridge."],
  ["What is a question you have never asked someone younger than you?", "Family", "Medium", "Intergenerational bridge."],
  ["What should we make more room for in this family?", "Family", "High", "Closing growth question."],
]);

const community = pack("Community Edition", "Community Edition", "COM", "Warm Gold / Teal", [
  ["What makes a place feel welcoming to you?", "Community", "Low", "Starts with shared space."],
  ["What is one thing you wish more strangers knew about you?", "Community", "Medium", "Humanizes quickly."],
  ["What is a local place that makes you feel less alone?", "Community", "Low", "Maps connection spaces."],
  ["What is one small act of kindness you still remember?", "Community", "Medium", "Builds warmth."],
  ["What do people your age get misunderstood about?", "Community", "Medium", "Bridges age groups."],
  ["What do people from your background get misunderstood about?", "Community", "High", "Invites identity with care."],
  ["What is a community you found when you needed it?", "Community", "Medium", "Story of belonging."],
  ["What is a community you had to leave to grow?", "Community", "High", "Story of transition."],
  ["What is one thing that helps you approach someone new?", "Community", "Low", "Practical social bridge."],
  ["What is one thing that makes approaching people hard?", "Community", "Medium", "Normalizes social friction."],
  ["What should more public spaces make room for?", "Community", "Medium", "Civic imagination."],
  ["What is a conversation you wish happened more often in your community?", "Community", "High", "Mission-aligned depth."],
  ["What is one label that never tells the full story?", "Community", "High", "Counters assumptions."],
  ["What is something you learned from someone very different from you?", "Community", "Medium", "Bridging difference."],
  ["What does belonging feel like before anyone says a word?", "Community", "High", "Poetic and embodied."],
  ["What is one rule of friendship you think society forgot?", "Community", "Medium", "Cultural reflection."],
  ["What is a reason people seem disconnected right now?", "Community", "Medium", "Context for the mission."],
  ["What is a reason people are still trying?", "Community", "Medium", "Hopeful counterweight."],
  ["What is one topic that could bring strangers together?", "Community", "Low", "Event-friendly prompt."],
  ["What is one topic that divides people too quickly?", "Community", "Medium", "Names friction carefully."],
  ["What is something you would ask someone from another generation?", "Community", "Medium", "Age bridge."],
  ["What is something you wish another generation asked you?", "Community", "Medium", "Reciprocal age bridge."],
  ["What is one way technology helps you feel connected?", "Community", "Low", "Digital connection."],
  ["What is one way technology makes connection harder?", "Community", "Medium", "Digital tension."],
  ["What does a good neighbor do?", "Community", "Low", "Simple civic intimacy."],
  ["What is one thing people could do to make loneliness easier to name?", "Community", "High", "Direct mission prompt."],
  ["What is a public moment when you felt seen?", "Community", "Medium", "Story of recognition."],
  ["What is a public moment when you felt invisible?", "Community", "High", "Story of exclusion."],
  ["What is one invitation you wish existed?", "Community", "Medium", "Opportunity for product/community ideas."],
  ["What should we build for people who feel outside the circle?", "Community", "High", "Strong closing prompt."],
]);

const facilitator = pack("Facilitator Edition", "Facilitator Edition", "FAC", "Charcoal / Lavender Clay", [
  ["What level of depth feels right for this room today?", "Facilitator", "Low", "Sets consent and pace."],
  ["What would help everyone feel able to pass honestly?", "Facilitator", "Low", "Protects opt-out safety."],
  ["What is one agreement this group needs before we begin?", "Facilitator", "Low", "Creates norms."],
  ["What should we do if a card lands too heavily?", "Facilitator", "Medium", "Plans for intensity."],
  ["What does respectful listening look like here?", "Facilitator", "Low", "Clarifies behavior."],
  ["What is one way this group can avoid fixing each other?", "Facilitator", "Medium", "Supports non-clinical sharing."],
  ["What is one question we should not rush?", "Facilitator", "Medium", "Encourages pacing."],
  ["What is one sign the room needs a lighter card?", "Facilitator", "Medium", "Builds facilitator awareness."],
  ["What is one sign the room is ready to go deeper?", "Facilitator", "Medium", "Builds facilitator awareness."],
  ["What is one voice we have not heard enough from?", "Facilitator", "Medium", "Improves inclusion."],
  ["What pattern is showing up in our answers?", "Facilitator", "High", "Group reflection."],
  ["What feeling has been named more than once?", "Facilitator", "Medium", "Tracks shared themes."],
  ["What is one moment where the room softened?", "Facilitator", "Medium", "Notices connection."],
  ["What is one moment where the room pulled back?", "Facilitator", "High", "Notices protection."],
  ["What is one assumption we should set down for the next round?", "Facilitator", "High", "Encourages openness."],
  ["What is one answer that deserves a follow-up later?", "Facilitator", "Medium", "Captures future depth."],
  ["What is something this group is learning about trust?", "Facilitator", "High", "Meta-conversation."],
  ["What is something this group is learning about difference?", "Facilitator", "High", "Meta-conversation."],
  ["What is something this group is learning about belonging?", "Facilitator", "High", "Meta-conversation."],
  ["What has become easier to say since we started?", "Facilitator", "High", "Measures shift."],
  ["What still feels unsaid, even lightly?", "Facilitator", "High", "Invites closure without pressure."],
  ["What should be held privately after this round?", "Facilitator", "High", "Supports confidentiality."],
  ["What is one thing we can thank the group for?", "Facilitator", "Medium", "Creates appreciation."],
  ["What is one thing the group should not carry alone?", "Facilitator", "High", "Encourages support."],
  ["What would make the next conversation safer?", "Facilitator", "Medium", "Improves future sessions."],
  ["What would make the next conversation braver?", "Facilitator", "Medium", "Improves future sessions."],
  ["What is one takeaway you want to keep in motion?", "Facilitator", "Medium", "Turns insight into action."],
  ["What is one thing you are leaving with that you did not arrive with?", "Facilitator", "High", "Closing reflection."],
  ["What should the final word of this room be?", "Facilitator", "Medium", "Simple group close."],
  ["What do we want to remember about how this felt?", "Facilitator", "High", "Emotional closure."],
]);

const normalize = (row) => ({
  ID: row.ID,
  Set: row.Set ?? (row.Category === "Couples Edition" ? "Couples Edition" : "Base Deck"),
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

const allRows = [
  ...baseRows.map(normalize),
  ...couplesRows.map(normalize),
  ...teams,
  ...family,
  ...community,
  ...facilitator,
];

await fs.mkdir(root, { recursive: true });

const headers = Object.keys(allRows[0]);
const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csv = [headers.map(csvEscape).join(","), ...allRows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))].join("\n");
await fs.writeFile(path.join(root, "say_more_300_card_library.csv"), csv, "utf8");
await fs.writeFile(path.join(root, "say_more_300_card_library.json"), JSON.stringify({ rows: allRows }, null, 2), "utf8");

const countsBySet = allRows.reduce((acc, row) => {
  acc[row.Set] = (acc[row.Set] ?? 0) + 1;
  return acc;
}, {});
const countsByCategory = allRows.reduce((acc, row) => {
  acc[row.Category] = (acc[row.Category] ?? 0) + 1;
  return acc;
}, {});

const workbook = Workbook.create();
const overview = workbook.worksheets.add("Overview");
overview.getRange("A1:D6").values = [
  ["Say More 300-Card Online Game Library", "", "", ""],
  ["Total Cards", allRows.length, "", ""],
  ["Base Deck", 150, "Core game", "Icebreaker, Connection, Reflection, Challenge, Wildcards, Prompt/Rules"],
  ["Expansion Cards", 150, "Additional contexts", "Couples, Teams, Family, Community, Facilitator"],
  ["Primary Use", "Browser game, playtesting, print prep, GitHub/Vercel static hosting", "", ""],
  ["Safety Principle", "Pass, pause, or choose a gentler card at any time.", "", ""],
];

const setSheet = workbook.worksheets.add("Counts by Set");
setSheet.getRange("A1:B1").values = [["Set", "Count"]];
setSheet.getRange(a1(2, 1, Object.keys(countsBySet).length, 2)).values = Object.entries(countsBySet);

const categorySheet = workbook.worksheets.add("Counts by Category");
categorySheet.getRange("A1:B1").values = [["Category", "Count"]];
categorySheet.getRange(a1(2, 1, Object.keys(countsByCategory).length, 2)).values = Object.entries(countsByCategory);

const cardSheet = workbook.worksheets.add("Cards");
cardSheet.getRange(a1(1, 1, 1, headers.length)).values = [headers];
cardSheet.getRange(a1(2, 1, allRows.length, headers.length)).values = allRows.map((row) => headers.map((h) => row[h]));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(path.join(root, "say_more_300_card_library.xlsx"));

console.log(JSON.stringify({ cards: allRows.length, countsBySet, countsByCategory, root }, null, 2));
