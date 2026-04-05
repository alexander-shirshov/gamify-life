import { useCallback } from 'react';
import { STORAGE_KEYS, DEFAULT_UI_STATE, type UIState } from '@/config';
import { normalizeUIState } from '@/utils/ui/normalizeUIState';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function useUIStateStorage() {
  const [state, setState] = useLocalStorage<UIState>(
    STORAGE_KEYS.uiPrefs,
    DEFAULT_UI_STATE,
    normalizeUIState
  );

  const updateField = useCallback(
    <K extends keyof UIState>(key: K, value: UIState[K]) => {
      setState(prev => ({ ...prev, [key]: value }));
    },
    [setState]
  );

  return {
    state,
    updateField,
  };
}
