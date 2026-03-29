import { useMediaQuery } from 'usehooks-ts';
import clsx from 'clsx';

import type { TabsProps } from '../model/types';
import { getTabLabel } from '../model/tabs.utils';
import { useTabsGlow } from '../model/useTabsGlow';
import { useTabsNavigation } from '../model/useTabsNavigation';
import { TabsCompact } from './TabsCompact';
import { TabsRegular } from './TabsRegular';

const DEFAULT_SWITCH_MS = 260;
const DEFAULT_HOLD_START_DELAY_MS = 340;
const DEFAULT_HOLD_REPEAT_MS = 170;
const DEFAULT_SWIPE_TRIGGER_PX = 56;
const DEFAULT_SWIPE_LOCK_RATIO = 1.2;

export function Tabs<TKey extends string>({
  items,
  value,
  onChange,
  adaptive = false,
  compactBreakpoint,
  className,
  variant = 'sci-fi',
  glowPadding = 10,
  glowWidthCoef = 0.9,
  leftSwitchIcon,
  rightSwitchIcon,
  compactPrevAriaLabel = 'Предыдущая вкладка',
  compactNextAriaLabel = 'Следующая вкладка',
  showFrame = true,
  showGlow = true,
  behavior,
}: TabsProps<TKey>) {
  const isCompact = useMediaQuery(
    adaptive && compactBreakpoint ? `(max-width: ${compactBreakpoint}px)` : '(max-width: 0px)'
  );

  const { glow, listRef, setButtonRef } = useTabsGlow<TKey>({
    activeKey: value,
    isEnabled: !isCompact && showGlow,
    padding: glowPadding,
  });

  const {
    displayedTab,
    pressedSwitch,
    phase,
    dragX,
    settleDirection,
    hasPrev,
    hasNext,
    prevTab,
    nextTab,
    goPrev,
    goNext,
    goFirst,
    goLast,
    startHoldSwitch,
    handleCompactPointerDown,
    handleCompactPointerMove,
    handleCompactPointerUp,
    handleCompactPointerCancel,
  } = useTabsNavigation<TKey>({
    items,
    value,
    onChange,
    switchMs: behavior?.switchMs ?? DEFAULT_SWITCH_MS,
    holdStartDelayMs: behavior?.holdStartDelayMs ?? DEFAULT_HOLD_START_DELAY_MS,
    holdRepeatMs: behavior?.holdRepeatMs ?? DEFAULT_HOLD_REPEAT_MS,
    swipeTriggerPx: behavior?.swipeTriggerPx ?? DEFAULT_SWIPE_TRIGGER_PX,
    swipeLockRatio: behavior?.swipeLockRatio ?? DEFAULT_SWIPE_LOCK_RATIO,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goPrev();
        break;

      case 'ArrowRight':
        e.preventDefault();
        goNext();
        break;

      case 'Home':
        e.preventDefault();
        goFirst();
        break;

      case 'End':
        e.preventDefault();
        goLast();
        break;

      default:
        break;
    }
  };

  return (
    <div
      className={clsx(
        'tabs',
        adaptive && isCompact && 'tabs--compact',
        variant && `tabs--${variant}`,
        className
      )}
      onKeyDown={handleKeyDown}
    >
      {showFrame && <div className="tabs__frame" aria-hidden="true" />}

      {adaptive && isCompact ? (
        <TabsCompact
          listRef={listRef}
          phase={phase}
          dragX={dragX}
          settleDirection={settleDirection}
          pressedSwitch={pressedSwitch}
          hasPrev={hasPrev}
          hasNext={hasNext}
          prevLabel={getTabLabel(items, prevTab)}
          currentLabel={getTabLabel(items, displayedTab)}
          nextLabel={getTabLabel(items, nextTab)}
          switchMs={behavior?.switchMs ?? DEFAULT_SWITCH_MS}
          compactPrevAriaLabel={compactPrevAriaLabel}
          compactNextAriaLabel={compactNextAriaLabel}
          onStartHoldSwitch={startHoldSwitch}
          onPointerDown={handleCompactPointerDown}
          onPointerMove={handleCompactPointerMove}
          onPointerUp={handleCompactPointerUp}
          onPointerCancel={handleCompactPointerCancel}
          leftSwitchIcon={leftSwitchIcon}
          rightSwitchIcon={rightSwitchIcon}
        />
      ) : (
        <TabsRegular
          items={items}
          activeKey={value}
          glow={glow}
          glowWidthCoef={glowWidthCoef}
          showGlow={showGlow}
          listRef={listRef}
          setButtonRef={setButtonRef}
          onChange={onChange}
        />
      )}
    </div>
  );
}
