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
        <p className="text-xs text-slate-400 bg-slate-100 rounded-full px-3 py-1">
          {message.content}
        </p>
      </div>
    );
  }

  const isUser = message.role === 'user';

  return (
    <div className={clsx('flex gap-2', isUser && 'flex-row-reverse')}>
      <div
        className={clsx(
          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1',
          isUser ? 'bg-primary-100' : 'bg-slate-200'
        )}
      >
        {isUser ? (
          <User size={14} className="text-primary-700" />
        ) : (
          <Bot size={14} className="text-slate-600" />
        )}
      </div>
      <div
        className={clsx(
          'max-w-[80%] rounded-xl px-4 py-2.5',
          isUser
            ? 'bg-primary-600 text-white'
            : 'bg-white border border-slate-200 text-slate-800'
        )}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="text-sm prose prose-sm prose-slate max-w-none">
            <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
          </div>
        )}
        <p
          className={clsx(
            'text-[10px] mt-1',
            isUser ? 'text-primary-200' : 'text-slate-400'
          )}
        >
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
