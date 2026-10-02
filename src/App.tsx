/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  Sparkles,
  ExternalLink,
  Info,
  ShieldAlert,
  Layers,
} from 'lucide-react';

import { GuestbookEntry, SortOption } from './types';
import { INITIAL_DEMO_ENTRIES, EMOJI_OPTIONS } from './constants/initialData';
import { Navbar } from './components/Navbar';
import { GuestbookForm } from './components/GuestbookForm';
import { EntryCard } from './components/EntryCard';
import { GuideModal } from './components/GuideModal';
import { SettingsModal } from './components/SettingsModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { EmptyState, CardSkeleton } from './components/EmptyState';

const STORAGE_KEY_URL = 'sheetboard_gas_url';
const STORAGE_KEY_DEMO_DATA = 'sheetboard_demo_entries';
const STORAGE_KEY_LIKES = 'sheetboard_liked_ids';

export default function App() {
  const [gasUrl, setGasUrl] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_URL) || '';
  });

  const [entries, setEntries] = useState<GuestbookEntry[]>(() => {
    if (!localStorage.getItem(STORAGE_KEY_URL)) {
      const saved = localStorage.getItem(STORAGE_KEY_DEMO_DATA);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return INITIAL_DEMO_ENTRIES;
        }
      }
      return INITIAL_DEMO_ENTRIES;
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEmojiFilter, setSelectedEmojiFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  // Liked IDs tracker
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LIKES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, description }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#6ee7b7', '#f59e0b', '#38bdf8'],
      });
    } catch {
      // ignore
    }
  };

  // Fetch entries from Google Apps Script
  const fetchFromGas = useCallback(
    async (urlToFetch: string, showToast = false): Promise<boolean> => {
      if (!urlToFetch) return false;
      setIsLoading(true);

      try {
        const response = await fetch(urlToFetch, {
          method: 'GET',
          redirect: 'follow',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        let items: GuestbookEntry[] = [];

        if (Array.isArray(data)) {
          items = data;
        } else if (data && data.status === 'success' && Array.isArray(data.data)) {
          items = data.data;
        } else if (data && Array.isArray(data.data)) {
          items = data.data;
        } else {
          throw new Error('응답 데이터 형식이 올바르지 않습니다.');
        }

        // Apply like state from local storage
        const hydratedItems = items.map((item) => ({
          ...item,
          likes: item.likes || 0,
          isLiked: likedIds[item.id] || false,
        }));

        setEntries(hydratedItems);

        if (showToast) {
          addToast('success', '새로고침 완료', `구글 시트에서 ${items.length}개의 응원글을 불러왔습니다.`);
        }
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (showToast) {
          addToast(
            'error',
            '시트 데이터 조회 실패',
            `구글 시트에 연결할 수 없습니다: ${msg}. 배포 권한이 '모든 사용자(Anyone)'인지 확인해주세요.`
          );
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [likedIds, addToast]
  );

  // Initial load
  useEffect(() => {
    if (gasUrl) {
      fetchFromGas(gasUrl);
    } else {
      setIsLoading(false);
    }
  }, [gasUrl, fetchFromGas]);

  // Handle Save URL from Settings Modal
  const handleSaveGasUrl = async (newUrl: string): Promise<boolean> => {
    const trimmed = newUrl.trim();
    if (!trimmed) {
      // Switched to demo mode
      localStorage.removeItem(STORAGE_KEY_URL);
      setGasUrl('');
      // Load demo data
      const saved = localStorage.getItem(STORAGE_KEY_DEMO_DATA);
      setEntries(saved ? JSON.parse(saved) : INITIAL_DEMO_ENTRIES);
      addToast('info', '데모 모드 활성화', '로컬 데모 모드로 변경되었습니다.');
      return true;
    }

    const success = await fetchFromGas(trimmed, false);
    if (success) {
      localStorage.setItem(STORAGE_KEY_URL, trimmed);
      setGasUrl(trimmed);
      addToast('success', '구글 시트 연동 성공!', '스프레드시트와 실시간으로 동기화됩니다.');
      return true;
    } else {
      return false;
    }
  };

  // Reset Demo Data
  const handleResetDemo = () => {
    localStorage.removeItem(STORAGE_KEY_DEMO_DATA);
    setEntries(INITIAL_DEMO_ENTRIES);
    addToast('info', '초기화 완료', '데모 방명록 데이터가 초기 상태로 복구되었습니다.');
  };

  // Submit new cheer entry
  const handleSubmitEntry = async (data: {
    name: string;
    message: string;
    emoji: string;
  }): Promise<boolean> => {
    setIsSubmitting(true);
    const newId = 'msg_' + Date.now();
    const newEntry: GuestbookEntry = {
      id: newId,
      name: data.name,
      message: data.message,
      emoji: data.emoji,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    if (gasUrl) {
      try {
        // Send as text/plain to avoid CORS OPTIONS preflight issues with Google Apps Script
        const response = await fetch(gasUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify({
            name: data.name,
            message: data.message,
            emoji: data.emoji,
            timestamp: newEntry.timestamp,
          }),
          redirect: 'follow',
        });

        if (!response.ok) {
          // If response not ok, check text
          const errText = await response.text();
          throw new Error(errText || '전송 실패');
        }

        // Successfully written to Google Sheets
        triggerConfetti();
        addToast(
          'success',
          '구글 시트에 등록 완료!',
          '스프레드시트에 새로운 행이 성공적으로 추가되었습니다.'
        );

        // Optimistically prepend to entries list and re-fetch
        setEntries((prev) => [newEntry, ...prev]);
        setTimeout(() => {
          fetchFromGas(gasUrl);
        }, 1200);

        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        addToast(
          'error',
          '등록 중 오류 발생',
          `구글 시트에 저장하지 못했습니다 (${msg}). 배포 설정에서 '액세스 권한: 모든 사용자'를 확인하세요.`
        );
        return false;
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Local Demo Mode
      await new Promise((resolve) => setTimeout(resolve, 500)); // simulate slight network delay for realism
      const updated = [newEntry, ...entries];
      setEntries(updated);
      localStorage.setItem(STORAGE_KEY_DEMO_DATA, JSON.stringify(updated));

      triggerConfetti();
      addToast(
        'success',
        '응원글이 등록되었습니다!',
        '현재 데모 모드이므로 브라우저에 저장되었습니다. 구글 시트에 저장하려면 [가이드]를 참고하세요.'
      );

      setIsSubmitting(false);
      return true;
    }
  };

  // Like / Heart Toggle
  const handleLike = (id: string) => {
    const isCurrentlyLiked = likedIds[id];
    const updatedLiked = { ...likedIds, [id]: !isCurrentlyLiked };
    setLikedIds(updatedLiked);
    localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(updatedLiked));

    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id === id) {
          const currentLikes = entry.likes ?? 0;
          return {
            ...entry,
            isLiked: !isCurrentlyLiked,
            likes: !isCurrentlyLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1),
          };
        }
        return entry;
      })
    );
  };

  // Filtered and Sorted entries
  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        // Emoji filter
        if (selectedEmojiFilter !== 'all' && entry.emoji !== selectedEmojiFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = entry.name.toLowerCase().includes(q);
          const matchMsg = entry.message.toLowerCase().includes(q);
          return matchName || matchMsg;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'likes') {
          return (b.likes ?? 0) - (a.likes ?? 0);
        }
        if (sortBy === 'oldest') {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        }
        // default latest
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  }, [entries, selectedEmojiFilter, searchQuery, sortBy]);

  const totalCheerCount = entries.length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Navigation Header */}
      <Navbar
        hasCustomUrl={Boolean(gasUrl)}
        totalCount={totalCheerCount}
        isLoading={isLoading}
        onRefresh={() => {
          if (gasUrl) {
            fetchFromGas(gasUrl, true);
          } else {
            addToast('info', '데모 모드 새로고침', '로컬 저장소의 최신 데이터를 확인했습니다.');
          }
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Banner Alert for Demo Mode */}
        {!gasUrl && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-emerald-950/30 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-zinc-100">
                  현재 <span className="text-amber-400">[로컬 데모 모드]</span>로 동작하고 있습니다.
                </p>
                <p className="text-zinc-400 mt-0.5">
                  나만의 구글 스프레드시트에 영구 저장하려면 [초보자용 가이드]를 통해 웹 앱 URL을 연동하세요.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                가이드 &amp; 코드 보기
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-950"
              >
                URL 연동하기
              </button>
            </div>
          </div>
        )}

        {/* Top Hero Card & Form */}
        <GuestbookForm
          onSubmit={handleSubmitEntry}
          isSubmitting={isSubmitting}
          hasCustomUrl={Boolean(gasUrl)}
          onOpenGuide={() => setIsGuideOpen(true)}
        />

        {/* Section Header: Search, Filters & Counters */}
        <section className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <span>남겨진 응원 목록</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-emerald-400 border border-zinc-700/60 font-mono">
                  {totalCheerCount}개
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {gasUrl
                  ? '구글 스프레드시트와 실시간으로 동기화되는 방명록 피드입니다.'
                  : '방문객들이 남긴 따뜻한 메시지들을 둘러보세요.'}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="작성자 또는 메시지 검색..."
                className="w-full pl-9 pr-3.5 py-2 bg-zinc-900/90 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs text-zinc-200 placeholder:text-zinc-600 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar: Emoji chips & Sorting */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-zinc-800/80">
            {/* Emoji filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-xs">
              <button
                onClick={() => setSelectedEmojiFilter('all')}
                className={`px-3 py-1 rounded-xl font-medium transition-colors cursor-pointer shrink-0 ${
                  selectedEmojiFilter === 'all'
                    ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-sm'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                전체 ({entries.length})
              </button>

              {EMOJI_OPTIONS.map((item) => {
                const count = entries.filter((e) => e.emoji === item.emoji).length;
                if (count === 0 && selectedEmojiFilter !== item.emoji) return null;
                return (
                  <button
                    key={item.emoji}
                    onClick={() =>
                      setSelectedEmojiFilter(
                        selectedEmojiFilter === item.emoji ? 'all' : item.emoji
                      )
                    }
                    className={`px-2.5 py-1 rounded-xl flex items-center gap-1 transition-colors cursor-pointer shrink-0 ${
                      selectedEmojiFilter === item.emoji
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span className="font-mono text-[11px] text-zinc-500">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-2.5 py-1 text-xs outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="latest">최신순</option>
                <option value="oldest">오래된순</option>
                <option value="likes">좋아요순</option>
              </select>
            </div>
          </div>

          {/* Cards Grid / Loading / Empty */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : filteredEntries.length === 0 ? (
            <EmptyState
              isSearch={Boolean(searchQuery) || selectedEmojiFilter !== 'all'}
              onResetSearch={() => {
                setSearchQuery('');
                setSelectedEmojiFilter('all');
              }}
              onFocusInput={() => {
                const el = document.getElementById('message-text');
                el?.focus();
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {filteredEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} onLike={handleLike} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950 py-8 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">시트보드 SheetBoard</span>
            <span>&middot;</span>
            <span>Google Apps Script &times; Google Sheets API</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Apps Script 코드 및 가이드
            </button>
            <span>&middot;</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              연동 설정
            </button>
          </div>
        </div>
      </footer>

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onUseUrlPrompt={() => setIsSettingsOpen(true)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUrl={gasUrl}
        onSaveUrl={handleSaveGasUrl}
        onResetDemo={handleResetDemo}
        onOpenGuide={() => {
          setIsSettingsOpen(false);
          setIsGuideOpen(true);
        }}
      />
    </div>
  );
}
