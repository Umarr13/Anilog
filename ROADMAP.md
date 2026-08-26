# Anilog — Implementation Plan

Everything that needs to happen, organized by phase. **Nothing runs until you say go.**

---

## Phase 1: Critical Fixes → `v0.0.1-beta`

> [!IMPORTANT]
> These are bugs and broken things in the current build. Must be fixed before anything else.

### 1.1 Replace Capacitor Icon with Luffy Icon

**Problem:** The installed APK shows the default Capacitor icon, not the Luffy icon from `public/luffy_icon.png`.

**Fix:** Generate properly sized icons from `luffy_icon.png` and replace every file in:
- `android/app/src/main/res/mipmap-hdpi/` (72×72)
- `android/app/src/main/res/mipmap-mdpi/` (48×48)
- `android/app/src/main/res/mipmap-xhdpi/` (96×96)
- `android/app/src/main/res/mipmap-xxhdpi/` (144×144)
- `android/app/src/main/res/mipmap-xxxhdpi/` (192×192)
- `android/app/src/main/res/mipmap-anydpi-v26/` (adaptive icon XML)
- Also replace all `splash.png` drawables with a Luffy-branded splash

**Files changed:** ~15 image files in `android/app/src/main/res/`

---

### 1.2 Fix Broken Navigation & Routing

**Problem:** Every link opens the One Piece details page. Search doesn't work. Profile button does nothing. Resume button is non-functional.

**Fix:**
- **Search page** — The search input doesn't filter anything; it's static HTML. Wire the input to filter the displayed list of trending items.
- **AnimeDetails page** — Currently hardcoded to show "One Piece" regardless of which anime was clicked. Read the `:id` param from the URL and display the correct data.
- **Resume button** — Should navigate to the AnimeDetails page for the currently-watching anime.
- **Profile button** — Link it to a placeholder Profile page or a "coming soon" modal.
- **Collection tabs** — "Watched", "Watching", "Plan to Watch" tabs all show the same static list. Wire them to filter by status.

**Files changed:**
- `src/pages/Search.tsx` — add filtering logic
- `src/pages/AnimeDetails.tsx` — read route param, display correct anime
- `src/pages/Dashboard.tsx` — wire Resume button
- `src/pages/Collection.tsx` — wire tab filtering
- `src/components/BottomNavBar.tsx` — fix Profile link
- New: `src/data/animeData.ts` — central mock data store (so all pages reference the same data)

---

### 1.3 Remove Sanity Gauge

**Problem:** The "Current Sanity: 75%" circular gauge on the Dashboard doesn't relate to an anime tracker.

**Fix:** Remove the entire `<section>` block for the sanity gauge from `Dashboard.tsx`.

**Files changed:** `src/pages/Dashboard.tsx`

---

### 1.4 Remove Nav-Curve Decoration

**Problem:** The "horns and bar" above the FAB (+) button on the bottom nav look broken/unfinished.

**Fix:** Remove the `.nav-curve` div from `BottomNavBar.tsx` and its CSS from `index.css`.

**Files changed:**
- `src/components/BottomNavBar.tsx` — remove `<div className="nav-curve ...">` 
- `src/index.css` — remove `.nav-curve` and its `::before`/`::after` rules (lines 47–81)

---

### 1.5 Fix File Structure

**Problem:** Git moved `src/components/` into `src/assets/components/` during the last commit. Imports in pages still reference `../components/`, which will break.

**Fix:** Move files back to `src/components/` and verify all imports resolve correctly.

**Files changed:**
- Move `src/assets/components/*.tsx` → `src/components/*.tsx`
- Verify imports in all page files

---

### 1.6 Reset Versioning

**Problem:** Current version tags are v1.0.0–v1.0.3. App is clearly pre-v1.

**Fix:**
- Update `android/app/build.gradle`: `versionName "0.0.1"`, `versionCode 1`
- Update `package.json`: `"version": "0.0.1-beta"`
- Tag as `v0.0.1-beta`
- Mark the GitHub Release as **Pre-release**
- Update workflow to set `prerelease: true`

