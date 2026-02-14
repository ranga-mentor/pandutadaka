# Byte Learning Site

Minimal React + Vite learning site with:
- Bite-sized lessons
- Easy chapter/lesson navigation
- Two starter tracks:
  - Git + Pega
  - Containers
- Optional Google Analytics (GA4)

## Run

```bash
npm install
npm run dev
```

Open the app at the URL shown by Vite (usually `http://localhost:5173`).

## Optional Analytics

Create `.env.local`:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

When present, the app loads `gtag.js` and tracks lesson views.

## Manual Verification Checklist

- Track switching:
  - Git + Pega and Containers tabs switch correctly
  - Lesson list resets to first lesson for a new track
- Navigation:
  - Sidebar lesson click opens selected lesson
  - `Previous`, `Next`, and `Restart Track` behave correctly at boundaries
- Content rendering:
  - Bite cards, practice commands, and quick check render per lesson
  - Layout is usable on desktop and mobile widths
- Analytics (if configured):
  - GA script loads only when `VITE_GA_MEASUREMENT_ID` is set
  - `lesson_view` events fire on lesson changes
