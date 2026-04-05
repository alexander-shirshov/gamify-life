import { BREAKPOINTS } from '@/config/windowBreakpoints';
import ChevronDoubleArrow from '@/assets/icons/chevron-double-right.svg?react';

import type { TabsItem } from '@/components/features/tabs';
import type { TabKey } from '@/components/features/tabs';
import { Tabs } from '@/components/features/tabs';

export const TABS: TabsItem<TabKey>[] = [
  { key: 'active', label: 'АКТИВНЫЕ' },
  { key: 'daily', label: 'РЕГУЛЯРНЫЕ' },
  { key: 'done', label: 'ЗАВЕРШЕННЫЕ' },
  { key: 'archive', label: 'АРХИВ' },
];

type Props = {
  value: TabKey;
  onChange: (next: TabKey) => void;
};

export function QuestTabs({ value, onChange }: Props) {
  return (
    <Tabs<TabKey>
      items={TABS}
      value={value}
      onChange={onChange}
      adaptive
      compactBreakpoint={BREAKPOINTS.tablet}
      variant="sci-fi"
      glowPadding={10}
      glowWidthCoef={0.9}
      showGlow={true}
      showFrame={true}
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
