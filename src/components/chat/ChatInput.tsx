import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useChartStore } from '../../stores/chartStore';
import { useChatSubmit } from '../../hooks/useChatSubmit';
import { clsx } from 'clsx';

const GENERAL_SUGGESTIONS = [
  'Strengthen weak evidence',
  'Add missing features',
  'Explain reasoning',
];

const ELEMENT_SUGGESTIONS = [
  'Strengthen the evidence',
  'Clarify claim language',
  'Improve product mapping',
  'Find missing citations',
];

export function ChatInput() {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = useChatStore((s) => s.isLoading);
  const messages = useChatStore((s) => s.messages);
  const selectedElementId = useChartStore((s) => s.selectedElementId);
  const submitMessage = useChatSubmit();

  const userMessages = messages.filter((m) => m.role === 'user');
  const showSuggestions = !isLoading && userMessages.length === 0;
  const suggestions = selectedElementId ? ELEMENT_SUGGESTIONS : GENERAL_SUGGESTIONS;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  async function handleSubmit(message?: string) {
    const trimmed = (message ?? text).trim();
    if (!trimmed || isLoading) return;
    setText('');
    await submitMessage(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const placeholder = selectedElementId
    ? 'Ask about the selected element...'
    : 'Ask about the claim chart...';

  return (
    <div className="p-3 border-t border-slate-200/80 bg-white/80 backdrop-blur-sm shrink-0">
      {selectedElementId && (
        <div className="mb-2 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-xs text-primary-700 bg-primary-50 rounded-lg px-2.5 py-1 font-medium border border-primary-100">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            Element selected
          </span>
        </div>
      )}
      {showSuggestions && (
        <div className="mb-2.5 flex flex-wrap gap-2">
          {suggestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSubmit(q)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-all shadow-sm hover:shadow"
            >
              {q}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className="w-full resize-none pl-3.5 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 disabled:opacity-50 placeholder:text-slate-400 bg-slate-50/50 transition-all"
          />
        </div>
        <button
          onClick={() => handleSubmit()}
          disabled={!text.trim() || isLoading}
          className={clsx(
            'p-2.5 rounded-xl transition-all shrink-0',
            text.trim() && !isLoading
              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-md shadow-primary-200 hover:shadow-lg'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          )}
        >
          <ArrowUp size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
