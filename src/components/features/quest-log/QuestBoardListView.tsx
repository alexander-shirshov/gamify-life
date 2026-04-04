import type { Task } from '@/types/task';
import QuestColumn from './QuestColumn';

type QuestBoardListViewProps = {
  quests: Task[];
  onOpenQuest: (id: string) => void;
  onToggleCompleteQuest: (questId: string) => void;
};

export function QuestBoardListView({
  quests,
  onOpenQuest,
  onToggleCompleteQuest,
}: QuestBoardListViewProps) {
  return (
    <section className="quest-board quest-board--1col" aria-label="Список заданий">
      <QuestColumn
        title="ЗАДАЧИ"
        quests={quests}
        onOpenQuest={onOpenQuest}
        onToggleCompleteQuest={onToggleCompleteQuest}
      />
    </section>
  );
}
