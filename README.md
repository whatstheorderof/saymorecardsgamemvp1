# Say More

Say More is a conversation-card game for closing social distance. This workspace includes the 1,050-card content library, print/source card files, and a static browser game.

## Browser Game

Open `site/index.html` in a browser. The game is fully static and includes all 1,050 cards in `site/cards.js`.

## Card Library

The full card library lives in:

- `outputs/say-more-1050-online-game/say_more_1050_card_library.xlsx`
- `outputs/say-more-1050-online-game/say_more_1050_card_library.json`
- `outputs/say-more-1050-online-game/say_more_1050_card_library.csv`

## Vercel

The root `vercel.json` is configured with `outputDirectory: "site"`, so Vercel can serve the browser game as a static site.

Deploy options:

- Connect this repository through the Vercel Git integration.
- Or run `vercel deploy` from the project root.
