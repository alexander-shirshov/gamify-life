import type { TaskCategory, Task } from '@/types/task';

export const QUEST_BOARD_VIEW_MODES = ['grouped', 'list'] as const;

export type QuestBoardViewMode = (typeof QUEST_BOARD_VIEW_MODES)[number];
// export type QuestGrouping = 'category' | 'deadline' | 'none';

export type QuestBoardViewModesByScreen = {
  desktop: QuestBoardViewMode[];
  tablet: QuestBoardViewMode[];
  mobile: QuestBoardViewMode[];
  mobile_s: QuestBoardViewMode[];
};

export type CatGroupedQuestSection = {
  id: string;
  category: TaskCategory;
  quests: Task[];
};

export type QuestBoardViewDataMap = {
  list: {
    quests: Task[];
  };
  grouped: {
    sections: CatGroupedQuestSection[];
  };
};

export type QuestBoardViewData = {
  [K in QuestBoardViewMode]: {
    type: K;
  } & QuestBoardViewDataMap[K];
}[QuestBoardViewMode];
