import React from 'react';
import { MessageSquareDashed, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  isSearch: boolean;
  onResetSearch?: () => void;
  onFocusInput?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isSearch,
  onResetSearch,
  onFocusInput,
}) => {
  return (
    <div className="text-center py-16 px-4 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
      <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-400 mx-auto mb-3">
        <MessageSquareDashed className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-zinc-200">
        {isSearch ? '검색 결과가 없습니다' : '아직 등록된 응원글이 없습니다'}
      </h3>
      <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
        {isSearch
          ? '다른 검색어로 다시 시도해보시거나 필터를 초기화해 보세요.'
          : '첫 번째 응원의 주인공이 되어 따뜻한 한마디를 남겨보세요!'}
      </p>

      <div className="mt-4">
        {isSearch ? (
          <button
            onClick={onResetSearch}
            className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            검색어 초기화
          </button>
        ) : (
          <button
            onClick={onFocusInput}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-950 flex items-center gap-1.5 mx-auto transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            첫 번째 응원 남기기
          </button>
        )}
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-zinc-800" />
          <div className="space-y-1.5">
            <div className="w-20 h-3 bg-zinc-800 rounded" />
            <div className="w-12 h-2.5 bg-zinc-800/70 rounded" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-xl bg-zinc-800/70" />
      </div>
      <div className="space-y-2 py-1">
        <div className="w-full h-3 bg-zinc-800/80 rounded" />
        <div className="w-4/5 h-3 bg-zinc-800/60 rounded" />
      </div>
      <div className="pt-2 border-t border-zinc-800/40 flex justify-between">
        <div className="w-12 h-5 bg-zinc-800 rounded-lg" />
        <div className="w-5 h-5 bg-zinc-800/50 rounded" />
      </div>
    </div>
  );
};
