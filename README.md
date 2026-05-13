# Smart Contact Manager (Premium Edition)

A professional contact management system built with Node.js, Express, and EJS, using CSV as a primary data storage mechanism with ISO standard timestamping. Now completely redesigned with a **Premium Modern Full-Stack Experience**.

## 🌟 Premium Features
- **Premium Light Mode UI**: Clean, minimal white backgrounds with light blue gradients and soft cyan accents.
- **Custom Vanilla CSS Architecture**: Highly scalable, bespoke CSS framework built without generic utility libraries (no Tailwind).
- **Glassmorphism & Micro-animations**: Smooth hover effects, page transitions, and modern developer-grade aesthetics (inspired by Linear, Stripe, and Vercel).
- **Advanced Dashboard Metrics**: Total contacts, recently added contacts, timestamp visualization, and contact activity timeline.
- **Full CRUD Operations**: Create, Read, Update, and Delete contacts smoothly with Toast notifications.
- **CSV Data Storage**: Reliable, auditable, and human-readable storage in `data/contacts.csv`.
- **ISO Timestamping**: Every contact is tagged with a precise creation time used for auditing and history.
- **Responsive Layout**: Fully optimized for mobile, tablet, and desktop environments.

## Why ISO Timestamping?
In production systems, timestamps are critical for:
1. **Auditing**: Knowing exactly when a record was created or modified.
2. **Indexing**: Sorting records by temporal relevance.
3. **Synchronization**: Determining which record is more recent during database migrations or multi-user edits.
4. **History**: Building a timeline of user interactions.

## Project Structure
- `server.ts`: Dashboard entry point.
- `public/css/style.css`: Core Premium UI styling.
- `src/cli.ts`: CLI entry point.
- `src/models/`: Data structures (Person class).
- `src/services/`: Business logic and File I/O.
- `src/views/`: Re-designed EJS templates for the premium UI.
- `data/`: Persistent CSV storage.

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Web Dashboard:
   ```bash
   npm run dev
   ```
3. Run the CLI Tool:
   ```bash
   npm run cli
   ```

## Production Considerations
- **Architecture**: Separated concerns (Service/Controller/Model) allow for scaling.
- **Error Handling**: Custom middleware handles global errors gracefully.
- **Validation**: Regex-based email validation and strict field checks prevent data corruption.
