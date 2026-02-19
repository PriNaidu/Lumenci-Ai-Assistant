import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export function ChatPanel() {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="px-4 py-3 border-b border-slate-200 bg-white shrink-0">
        <h2 className="text-sm font-semibold text-slate-700">AI Chat</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Select an element, then ask for refinements
        </p>
      </div>
      <MessageList />
      <ChatInput />
    </div>
  );
}
