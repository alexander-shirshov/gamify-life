import React from 'react';
import clsx from 'clsx';

import type { TabsItem, TabsGlowState } from '../model/types';

type TabsRegularProps<TKey extends string> = {
  items: TabsItem<TKey>[];
  activeKey: TKey;
  glow: TabsGlowState;
  glowWidthCoef?: number;
  showGlow?: boolean;
  listRef: React.RefObject<HTMLDivElement | null>;
  setButtonRef: (key: TKey) => (node: HTMLButtonElement | null) => void;
  onChange: (next: TKey) => void;
};

export function TabsRegular<TKey extends string>({
  items,
  activeKey,
  glow,
  glowWidthCoef = 1,
  showGlow = true,
  listRef,
  setButtonRef,
  onChange,
}: TabsRegularProps<TKey>) {
  return (
    <div className="tabs__list" role="tablist" ref={listRef}>
      {showGlow && (
        <div
          className="tabs__glow"
          style={{
            transform: `translateX(${glow.x}px)`,
            width: glow.w * glowWidthCoef,
          }}
          aria-hidden="true"
        />
      )}

      {items.map((item, index) => {
        const isActive = item.key === activeKey;

        return (
          <React.Fragment key={item.key}>
            {index > 0 && <div className="tabs__separator" aria-hidden="true" />}

            <button
              ref={setButtonRef(item.key)}
              type="button"
              role="tab"
              className={clsx('tab', isActive && 'tab--active')}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(item.key)}
            >
              {item.label}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
