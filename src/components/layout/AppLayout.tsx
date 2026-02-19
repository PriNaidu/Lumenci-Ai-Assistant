import { Panel, Group, Separator } from 'react-resizable-panels';
import { ChatPanel } from '../chat/ChatPanel';
import { ClaimChart } from '../chart/ClaimChart';

export function AppLayout() {
  return (
    <Group orientation="horizontal" className="flex-1">
      <Panel defaultSize={40} minSize={25}>
        <ChatPanel />
      </Panel>
      <Separator className="w-1.5 bg-slate-200 hover:bg-primary-300 transition-colors cursor-col-resize" />
      <Panel defaultSize={60} minSize={30}>
        <ClaimChart />
      </Panel>
    </Group>
  );
}
