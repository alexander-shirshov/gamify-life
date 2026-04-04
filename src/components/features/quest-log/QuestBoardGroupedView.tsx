import type { TaskCategory } from '@/types/task';
import QuestColumn from './QuestColumn';
import type { CatGroupedQuestSection } from './model';

type QuestBoardGroupedViewProps = {
  sections: CatGroupedQuestSection[];
  onOpenQuest: (id: string) => void;
  onToggleCompleteQuest: (questId: string) => void;
  onCreateQuest?: (category: TaskCategory) => void;
};

export function QuestBoardGroupedView({
  sections,
  onOpenQuest,
  onToggleCompleteQuest,
  onCreateQuest,
}: QuestBoardGroupedViewProps) {
  return (
    <section
      className={`quest-board quest-board--${sections.length}col`}
      aria-label="Доска заданий"
    >
      {sections.map(section => (
        <QuestColumn
          key={section.id}
          category={section.category}
          quests={section.quests}
          onOpenQuest={onOpenQuest}
          onToggleCompleteQuest={onToggleCompleteQuest}
          onCreateQuest={onCreateQuest}
        />
      ))}
    </section>
  );
}