**Files changed:**
- `android/app/build.gradle`
- `package.json`
- `.github/workflows/build-apk.yml`

---

### 1.7 Clean Up Unused Files

**Problem:** `App.css` contains Vite starter template CSS that isn't used. `keystore_base64.txt` is sitting in the project root.

**Fix:** 
- Delete `src/App.css` (not imported anywhere that matters)
- Delete `keystore_base64.txt`
- Remove `src/assets/react.svg` and `src/assets/vite.svg` (Vite defaults, unused)

---

## Phase 2: Core Infrastructure → `v0.1.0-beta`

> [!NOTE]
> This phase turns the static mockup into a real, functional app with data persistence and live search.

### 2.1 Offline-First Local Database

**What:** Store all user data (collection, progress, ratings, notes) locally on the device so the app works without internet.

**Approach:** Use IndexedDB via a lightweight wrapper (Dexie.js) — no native plugin needed, works in Capacitor's WebView out of the box.

**New files:**
- `src/db/database.ts` — Dexie database schema (tables: `anime`, `collection`, `journal`)
- `src/db/hooks.ts` — React hooks (`useCollection()`, `useAnime()`, `useJournal()`)

**Why IndexedDB over SQLite?** No native plugin dependency, simpler setup, works identically in browser dev mode and on the APK. SQLite (via `@capacitor-community/sqlite`) is heavier and requires native config — overkill for this data size.

---

### 2.2 AniList GraphQL API Integration

**What:** Wire the Search page to search real anime titles from AniList's public API (no API key required).

**New files:**
- `src/api/anilist.ts` — GraphQL queries for search, anime details, trending
- `src/hooks/useSearch.ts` — debounced search hook with loading/error states

**Changes:**
- `src/pages/Search.tsx` — replace static cards with live search results
- `src/pages/AnimeDetails.tsx` — fetch full details from AniList when viewing an anime

**Offline fallback:** If no internet, search only locally stored anime from IndexedDB.

---

### 2.3 Collection CRUD

**What:** Make "Add to Collection", status changes (Watching/Watched/Plan to Watch), episode increment (+/-), and ratings actually persist.

**Changes:**
- `src/pages/AnimeDetails.tsx` — save progress, ratings, notes to IndexedDB
- `src/pages/Collection.tsx` — read from IndexedDB, filter by status tab
- `src/pages/Dashboard.tsx` — show actual "currently watching" anime from DB
- `src/components/BottomNavBar.tsx` — FAB (+) button opens an "add anime" flow

---

## Phase 3: UX Improvements → `v0.2.0-beta`

### 3.1 Swipe Gestures
Swipe right to go back. Uses `framer-motion` (already installed) for drag detection.

### 3.2 Optimistic UI
Episode +1 updates the counter instantly, writes to DB in background. Show a subtle checkmark animation on save.

### 3.3 Undo Toasts (Instead of Confirm Dialogs)
Removing from collection shows a 5-second toast with "Undo" instead of "Are you sure?" popup.

### 3.4 Persistent State
Save scroll position and search query to `sessionStorage`. Restore on app reopen.

### 3.5 Empty States with CTAs
"Your collection is empty" → "Search for anime to add" button. Each empty tab gets a contextual message.

### 3.6 Skeleton Loaders
Gray shimmer blocks matching card layouts while API data loads. New component: `src/components/Skeleton.tsx`.

### 3.7 Bigger Tap Targets for Star Ratings
Increase star icon size from `text-3xl` to at least 44×44px touch targets. Add haptic feedback via `@capacitor/haptics`.

### 3.8 Long-Press Quick Actions
Long-press a collection card → context menu: "Mark next episode", "Change status", "Remove". New component: `src/components/ContextMenu.tsx`.

### 3.9 Consistent Motion Language
Define a single easing curve and duration system. Apply to all page transitions, card interactions, and modals consistently.

