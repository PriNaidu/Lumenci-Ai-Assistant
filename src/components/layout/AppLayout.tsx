import { Panel, Group, Separator } from 'react-resizable-panels';
import { ChatPanel } from '../chat/ChatPanel';
import { ClaimChart } from '../chart/ClaimChart';

export function AppLayout() {
  return (
    <Group orientation="horizontal" className="flex-1">
      <Panel defaultSize={40} minSize={25}>
        <ChatPanel />
      </Panel>
      <Separator className="w-1 bg-slate-200/60 hover:bg-primary-400 transition-all duration-200 cursor-col-resize hover:w-1.5" />
      <Panel defaultSize={60} minSize={30}>
        <ClaimChart />
      </Panel>
    </Group>
  );
}
