import { useLayoutEffect, useRef, useState } from 'react';

import type { TabsGlowState } from './types';

type UseTabsGlowParams<TKey extends string> = {
  activeKey: TKey;
  isEnabled: boolean;
  padding?: number;
};

type UseTabsGlowReturn<TKey extends string> = {
  glow: TabsGlowState;
  listRef: React.RefObject<HTMLDivElement | null>;
  setButtonRef: (key: TKey) => (node: HTMLButtonElement | null) => void;
};

export function useTabsGlow<TKey extends string>({
  activeKey,
  isEnabled,
  padding = 0,
}: UseTabsGlowParams<TKey>): UseTabsGlowReturn<TKey> {
  const listRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<TKey, HTMLButtonElement | null>>(
    {} as Record<TKey, HTMLButtonElement | null>
  );

  const [glow, setGlow] = useState<TabsGlowState>({ x: 0, w: 0 });

  useLayoutEffect(() => {
    if (!isEnabled) return;

    let raf = 0;

    const recalc = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const list = listRef.current;
        const btn = btnRefs.current[activeKey];

        if (!list || !btn) return;

        const listBox = list.getBoundingClientRect();
        const btnBox = btn.getBoundingClientRect();

        setGlow({
          x: btnBox.left - listBox.left + padding,
          w: Math.max(0, btnBox.width - padding * 2),
        });
      });
    };

    recalc();
    window.addEventListener('resize', recalc);

    const list = listRef.current;
    let ro: ResizeObserver | null = null;

    if (list && 'ResizeObserver' in window) {
      ro = new ResizeObserver(recalc);
      ro.observe(list);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', recalc);
      ro?.disconnect();
    };
  }, [activeKey, isEnabled, padding]);

  const setButtonRef =
    (key: TKey) =>
    (node: HTMLButtonElement | null): void => {
      btnRefs.current[key] = node;
    };

  return {
    glow,
    listRef,
    setButtonRef,
  };
}