### 3.10 First-Run Onboarding
2–3 screen overlay (skippable with one tap) explaining the app. Shown once, tracked via `localStorage`. New component: `src/components/Onboarding.tsx`.

### 3.11 Anime Streaming & External Player Integration
Integrate Th3-Anime API keys to allow users to stream anime directly within the app or open streams using external players like VLC and MX Player.

---

## Phase 4: Advanced Features → `v0.3.0-beta`

### 4.1 Fullscreen & Edge-to-Edge Display
Fix the app so it covers the entire mobile screen, drawing behind the status bar and navigation bar for a truly native immersive feel. Adjust Android themes and safe-area insets.

### 4.2 Native Mobile Back Gestures
Integrate Capacitor's App plugin to intercept native Android hardware back button and edge-swipe gestures. Navigate back in React Router history instead of closing the entire app (unless on the root Dashboard).

### 4.3 Mood-Based Recommendations
Simple quiz UI: "Short or long?", "Action or chill?", "New or classic?" → filters Plan to Watch list and surfaces a pick. New page: `src/pages/Recommend.tsx`.

### 4.4 Seasonal Anime Calendar
New page: `src/pages/SeasonalCalendar.tsx` — fetches the current season's anime schedule from AniList (airing day, time, episode count) and displays them grouped by day of the week. Each entry shows cover art, title, next episode number, and a one-tap "Add to Collection" button. Users can filter by genre or sort by popularity. This is the feature that drives daily return visits — "what's airing today?" — and directly funnels users into adding new shows. No extra native permissions required; it's pure API data.

### 4.5 Episode Release Tracking
For "Currently Airing" shows, fetch next episode air date from AniList and display countdown. Optional local notification via `@capacitor/local-notifications`.

### 4.6 Anime Details UX Refinements
- **Direct Episode Input & Quick Status Update:** Instead of just `+` and `-` buttons, add a slider or direct input to jump to a specific episode. Also, allow changing status directly to "Watched" via the pen edit button next to the personal log.
- **Quick "Watched" Action Button:** On the anime details page, alongside the "Watching" and "Plan to Watch" buttons, add a dedicated "Watched" button for a one-tap status change.
- **5-Star Rating System:** Explicitly enforce and style a clean 5-star rating system (out of 5 stars) for user ratings.
- **Accurate Descriptions:** Enhance AniList data fetching to ensure synopsis descriptions are accurate, clean, and appropriately parsed (stripping raw HTML tags from the API).

### 4.7 Dashboard Bento Grid Layout
Redesign the Dashboard "Currently Watching" section. Instead of showing only a single anime, use a Bento Box grid displaying up to 4 recent shows (2 boxes per row, 2 rows) for a quick overview of active series.

### 4.8 Header Branding
Update the top header area of the app so the official Anilog app icon (the Luffy icon) is displayed right next to the "Anilog" title, matching the mobile app icon.

---

## Phase 5: Open Source Readiness → `v0.5.0-beta`

### 5.1 Repo Files
| File | Purpose |
|------|---------|
| `LICENSE` | MIT license |
| `CONTRIBUTING.md` | How to run locally, design system docs, PR conventions |
| `CODE_OF_CONDUCT.md` | Contributor Covenant |
| `CHANGELOG.md` | What changed per version |
| `.github/ISSUE_TEMPLATE/bug_report.md` | Bug report template |
| `.github/ISSUE_TEMPLATE/feature_request.md` | Feature request template |

### 5.2 Beta CI Workflow
Separate workflow on `develop` branch pushes → builds debug-signed APK → attaches to a pre-release. Keeps your release keystore safe for stable tags only.

### 5.3 In-App Bug Report Button
"Report a Bug" button in Profile/Settings that opens `https://github.com/Umarr13/Anilog/issues/new?title=Bug:&labels=bug` in the system browser.

---

## Phase 6: Ecosystem & Power Features → `v0.6.0-beta`

> [!NOTE]
> This phase builds on the stable core from 0.5.0 — adding the features that make people stick around and tell others about it.

