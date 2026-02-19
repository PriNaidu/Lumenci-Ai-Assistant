import { useEffect, useRef } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { useSuggestionStore } from '../../stores/suggestionStore';
import { ChatMessage } from './ChatMessage';
import { SuggestionCard } from '../suggestion/SuggestionCard';

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
        <div className="text-center text-slate-400 text-sm mt-12">
          <p className="font-medium text-slate-500 mb-1">No messages yet</p>
          <p>Select a claim element and ask the AI to refine it.</p>
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id}>
          <ChatMessage message={msg} />
          {msg.suggestionId &&
            suggestions
              .filter((s) => s.id === msg.suggestionId)
              .map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
          {/* Also render suggestions that reference this message */}
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
