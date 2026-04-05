import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  type CreateTaskData,
  type Task,
  type TaskCategory,
  type UpdateTaskData,
} from '@/types/task';
import { type TabKey } from '@/components/features/tabs';

import { QuestBoard } from '@/components/features/quest-log/QuestBoard';
import QuestFrame from '@/components/features/quest-log/QuestFrame';
import { QuestTabs } from '@/components/features/quest-log/QuestTabs';
import { QuestModal } from '@/components/features/quest-modal/QuestModal';
import { QuestEdgeControls } from './QuestEdgeControls';
import { QuestDisplayDrawer } from './QuestDisplayDrawer';

import { useTasks } from '@/hooks/useTasks';
import { useQuestBoardViewMode } from './hooks';
import { useUIState } from '@/context/UIStateContext';

type ModalState =
  | { mode: 'view'; questId: string }
  | { mode: 'edit'; questId: string }
  | { mode: 'create'; initialCategory?: TaskCategory }
  | null;

const predicateByTab: Record<TabKey, (task: Task) => boolean> = {
  active: task => !task.completed,
  done: task => task.completed,
  daily: task => task.title === 'DAILY',
  archive: task => task.title === 'ARCHIVED',
};

export function QuestLog() {
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { tasks, createTask, markCompleted, markIncomplete, updateTask } = useTasks();
  const { state, setActiveQuestTab } = useUIState();
  const [modal, setModal] = useState<ModalState>(null);

  const { preferredViewMode, effectiveViewMode, availableViewModes, setPreferredViewMode } =
    useQuestBoardViewMode();

  const canOpenDisplayDrawer = availableViewModes.length > 1;

  const { activeQuestTab } = state;

  const handleToggleControls = useCallback(() => {
    setIsControlsOpen(prev => !prev);
  }, []);

  const handleCloseControls = useCallback(() => {
    setIsControlsOpen(false);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const handleCompleteToggle = useCallback(
    (questId: string): void => {
      const task = tasks.find(task => task.id === questId);

      if (!task) return;

      if (task.completed) {
        markIncomplete(task.id);
        return;
      }
      markCompleted(task.id);
    },
    [tasks, markCompleted, markIncomplete]
  );

  const handleModalClose = useCallback(() => {
    setModal(null);
  }, []);

  const handleCompleteInModal = useCallback(
    (questId: string): void => {
      handleCompleteToggle(questId);
      handleModalClose();
    },
    [handleCompleteToggle, handleModalClose]
  );

  const handleTaskUpdateModal = useCallback(
    (id: string, updates: UpdateTaskData) => {
      updateTask(id, updates);
      handleModalClose();
    },
    [handleModalClose, updateTask]
  );

  const handleTaskCreateModal = useCallback(
    (data: CreateTaskData) => {
      createTask(data);
      handleModalClose();
    },
    [createTask, handleModalClose]
  );

  const handleOpenCreate = useCallback(() => setModal({ mode: 'create' }), []);
  const handleOpenCreateWithCat = useCallback(
    (cat: TaskCategory) => setModal({ mode: 'create', initialCategory: cat }),
    []
  );

  const handleRequestEdit = useCallback(
    (id: string) => setModal({ mode: 'edit', questId: id }),
    []
  );

  const handleOpenQuest = useCallback((id: string) => setModal({ mode: 'view', questId: id }), []);

  const visibleQuests = useMemo(() => {
    return tasks.filter(predicateByTab[activeQuestTab]);
  }, [activeQuestTab, tasks]);

  const questForModal = useMemo(() => {
    if (modal && modal?.mode !== 'create') {
      return tasks.find(task => task.id === modal.questId);
    }
    return null;
  }, [modal, tasks]);

  useEffect(() => {
    if (isControlsOpen && !canOpenDisplayDrawer) {
      handleCloseControls();
    }
  }, [isControlsOpen, canOpenDisplayDrawer, handleCloseControls]);

  return (
    <>
      {/* Header */}
      <main className="quest-log">
        <section className="quest-log__container container">
          <QuestFrame className="quest-log__frame">
            <div className="quest-log__content">
              <div className="quest-log__shell">
                <QuestEdgeControls
                  isControlsOpen={isControlsOpen}
                  isFullscreen={isFullscreen}
                  needDrawer={canOpenDisplayDrawer}
                  onToggleControls={handleToggleControls}
                  onToggleFullscreen={handleToggleFullscreen}
                />
                {canOpenDisplayDrawer && (
                  <QuestDisplayDrawer
                    isOpen={isControlsOpen}
                    availableViewModes={availableViewModes}
                    preferredViewMode={preferredViewMode}
                    onClose={handleCloseControls}
                    onChangeViewMode={setPreferredViewMode}
                  />
                )}

                <header className="quest-log__header">
                  <h1 className="quest-log__title">QUEST LOG</h1>
                  <button
                    className="qbtn qbtn--primary qbtn--cta"
                    type="button"
                    onClick={handleOpenCreate}
                  >
                    НОВАЯ МИССИЯ
                  </button>
                </header>
                <QuestTabs value={activeQuestTab} onChange={setActiveQuestTab} />
                <div className="quest-log__tabsDivider" />
                <div className="quest-log__body">
                  <QuestBoard
                    quests={visibleQuests}
                    viewMode={effectiveViewMode}
                    onOpenQuest={handleOpenQuest}
                    onToggleCompleteQuest={handleCompleteToggle}
                    onCreateQuest={handleOpenCreateWithCat}
                  />
                </div>
              </div>
            </div>
          </QuestFrame>
        </section>
        {modal && modal.mode === 'view' && questForModal && (
          <QuestModal
            mode="view"
            quest={questForModal}
            onClose={handleModalClose}
            onComplete={handleCompleteInModal}
            onRequestEdit={handleRequestEdit}
          />
        )}

        {modal && modal.mode === 'edit' && questForModal && (
          <QuestModal
            mode="edit"
            quest={questForModal}
            onClose={handleModalClose}
            onUpdate={handleTaskUpdateModal}
          />
        )}

        {modal && modal.mode === 'create' && (
          <QuestModal
            mode="create"
            initialCategory={modal.initialCategory}
            existingTasks={tasks}
            onClose={handleModalClose}
            onCreate={handleTaskCreateModal}
          />
        )}
      </main>
    </>
  );
}