### 6.1 Stats & Yearly Wrapped
Charts for genres watched most, total hours, busiest month. Shareable "Anilog Wrapped" card exportable as an image. New page: `src/pages/Stats.tsx`, uses a lightweight chart lib (Recharts).

### 6.2 Custom Lists/Tags
User-created lists beyond default status tabs ("Comfort rewatches," "Rainy day picks"). New table `customLists` in Dexie schema, drag-and-drop assignment.

### 6.3 Home Screen Widget
Android widget showing currently-watching anime + progress, using `@capacitor/app` + native widget config.

### 6.4 Quick-Add via Barcode/Share Intent
Let users share a link from MyAnimeList/AniList/a browser directly into Anilog via Android's share sheet, auto-parsing and adding.

### 6.5 Compare-with-Friend Export Card
Generate a shareable "compare card" image (like Spotify Wrapped comparisons) — no backend needed, just local image generation + share sheet.

### 6.6 Dark Mode
You've got `darkMode: "class"` already configured in Tailwind but unused — actually implement the toggle, respect system preference by default. New: `src/hooks/useTheme.ts`.

### 6.7 Search Filters & Sort
Genre, year, score, status filters on the Search page. Sort Collection by score/recently updated/alphabetical.

### 6.8 Batch Actions in Collection
Multi-select mode (long-press to enter) for bulk status changes or removal across several titles at once.

### 6.9 Backup & Restore (Local)
Export the entire IndexedDB collection as a JSON file, import it back. No cloud dependency — just file save/load via `@capacitor/filesystem`.

### 6.10 Character & Staff Pages
Since AniList's API supports it — tapping a character/VA name in Details opens a basic character/staff profile page.

### 6.11 Related Anime & Recommendations Row
On AnimeDetails, show "If you liked this" / sequels / prequels pulled from AniList relations data.

### 6.12 Accessibility Pass
Screen reader labels, focus states, color contrast audit on the "surface variant" grays (some are borderline WCAG AA), reduced-motion support respecting `prefers-reduced-motion`.

### 6.13 App Icon & Splash Theming
Support Android 13+ themed/monochrome icons (Material You), so the Luffy icon adapts to the user's wallpaper color scheme.

### 6.14 Localization Scaffold
Set up i18n structure (even if English-only for now) so translation contributions are easy for open-source contributors — `src/i18n/en.json` + a wrapper hook.

---

## Phase 7: Stabilization & Senior Code Review → `v0.9.0-beta`

> [!IMPORTANT]
> This is the "pre-1.0 audit" phase. Goal: go through the entire codebase like a senior dev doing a pre-release review — not adding features, just making everything correct, consistent, and maintainable before calling it stable.

### 7.1 TypeScript Strictness Audit
Enable `strict: true` in `tsconfig.json` if not already; fix all resulting type errors. Eliminate `any` types introduced during rapid feature phases (2–6).

### 7.2 Dead Code & Unused Import Sweep
Run through every page/component for unused imports, commented-out old code, leftover mock data references now replaced by IndexedDB/AniList calls.

### 7.3 Consistent Error Handling
Audit every API call (AniList queries, DB writes) for proper try/catch, user-facing error states, and fallback UI — no silent failures or unhandled promise rejections.

### 7.4 Race Condition Review
Check async flows introduced in Phases 2–4 (optimistic UI writes, debounced search, offline fallback logic) for race conditions — e.g., rapid +1/-1 episode taps causing out-of-order DB writes.

### 7.5 Memory Leak Check
Review `useEffect` cleanup functions across hooks (`useSearch`, `useCollection`, notification listeners) — ensure subscriptions/listeners are properly torn down on unmount.

### 7.6 Bundle Size Audit
Check what's bloating the APK — unused Tailwind classes not purged, duplicate dependencies, unoptimized images. Run bundle analyzer, trim accordingly.

### 7.7 Naming & Convention Consistency
Standardize file/component naming (some pages may still mix `.tsx` patterns from early scaffolding vs. later phases), consistent prop naming, consistent hook naming (`use*` prefix everywhere).

