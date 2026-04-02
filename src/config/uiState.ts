import type { TabKey } from '@/components/features/quest-log/QuestTabs';
import type { QuestBoardViewMode } from '@/components/features/quest-log/model/types';

export type UIState = {
  activeQuestTab: TabKey;
  questBoardViewMode: QuestBoardViewMode;
};

export const DEFAULT_UI_STATE: UIState = {
  activeQuestTab: 'active',
  questBoardViewMode: 'grouped',
};
