import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Link2, HelpCircle, RotateCcw, Database } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSaveUrl: (url: string) => Promise<boolean>;
  onResetDemo: () => void;
  onOpenGuide: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  onSaveUrl,
  onResetDemo,
  onOpenGuide,
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();

    if (!trimmed) {
      // Switching to demo mode
      await onSaveUrl('');
      setTestResult({
        success: true,
        message: '로컬 데모 모드로 전환되었습니다.',
      });
      setTimeout(() => {
        onClose();
      }, 1000);
      return;
    }

    if (!trimmed.startsWith('https://script.google.com/macros/s/')) {
      setTestResult({
        success: false,
        message: '올바른 구글 앱스 스크립트 웹 앱 URL 형태가 아닙니다. (https://script.google.com/macros/s/.../exec)',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const success = await onSaveUrl(trimmed);
    setIsTesting(false);

    if (success) {
      setTestResult({
        success: true,
        message: '구글 스프레드시트와 성공적으로 연결되었습니다!',
      });
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setTestResult({
        success: false,
        message: '스프레드시트 응답 확인 실패. 배포 시 "액세스 권한: 모든 사용자"로 설정되었는지 확인해 주세요.',
      });
    }
  };

  const handleClearToDemo = async () => {
    setUrlInput('');
    await onSaveUrl('');
    setTestResult({
      success: true,
      message: '로컬 데모 모드로 변경되었습니다.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">구글 시트 연동 설정</h2>
              <p className="text-xs text-zinc-400">Apps Script 웹 앱 URL을 등록하여 실시간 연동</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="설정 닫기"
            className="text-zinc-400 hover:text-zinc-200 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleTestAndSave} className="p-6 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="gas-url" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                구글 앱스 스크립트 웹 앱 URL
              </label>
              <button
                type="button"
                onClick={onOpenGuide}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline underline-offset-2"
              >
                <HelpCircle className="w-3 h-3" />
                URL 얻는 방법 보기
              </button>
            </div>

            <input
              id="gas-url"
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs font-mono text-zinc-100 placeholder:text-zinc-600 transition-colors outline-none"
            />
            <p className="text-[11px] text-zinc-500 leading-normal">
              입력란을 비워두고 저장하면 내장된 [로컬 데모 모드]로 안전하게 작동합니다.
            </p>
          </div>

          {/* Test Result Message */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{testResult.message}</span>
            </div>
          )}

          {/* Current Status Box */}
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs">
            <span className="text-zinc-400">현재 연동 상태:</span>
            <span className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  currentUrl ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="font-semibold text-zinc-200">
                {currentUrl ? '구글 스프레드시트 실시간 연동' : '로컬 데모 모드 (브라우저 저장)'}
              </span>
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              type="submit"
              disabled={isTesting}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  연결 상태 확인 중...
                </>
              ) : (
                '연결 테스트 및 저장'
              )}
            </button>

            {currentUrl && (
              <button
                type="button"
                onClick={handleClearToDemo}
                className="py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-xl transition-colors"
              >
                데모 모드로 전환
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onResetDemo();
                setTestResult({
                  success: true,
                  message: '데모 데이터가 초기 상태로 복원되었습니다.',
                });
              }}
              title="샘플 글 목록 초기화"
              className="py-2.5 px-3 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              샘플 복원
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
