import React from 'react';
import { Table, RefreshCw, Settings, BookOpen, ExternalLink } from 'lucide-react';

interface NavbarProps {
  hasCustomUrl: boolean;
  totalCount: number;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hasCustomUrl,
  totalCount,
  isLoading,
  onRefresh,
  onOpenSettings,
  onOpenGuide,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-zinc-100">
                시트보드 <span className="text-emerald-400 font-semibold text-xs ml-0.5">SheetBoard</span>
              </h1>
              {/* Status Badge */}
              <button
                onClick={onOpenSettings}
                title="연동 상태 변경하기"
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  hasCustomUrl
                    ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60'
                    : 'bg-amber-950/50 border-amber-500/30 text-amber-300 hover:bg-amber-900/50'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    hasCustomUrl ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                {hasCustomUrl ? '구글 시트 연동 중' : '데모 모드'}
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 hidden sm:block">
              구글 스프레드시트 기반의 실시간 방명록 &amp; 게시판
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            aria-label="방명록 새로고침"
            title="최신 글 새로고침"
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded-xl transition-all cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {/* Guide Button */}
          <button
            onClick={onOpenGuide}
            className="px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-950 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">초보자용 가이드</span>
            <span className="sm:hidden">가이드</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-zinc-400" />
            <span className="hidden sm:inline">시트 연동 설정</span>
          </button>
        </div>
      </div>
    </header>
  );
};
