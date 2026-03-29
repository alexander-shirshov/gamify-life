import React from 'react';
import clsx from 'clsx';

import type { TabsDirection } from '../model/types';

type TabsCompactProps = {
  listRef: React.RefObject<HTMLDivElement | null>;

  phase: 'idle' | 'dragging' | 'settling';
  dragX: number;
  settleDirection: TabsDirection | null;

  pressedSwitch: TabsDirection | null;
  hasPrev: boolean;
  hasNext: boolean;

  prevLabel: string;
  currentLabel: string;
  nextLabel: string;

  switchMs: number;

  compactPrevAriaLabel?: string;
  compactNextAriaLabel?: string;

  onStartHoldSwitch: (direction: TabsDirection) => void;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;

  leftSwitchIcon: React.ReactNode;
  rightSwitchIcon: React.ReactNode;
};

export function TabsCompact({
  listRef,
  phase,
  dragX,
  settleDirection,
  pressedSwitch,
  hasPrev,
  hasNext,
  prevLabel,
  currentLabel,
  nextLabel,
  switchMs,
  compactPrevAriaLabel = 'Предыдущая вкладка',
  compactNextAriaLabel = 'Следующая вкладка',
  onStartHoldSwitch,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  leftSwitchIcon,
  rightSwitchIcon,
}: TabsCompactProps) {
  return (
    <div className="tabs__list--compact" ref={listRef}>
      <button
        type="button"
        className={clsx(
          'tabs__switch',
          'tabs__switch--left',
          pressedSwitch === 'left' && 'is-pressed',
          phase === 'settling' && 'is-busy'
        )}
        disabled={!hasPrev}
        aria-label={compactPrevAriaLabel}
        aria-disabled={!hasPrev || phase === 'settling'}
        onPointerDown={() => onStartHoldSwitch('left')}
      >
        {leftSwitchIcon}
      </button>

      <div
        className={clsx('tabs__viewport', phase === 'dragging' && 'is-dragging')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <div
          className={clsx(
            'tabs__track',
            phase === 'dragging' && 'is-dragging',
            phase === 'settling' && 'is-settling',
            settleDirection === 'left' && 'is-settling-left',
            settleDirection === 'right' && 'is-settling-right'
          )}
          style={
            {
              '--tabs-drag-x': `${dragX}px`,
              '--tabs-switch-ms': `${switchMs}ms`,
            } as React.CSSProperties
          }
        >
          <div className="tabs__slide tabs__slide--prev">{prevLabel}</div>
          <div className="tabs__slide tabs__slide--current">{currentLabel}</div>
          <div className="tabs__slide tabs__slide--next">{nextLabel}</div>
        </div>
      </div>

      <button
        type="button"
        className={clsx(
          'tabs__switch',
          'tabs__switch--right',
          pressedSwitch === 'right' && 'is-pressed',
          phase === 'settling' && 'is-busy'
        )}
        disabled={!hasNext}
        aria-label={compactNextAriaLabel}
        aria-disabled={!hasNext || phase === 'settling'}
        onPointerDown={() => onStartHoldSwitch('right')}
      >
        {rightSwitchIcon}
      </button>
    </div>
  );
}
