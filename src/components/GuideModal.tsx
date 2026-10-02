import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Code2, BookOpen, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../constants/initialData';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseUrlPrompt?: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, onUseUrlPrompt }) => {
  const [activeTab, setActiveTab] = useState<'tutorial' | 'code' | 'faq'>('tutorial');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = GOOGLE_APPS_SCRIPT_CODE;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-zinc-900 border border-zinc-800 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                초보자를 위한 구글 시트 연동 가이드
                <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  무료 & 서버비 0원
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                구글 스프레드시트를 나만의 실시간 데이터베이스(DB)로 변환하는 초간단 방법
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="가이드 닫기"
            className="text-zinc-400 hover:text-zinc-200 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-zinc-800 bg-zinc-950/40 text-sm">
          <button
            onClick={() => setActiveTab('tutorial')}
            className={`pb-2.5 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'tutorial'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            단계별 튜토리얼 (5분 완성)
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-2.5 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Apps Script API 코드 (doGet / doPost)
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-2.5 px-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'faq'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            주의사항 & FAQ
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-zinc-300 text-sm leading-relaxed">
          {activeTab === 'tutorial' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-zinc-300 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-300 text-sm">구글 스프레드시트가 DB가 되는 원리</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    구글 앱스 스크립트(Google Apps Script)는 무료로 웹 API 엔드포인트를 제공합니다. 
                    우리가 제공하는 스크립트를 붙여넣고 배포하면, 방문자가 글을 쓸 때 자동으로 구글 시트 행에 한 줄씩 기록됩니다!
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-500/30">
                  1
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-zinc-100 flex items-center justify-between">
                    <span>구글 스프레드시트 새로 만들기</span>
                    <a
                      href="https://sheets.new"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      sheets.new 바로가기 <ExternalLink className="w-3 h-3" />
                    </a>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    구글 드라이브에서 빈 스프레드시트를 생성하고 제목을 원하는 이름(예: &lsquo;방명록 DB&rsquo;)으로 설정합니다.
                  </p>

                  {/* Visual Sheet Structure Diagram */}
                  <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="font-semibold text-zinc-300">📊 스프레드시트 컬럼 구조 (A ~ E열)</span>
                      <span className="text-emerald-400 font-mono">자동 생성 지원</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px] font-mono">
                        <thead>
                          <tr className="bg-zinc-900 border-b border-zinc-800 text-emerald-400">
                            <th className="p-2 border-r border-zinc-800 w-16">A열 (ID)</th>
                            <th className="p-2 border-r border-zinc-800 w-24">B열 (작성자)</th>
                            <th className="p-2 border-r border-zinc-800 min-w-36">C열 (응원메시지)</th>
                            <th className="p-2 border-r border-zinc-800 w-28">D열 (작성일시)</th>
                            <th className="p-2 w-16">E열 (이모지)</th>
                          </tr>
                        </thead>
                        <tbody className="text-zinc-400">
                          <tr className="border-b border-zinc-800/60 bg-zinc-950/80">
                            <td className="p-2 border-r border-zinc-800 text-zinc-500">msg_17280...</td>
                            <td className="p-2 border-r border-zinc-800 text-zinc-200">홍길동</td>
                            <td className="p-2 border-r border-zinc-800 text-zinc-300">화이팅입니다! 🔥</td>
                            <td className="p-2 border-r border-zinc-800 text-zinc-500">2026-10-01...</td>
                            <td className="p-2">🎉</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      💡 <strong className="text-zinc-200">미리 만들 필요가 없습니다!</strong> 스크립트가 첫 글 등록 또는 첫 조회 시 빈 시트임을 감지하면 위 1행 헤더를 <strong>자동으로 채워줍니다.</strong> 직접 작성해두고 싶다면 1행만 위처럼 입력해두셔도 좋습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-500/30">
                  2
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-zinc-100">Apps Script 편집기 열기</h3>
                  <p className="text-xs text-zinc-400">
                    스프레드시트 상단 메뉴에서 <strong className="text-zinc-200">[확장 프로그램]</strong> &gt; <strong className="text-zinc-200">[Apps Script]</strong>를 클릭합니다.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-500/30">
                  3
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-100">API 코드 붙여넣기</h3>
                    <button
                      onClick={handleCopyCode}
                      className="text-xs px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md flex items-center gap-1 font-medium transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? '복사 완료!' : '코드 원클릭 복사'}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400">
                    편집기 화면에 기본으로 적혀있는 <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">function myFunction() ...</code> 내용을 모두 지우고, 
                    두 번째 탭에 준비된 <strong className="text-emerald-400">doGet / doPost 스크립트 코드</strong>를 전체 붙여넣습니다. 그 후 저장(Ctrl+S 또는 디스켓 아이콘)을 누릅니다.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-500/30">
                  4
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-zinc-100 text-rose-300 flex items-center gap-2">
                    웹 앱으로 배포하기 (★ 가장 중요한 단계)
                  </h3>
                  <div className="space-y-2 text-xs text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <p>1. 우측 상단 파란색 <strong className="text-zinc-100">[배포]</strong> &gt; <strong className="text-zinc-100">[새 배포]</strong> 클릭</p>
                    <p>2. 좌측 톱니바퀴 아이콘 클릭 후 <strong className="text-zinc-100">[웹 앱]</strong> 선택</p>
                    <p>3. 설명: <span className="text-zinc-400">방명록 API</span> (자유롭게 입력)</p>
                    <p>4. 다음 사용자로 실행: <strong className="text-emerald-400">나 (내 계정)</strong></p>
                    <p className="p-2 bg-rose-950/40 border border-rose-500/30 rounded text-rose-200">
                      ⚠️ <strong>액세스 권한:</strong> 반드시 <strong className="text-rose-100 underline decoration-rose-400">모든 사용자 (Anyone)</strong>를 선택하세요! 
                      (&lsquo;나만&rsquo;으로 하면 브라우저에서 권한 오류가 발생합니다)
                    </p>
                    <p>5. 하단 <strong className="text-zinc-100">[배포]</strong> 버튼 클릭 후 권한 승인 창이 뜨면 계정 선택 &gt; &lsquo;고급&rsquo; &gt; &lsquo;이동(안전하지 않음)&rsquo; &gt; &lsquo;허용&rsquo;을 누릅니다.</p>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-500/30">
                  5
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-zinc-100">웹 앱 URL을 복사하여 연동하기</h3>
                  <p className="text-xs text-zinc-400">
                    배포가 완료되면 <code className="text-emerald-400 bg-zinc-950 px-1 py-0.5 rounded">https://script.google.com/macros/s/.../exec</code> 형태의 웹 앱 URL이 나타납니다.
                    이 URL을 복사하여 본 웹앱 상단의 [연동 설정] 창에 넣으면 즉시 구글 시트와 실시간 연동됩니다!
                  </p>
                  {onUseUrlPrompt && (
                    <button
                      onClick={() => {
                        onClose();
                        onUseUrlPrompt();
                      }}
                      className="mt-2 text-xs font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      지금 바로 연동 URL 입력하기 →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-zinc-200 text-sm">Google Apps Script 전체 코드</h3>
                  <p className="text-xs text-zinc-400">
                    GET(목록 조회)과 POST(신규 등록)을 모두 처리하는 완전한 코드입니다.
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-950"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '복사 완료!' : '전체 코드 복사'}
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl overflow-x-auto text-xs font-mono text-emerald-300 max-h-[420px] leading-relaxed selection:bg-emerald-800/40">
                  {GOOGLE_APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-zinc-200 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Q. 비용이나 구글 계정 요금이 발생하나요?
                </div>
                <p className="text-zinc-400 pl-6">
                  완전 무료입니다! 개인 구글 계정의 기본 Apps Script 할당량(일일 수만 건의 요청) 내에서 무료로 동작하므로 소규모 방명록, 동아리 게시판, 포트폴리오 피드백용으로 완벽합니다.
                </p>
              </div>

              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-zinc-200 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Q. 코드를 수정한 후 시트에 반영이 안 돼요!
                </div>
                <p className="text-zinc-400 pl-6">
                  Apps Script 코드를 수정하셨다면 반드시 <strong className="text-zinc-200">[배포] &gt; [배포 관리] &gt; 연필(수정) 아이콘 &gt; 버전: [새 버전]</strong>을 선택하고 다시 [배포]를 눌러야 새 코드가 적용됩니다.
                </p>
              </div>

              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-zinc-200 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Q. &lsquo;CORS 오류&rsquo;나 권한 거부 오류가 뜨나요?
                </div>
                <p className="text-zinc-400 pl-6">
                  배포 시 <strong className="text-zinc-200">&lsquo;액세스 권한: 모든 사용자 (Anyone)&rsquo;</strong>로 배포하지 않은 경우 브라우저 보안 정책에 의해 차단됩니다. 또한 본 웹앱은 preflight(OPTIONS) 통신 오류를 원천 차단하기 위해 Content-Type 최적화 처리가 적용되어 있습니다.
                </p>
              </div>

              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-zinc-200 text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Q. URL 없이도 테스트해볼 수 있나요?
                </div>
                <p className="text-zinc-400 pl-6">
                  네! URL을 등록하기 전에는 <strong className="text-emerald-400">[데모 모드]</strong>로 동작하여 모든 기능(글 작성, 좋아요, 검색, 정렬, 반응)을 웹 브라우저 내에서 즉시 체험해보실 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            구글 시트 연동 초간단 방명록 웹앱 &middot; SheetBoard
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
