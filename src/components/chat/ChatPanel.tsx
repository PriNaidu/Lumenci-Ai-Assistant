import { MessageCircle } from 'lucide-react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export function ChatPanel() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-50 to-slate-100/50">
      <div className="px-4 py-3 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary-100 flex items-center justify-center">
            <MessageCircle size={13} className="text-primary-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-700">AI Chat</h2>
            <p className="text-[11px] text-slate-400">
              Select an element, then ask for refinements
            </p>
          </div>
        </div>
      </div>
      <MessageList />
      <ChatInput />
    </div>
  );
}
