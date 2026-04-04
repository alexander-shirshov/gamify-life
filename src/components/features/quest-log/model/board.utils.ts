import type { Task, TaskCategory } from '@/types/task';
import { TASK_CATEGORIES } from '@/types/common';
import type { CatGroupedQuestSection, QuestBoardViewData, QuestBoardViewMode } from './';

function assertNever(value: never): never {
  throw new Error(`Unhandled quest board view mode: ${String(value)}`);
}

function buildGroupedSections(quests: Task[]): CatGroupedQuestSection[] {
  const byCategory: Record<TaskCategory, Task[]> = TASK_CATEGORIES.reduce(
    (a, c) => {
      a[c] = [];
      return a;
    },
    {} as Record<TaskCategory, Task[]>
  );

  for (const quest of quests) {
    byCategory[quest.category].push(quest);
  }

  return TASK_CATEGORIES.reduce<CatGroupedQuestSection[]>((a, c) => {
    a.push({ id: c, category: c, quests: byCategory[c] });
    return a;
  }, []);
}

export function buildQuestBoardViewData(
  quests: Task[],
  viewMode: QuestBoardViewMode
): QuestBoardViewData {
  switch (viewMode) {
    case 'list':
      return {
        type: viewMode,
        quests,
      };

    case 'grouped':
      return {
        type: viewMode,
        sections: buildGroupedSections(quests),
      };

    default:
      return assertNever(viewMode);
  }
}
