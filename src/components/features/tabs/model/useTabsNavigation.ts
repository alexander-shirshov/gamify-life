import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { TabsDirection, TabsPhase, TabsPointerState, TabsItem } from './types';
import { getAdjacentTab, getTabIndex } from './tabs.utils';

type UseTabsNavigationParams<TKey extends string> = {
  items: TabsItem<TKey>[];
  value: TKey;
  onChange: (next: TKey) => void;
  switchMs: number;
  holdStartDelayMs: number;
  holdRepeatMs: number;
  swipeTriggerPx: number;
  swipeLockRatio: number;
};

type UseTabsNavigationReturn<TKey extends string> = {
  displayedTab: TKey;
  pressedSwitch: TabsDirection | null;
  phase: TabsPhase;
  dragX: number;
  settleDirection: TabsDirection | null;

  currentIndex: number;
  hasPrev: boolean;
  hasNext: boolean;
  prevTab: TKey | null;
  nextTab: TKey | null;

  goToTab: (next: TKey) => void;
  goPrev: () => void;
  goNext: () => void;
  goFirst: () => void;
  goLast: () => void;

  startHoldSwitch: (direction: TabsDirection) => void;

  handleCompactPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleCompactPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleCompactPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleCompactPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
};

export function useTabsNavigation<TKey extends string>({
  items,
  value,
  onChange,
  switchMs,
  holdStartDelayMs,
  holdRepeatMs,
  swipeTriggerPx,
  swipeLockRatio,
}: UseTabsNavigationParams<TKey>): UseTabsNavigationReturn<TKey> {
  const phaseRef = useRef<TabsPhase>('idle');
  const scheduleNextHoldStepRef = useRef<(() => void) | null>(null);

  const [displayedTab, setDisplayedTab] = useState<TKey>(value);
  const [pressedSwitch, setPressedSwitch] = useState<TabsDirection | null>(null);
  const [phase, setPhase] = useState<TabsPhase>('idle');
  const [dragX, setDragX] = useState(0);
  const [settleDirection, setSettleDirection] = useState<TabsDirection | null>(null);

  const displayedTabRef = useRef(displayedTab);
  const pressedSwitchRef = useRef<TabsDirection | null>(null);

  const holdDelayRef = useRef<number | null>(null);
  const holdRepeatRef = useRef<number | null>(null);
  const settleTimeoutRef = useRef<number | null>(null);

  const repeatEnabledRef = useRef(false);

  const pointerStateRef = useRef<TabsPointerState>({
    pointerId: null,
    startX: 0,
    startY: 0,
    lockedAxis: null,
  });

  useEffect(() => {
    displayedTabRef.current = displayedTab;
  }, [displayedTab]);

  useEffect(() => {
    pressedSwitchRef.current = pressedSwitch;
  }, [pressedSwitch]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const currentIndex = useMemo(() => getTabIndex(items, displayedTab), [items, displayedTab]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const prevTab = hasPrev ? items[currentIndex - 1].key : null;
  const nextTab = hasNext ? items[currentIndex + 1].key : null;

  const clearHoldTimers = useCallback((): void => {
    if (holdDelayRef.current !== null) {
      window.clearTimeout(holdDelayRef.current);
      holdDelayRef.current = null;
    }

    if (holdRepeatRef.current !== null) {
      window.clearTimeout(holdRepeatRef.current);
      holdRepeatRef.current = null;
    }
  }, []);

  const clearSettleTimer = useCallback((): void => {
    if (settleTimeoutRef.current !== null) {
      window.clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = null;
    }
  }, []);

  const goToTab = useCallback(
    (next: TKey): void => {
      if (phaseRef.current === 'settling') return;
      if (displayedTabRef.current === next) return;

      displayedTabRef.current = next;
      phaseRef.current = 'idle';

      clearSettleTimer();
      setDisplayedTab(next);
      setPhase('idle');
      setDragX(0);
      setSettleDirection(null);
      onChange(next);
    },
    [clearSettleTimer, onChange]
  );

  const goPrev = useCallback((): void => {
    const current = displayedTabRef.current;
    const prev = getAdjacentTab(items, current, 'left');
    if (!prev) return;
    goToTab(prev);
  }, [goToTab, items]);

  const goNext = useCallback((): void => {
    const current = displayedTabRef.current;
    const next = getAdjacentTab(items, current, 'right');
    if (!next) return;
    goToTab(next);
  }, [goToTab, items]);

  const goFirst = useCallback((): void => {
    const first = items[0]?.key;
    if (!first) return;
    goToTab(first);
  }, [goToTab, items]);

  const goLast = useCallback((): void => {
    const last = items[items.length - 1]?.key;
    if (!last) return;
    goToTab(last);
  }, [goToTab, items]);

  const stopHoldSwitch = useCallback((): void => {
    clearHoldTimers();
    repeatEnabledRef.current = false;
    pressedSwitchRef.current = null;
    setPressedSwitch(null);
  }, [clearHoldTimers]);

  const finishSwitch = useCallback(
    (next: TKey): void => {
      displayedTabRef.current = next;
      phaseRef.current = 'idle';

      setDisplayedTab(next);
      setPhase('idle');
      setDragX(0);
      setSettleDirection(null);
      onChange(next);

      if (repeatEnabledRef.current && pressedSwitchRef.current) {
        scheduleNextHoldStepRef.current?.();
      }
    },
    [onChange]
  );

  const commitSwitch = useCallback(
    (direction: TabsDirection): boolean => {
      if (phaseRef.current === 'settling') return false;

      const current = displayedTabRef.current;
      const next = getAdjacentTab(items, current, direction);

      if (!next) return false;

      phaseRef.current = 'settling';
      setPhase('settling');
      setSettleDirection(direction);

      clearSettleTimer();
      settleTimeoutRef.current = window.setTimeout(() => {
        finishSwitch(next);
      }, switchMs);

      return true;
    },
    [clearSettleTimer, finishSwitch, items, switchMs]
  );

  const scheduleNextHoldStep = useCallback((): void => {
    if (!repeatEnabledRef.current || !pressedSwitchRef.current) return;

    clearHoldTimers();

    holdRepeatRef.current = window.setTimeout(() => {
      const direction = pressedSwitchRef.current;

      if (!repeatEnabledRef.current || !direction) return;

      const moved = commitSwitch(direction);

      if (!moved) {
        stopHoldSwitch();
      }
    }, holdRepeatMs);
  }, [clearHoldTimers, commitSwitch, holdRepeatMs, stopHoldSwitch]);

  useEffect(() => {
    scheduleNextHoldStepRef.current = scheduleNextHoldStep;
  }, [scheduleNextHoldStep]);

  const startHoldSwitch = useCallback(
    (direction: TabsDirection): void => {
      if (phaseRef.current === 'settling') return;

      setPressedSwitch(direction);
      pressedSwitchRef.current = direction;

      repeatEnabledRef.current = false;
      clearHoldTimers();

      const switched = commitSwitch(direction);

      if (!switched) {
        setPressedSwitch(null);
        pressedSwitchRef.current = null;
        return;
      }

      holdDelayRef.current = window.setTimeout(() => {
        if (pressedSwitchRef.current !== direction) return;

        repeatEnabledRef.current = true;
        scheduleNextHoldStep();
      }, holdStartDelayMs);
    },
    [clearHoldTimers, commitSwitch, holdStartDelayMs, scheduleNextHoldStep]
  );

  useEffect(() => {
    return () => {
      clearHoldTimers();
      clearSettleTimer();
    };
  }, [clearHoldTimers, clearSettleTimer]);

  useEffect(() => {
    if (!pressedSwitch) return;

    const handleGlobalPointerUp = () => {
      stopHoldSwitch();
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [pressedSwitch, stopHoldSwitch]);

  useEffect(() => {
    if (phaseRef.current === 'settling' || phase === 'dragging') return;
    if (displayedTab === value) return;

    displayedTabRef.current = value;
    setDisplayedTab(value);
  }, [displayedTab, phase, value]);

  const handleCompactPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>): void => {
    if (phaseRef.current === 'settling') return;

    pointerStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lockedAxis: null,
    };

    setPhase('dragging');
    setDragX(0);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const handleCompactPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>): void => {
      const state = pointerStateRef.current;
      if (phaseRef.current !== 'dragging' || state.pointerId !== e.pointerId) return;

      const deltaX = e.clientX - state.startX;
      const deltaY = e.clientY - state.startY;

      if (!state.lockedAxis) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX < 6 && absY < 6) return;

        state.lockedAxis = absX > absY * swipeLockRatio ? 'x' : 'y';
      }

      if (state.lockedAxis === 'y') {
        setPhase('idle');
        setDragX(0);
        return;
      }

      const current = displayedTabRef.current;
      const currentItemIndex = getTabIndex(items, current);
      const localHasPrev = currentItemIndex > 0;
      const localHasNext = currentItemIndex < items.length - 1;

      if (deltaX > 0 && !localHasPrev) {
        setDragX(deltaX * 0.22);
        return;
      }

      if (deltaX < 0 && !localHasNext) {
        setDragX(deltaX * 0.22);
        return;
      }

      setDragX(deltaX);
    },
    [items, swipeLockRatio]
  );

  const finishPointerInteraction = useCallback(
    (pointerId?: number): void => {
      const state = pointerStateRef.current;

      if (pointerId !== undefined && state.pointerId !== pointerId) return;

      pointerStateRef.current = {
        pointerId: null,
        startX: 0,
        startY: 0,
        lockedAxis: null,
      };

      if (phaseRef.current !== 'dragging') {
        setDragX(0);
        setPhase('idle');
        return;
      }

      const currentDrag = dragX;
      const current = displayedTabRef.current;
      const currentItemIndex = getTabIndex(items, current);
      const localPrevTab = currentItemIndex > 0 ? items[currentItemIndex - 1].key : null;
      const localNextTab =
        currentItemIndex < items.length - 1 ? items[currentItemIndex + 1].key : null;

      if (Math.abs(currentDrag) < swipeTriggerPx) {
        setPhase('idle');
        setDragX(0);
        return;
      }

      if (currentDrag < 0 && localNextTab) {
        phaseRef.current = 'settling';
        setPhase('settling');
        setSettleDirection('right');

        clearSettleTimer();
        settleTimeoutRef.current = window.setTimeout(() => {
          finishSwitch(localNextTab);
        }, switchMs);

        return;
      }

      if (currentDrag > 0 && localPrevTab) {
        phaseRef.current = 'settling';
        setPhase('settling');
        setSettleDirection('left');

        clearSettleTimer();
        settleTimeoutRef.current = window.setTimeout(() => {
          finishSwitch(localPrevTab);
        }, switchMs);

        return;
      }

      setPhase('idle');
      setDragX(0);
    },
    [clearSettleTimer, dragX, finishSwitch, items, swipeTriggerPx, switchMs]
  );

  const handleCompactPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>): void => {
      finishPointerInteraction(e.pointerId);
    },
    [finishPointerInteraction]
  );

  const handleCompactPointerCancel = useCallback(
    (e: React.PointerEvent<HTMLDivElement>): void => {
      finishPointerInteraction(e.pointerId);
    },
    [finishPointerInteraction]
  );

  return {
    displayedTab,
    pressedSwitch,
    phase,
    dragX,
    settleDirection,
    currentIndex,
    hasPrev,
    hasNext,
    prevTab,
    nextTab,
    goToTab,
    goPrev,
    goNext,
    goFirst,
    goLast,
    startHoldSwitch,
    handleCompactPointerDown,
    handleCompactPointerMove,
    handleCompactPointerUp,
    handleCompactPointerCancel,
  };
}
