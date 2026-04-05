import { TAB_KEYS } from '@/components/features/tabs';
import { QUEST_BOARD_VIEW_MODES } from '@/components/features/quest-log/model';
import { DEFAULT_UI_STATE, type UIState } from '@/config/uiState';
import { type TabKey } from '@/components/features/tabs';
import type { QuestBoardViewMode } from '@/components/features/quest-log/model';

function isTabKey(value: unknown): value is TabKey {
  return typeof value === 'string' && TAB_KEYS.includes(value as TabKey);
}

function isViewMode(value: unknown): value is QuestBoardViewMode {
  return typeof value === 'string' && QUEST_BOARD_VIEW_MODES.includes(value as QuestBoardViewMode);
}

export function normalizeUIState(raw: unknown): UIState {
  // 1. Проверяем, что raw — объект
  if (typeof raw !== 'object' || raw === null) {
    return DEFAULT_UI_STATE;
  }

  // 2. Безопасно извлекаем поля (raw может не иметь этих ключей)
  const rawObj = raw as Record<string, unknown>;

  // 3. Проверяем каждое поле
  const activeQuestTab = isTabKey(rawObj.activeQuestTab)
    ? rawObj.activeQuestTab
    : DEFAULT_UI_STATE.activeQuestTab;

  const questBoardViewMode = isViewMode(rawObj.questBoardViewMode)
    ? rawObj.questBoardViewMode
    : DEFAULT_UI_STATE.questBoardViewMode;

  // 4. Возвращаем объект, соответствующий UIState
  return { activeQuestTab, questBoardViewMode };
}
