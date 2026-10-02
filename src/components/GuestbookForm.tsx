import React, { useState } from 'react';
import { Send, Loader2, Sparkles, Smile, User, MessageSquare } from 'lucide-react';
import { EMOJI_OPTIONS, QUICK_CHEER_PRESETS } from '../constants/initialData';

interface GuestbookFormProps {
  onSubmit: (data: { name: string; message: string; emoji: string }) => Promise<boolean>;
  isSubmitting: boolean;
  hasCustomUrl: boolean;
  onOpenGuide: () => void;
}

export const GuestbookForm: React.FC<GuestbookFormProps> = ({
  onSubmit,
  isSubmitting,
  hasCustomUrl,
  onOpenGuide,
}) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎉');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = name.trim() || '익명의 응원자';
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setErrorMessage('응원 한마디 메시지를 입력해 주세요!');
      return;
    }

    if (trimmedMessage.length > 300) {
      setErrorMessage('메시지는 최대 300자까지 작성할 수 있습니다.');
      return;
    }

    const success = await onSubmit({
      name: trimmedName,
      message: trimmedMessage,
      emoji: selectedEmoji,
    });

    if (success) {
      setMessage('');
      // Keep author name for convenience
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Decorative gradient blur in top corner */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Form Title & Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800/60">
        <div>
          <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <span>응원 한마디 남기기</span>
            <span className="text-xl">{selectedEmoji}</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            따뜻한 응원과 방명록 한 줄을 남겨주시면 큰 힘이 됩니다.
          </p>
        </div>

        {!hasCustomUrl && (
          <div className="text-[11px] text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 self-start sm:self-auto">
            <span>⚠️ [데모 모드] 브라우저에 임시 저장됩니다</span>
            <button
              type="button"
              onClick={onOpenGuide}
              className="text-amber-200 underline font-semibold cursor-pointer hover:text-white"
            >
              시트 연동
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input & Emoji Picker Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Author Name */}
          <div className="sm:col-span-5 relative">
            <label htmlFor="author-name" className="block text-[11px] font-semibold text-zinc-400 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-zinc-500" />
              작성자 이름 (닉네임)
            </label>
            <input
              id="author-name"
              type="text"
              maxLength={25}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 홍길동, 커피러버"
              className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors"
            />
          </div>

          {/* Emoji Badge Selector */}
          <div className="sm:col-span-7">
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1 flex items-center gap-1">
              <Smile className="w-3 h-3 text-zinc-500" />
              감정/테마 이모지 선택
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
              {EMOJI_OPTIONS.map((item) => {
                const isSelected = selectedEmoji === item.emoji;
                return (
                  <button
                    key={item.emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(item.emoji)}
                    className={`px-2.5 py-1.5 text-xs rounded-xl flex items-center gap-1 transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-950 scale-105'
                        : 'bg-zinc-950/60 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span className="text-[10px] hidden md:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="message-text" className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-zinc-500" />
              응원 메시지
            </label>
            <span className={`text-[10px] ${message.length > 280 ? 'text-amber-400 font-bold' : 'text-zinc-500'}`}>
              {message.length} / 300자
            </span>
          </div>

          <textarea
            id="message-text"
            rows={3}
            maxLength={300}
            value={message}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="응원의 한마디, 피드백, 축하 인사를 자유롭게 적어주세요! (Ctrl + Enter로 바로 등록)"
            className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors resize-none leading-relaxed"
          />

          {errorMessage && (
            <p className="text-xs text-rose-400 mt-1 font-medium flex items-center gap-1">
              <span>⚠️</span> {errorMessage}
            </p>
          )}
        </div>

        {/* Quick Presets */}
        <div>
          <div className="text-[10px] font-medium text-zinc-500 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400/80" />
            빠른 응원 문구 추천 (클릭 시 자동 입력):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_CHEER_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setMessage(preset);
                  if (errorMessage) setErrorMessage('');
                }}
                className="text-[11px] px-2.5 py-1 bg-zinc-950/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 rounded-lg transition-colors cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-zinc-500 hidden sm:inline">
            💡 작성된 글은 실시간 스프레드시트 또는 로컬 DB에 즉시 반영됩니다.
          </span>
          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>구글 시트에 등록 중...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>응원 등록하기</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
