# GamifyShit 🎮💩 (work title)

**Gamified task tracker that turns routine tasks into quests**

## Intro

Gamified task tracking application built with React and TypeScript.
Designed as a productivity tool with game-inspired mechanics such as difficulty levels, XP rewards and a custom quest log interface.

## Preview

![Quest Log Board](./screenshots/task-board.png)
![Task Modal](./screenshots/quest-modal.png)

## Current features

- Task creation, editing and completion flows

- Difficulty-based task categorization

- Local persistence with custom useLocalStorage hook

- Interactive modal for task management

- Scrollable task board with custom UI styling

## Planned features

- Pomodoro timer

- Energy / stamina mechanics

- Progress tracking and extended gamification systems

## Tech stack

React • TypeScript • SCSS • Vite

## Development and styles

```sh
npm install
npm run dev
```

Vite compiles SCSS through the existing `sass-embedded` dependency and updates styles during development. No separate Sass watcher is needed. `npm run build` produces the production assets in `dist/`.

- `src/main.tsx` imports `src/assets/styles/main.scss` directly.
- `main.scss` loads global, component and feature styles with `@use`; their order preserves the CSS cascade.
- SCSS filenames use kebab-case without a leading underscore. Add new styles to `main.scss` with `@use`.
- Shared Sass variables, functions and mixins are exposed through `base/core.scss` with `@forward` and consumed with `@use`.
- Styles use global class names. Sass modules (`@use`/`@forward`) are separate from CSS Modules (`*.module.scss`), which scope class names.
- Generated CSS and source maps belong in the build output, not alongside SCSS sources.

## UI architecture notes

The project gradually extracts reusable UI features from screen-specific implementations.

Current reusable feature examples:

- adaptive tabs system (`src/components/features/tabs`)

Related documentation:

- `docs/features/tabs/Tabs.md`
