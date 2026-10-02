import React, { useState } from 'react';
import { Heart, Copy, Check, Clock } from 'lucide-react';
import { GuestbookEntry } from '../types';
import { formatKoreanTimeAgo, generateAvatarColor } from '../utils/timeAgo';

interface EntryCardProps {
  entry: GuestbookEntry;
  onLike: (id: string) => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onLike }) => {
  const [copied, setCopied] = useState(false);

  const initial = entry.name.trim().charAt(0) || '익';
  const avatarGradient = generateAvatarColor(entry.name);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(`[${entry.name}] ${entry.message}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="group bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl p-5 transition-all duration-200 shadow-lg shadow-black/20 flex flex-col justify-between relative overflow-hidden">
      {/* Top Author & Time Bar */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm shadow-black/30`}
            >
              {initial}
            </div>

            {/* Author info */}
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-zinc-200 truncate group-hover:text-emerald-300 transition-colors">
                {entry.name}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-0.5">
                <Clock className="w-3 h-3 text-zinc-600" />
                <span>{formatKoreanTimeAgo(entry.timestamp)}</span>
              </div>
            </div>
          </div>

          {/* Emoji Badge */}
          <div className="text-2xl shrink-0 p-1.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 shadow-inner">
            {entry.emoji || '🎉'}
          </div>
        </div>

        {/* Message Content */}
        <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap break-words py-1">
          {entry.message}
        </p>
      </div>

      {/* Bottom Actions Bar */}
      <div className="pt-3 mt-3 border-t border-zinc-800/50 flex items-center justify-between">
        {/* Like Button */}
        <button
          onClick={() => onLike(entry.id)}
          aria-label="응원 하트 누르기"
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            entry.isLiked
              ? 'text-rose-400 bg-rose-950/40 border border-rose-500/30'
              : 'text-zinc-400 hover:text-rose-400 bg-zinc-950/40 border border-zinc-800/60 hover:border-rose-500/20'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${entry.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span className="text-[11px] font-mono">{entry.likes ?? 0}</span>
        </button>

        {/* Copy Button */}
        <button
          onClick={handleCopyText}
          aria-label="메시지 복사"
          title="응원글 복사하기"
          className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors cursor-pointer"
        >
          {copied ? (
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> 복사됨
            </span>
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
