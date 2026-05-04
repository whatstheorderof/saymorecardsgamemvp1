import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outDir = path.resolve("outputs/say-more-120-card-set");

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

const categories = {
  Icebreaker: [
    ["What color represents your current mood?", "Strangers", "Low", "A gentle self-expression opener."],
    ["Coffee, tea, or neither?", "Speed", "Low", "Simple preference with room for personality."],
    ["What app do you use most, and what does it say about you?", "Strangers", "Low", "Modern, playful, and revealing."],
    ["What is one tiny thing that made today better?", "All", "Low", "Builds warmth through ordinary gratitude."],
    ["What is a song that always changes your mood?", "All", "Low", "Music is an easy bridge into memory."],
    ["What question do you wish people asked you more often?", "All", "Medium", "Invites agency without forcing depth."],
    ["What is your current comfort show, meal, or ritual?", "Strangers", "Low", "Creates immediate relatability."],
    ["What is something you are surprisingly good at?", "Teams", "Low", "Light self-disclosure with confidence."],
    ["What is the best compliment you have received recently?", "All", "Low", "Opens positive reflection."],
    ["What is a place that instantly makes you feel more like yourself?", "All", "Medium", "Starts place-based storytelling."],
    ["What small object would explain your personality?", "Strangers", "Low", "Concrete and visual for groups or video."],
    ["What is one thing you always notice first about a room?", "All", "Low", "Accessible, sensory, and revealing."],
    ["What was your favorite way to play as a child?", "Family", "Medium", "Light nostalgia with emotional texture."],
    ["What is a trend you secretly understand?", "Strangers", "Low", "Gen Z-friendly and playful."],
    ["What is something you used to dislike but now love?", "All", "Low", "Safe way to discuss change."],
    ["What is your ideal low-pressure hangout?", "Strangers", "Low", "Reveals social needs gently."],
    ["What is a word people use to describe you that feels accurate?", "All", "Medium", "Introduces self-perception."],
    ["What is a word people use to describe you that feels wrong?", "All", "Medium", "Adds nuance without becoming too heavy."],
    ["What is one thing you would teach a room full of strangers?", "Teams", "Low", "Invites expertise and identity."],
    ["What is your favorite kind of silence?", "All", "Medium", "A poetic entry into comfort and connection."],
    ["What is something that makes you laugh faster than it should?", "All", "Low", "Fast path to warmth."],
    ["What is a food memory you still think about?", "Family", "Low", "Sensory, personal, and inclusive."],
    ["What is a tiny rule you live by?", "All", "Medium", "Reveals values in a compact way."],
    ["What would your friends say is your signature move?", "Friends", "Low", "Playful self-awareness."],
    ["What is something you are currently curious about?", "All", "Low", "Opens future-oriented conversation."],
    ["What is your favorite way to make a boring day better?", "Speed", "Low", "Useful and easy to answer."],
    ["What is a place online that feels strangely comforting?", "Strangers", "Medium", "Modern connection lens."],
    ["What is one thing you would put in a care package for yourself?", "All", "Medium", "Gentle self-knowledge."],
    ["What is a harmless hill you will die on?", "Teams", "Low", "Playful debate starter."],
    ["What is one good thing people often miss about you?", "All", "Medium", "Soft invitation into being seen."],
  ],
  Connection: [
    ["What is a lesson you learned the hard way?", "All", "Medium", "Encourages story and wisdom."],
    ["Who in your life makes you feel most understood?", "All", "Medium", "Surfaces models of connection."],
    ["What is something you are still learning to say out loud?", "Deep Dive", "High", "Naming vulnerability with choice."],
    ["What belief did you used to hold, but no longer do?", "All", "Medium", "Tracks growth and perspective."],
    ["When was the last time you felt truly seen?", "Deep Dive", "High", "Core brand-level question."],
    ["What is one thing you wish people knew about your story?", "All", "High", "Deep but open-ended."],
    ["What kind of support is easiest for you to receive?", "Couples", "Medium", "Practical intimacy."],
    ["What kind of support is hardest for you to ask for?", "Deep Dive", "High", "Useful for trusted groups."],
    ["What is a friendship you are grateful for right now?", "Friends", "Medium", "Positive relational reflection."],
    ["What is a friendship you still think about?", "Deep Dive", "High", "Allows grief, nostalgia, or warmth."],
    ["What does trust feel like in your body?", "Deep Dive", "High", "Somatic but accessible."],
    ["What makes you feel safe enough to be honest?", "All", "High", "Names conditions for depth."],
    ["What is something you admire in people that you are working on yourself?", "Teams", "Medium", "Humility and aspiration."],
    ["Who taught you how to love, directly or indirectly?", "Family", "High", "Big emotional storytelling."],
    ["What is a boundary you are proud of learning?", "All", "High", "Healthy growth topic."],
    ["What is something you wish you had been thanked for?", "Deep Dive", "High", "Recognition and unseen labor."],
    ["When do you feel easiest to be around?", "All", "Medium", "Self-awareness and social rhythms."],
    ["When do you become hardest to reach?", "Deep Dive", "High", "Gentle accountability."],
    ["What is a memory that still makes you feel connected to someone?", "Family", "Medium", "Story-forward connection."],
    ["What is something small someone did that stayed with you?", "All", "Medium", "Highlights micro-kindness."],
    ["What does a good apology sound like to you?", "Couples", "High", "Conflict literacy."],
    ["What do you hope people feel after spending time with you?", "All", "Medium", "Identity and intention."],
    ["What is a part of your personality you protect carefully?", "Deep Dive", "High", "Vulnerability with boundaries."],
    ["What is something you have outgrown socially?", "All", "Medium", "Maturity and changing needs."],
    ["What kind of conversation makes you lose track of time?", "Strangers", "Medium", "Natural segue into shared interests."],
    ["What is one way loneliness has shaped you?", "Deep Dive", "High", "Directly tied to mission."],
    ["What is one way connection has surprised you?", "All", "Medium", "Balances the loneliness theme."],
    ["What do you need more of from your people this season?", "All", "High", "Timely and relational."],
    ["What is one thing you want to understand better about someone here?", "Groups", "Medium", "Promotes direct curiosity."],
    ["What would feeling closer look like tonight?", "Deep Dive", "High", "Useful end-of-round intimacy check."],
  ],
  Reflection: [
    ["Describe a moment you felt misunderstood.", "Deep Dive", "High", "Core self-insight prompt."],
    ["What is something you still need to heal from?", "Deep Dive", "High", "High-depth card with consent needed."],
    ["What changed you more than you expected?", "All", "High", "Strong story prompt."],
    ["What is a fear you still carry?", "Deep Dive", "High", "Classic reflective depth."],
    ["When was your last moment of true peace?", "All", "Medium", "Soft and image-rich."],
    ["What would disappoint your younger self, and what would they understand?", "Deep Dive", "High", "Nuanced growth question."],
    ["What part of yourself are you trying to be kinder to?", "All", "High", "Self-compassion focus."],
    ["What do you miss about who you used to be?", "Deep Dive", "High", "Allows grief without prescribing it."],
    ["What do you not miss about who you used to be?", "All", "Medium", "Empowering reflection."],
    ["What is a lie you once believed about yourself?", "Deep Dive", "High", "Identity repair."],
    ["What is something you are learning not to chase?", "All", "Medium", "Modern and reflective."],
    ["What is something you are learning to let be enough?", "All", "Medium", "Gentle values prompt."],
    ["What emotion do you find hardest to admit?", "Deep Dive", "High", "Builds emotional vocabulary."],
    ["What emotion visits you most often lately?", "All", "Medium", "Current-state reflection."],
    ["What do you do when you feel left out?", "Deep Dive", "High", "Mission-aligned and useful."],
    ["What do you wish people understood about your quiet moments?", "All", "Medium", "Introversion/withdrawal nuance."],
    ["What are you proud of surviving quietly?", "Deep Dive", "High", "Recognition without requiring details."],
    ["What is a version of success you are rethinking?", "Teams", "Medium", "Good for personal or work contexts."],
    ["What is one expectation you are ready to release?", "All", "Medium", "Growth-oriented."],
    ["What is one thing your body has been trying to tell you?", "Deep Dive", "High", "Somatic reflection, non-clinical."],
    ["What did you need more of growing up?", "Family", "High", "Deep family/care prompt."],
    ["What did you get growing up that still helps you now?", "Family", "Medium", "Balances deficit with strength."],
    ["What is a memory you avoid, and what does it ask of you?", "Deep Dive", "High", "Intense; for trusted play."],
    ["What is a dream you changed without telling many people?", "All", "High", "Invites identity transition stories."],
    ["What part of your life feels most unfinished?", "Deep Dive", "High", "Open, existential reflection."],
    ["What part of your life feels more complete than before?", "All", "Medium", "Hopeful counterweight."],
    ["What do you forgive yourself for a little more now?", "Deep Dive", "High", "Soft repair."],
    ["What are you still waiting to hear from someone?", "Deep Dive", "High", "Powerful, optional vulnerability."],
    ["What is something you can finally name?", "All", "High", "Invites insight and language."],
    ["What would your future self thank you for protecting?", "All", "Medium", "Forward-looking self-care."],
  ],
  Challenge: [
    ["Share something honest you usually soften for other people.", "Deep Dive", "High", "Brave but not reckless."],
    ["Tell the group one compliment you have been holding back.", "Groups", "Medium", "Creates warmth in-room."],
    ["Ask someone here a follow-up question you genuinely care about.", "All", "Medium", "Teaches deeper listening."],
    ["Share an embarrassing but funny story.", "Speed", "Low", "Energy and levity."],
    ["Give someone else the card you think they should answer.", "Groups", "Medium", "Interactive dynamic."],
    ["Say one thing you are grateful for about this room.", "Groups", "Medium", "Grounds shared experience."],
    ["Pick one person and ask what they want to be known for.", "Groups", "Medium", "Direct, affirming question."],
    ["Answer your card in exactly seven words.", "Speed", "Low", "Playful constraint."],
    ["Let another player choose whether you answer lightly or deeply.", "Groups", "Medium", "Adds playful agency."],
    ["Tell the truth, then tell the gentler version you usually use.", "Deep Dive", "High", "Explores social masking."],
    ["Give a two-sentence toast to someone here.", "Groups", "Medium", "Affectionate performance."],
    ["Ask the person opposite you what they want more of this year.", "Groups", "Medium", "Easy direct connection."],
    ["Name something you are avoiding, without explaining it.", "All", "High", "Brave but bounded."],
    ["Share a sentence you wish someone had said to you earlier.", "Deep Dive", "High", "Emotional but concise."],
    ["Let the group ask you one yes-or-no question.", "Groups", "Medium", "Interactive and safe."],
    ["Choose someone to answer: what do you think I care about?", "Groups", "Medium", "Invites being perceived."],
    ["Say one thing you want to be brave enough to ask for.", "Deep Dive", "High", "Vulnerability plus desire."],
    ["Trade cards with someone whose energy you are curious about.", "Groups", "Low", "Light movement and curiosity."],
    ["Answer as your past self, then as your current self.", "Deep Dive", "High", "Creative reflection."],
    ["Ask the group: what is a small joy I should try?", "Groups", "Low", "Community-generated care."],
    ["Give advice to the person you were one year ago.", "All", "Medium", "Reflective performance."],
    ["Give advice to the person you will be one year from now.", "All", "Medium", "Forward-looking challenge."],
    ["Share one thing you are ready to stop pretending about.", "Deep Dive", "High", "Bold identity card."],
    ["Pick someone and say what you hope they remember from tonight.", "Groups", "High", "Strong closing moment."],
    ["Ask someone to repeat back what they heard in your answer.", "Deep Dive", "High", "Builds active listening."],
    ["Let the youngest person choose the next category.", "Family", "Low", "Age-bridging group mechanic."],
    ["Let the oldest person choose who answers next.", "Family", "Low", "Age-bridging group mechanic."],
    ["Answer without using the words fine, busy, or tired.", "Speed", "Low", "Breaks default social scripts."],
    ["Invite someone to challenge your first answer with one follow-up.", "Deep Dive", "High", "Encourages depth with permission."],
    ["Close your answer with: what I need now is...", "Deep Dive", "High", "Turns reflection into a clear need."],
  ],
};

