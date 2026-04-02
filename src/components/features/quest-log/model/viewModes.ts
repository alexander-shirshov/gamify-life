import type { QuestBoardViewMode } from './types';

type QuestBoardViewModesByScreen = {
  desktop: QuestBoardViewMode[];
  tablet: QuestBoardViewMode[];
  mobile: QuestBoardViewMode[];
  mobile_s: QuestBoardViewMode[];
};

export const AVAILABLE_VIEW_MODES: QuestBoardViewModesByScreen = {
  desktop: ['grouped', 'list'],
  tablet: ['grouped', 'list'],
  mobile: ['list'],
  mobile_s: ['list'],
};
