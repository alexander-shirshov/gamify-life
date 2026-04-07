import type { Task, TaskCategory } from '@/types/task';
import QuestColumn from './QuestColumn';
import { DEFAULT_TASK_CREATE_CATEGORY } from '@/components/features/quest-log/model/constants';

type QuestBoardListViewProps = {
  quests: Task[];
  onOpenQuest: (id: string) => void;
  onToggleCompleteQuest: (questId: string) => void;
  onCreateQuest?: (category: TaskCategory) => void;
};

export function QuestBoardListView({
  quests,
  onOpenQuest,
  onToggleCompleteQuest,
  onCreateQuest,
}: QuestBoardListViewProps) {
  const handleCreateClick = onCreateQuest
    ? () => onCreateQuest(DEFAULT_TASK_CREATE_CATEGORY)
    : undefined;

  return (
    <section className="quest-board quest-board--1col" aria-label="Список заданий">
      <QuestColumn
        title="ЗАДАЧИ"
        quests={quests}
        onOpenQuest={onOpenQuest}
        onToggleCompleteQuest={onToggleCompleteQuest}
        onCreateClick={handleCreateClick}
      />
    </section>
  );
}
