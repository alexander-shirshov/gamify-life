import { useMemo } from 'react';
import { useUIState } from '@/context/UIStateContext';
import type { QuestBoardViewMode } from '../model/types';
import { useAvailableQuestViewModes } from './useAvailableQuestViewModes';

const FALLBACK_VIEW_MODE: QuestBoardViewMode = 'list';

export function useQuestBoardViewMode() {
  const { state, setQuestBoardViewMode } = useUIState();
  const { availableViewModes, currentScreen } = useAvailableQuestViewModes();

  const preferredViewMode = state.questBoardViewMode;

  const effectiveViewMode = useMemo<QuestBoardViewMode>(() => {
    if (availableViewModes.includes(preferredViewMode)) {
      return preferredViewMode;
    }

    return FALLBACK_VIEW_MODE;
  }, [availableViewModes, preferredViewMode]);

  return {
    currentScreen,
    preferredViewMode,
    effectiveViewMode,
    availableViewModes,
    setPreferredViewMode: setQuestBoardViewMode,
  };
}
