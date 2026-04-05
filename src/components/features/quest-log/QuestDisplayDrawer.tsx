import clsx from 'clsx';
import type { QuestBoardViewMode } from './model';
import { useEffect } from 'react';
import Settings from '@/assets/icons/settings.svg?react';

type QuestDisplayDrawerProps = {
  isOpen: boolean;
  availableViewModes: QuestBoardViewMode[];
  preferredViewMode: QuestBoardViewMode;
  onClose: () => void;
  onChangeViewMode: (mode: QuestBoardViewMode) => void;
};

export function QuestDisplayDrawer({
  isOpen,
  availableViewModes,
  preferredViewMode,
  onClose,
  onChangeViewMode,
}: QuestDisplayDrawerProps) {
  const canSelectViewMode = availableViewModes.length > 1;

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, isOpen]);

  return (
    <>
      <div
        className={clsx('quest-display-drawer__backdrop', {
          'is-open': isOpen,
        })}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="quest-display-drawer"
        className={clsx('quest-display-drawer', {
          'is-open': isOpen,
        })}
        aria-label="Настройки отображения"
      >
        <button
          type="button"
          className={clsx('quest-display-drawer__handle', {
            'is-active': isOpen,
          })}
          onClick={onClose}
          aria-label="Закрыть настройки отображения"
        >
          <span className="quest-display-drawer__handleIcon" aria-hidden="true">
            <Settings />
          </span>
        </button>

        <div className="quest-display-drawer__panel">
          <div className="quest-display-drawer__header">
            <div className="quest-display-drawer__titleBlock">
              <p className="quest-display-drawer__eyebrow">SYSTEM CONFIG</p>
              <h2 className="quest-display-drawer__title">DISPLAY SETTINGS</h2>
            </div>
          </div>

          <div className="quest-display-drawer__body">
            {canSelectViewMode && (
              <section className="quest-display-drawer__section">
                <p className="quest-display-drawer__sectionLabel">VIEW MODE</p>

                <div className="quest-display-drawer__modeToggle">
                  {availableViewModes.includes('grouped') && (
                    <button
                      type="button"
                      className={clsx('quest-display-drawer__modeBtn', {
                        'is-active': preferredViewMode === 'grouped',
                      })}
                      onClick={() => onChangeViewMode('grouped')}
                    >
                      GROUPED
                    </button>
                  )}

                  {availableViewModes.includes('list') && (
                    <button
                      type="button"
                      className={clsx('quest-display-drawer__modeBtn', {
                        'is-active': preferredViewMode === 'list',
                      })}
                      onClick={() => onChangeViewMode('list')}
                    >
                      LIST
                    </button>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