const rows = [];
const categoryColors = {
  Icebreaker: "Warm Cream",
  Connection: "Muted Teal",
  Reflection: "Clay / Charcoal",
  Challenge: "Sunset Coral",
};

for (const [category, cards] of Object.entries(categories)) {
  cards.forEach(([prompt, mode, depth, rationale], index) => {
    rows.push({
      ID: `${category.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(2, "0")}`,
      Category: category,
      "Card Type": "Question",
      Level: index < 10 ? "Level 1" : index < 20 ? "Level 2" : "Level 3",
      "Suggested Mode": mode,
      Depth: depth,
      Prompt: prompt,
      "Design Treatment": categoryColors[category],
      "Facilitator Note": depth === "High" ? "Best after trust has warmed up; passing is always allowed." : "Suitable for early playtesting.",
      Rationale: rationale,
    });
  });
}

const summary = [
  ["Say More 120-Card Master Set", "", "", ""],
  ["Total Cards", rows.length, "", ""],
  ["Icebreaker", 30, "Light openers", "Low-pressure personality, preference, and mood prompts."],
  ["Connection", 30, "Relational depth", "Story, trust, support, and meaningful understanding."],
  ["Reflection", 30, "Self-insight", "Memory, healing, identity, and personal growth."],
  ["Challenge", 30, "Playful bravery", "Interactive prompts, direct appreciation, and deeper listening."],
  ["Brand Direction", "Premium, warm, editorial, inclusive", "", ""],
  ["Use", "Playtesting, Canva layout, print prep, interview-platform episodes", "", ""],
];

