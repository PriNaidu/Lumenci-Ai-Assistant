import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useChartStore } from '../../stores/chartStore';
import { useChatSubmit } from '../../hooks/useChatSubmit';
import { clsx } from 'clsx';

export function ChatInput() {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = useChatStore((s) => s.isLoading);
  const selectedElementId = useChartStore((s) => s.selectedElementId);
  const submitMessage = useChatSubmit();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  async function handleSubmit() {
    const trimmed = text.trim();
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
    ? 'Ask about the selected element... (Ctrl+Enter to send)'
    : 'Select an element or ask a general question... (Ctrl+Enter to send)';

  return (
    <div className="p-3 border-t border-slate-200 bg-white shrink-0">
      {selectedElementId && (
        <div className="mb-2 flex items-center gap-1">
          <span className="text-xs text-primary-600 bg-primary-50 rounded px-2 py-0.5">
            Element selected
          </span>
        </div>
      )}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 placeholder:text-slate-400"
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading}
          className={clsx(
            'p-2 rounded-lg transition-colors shrink-0',
            text.trim() && !isLoading
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          )}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
