export type TabsDirection = 'left' | 'right';
export type TabsPhase = 'idle' | 'dragging' | 'settling';
export type TabsVariant = 'sci-fi';

export type TabsItem<TKey extends string> = {
  key: TKey;
  label: string;
};

export type TabsGlowState = {
  x: number;
  w: number;
};

export type TabsPointerState = {
  pointerId: number | null;
  startX: number;
  startY: number;
  lockedAxis: 'x' | 'y' | null;
};

export type TabsBehaviorConfig = {
  switchMs?: number;
  holdStartDelayMs?: number;
  holdRepeatMs?: number;
  swipeTriggerPx?: number;
  swipeLockRatio?: number;
};

export type TabsProps<TKey extends string> = {
  items: TabsItem<TKey>[];
  value: TKey;
  onChange: (next: TKey) => void;

  adaptive?: boolean;
  compactBreakpoint?: number;

  className?: string;
  variant?: TabsVariant;

  glowPadding?: number;
  glowWidthCoef?: number;

  leftSwitchIcon?: React.ReactNode;
  rightSwitchIcon?: React.ReactNode;

  behavior?: TabsBehaviorConfig;
};