await fs.mkdir(outDir, { recursive: true });

const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csvHeaders = Object.keys(rows[0]);
const csv = [csvHeaders.map(csvEscape).join(","), ...rows.map((row) => csvHeaders.map((h) => csvEscape(row[h])).join(","))].join("\n");
await fs.writeFile(path.join(outDir, "say_more_120_card_master.csv"), csv, "utf8");

const workbook = Workbook.create();
const summarySheet = workbook.worksheets.add("Overview");
summarySheet.getRange("A1:D8").values = summary;

const cardSheet = workbook.worksheets.add("120 Cards");
cardSheet.getRange(a1(1, 1, 1, csvHeaders.length)).values = [csvHeaders];
cardSheet.getRange(a1(2, 1, rows.length, csvHeaders.length)).values = rows.map((row) => csvHeaders.map((h) => row[h]));

const categorySheet = workbook.worksheets.add("Category Counts");
const countRows = Object.entries(categories).map(([category, cards]) => [category, cards.length, categoryColors[category]]);
categorySheet.getRange("A1:C1").values = [["Category", "Count", "Design Treatment"]];
categorySheet.getRange(a1(2, 1, countRows.length, 3)).values = countRows;

await fs.writeFile(path.join(outDir, "say_more_120_card_master.json"), JSON.stringify({ rows }, null, 2), "utf8");

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(path.join(outDir, "say_more_120_card_master.xlsx"));

console.log(JSON.stringify({
  xlsx: path.join(outDir, "say_more_120_card_master.xlsx"),
  csv: path.join(outDir, "say_more_120_card_master.csv"),
  cards: rows.length,
}, null, 2));
