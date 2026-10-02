import { GuestbookEntry } from '../types';

export const INITIAL_DEMO_ENTRIES: GuestbookEntry[] = [
  {
    id: 'demo_1',
    name: '김민준 개발자',
    message: '구글 스프레드시트를 DB로 활용하는 아이디어가 정말 실용적입니다! 별도의 백엔드 서버 없이도 바로 방명록이나 피드백 폼을 만들 수 있어 유용하네요 🚀',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
    emoji: '🚀',
    likes: 8,
  },
  {
    id: 'demo_2',
    name: '이지은',
    message: '다크 모드 디자인이 눈에 편하고 카드 애니메이션도 깔끔합니다. 새로운 프로젝트 런칭을 진심으로 축하드려요! 대박 나시길 응원합니다 ✨',
    timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(), // 1 hour ago
    emoji: '🎉',
    likes: 14,
  },
  {
    id: 'demo_3',
    name: '박서준 디자이너',
    message: '초보자도 따라 할 수 있는 Apps Script 가이드 덕분에 5분 만에 제 구글 시트 연결 성공했습니다! 커피 한 잔 후원하고 갑니다 ☕',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    emoji: '☕',
    likes: 5,
  },
  {
    id: 'demo_4',
    name: '최수현',
    message: '오늘 하루도 모두 힘내시고 행복한 코딩 되세요! 항상 응원하겠습니다 🍀',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1 day ago
    emoji: '🍀',
    likes: 19,
  },
  {
    id: 'demo_5',
    name: '정우성',
    message: '모바일에서도 반응형으로 아주 매끄럽게 작동하네요. 팀 프로젝트 문의 게시판으로도 활용해봐야겠습니다 🔥',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    emoji: '🔥',
    likes: 7,
  }
];

export const EMOJI_OPTIONS = [
  { emoji: '🎉', label: '축하' },
  { emoji: '🔥', label: '열정' },
  { emoji: '☕', label: '응원' },
  { emoji: '🍀', label: '행운' },
  { emoji: '💡', label: '영감' },
  { emoji: '❤️', label: '사랑' },
  { emoji: '🚀', label: '성장' },
  { emoji: '👏', label: '박수' },
];

export const QUICK_CHEER_PRESETS = [
  '새로운 시작을 진심으로 응원합니다! 🎉',
  '오늘도 멋진 하루 보내세요 힘내세요! 💪',
  '프로젝트 완성도 최고네요 대박나세요! 🚀',
  '항상 응원하고 있습니다 파이팅! 🍀',
];

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * [시트보드] 구글 스프레드시트 방명록 API (Google Apps Script)
 * 
 * [배포 방법]
 * 1. 스프레드시트 메뉴 > 확장 프로그램 > Apps Script에 이 코드를 붙여넣습니다.
 * 2. 상단 [배포] > [새 배포] 클릭
 * 3. 톱니바퀴 아이콘 > [웹 앱] 선택
 * 4. 설명: 방명록 API (자유 입력)
 * 5. 다음 사용자로 실행: '나 (내 계정)'
 * 6. 액세스 권한: '모든 사용자 (Anyone)' ★ 필수! (로그인 없이 누구나 작성 가능)
 * 7. [배포] 클릭 후 부여되는 '웹 앱 URL'을 복사하여 웹앱에 등록하세요.
 */

var SHEET_NAME = "시트1";

function getTargetSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0]; // 시트 이름이 다를 경우 첫 번째 시트 사용
  }
  // 헤더가 없으면 자동 생성
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["ID", "작성자", "응원메시지", "작성일시", "이모지"]);
    sheet.getRange(1, 1, 1, 5)
      .setFontWeight("bold")
      .setBackground("#18181b")
      .setFontColor("#10b981");
  }
  return sheet;
}

// GET 요청: 저장된 방명록 목록 불러오기
function doGet(e) {
  try {
    var sheet = getTargetSheet();
    var lastRow = sheet.getLastRow();
    var list = [];
    
    if (lastRow > 1) {
      // 2번째 행부터 데이터 가져오기 (1행은 헤더)
      var values = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
      for (var i = 0; i < values.length; i++) {
        var row = values[i];
        if (row[0] || row[1] || row[2]) {
          list.push({
            id: row[0] ? String(row[0]) : "row_" + (i + 2),
            name: row[1] ? String(row[1]) : "익명",
            message: row[2] ? String(row[2]) : "",
            timestamp: row[3] ? String(row[3]) : new Date().toISOString(),
            emoji: row[4] ? String(row[4]) : "🎉"
          });
        }
      }
    }
    
    // 최신 작성글이 상단에 오도록 역순 정렬
    list.reverse();
    
    var response = {
      status: "success",
      count: list.length,
      data: list
    };
    
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// POST 요청: 새로운 응원글 시트에 추가하기
function doPost(e) {
  try {
    var sheet = getTargetSheet();
    var payload = {};
    
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e.parameter) {
      payload = e.parameter;
    }
    
    var id = "msg_" + new Date().getTime();
    var name = payload.name ? String(payload.name).trim() : "익명";
    var message = payload.message ? String(payload.message).trim() : "";
    var timestamp = payload.timestamp || new Date().toISOString();
    var emoji = payload.emoji || "🎉";
    
    if (!message) {
      throw new Error("메시지 내용이 비어있습니다.");
    }
    
    // 시트 마지막 행에 추가
    sheet.appendRow([id, name, message, timestamp, emoji]);
    
    var result = {
      status: "success",
      message: "성공적으로 등록되었습니다.",
      data: {
        id: id,
        name: name,
        message: message,
        timestamp: timestamp,
        emoji: emoji
      }
    };
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;
