# MockBot

**MockBot** is a fun and smart chat simulator built with React, featuring three unique characters with distinct personalities.

![MockBot Preview](src/assets/hero.png)

---

## Features

- **3 Unique Characters**
  - **Captain Hook** — An angry and witty pirate
  - **R0-B0T** — A confused and glitchy robot
  - **Pepe the Frog** — A silent frog that only speaks in emojis

- **Smart Response Engine**
  - Mathematical calculations (basic operations, percentages, VAT, square root, exponents)
  - Unit conversions (km/miles, kg/lbs, cm/inches, °C/°F)
  - Real-time clock & date queries
  - Mathematical constants (π, e, golden ratio)

- **Bilingual Support** — Instant switching between Turkish and English

- **Typewriter Effect** — Bot responses are typed out letter by letter

- **Retro Sound Effects** — Each character has its own unique sound (Web Audio API)

- **Repeat Detection** — Characters notice when you send the same message twice

- **Mobile Friendly** — Responsive design with a slide-in sidebar on mobile

---

## Tech Stack

| Tool | Version |
|------|---------|
| TypeScript | 6 |
| React | 19 |
| Vite | 8 |
| Tailwind CSS | 4 |
| oxlint | 1.79 |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## Project Structure

```
MockBot/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   └── hero.png
│   ├── App.tsx        # All application logic
│   ├── index.css      # Global styles
│   └── main.tsx       # App entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## How to Use

1. Select a character from the left panel (Pirate, Robot or Frog)
2. Type a message and press **Enter** or click the send button
3. Switch languages using the **TR / EN** toggle in the top right
4. Clear the chat history with the trash icon

### Smart Queries

| Query Type | Example |
|------------|---------|
| Math | `5 + 3 * 2`, `sqrt 144`, `2^10` |
| Percentage | `18% of 200` |
| VAT | `1000 with 18% vat` |
| Unit Conversion | `100 km to miles`, `30°C to F` |
| Time | `what time is it` |
| Date | `what's today's date`, `what day is it` |

---

## License

MIT License — feel free to use it however you like.
