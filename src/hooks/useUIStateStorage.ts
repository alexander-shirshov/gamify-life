import { useCallback } from 'react';
import { STORAGE_KEYS, DEFAULT_UI_STATE, type UIState } from '@/config';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function useUIStateStorage() {
  const [state, setState] = useLocalStorage<UIState>(STORAGE_KEYS.uiPrefs, DEFAULT_UI_STATE);

  const updateField = useCallback(<K extends keyof UIState>(key: K, value: UIState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    state,
    updateField,
  };
}