### 7.8 Component Prop-Drilling Cleanup
Identify any prop-drilling that crept in across phases and consolidate into context/hooks where it improves readability (collection status, theme, onboarding state are likely candidates).

### 7.9 Database Migration Safety
Since schema grew across Phases 2 and 6 (new tables: `customLists`, etc.), verify Dexie version migrations won't break existing users' local data when updating between beta versions.

### 7.10 Offline/Online Edge Case Testing
Test every AniList-dependent feature (search, related anime, character pages, episode countdown) with network on/off/flaky — confirm graceful fallbacks everywhere, not just in the original 2.2 implementation.

### 7.11 Android Permissions Audit
Review `AndroidManifest.xml` — filesystem and notifications permissions should be requested only when the relevant feature (backup, episode alerts) is actually used, not all upfront on install.

### 7.12 Security Review
Check for any hardcoded secrets/keys left over (the plan already flags `keystore_base64.txt` for removal in 1.7 — verify it's actually gone from git history, not just the working tree). Sanitize any user input going into share intents or file exports.

### 7.13 Performance Pass on Long Lists
Collection/Search lists should use virtualization if a user has 500+ entries — test with a large seeded dataset, not just the 4–12 item mocks used during development.

### 7.14 Cross-Device/Screen Size QA
Test on a few different Android screen sizes/densities — the mipmap and layout work in Phase 1/6 should be verified on tablets and smaller phones, not just the primary dev device.

### 7.15 Final Documentation Sync
Update `CONTRIBUTING.md`, `CHANGELOG.md`, and inline code comments to reflect the actual final architecture — docs written during Phase 5 may be stale after Phases 6–7 changes.

---

## Phase 7.2: Complex UX & Advanced Motion

> [!NOTE]
> Added post-audit to push the UI polish to a truly premium, native-feeling level before release candidates begin.

### 7.2.1 Native Pull-to-Refresh
Native-feeling pull-to-refresh on Dashboard/Collection to force-refetch AniList data without requiring the user to close and reopen the app.

### 7.2.2 Android App Shortcuts
Static shortcuts in Android launcher (long-press app icon) to jump directly to "Search" or "My Collection".

### 7.2.3 Directional Page Transitions
Slide-left vs slide-right transitions depending on whether you are moving "forward" (clicking an anime) or "backward" (returning to dashboard).

### 7.2.4 Card Preview "Peek"
Long-press a card in the Collection grid to see a blurred background popup preview of the details without fully navigating to the page.

### 7.2.5 Optional UI Sound Design
Subtle, synthesized Web Audio API sounds (like a soft "pop") for primary interactions (saving an anime, changing status) to mimic native haptic-audio feedback. *(Implemented)*

### 7.2.6 Contextual Floating Action Button
The FAB on the Collection page morphs its label and icon dynamically based on context—e.g., changing from "Add to Collection" to "Scroll to Top" when scrolled down. *(Implemented)*

### 7.2.7 Drag-to-Reorder
Allow manual drag-and-drop reordering of lists (requires DB schema migration to support custom rank indices).

### 7.2.8 "Just Added" Highlight Pulse
Brief glow or pulsing ring animation on newly added or modified anime cards when returning to the Collection page, giving immediate visual feedback. *(Implemented)*

### 7.2.9 Custom App-Switcher Preview Label
Contextual labels in the Android recents/app-switcher menu (e.g., "Anilog | Collection") achieved by dynamically updating the document title based on the active tab. *(Implemented)*

---

## Phase 7.5: Post-Audit Fix Cycle → `v0.9.1`–`v0.9.4`

> [!NOTE]
> Phase 7 (0.9.0) was the *review* — reading the code and writing down every issue found. These versions are where you actually *fix* what got flagged, in digestible batches instead of one giant PR. Think of 0.9.0 as the punch list and 0.9.1–0.9.4 as checking items off it.

### `v0.9.1` — Type Safety & Dead Code Fixes
Everything flagged in 7.1 (TypeScript strictness) and 7.2 (dead code sweep) gets actually fixed here. Small, low-risk, high-confidence changes first.

### `v0.9.2` — Async/Race Condition Fixes
Everything flagged in 7.4 (race conditions) and 7.5 (memory leaks) gets fixed. Riskier changes — touch these in isolation so if something breaks, it's easy to bisect.

### `v0.9.3` — Error Handling & Edge Case Fixes
Everything flagged in 7.3 (error handling) and 7.10 (offline/online edge cases) gets fixed. This is where "silent failures" from earlier phases finally get real user-facing states.

### `v0.9.4` — Performance & Security Fixes
Everything flagged in 7.6 (bundle size), 7.12 (security), and 7.13 (long list performance) gets fixed. Also a good place to re-run the audit checklist and confirm nothing regressed.

---

## Phase 7.7: In-App Feedback & Crash Capture → `v0.9.5`

> [!NOTE]
> Everything before this phase relies on users being motivated enough to open GitHub and write an issue. Most won't. This phase makes flagging a problem take one tap, with zero explaining required — the app does the explaining for them.

### 7.7.1 Automatic Crash Capture
When the app crashes or hits an unhandled error, catch it silently in the background (a top-level error boundary + native crash hook) and store a local crash report — stack trace, screen it happened on, app version, device info — without interrupting the user or requiring them to do anything.

### 7.7.2 "Something's Wrong" Floating Flag Button
A small, unobtrusive flag/report icon always accessible (bottom corner, or in a long-press menu) that the user can tap *the moment* something feels off — mistracked episode, weird layout, button that didn't respond — no need to navigate to a settings page first.

### 7.7.3 One-Tap Screenshot + Auto-Context Bundling
Tapping the flag button auto-captures a screenshot of the current screen and silently attaches: current page/route, last 3–5 user actions (a lightweight in-memory action log), app version, device/OS info. The user sees none of this complexity — they just tap and optionally type one line if they want.

### 7.7.4 Optional One-Line Comment (Not Required)
After tapping flag, show a single text field with placeholder text like "What happened? (optional)" — never require it. A report with zero text but full auto-context is still useful and should submit fine.

### 7.7.5 Local Report Queue (Works Offline)
Reports get saved locally first (IndexedDB), then sync out when there's a connection — so someone on a plane or with bad signal can still flag things without losing the report.

### 7.7.6 Silent Submission to GitHub Issues via API
Instead of opening the browser and making the user manually create an issue (Phase 5's approach), use a lightweight backend-free method: submit directly to GitHub's Issues API using a scoped token (or route through a tiny serverless function if you want to keep the token off-device), auto-labeled `user-report`, with the screenshot and context auto-attached. User never sees GitHub at all unless they want to.

### 7.7.7 De-Duplication on the Backend Side
Before creating a new issue, do a lightweight check — if 5 people just flagged the same crash on the same screen/version, group them into one issue with a "+4 others reported this" comment instead of flooding your issue tracker with duplicates.

### 7.7.8 In-App "You Reported This" Confirmation
After submitting, a small toast: "Thanks — flagged." No forced follow-up, no account creation, no email required. It should feel as low-friction as a "thumbs down" tap.

### 7.7.9 Privacy-Respecting by Default
Screenshots and context never include personal data beyond what's already visible on-screen (no device contacts, no location, no anything outside the app). Document exactly what gets sent in `PRIVACY.md` since this phase is the first time the app silently transmits user data anywhere.

### 7.7.10 Maintainer-Side Triage View (Optional, Nice-to-Have)
Since reports land as labeled GitHub issues automatically, you don't strictly need a separate dashboard — but if report volume grows, a simple filtered GitHub Project board view (`user-report` label, grouped by app version/screen) keeps triage fast without building custom infrastructure.

---

## Phase 7.9: Release Candidate Hardening → `v0.9.6`–`v0.9.9`

> [!IMPORTANT]
> This is the classic "RC" stretch — the app is feature-complete and (mostly) bug-free, and each version here exists to catch what only *real-world use* surfaces, not code review. No new features allowed past this point without kicking back to a Phase 6/7 revisit.

### `v0.9.6` — External Beta Tester Round
Hand the APK to 5–10 people outside your immediate circle (ideally people who don't already know how the app "should" work). With the flagging tool from 7.7 already live, their friction points get captured automatically instead of relying on them to remember to write you a message.

### `v0.9.7` — Device & OS Matrix Testing
Systematically test across Android versions (not just your dev device) — different screen densities, Android 12 vs 14 vs 15 behavior differences, different OEM skins (Samsung/Xiaomi/etc. sometimes handle WebViews and permissions differently than stock Android).

### `v0.9.8` — Fresh Install & Upgrade Path Verification
Test the exact scenarios real users will hit: fresh install with zero data, upgrade from every prior beta version in sequence (does 0.1.0 → 0.9.8 in one jump work, or only sequential updates?), and uninstall/reinstall data loss behavior — confirm it matches what Phase 8 promises.

### `v0.9.9` — Release Candidate Freeze
Code freeze. No fixes except release-blocking crashes or data-loss bugs. This build, if it survives a few days untouched with no new critical issues, *is* what gets tagged `v1.0.0` — just with the version number bumped and beta labeling removed.

---

## Phase 8: Launch Readiness → `v1.0.0`

> [!IMPORTANT]
> The finish line. Distribution, resilience, docs, and community setup. If `v0.9.9` survived the RC freeze, this is just the version bump + final polish.

### 8.1 Version Bump & Beta Label Removal
Update `package.json`, `build.gradle`, and all references from `beta` to stable `v1.0.0`. Remove `prerelease: true` from the CI workflow. Create a proper GitHub Release (not pre-release) with a changelog.

### 8.2 Play Store / Distribution Prep
Generate signed release APK, prepare store listing assets (screenshots, description, feature graphic), and decide on distribution channel — Play Store, GitHub Releases, or both.

### 8.3 Final README & Landing Page
Rewrite `README.md` as a proper project showcase (not dev setup notes) — hero screenshot, feature list, download link, tech stack. Optionally a simple landing page.

### 8.4 Community & Contribution Onboarding
Ensure `CONTRIBUTING.md`, issue templates, and labels are all current. Pin a "good first issues" label for new contributors. Set up GitHub Discussions if the project warrants it.

---

## Phase Summary

| Phase | Version | Scope |
|-------|---------|-------|
| 1 — Critical Fixes | `v0.0.1-beta` | Fix icons, routing, remove broken UI, clean files |
| 2 — Core Infrastructure | `v0.1.0-beta` | Database, API, real CRUD |
| 3 — UX Improvements | `v0.2.0-beta` | Gestures, animations, skeleton loaders, empty states |
| 4 — Advanced Features | `v0.3.0-beta` | Fullscreen fix, back gestures, recommendations, bento dashboard, UX details |
| 5 — Open Source | `v0.5.0-beta` | Docs, templates, beta CI, in-app feedback |
| 6 — Ecosystem & Power Features | `v0.6.0-beta` | Stats, widgets, dark mode, filters, backups |
| 7 — Stabilization & Code Review | `v0.9.0-beta` | Audit — find every issue, fix nothing yet |
| 7.2 — Complex UX & Motion | `v0.9.x` | Native UI Polish (Sounds, Contextual FABs, Previews) |
| 7.5 — Post-Audit Fix Cycle | `v0.9.1`–`v0.9.4` | Fix everything the audit found, in batches |
| 7.7 — In-App Feedback & Crash Capture | `v0.9.5` | One-tap flagging, silent crash capture, no user effort required |
| 7.9 — Release Candidate Hardening | `v0.9.6`–`v0.9.9` | Real-world testing, device matrix, freeze |
| 8 — Launch Readiness | `v1.0.0` | Distribution, resilience, docs, community setup |
