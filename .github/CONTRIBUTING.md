# Contributing to Anilog

First off, thanks for taking the time to contribute! 🎉

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Umarr13/Anilog.git
   cd Anilog
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Design System & Architecture
- **Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Dexie (IndexedDB), Capacitor.
- **Offline First:** All data must be saved to IndexedDB first. AniList API is used only for fetching external read-only data.
- **Aesthetic:** We strictly follow a "Zen Analogue" aesthetic. High contrast, large whitespace, monochromatic backgrounds with subtle textures.

## Pull Request Conventions
- Keep PRs focused on a single issue or feature.
- Follow conventional commits (e.g., `feat:`, `fix:`, `chore:`).
- Ensure TypeScript strict mode passes.
