import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = path.resolve("outputs/say-more-500-online-game");
const sourceRows = JSON.parse(
  await fs.readFile("outputs/say-more-300-online-game/say_more_300_card_library.json", "utf8"),
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

const makePack = (setName, category, prefix, designTreatment, prompts) =>
  prompts.map(([prompt, depth, rationale], index) => ({
    ID: `${prefix}-${String(index + 1).padStart(2, "0")}`,
    Set: setName,
    Category: category,
    "Card Type": "Question",
    Level: index < 17 ? "Level 1" : index < 34 ? "Level 2" : "Level 3",
    "Suggested Mode": setName,
    Depth: depth,
    Prompt: prompt,
    "Design Treatment": designTreatment,
    "Facilitator Note": depth === "High" ? "Best after trust has warmed up; passing is always allowed." : "Suitable for early playtesting.",
    Rationale: rationale,
  }));

const firstDate = makePack("First Date", "First Date", "FD", "Blush / Cream", [
  ["What is a small thing that made you smile this week?", "Low", "Opens warmly without pressure."],
  ["What is your ideal low-pressure first date?", "Low", "Names comfort early."],
  ["What is a food you could talk about for ten minutes?", "Low", "Easy sensory small talk."],
  ["What does a good weekend look like for you lately?", "Low", "Reveals lifestyle."],
  ["What is a place in the city you think more people should know?", "Low", "Local and conversational."],
  ["What is your current comfort show, song, or meal?", "Low", "Accessible personal taste."],
  ["What is something you are learning just for fun?", "Low", "Highlights curiosity."],
  ["What is your favorite way to spend a slow morning?", "Low", "Reveals rhythm and values."],
  ["What is a tiny hill you will happily defend?", "Low", "Playful disagreement."],
  ["What is one thing your friends rely on you for?", "Medium", "Gentle character prompt."],
  ["What is a book, film, or album that stayed with you?", "Medium", "Invites taste and memory."],
  ["What is something you have changed your mind about recently?", "Medium", "Shows openness."],
  ["What kind of conversations make you forget your phone?", "Medium", "Directly names connection style."],
  ["What is one thing you are looking forward to?", "Low", "Future-oriented and light."],
  ["What is a hobby you respect but have not tried yet?", "Low", "Playful possibility."],
  ["What is your favorite kind of weather to be outside in?", "Low", "Simple sensory opener."],
  ["What is an ordinary thing you find oddly romantic?", "Medium", "Soft romantic cue."],
  ["What is your favorite question to ask someone new?", "Medium", "Meta-conversation."],
  ["What is one thing you notice quickly about people?", "Medium", "Reveals perception."],
  ["What makes you feel relaxed around someone new?", "Medium", "Names safety cues."],
  ["What is a small sign that a date is going well?", "Low", "Light dating-specific prompt."],
  ["What is a green flag you appreciate more now than before?", "Medium", "Values without intensity."],
  ["What is a first impression people often get right about you?", "Medium", "Self-awareness."],
  ["What is a first impression people often get wrong about you?", "Medium", "Adds nuance."],
  ["What is a place you would take someone to show your taste?", "Low", "Grounds personality in place."],
  ["What is something you care about that you rarely get to explain?", "Medium", "Invites depth by choice."],
  ["What is a song that would be on the soundtrack of your week?", "Low", "Playful and current."],
  ["What is a small luxury you believe in?", "Low", "Reveals preferences and values."],
  ["What is one thing that makes you feel more like yourself?", "Medium", "Gentle identity prompt."],
  ["What is a question you wish dating apps asked?", "Medium", "Dating context with humor."],
  ["What is something you are surprisingly particular about?", "Low", "Small quirk prompt."],
  ["What is a story your friends love telling about you?", "Medium", "Invites personality through story."],
  ["What is something you hope your next chapter includes?", "Medium", "Future without pressure."],
  ["What is your favorite way to celebrate something small?", "Low", "Joy and rituals."],
  ["What is one value you want your life to make obvious?", "High", "Deeper but still broad."],
  ["What is something you are trying to make more room for?", "Medium", "Current priorities."],
  ["What does being easy to be around mean to you?", "Medium", "Relational preference."],
  ["What is a compliment that always lands for you?", "Medium", "Affection and recognition."],
  ["What is a small act of care you notice immediately?", "Medium", "Green flag behavior."],
  ["What does good chemistry feel like to you?", "Medium", "Dating-specific reflection."],
  ["What is a dating rule you ignore?", "Low", "Playful dating philosophy."],
  ["What is a dating rule you secretly agree with?", "Low", "Playful dating philosophy."],
  ["What is one thing you want someone to be curious about?", "Medium", "Invites being seen."],
  ["What is one thing that makes conversation feel natural?", "Low", "Useful first-date check."],
  ["What is the best kind of laugh on a date?", "Low", "Light and embodied."],
  ["What is a story that explains your sense of humor?", "Medium", "Playful self-disclosure."],
  ["What is a kind of kindness you never overlook?", "Medium", "Values in action."],
  ["What is one thing you hope people feel after meeting you?", "Medium", "Identity and impact."],
  ["What would make tonight feel worth remembering?", "Medium", "Soft closing prompt."],
  ["What is one question you want to ask before we leave?", "Medium", "Creates choice at the end."],
]);

const secondDate = makePack("Second Date", "Second Date", "SD", "Rose / Teal", [
  ["What felt easy about our first conversation?", "Medium", "Connects to prior date."],
  ["What are you more curious about after meeting me?", "Medium", "Invites direct interest."],
  ["What is something you usually reveal slowly?", "High", "Names pacing and trust."],
  ["What does emotional availability mean to you in practice?", "High", "Deep dating alignment."],
  ["What is one pattern you are trying not to repeat?", "High", "Growth-oriented."],
  ["What helps you open up when you like someone?", "Medium", "Practical intimacy."],
  ["What makes you pull back, even if things are going well?", "High", "Attachment-aware without labels."],
  ["What is something you want to be understood for?", "High", "Core being-seen prompt."],
  ["What kind of affection feels natural to you?", "Medium", "Love language without jargon."],
  ["What kind of attention feels overwhelming?", "Medium", "Boundaries and pacing."],
  ["What is one thing you are proud of healing?", "High", "Vulnerability with strength."],
  ["What is something you are still learning in relationships?", "High", "Growth and humility."],
  ["What do you need more of when life gets heavy?", "High", "Support style."],
  ["What is a relationship green flag you learned late?", "Medium", "Wisdom from experience."],
  ["What is a red flag you no longer negotiate with?", "High", "Boundaries."],
  ["What does consistency look like to you?", "Medium", "Practical alignment."],
  ["What makes someone feel trustworthy to you?", "Medium", "Trust cues."],
  ["What is something you wish people did not assume about your dating life?", "Medium", "Counters assumptions."],
  ["What is your relationship with alone time?", "Medium", "Compatibility insight."],
  ["What is your relationship with conflict?", "High", "Important dating topic."],
  ["What do you want to feel more of in your next relationship?", "High", "Desire and values."],
  ["What do you want to feel less of in your next relationship?", "High", "Boundaries and contrast."],
  ["What is something you are afraid people will misunderstand about you?", "High", "Tender self-disclosure."],
  ["When do you feel most attractive, beyond appearance?", "Medium", "Confidence and identity."],
  ["What kind of reassurance actually helps you?", "High", "Practical care."],
  ["What is a meaningful compliment you still remember?", "Medium", "Affection and memory."],
  ["How do you know when you are starting to care?", "High", "Emotional awareness."],
  ["How do you want someone to handle your bad days?", "High", "Care instructions."],
  ["What is something dating has taught you about yourself?", "High", "Self-insight."],
  ["What does effort look like without feeling performative?", "Medium", "Dating behavior alignment."],
  ["What is something you want to build slowly?", "Medium", "Pacing and intention."],
  ["What is a promise you make to yourself when dating?", "Medium", "Self-respect."],
  ["What is something you are done pretending is fine?", "High", "Honest relationship talk."],
  ["What kind of future do you think about quietly?", "High", "Future orientation."],
  ["What do you want your love life to protect in you?", "High", "Deep values."],
  ["What is one thing you are not ready to rush?", "Medium", "Pacing."],
  ["What is one thing you do not want to keep vague forever?", "High", "Clarity."],
  ["What should someone know before getting close to you?", "High", "Consent and self-knowledge."],
  ["What is something you find hard to ask for directly?", "High", "Needs and vulnerability."],
  ["What kind of honesty feels caring to you?", "Medium", "Communication style."],
  ["What is one quality you are trying to practice more?", "Medium", "Growth."],
  ["What is one thing you admire in how I show up so far?", "Medium", "Direct appreciation."],
  ["What do you want to ask but are editing yourself around?", "High", "Encourages honesty."],
  ["What would make this feel less like performing?", "Medium", "Authenticity."],
  ["What would make this feel more real?", "High", "Depth and clarity."],
  ["What is one story that explains how you love people?", "High", "Powerful narrative."],
  ["What do you hope someone notices when they pay attention?", "High", "Being seen."],
  ["What is one thing you want to be careful with between us?", "High", "Tender pacing."],
  ["What would make a third date feel exciting instead of automatic?", "Medium", "Forward momentum."],
  ["What should we talk about next time if there is a next time?", "Medium", "Closing and continuity."],
]);

const thirdDate = makePack("Third Date", "Third Date", "TD", "Deep Coral / Charcoal", [
  ["What are you hoping this could become, honestly?", "High", "Direct relationship clarity."],
  ["What pace feels right to you from here?", "High", "Consent and pacing."],
  ["What would make you feel chosen without feeling rushed?", "High", "Security and autonomy."],
  ["What do you need to know before you invest emotionally?", "High", "Intentional dating."],
  ["What does commitment mean before labels enter the room?", "High", "Defines values."],
  ["What are you still unsure about, if anything?", "High", "Allows honesty."],
  ["What feels promising between us?", "Medium", "Names potential."],
  ["What feels unknown between us?", "Medium", "Names uncertainty."],
  ["What kind of communication would help this grow well?", "High", "Practical alignment."],
  ["What does respect look like when we disagree?", "High", "Conflict foundation."],
  ["What is a relationship need you used to minimize?", "High", "Growth and self-respect."],
  ["What is a need you are learning to name sooner?", "High", "Healthy honesty."],
  ["What is something you will not abandon yourself for again?", "High", "Boundaries."],
  ["What does emotional safety look like with someone you are dating?", "High", "Core relationship topic."],
  ["What is a boundary that helps you stay open?", "High", "Boundaries as care."],
  ["What would make dating you easier to understand?", "Medium", "Self-awareness."],
  ["What would make dating me easier to understand?", "Medium", "Direct curiosity."],
  ["How do you want us to handle mixed signals?", "High", "Clarity and respect."],
  ["What does exclusivity mean to you emotionally, not just technically?", "High", "Honest relationship talk."],
  ["What do you want to keep spacious, even if this gets closer?", "High", "Autonomy and intimacy."],
  ["What should never feel like a guessing game?", "High", "Communication clarity."],
  ["What does repair look like after a misunderstanding?", "High", "Conflict repair."],
  ["What would help you bring up something difficult?", "High", "Safety and skill."],
  ["What is one way you protect yourself that can confuse people?", "High", "Attachment behavior with agency."],
  ["What is one way you show care that people sometimes miss?", "Medium", "Love expression."],
  ["What does being seen by me bring up for you?", "High", "Direct tenderness."],
  ["What do you want me to be careful with?", "High", "Consent and tenderness."],
  ["What do you want me to be brave enough to ask?", "High", "Invites deeper pursuit."],
  ["What is one thing we should not avoid just because it is early?", "High", "Important early clarity."],
  ["What is one thing we should not force just because it is exciting?", "High", "Pacing and judgment."],
  ["What would make this connection feel mutual?", "High", "Reciprocity."],
  ["What would make this connection feel uneven?", "High", "Naming imbalance."],
  ["How do you know when you are emotionally overextending?", "High", "Self-protection."],
  ["What do you hope I understand about your past without judging it?", "High", "Compassion and context."],
  ["What do you want your next relationship to do differently?", "High", "Future relationship vision."],
  ["What does trust need from us in the next few weeks?", "High", "Turns depth into action."],
  ["What does desire need from us in the next few weeks?", "High", "Romantic honesty."],
  ["What does friendship need from us in the next few weeks?", "Medium", "Grounding romance in friendship."],
  ["What does independence need from us in the next few weeks?", "High", "Balance."],
  ["What would be a healthy next step?", "Medium", "Practical close."],
  ["What would be an unhealthy next step?", "High", "Names caution."],
  ["What are you enjoying that you do not want to overthink?", "Medium", "Keeps lightness alive."],
  ["What are you overthinking that you want to say plainly?", "High", "Direct communication."],
  ["What is one truth you want to offer without needing an answer tonight?", "High", "Gentle vulnerability."],
  ["What is one question you want answered before this goes further?", "High", "Clarity."],
  ["What does a good beginning feel like to you?", "Medium", "Defines early connection."],
  ["What does a bad beginning teach you to notice?", "Medium", "Wisdom from experience."],
  ["What is one thing you would like us to try together?", "Medium", "Future action."],
  ["What would make you want to keep choosing this?", "High", "Clear desire."],
  ["What should we be honest about before we leave?", "High", "Strong closing prompt."],
]);

const friendship = makePack("Friendship Edition", "Friendship Edition", "FRI", "Sky / Clay", [
  ["What kind of friend are you when life gets busy?", "Medium", "Friendship self-awareness."],
  ["What kind of friend do you need when life gets busy?", "Medium", "Names support."],
  ["What makes a friendship feel easy to return to?", "Low", "Accessible friendship reflection."],
  ["What is one friendship you are grateful for right now?", "Medium", "Starts with gratitude."],
  ["What is one friendship that shaped who you are?", "High", "Deep story prompt."],
  ["What is something friends often misunderstand about your silence?", "High", "Care and communication."],
  ["What does loyalty mean to you in friendship?", "High", "Values prompt."],
  ["What does low-maintenance friendship mean to you?", "Medium", "Modern friendship rhythm."],
  ["What is a small way a friend can make you feel remembered?", "Medium", "Concrete care."],
  ["What is a friendship green flag?", "Low", "Light values."],
  ["What is a friendship red flag you notice sooner now?", "Medium", "Boundaries."],
  ["What is a friendship boundary you respect more with age?", "High", "Healthy growth."],
  ["What is something you want to get better at as a friend?", "Medium", "Growth without shame."],
  ["What is something you wish your friends asked about more?", "High", "Being seen."],
  ["What makes you feel included without being put on the spot?", "Medium", "Group care."],
  ["What makes you feel left out, even if no one means harm?", "High", "Direct loneliness prompt."],
  ["What is a friend memory that still makes you laugh?", "Low", "Playful shared story."],
  ["What is a friend memory that still makes you emotional?", "High", "Deeper shared story."],
  ["What is one way a friend helped you through a hard time?", "High", "Support and gratitude."],
  ["What is one way you show up that people might miss?", "Medium", "Recognition."],
  ["What is a friendship you would like to repair gently?", "High", "Repair with care."],
  ["What is a friendship you had to release?", "High", "Loss and maturity."],
  ["What do you miss about making friends as a child?", "Medium", "Nostalgia and ease."],
  ["What do you appreciate about making friends as an adult?", "Medium", "Adult friendship perspective."],
  ["What is a social plan that sounds genuinely good to you?", "Low", "Practical connection."],
  ["What is a social plan that drains you before it starts?", "Low", "Energy and preferences."],
  ["What should friends know about your alone time?", "Medium", "Autonomy and closeness."],
  ["What should friends know about your anxiety, stress, or overwhelm?", "High", "Support context."],
  ["What is one thing you want to normalize in friendships?", "Medium", "Cultural reflection."],
  ["What is one thing you want to stop normalizing in friendships?", "High", "Boundary culture."],
  ["What is a friend tradition worth starting?", "Low", "Action-oriented."],
  ["What is a friend tradition worth protecting?", "Low", "Ritual and continuity."],
  ["What is one kind of message that always means a lot?", "Low", "Concrete care."],
  ["What is one kind of check-in that actually helps?", "Medium", "Support specificity."],
  ["What is a question you would ask a friend you trust deeply?", "High", "Deep friendship prompt."],
  ["What is something you want your friends to celebrate with you?", "Medium", "Joy and recognition."],
  ["What is something you want your friends to sit with you in?", "High", "Care in difficulty."],
  ["What is a friendship lesson you learned the hard way?", "High", "Story and wisdom."],
  ["What is a friendship lesson you learned beautifully?", "Medium", "Positive wisdom."],
  ["What do you hope your friends feel after time with you?", "Medium", "Identity and impact."],
  ["What is one way friendship has saved you from loneliness?", "High", "Mission-aligned."],
  ["What is one way loneliness has changed how you choose friends?", "High", "Mission-aligned."],
  ["What is a friend you wish you could thank more specifically?", "Medium", "Gratitude and action."],
  ["What would make your friendships feel more reciprocal?", "High", "Balanced connection."],
  ["What is something you want to ask for without apologizing?", "High", "Needs and confidence."],
  ["What does emotional honesty look like in friendship?", "High", "Friendship intimacy."],
  ["What should friends be able to say kindly?", "Medium", "Honest feedback."],
  ["What is a promise you want to make to your friendships?", "High", "Closing commitment."],
  ["What is one person you want to reach out to after this?", "Medium", "Action after play."],
  ["What would friendship feel like if it were less rushed?", "Medium", "Soft closing reflection."],
]);

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

const rows = [...sourceRows.map(normalize), ...firstDate, ...secondDate, ...thirdDate, ...friendship];
await fs.mkdir(root, { recursive: true });

const headers = Object.keys(rows[0]);
const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csv = [headers.map(csvEscape).join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))].join("\n");
await fs.writeFile(path.join(root, "say_more_500_card_library.csv"), csv, "utf8");
await fs.writeFile(path.join(root, "say_more_500_card_library.json"), JSON.stringify({ rows }, null, 2), "utf8");

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
overview.getRange("A1:D6").values = [
  ["Say More 500-Card Online Game Library", "", "", ""],
  ["Total Cards", rows.length, "", ""],
  ["Previous Library", 300, "Base plus existing expansions", ""],
  ["New Date Packs", 150, "First Date, Second Date, Third Date", ""],
  ["New Friendship Pack", 50, "Friendship Edition", ""],
  ["Next Target", 1000, "Additional topic packs", ""],
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
await output.save(path.join(root, "say_more_500_card_library.xlsx"));

console.log(JSON.stringify({ cards: rows.length, countsBySet, countsByCategory, root }, null, 2));
