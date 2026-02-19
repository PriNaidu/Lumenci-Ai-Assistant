import { clsx } from 'clsx';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage as ChatMessageType } from '../../types';
import { formatTimestamp } from '../../lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === 'system') {
    return (
      <div className="flex justify-center">
        <p className="text-[11px] text-slate-400 bg-slate-100/80 rounded-full px-3.5 py-1 border border-slate-200/50">
          {message.content}
        </p>
      </div>
    );
  }

  const isUser = message.role === 'user';

  return (
    <div className={clsx('flex gap-2.5', isUser && 'flex-row-reverse')}>
      <div
        className={clsx(
          'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-sm',
          isUser
            ? 'bg-gradient-to-br from-primary-500 to-primary-700'
            : 'bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/50'
        )}
      >
        {isUser ? (
          <User size={13} className="text-white" />
        ) : (
          <Bot size={13} className="text-slate-600" />
        )}
      </div>
      <div
        className={clsx(
          'max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm',
          isUser
            ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white'
            : 'bg-white border border-slate-200/80 text-slate-800'
        )}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          <div className="text-sm prose prose-sm prose-slate max-w-none [&>p]:leading-relaxed">
            <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
          </div>
        )}
        <p
          className={clsx(
            'text-[10px] mt-1.5',
            isUser ? 'text-primary-200' : 'text-slate-400'
          )}
        >
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
