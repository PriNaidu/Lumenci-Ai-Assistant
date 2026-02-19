import { useEffect, useRef } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { useSuggestionStore } from '../../stores/suggestionStore';
import { ChatMessage } from './ChatMessage';
import { SuggestionCard } from '../suggestion/SuggestionCard';
import { MessageSquare } from 'lucide-react';

export function MessageList() {
  const messages = useChatStore((s) => s.messages);
  const suggestions = useSuggestionStore((s) => s.suggestions);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, suggestions]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.length === 0 && (
        <div className="text-center mt-16 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={22} className="text-slate-400" />
          </div>
          <p className="font-semibold text-slate-600 mb-1">No messages yet</p>
          <p className="text-sm text-slate-400 max-w-[220px] mx-auto leading-relaxed">
            Select a claim element from the chart and ask the AI to refine it.
          </p>
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id} className="animate-fade-in">
          <ChatMessage message={msg} />
          {msg.suggestionId &&
            suggestions
              .filter((s) => s.id === msg.suggestionId)
              .map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
          {msg.role === 'assistant' &&
            !msg.suggestionId &&
            suggestions
              .filter(
                (s) =>
                  s.timestamp >= msg.timestamp &&
                  s.timestamp <= msg.timestamp + 1000
              )
              .map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
