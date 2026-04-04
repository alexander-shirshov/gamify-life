import { useMemo } from 'react';
import { type Task } from '@/types/task';
import { type TaskCategory } from '@/types/task';
import { buildQuestBoardViewData, type QuestBoardViewMode } from './model';
import { QuestBoardGroupedView } from './QuestBoardGroupedView';
import { QuestBoardListView } from './QuestBoardListView';

type QuestBoardProps = {
  quests: Task[];
  viewMode: QuestBoardViewMode;
  onOpenQuest: (id: string) => void;
  onToggleCompleteQuest: (questId: string) => void;
  onCreateQuest?: (category: TaskCategory) => void;
};

export function QuestBoard({
  quests,
  viewMode,
  onCreateQuest,
  onOpenQuest,
  onToggleCompleteQuest,
}: QuestBoardProps) {
  const viewData = useMemo(() => {
    return buildQuestBoardViewData(quests, viewMode);
  }, [quests, viewMode]);

  if (viewData.type === 'list') {
    return (
      <QuestBoardListView
        quests={viewData.quests}
        onOpenQuest={onOpenQuest}
        onToggleCompleteQuest={onToggleCompleteQuest}
      />
    );
  }
  return (
    <QuestBoardGroupedView
      sections={viewData.sections}
      onOpenQuest={onOpenQuest}
      onToggleCompleteQuest={onToggleCompleteQuest}
      onCreateQuest={onCreateQuest}
    />
  );
}
