import clsx from 'clsx';
import Settings from '@/assets/icons/settings.svg?react';
import Minimize from '@/assets/icons/minimize.svg?react';
import Maximize from '@/assets/icons/maximize.svg?react';

type QuestEdgeControlsProps = {
  isControlsOpen: boolean;
  isFullscreen: boolean;
  needDrawer: boolean;
  onToggleControls: () => void;
  onToggleFullscreen: () => void;
};

export function QuestEdgeControls({
  isControlsOpen,
  isFullscreen,
  needDrawer,
  onToggleControls,
  onToggleFullscreen,
}: QuestEdgeControlsProps) {
  return (
    <div className="quest-edge-controls" aria-label="Служебные элементы интерфейса">
      <button
        type="button"
        className={clsx('quest-edge-controls__tab', 'quest-edge-controls__tab--fullscreen', {
          'is-active': isFullscreen,
        })}
        onClick={onToggleFullscreen}
        aria-pressed={isFullscreen}
        aria-label="Полноэкранный режим"
      >
        <span className="quest-edge-controls__icon" aria-hidden="true">
          {isFullscreen ? <Minimize /> : <Maximize />}
        </span>
      </button>

      {!isControlsOpen && needDrawer && (
        <button
          type="button"
          className={clsx('quest-edge-controls__tab', 'quest-edge-controls__tab--system')}
          onClick={onToggleControls}
          aria-expanded={isControlsOpen}
          aria-controls="quest-display-drawer"
          aria-label="Настройки отображения"
        >
          <span className="quest-edge-controls__icon" aria-hidden="true">
            <Settings />
          </span>
        </button>
      )}
    </div>
  );
}
