// contexts/UIStateContext.tsx
import { createContext, useContext, type ReactNode } from 'react';
import { useUIStateStorage } from '@/hooks/useUIStateStorage';
import type { UIState } from '@/config';

type UIStateContextValue = {
  state: UIState;
  updateField: <K extends keyof UIState>(key: K, value: UIState[K]) => void;
};

const UIStateContext = createContext<UIStateContextValue | null>(null);

export function UIStateProvider({ children }: { children: ReactNode }) {
  const { state, updateField } = useUIStateStorage();

  return (
    <UIStateContext.Provider value={{ state, updateField }}>{children}</UIStateContext.Provider>
  );
}

export function useUIState() {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUI must be used within UIStateProvider');
  }

  const setActiveQuestTab = (tab: UIState['activeQuestTab']) => {
    context.updateField('activeQuestTab', tab);
  };

  const setQuestBoardViewMode = (mode: UIState['questBoardViewMode']) => {
    context.updateField('questBoardViewMode', mode);
  };

  return {
    state: context.state,
    updateField: context.updateField,
    setActiveQuestTab,
    setQuestBoardViewMode,
  };
}
