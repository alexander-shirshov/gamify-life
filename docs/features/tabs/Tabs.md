# Tabs feature

Reusable adaptive tabs feature with two display modes:

- **regular mode** — full horizontal tab list with active glow
- **compact mode** — current tab centered, side navigation buttons, swipe gestures, hold-to-repeat navigation

This feature was extracted from the Quest Log screen and is designed to be reusable across the project.

---

## TL;DR

Use `Tabs` when you need:

- controlled tab navigation
- responsive compact mode with swipe
- reusable UI across screens

Start with:

```tsx
<Tabs items={...} value={...} onChange={...} adaptive />
```

## What this feature provides

### Behavior

- controlled tabs API (`value` + `onChange`)
- adaptive switch between regular and compact layouts
- swipe navigation in compact mode
- hold-to-repeat navigation in compact mode
- keyboard navigation:
  - `ArrowLeft`
  - `ArrowRight`
  - `Home`
  - `End`

### UI

- reusable `Tabs` component
- reusable presentational layers:
  - `TabsRegular`
  - `TabsCompact`

### Internal hooks

- `useTabsNavigation` — compact navigation engine
- `useTabsGlow` — regular mode glow positioning

---

## File structure

```txt
src/components/features/tabs/
  model/
    tabs.utils.ts
    types.ts
    useTabsGlow.ts
    useTabsNavigation.ts
  ui/
    Tabs.tsx
    TabsCompact.tsx
    TabsRegular.tsx
  index.ts
```

### Styles live in the global styles layer:

```
src/assets/styles/features/tabs/
  _tabs-base.scss
  _tabs-sci-fi.scss
```

## Public API

### Entry point

```ts
import { Tabs } from '@/components/features/tabs';
```

### Basic usage

```ts
import { useState } from 'react';
import { Tabs, type TabsItem } from '@/components/features/tabs';

type ProfileTabKey = 'overview' | 'stats' | 'settings';

const PROFILE_TABS: TabsItem<ProfileTabKey>[] = [
  { key: 'overview', label: 'OVERVIEW' },
  { key: 'stats', label: 'STATS' },
  { key: 'settings', label: 'SETTINGS' },
];

export function ProfileTabsExample() {
  const [tab, setTab] = useState<ProfileTabKey>('overview');

  return (
    <Tabs<ProfileTabKey>
      items={PROFILE_TABS}
      value={tab}
      onChange={setTab}
      adaptive
      compactBreakpoint={768}
      variant="sci-fi"
    />
  );
}
```

## Props

### `items`

Array of tab definitions.

```ts
type TabsItem<TKey extends string> = {
  key: TKey;
  label: string;
};
```

Example:

```ts
const TABS = [
  { key: 'active', label: 'АКТИВНЫЕ' },
  { key: 'done', label: 'ЗАВЕРШЕННЫЕ' },
];
```

### `value`

Currently active tab key.

```ts
value = { tab };
```

### `onChange`

Called when active tab changes.

```ts
onChange = { setTab };
```

### `adaptive`

Enables automatic switch between regular and compact modes.

```
adaptive
```

If omitted or `false`, the component stays in regular mode.

### `compactBreakpoint`

Viewport width threshold for compact mode.

```ts
compactBreakpoint={768}
```

Used only when `adaptive` is enabled.

### `variant`

Visual variant of the component.

Currently supported:

```ts
type TabsVariant = 'sci-fi';
```

Example:

```
variant="sci-fi"
```

### `className`

Additional class for outer tabs container.

```
className="profile-tabs"
```

Useful for local layout tweaks.

### `showFrame`

Controls rendering of the outer decorative frame.

```ts
showFrame={false}
```

Default: `true`

### `showGlow`

Controls rendering of the active glow in regular mode.

```ts
showGlow={false}
```

Default: `true`

### `glowPadding`

Inner horizontal padding used when calculating glow position.

```ts
glowPadding={10}
```

Default: `10`

### `glowWidthCoef`

Multiplier for glow width.

```ts
glowWidthCoef={0.9}
```

Default: `0.9`

### `leftSwitchIcon` / `rightSwitchIcon`

Custom icons for compact navigation buttons.

```ts
leftSwitchIcon={<ChevronDoubleArrow />}
rightSwitchIcon={<ChevronDoubleArrow />}
```

If omitted, compact buttons can still render, but you should normally provide icons for the intended UI style.

### `compactPrevAriaLabel` / `compactNextAriaLabel`

Accessible labels for compact navigation buttons.

```
compactPrevAriaLabel="Previous section"
compactNextAriaLabel="Next section"
```

Defaults:

- `Предыдущая вкладка`
- `Следующая вкладка`

`behavior`

Optional behavior tuning for compact mode.

```ts
type TabsBehaviorConfig = {
  switchMs?: number;
  holdStartDelayMs?: number;
  holdRepeatMs?: number;
  swipeTriggerPx?: number;
  swipeLockRatio?: number;
};
```

Example:

```ts
behavior={{
  switchMs: 260,
  holdStartDelayMs: 340,
  holdRepeatMs: 170,
  swipeTriggerPx: 56,
  swipeLockRatio: 1.2,
}}
```

### Meaning

