import { useMemo } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { BREAKPOINTS, type Breakpoint } from '@/config/index';
import { AVAILABLE_VIEW_MODES } from '../model';
import type { QuestBoardViewMode } from '@/components/features/quest-log/model/types';

type AvailableQuestViewModesResult = {
  availableViewModes: QuestBoardViewMode[];
  currentScreen: Breakpoint;
};

export function useAvailableQuestViewModes(): AvailableQuestViewModesResult {
  const isMobileS = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile_s}px)`, {
    defaultValue: false,
    initializeWithValue: true,
  });

  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile}px)`, {
    defaultValue: false,
    initializeWithValue: true,
  });

  const isTablet = useMediaQuery(`(max-width: ${BREAKPOINTS.tablet}px)`, {
    defaultValue: false,
    initializeWithValue: true,
  });

  const currentScreen = useMemo(() => {
    if (isMobileS) return 'mobile_s';
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  }, [isMobileS, isMobile, isTablet]);

  const availableViewModes = AVAILABLE_VIEW_MODES[currentScreen];

  return {
    availableViewModes,
    currentScreen,
  };
}
