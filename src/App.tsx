import { QuestLog } from '@/components/features/quest-log';
import { UIStateProvider } from '@/context/UIStateContext';

export default function App() {
  return (
    <UIStateProvider>
      <div className="app-screen"></div>
      <QuestLog />
    </UIStateProvider>
  );
}