- `switchMs` — transition duration for compact tab switch
- `holdStartDelayMs` — delay before hold-to-repeat starts
- `holdRepeatMs` — delay between repeat steps after hold starts
- `swipeTriggerPx` — minimum drag distance required to commit swipe switch
- `swipeLockRatio` — ratio used to distinguish horizontal swipe from vertical scroll

## Regular mode

Regular mode shows all tabs in a row and highlights the active one with a glow indicator.

Features:

- click-based switching
- active glow
- keyboard navigation

Used when:

- adaptive={false}
- or viewport is wider than compactBreakpoint

## Compact mode

Compact mode shows:

- previous switch button
- current tab label
- next switch button

Features:

- tap navigation via buttons
- hold-to-repeat navigation
- swipe gestures
- keyboard navigation

Used when:

- adaptive={true}
- and viewport is narrower than compactBreakpoint

## Keyboard navigation

Supported keys:

- ArrowLeft — move to previous tab
- ArrowRight — move to next tab
- Home — jump to first tab
- End — jump to last tab

This works through the reusable `Tabs` entry component.

## Styling

Tabs styles are split into:

- src/assets/styles/features/tabs/\_tabs-base.scss
- src/assets/styles/features/tabs/\_tabs-sci-fi.scss

### Base styles

Contain:

- structure
- layout
- transitions
- track / viewport mechanics
- sizing

### Sci-fi styles

Contain:

- colors
- glow
- shadows
- decorative frame
- interactive visual states

### Important note

At the moment the sci-fi stylesheet uses a compatibility selector:

```
.tabs--sci-fi,
.tabs
```

This is a transitional fallback kept during migration to fully variant-based theming.

For MVP this is acceptable.
Long-term goal: rely on `.tabs--sci-fi` only.

## Recommended usage pattern in project screens

For project-specific screens, prefer creating a thin wrapper over reusable `Tabs`.

Example:

```ts
import { Tabs, type TabsItem } from '@/components/features/tabs';
import ChevronDoubleArrow from '@/assets/icons/chevron-double-right.svg?react';
import { BREAKPOINTS } from '@/config/windowBreakpoints';

export type QuestTabKey = 'active' | 'daily' | 'done' | 'archive';

const QUEST_TABS: TabsItem<QuestTabKey>[] = [
  { key: 'active', label: 'АКТИВНЫЕ' },
  { key: 'daily', label: 'РЕГУЛЯРНЫЕ' },
  { key: 'done', label: 'ЗАВЕРШЕННЫЕ' },
  { key: 'archive', label: 'АРХИВ' },
];

export function QuestTabs({ value, onChange }: {
  value: QuestTabKey;
  onChange: (next: QuestTabKey) => void;
}) {
  return (
    <Tabs<QuestTabKey>
      items={QUEST_TABS}
      value={value}
      onChange={onChange}
      adaptive
      compactBreakpoint={BREAKPOINTS.tablet}
      variant="sci-fi"
      leftSwitchIcon={<ChevronDoubleArrow />}
      rightSwitchIcon={<ChevronDoubleArrow />}
      behavior={{
        switchMs: 260,
        holdStartDelayMs: 340,
        holdRepeatMs: 170,
        swipeTriggerPx: 56,
        swipeLockRatio: 1.2,
      }}
    />
  );
}
```

This keeps:

- the reusable feature generic
- screen-specific configuration local
- future maintenance simpler

## Reusing tabs in another part of the project

Checklist:

1. Define a tab key union type
2. Create a TabsItem[] config
3. Store active tab in parent state
4. Render Tabs
5. Choose whether you need:

- adaptive
- a custom breakpoint
- custom icons
- frame/glow toggles
- custom behavior timings

## Moving this feature to another project

To reuse tabs in another project, copy:

### Components

`src/components/features/tabs/`

### Styles

```
src/assets/styles/features/tabs/_tabs-base.scss
src/assets/styles/features/tabs/_tabs-sci-fi.scss
```

### Required dependencies / assumptions

- React
- TypeScript
- usehooks-ts for useMediaQuery
- clsx
- SCSS pipeline
- project-level utility mixins used from base/core

### Important adaptation note

If the target project does not have the same SCSS utility layer (`reset-button`, `flex-center`, `hover`, theme vars, etc.), you will need to either:

- port those mixins/tokens too
- or rewrite the tabs SCSS to match the target project's styling system

### Recommended extraction level

For reuse inside this project, current structure is enough.

For reuse across completely different projects, the next logical step would be:

- remove dependency on project-specific SCSS mixins
- make variant styling more self-contained
- remove temporary .tabs fallback from sci-fi styles

## Known limitations / future improvements

Current feature is production-usable inside this project, but still has room for extension:

- only one official visual variant exists: sci-fi
- renderLabel is intentionally not implemented yet
- sci-fi theme still keeps a temporary fallback selector
- keyboard support is good, but not yet a fully exhaustive WAI-ARIA tabs implementation
- styles still depend on shared project SCSS utilities

## Summary

Use this feature when you need:

- reusable controlled tabs
- adaptive regular/compact behavior
- mobile-friendly compact navigation
- swipe + hold interactions
- a sci-fi styled tab system consistent with the project UI
