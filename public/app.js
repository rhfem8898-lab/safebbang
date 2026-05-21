const { useState, useEffect, useRef, useMemo } = React;

// 토스 스타일 디자인 시스템
const C = {
  // 배경
  bg: '#ffffff', 
  bgSubtle: '#f2f4f6',   // 토스 카드 배경
  bgHover: '#e5e8eb',
  
  // 경계선
  border: '#e5e8eb', 
  borderStrong: '#d1d6db',
  
  // 텍스트
  text: '#191f28',       // 토스 검정
  textMid: '#4e5968',    // 토스 중간 회색
  textLight: '#8b95a1',  // 토스 옅은 회색
  
  // 상태 컬러
  blue: '#3182f6',       // 토스 시그니처 블루
  blueBg: '#e8f3ff',
  blueDark: '#1b64da',
  
  red: '#f04452', 
  redBg: '#fde8eb',
  
  orange: '#f59e0b', 
  orangeBg: '#fef3c7',
  
  yellow: '#facc15', 
  yellowBg: '#fef9c3',
  
  green: '#22c55e', 
  greenBg: '#dcfce7',
};

// SVG 아이콘 컴포넌트들 (lucide 대신)
const Icon = ({ d, size = 16, color = 'currentColor', fill = 'none', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);
const Shield = (p) => <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const Link2 = (p) => <Icon {...p} d={<g><path d="M9 17H7A5 5 0 017 7h2"/><path d="M15 7h2a5 5 0 010 10h-2"/><line x1="8" y1="12" x2="16" y2="12"/></g>} />;
const Camera = (p) => <Icon {...p} d={<g><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></g>} />;
const Upload = (p) => <Icon {...p} d={<g><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></g>} />;
const X = (p) => <Icon {...p} d={<g><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></g>} />;
const ChevronRight = (p) => <Icon {...p} d="M9 18l6-6-6-6" />;
const ChevronDown = (p) => <Icon {...p} d="M6 9l6 6 6-6" />;
const MapPin = (p) => <Icon {...p} d={<g><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></g>} />;
const Loader = (p) => <Icon {...p} d={<g><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></g>} />;
const AlertCircle = (p) => <Icon {...p} d={<g><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></g>} />;
const Quote = (p) => <Icon {...p} fill={p.fill || "currentColor"} d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h2.5c0 4-3 4-3.5 4M14 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h2.5c0 4-3 4-3.5 4" />;
const ThumbsUp = (p) => <Icon {...p} d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />;
const ThumbsDown = (p) => <Icon {...p} d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />;
const Check = (p) => <Icon {...p} d="M20 6L9 17l-5-5" />;
const TrendingDown = (p) => <Icon {...p} d={<g><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></g>} />;
const User = (p) => <Icon {...p} d={<g><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></g>} />;
const Sparkles = (p) => <Icon {...p} fill={p.fill || "currentColor"} d="M12 2l2.5 7H22l-6 4.5L18.5 21 12 16.5 5.5 21 8 13.5 2 9h7.5z" />;
const Bookmark = (p) => <Icon {...p} fill={p.fill || "none"} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />;
const BookmarkCheck = (p) => <Icon {...p} fill={p.fill || "currentColor"} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />;
const BarChart = (p) => <Icon {...p} d={<g><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></g>} />;
const External = (p) => <Icon {...p} d={<g><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></g>} />;
const SettingsIcon = (p) => <Icon {...p} d={<g><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></g>} />;
const Spinner = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2"/>
    <path d="M22 12a10 10 0 00-10-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// 사이트 감지
function detectSite(url) {
  try {
    const u = new URL(url);
    const host = u.hostname;
    
    // 스마트스토어 (먼저 체크 - 더 구체적)
    if (host.includes('smartstore.naver.com') || host.includes('brand.naver.com'))
      return { id: 'smartstore', name: '스마트스토어', color: '#03c75a', emoji: '🛒', supported: true };
    
    // 네이버 플레이스 (장소)
    if (host.includes('naver.com') || host.includes('naver.me')) 
      return { id: 'naver', name: '네이버 플레이스', color: '#03c75a', emoji: '🟢', supported: true };
    
    if (host.includes('yanolja.com')) 
      return { id: 'yanolja', name: '야놀자', color: '#ff3d6e', emoji: '🛏', supported: false };
    if (host.includes('goodchoice.kr')) 
      return { id: 'goodchoice', name: '여기어때', color: '#ff5e3a', emoji: '🏨', supported: false };
    if (host.includes('airbnb')) 
      return { id: 'airbnb', name: '에어비앤비', color: '#ff385c', emoji: '🏠', supported: false };
    return { id: 'unknown', name: u.hostname, color: C.text, emoji: '🔗', supported: false };
  } catch (e) { return null; }
}

const isValidUrl = (str) => { try { new URL(str); return true; } catch (e) { return false; } };

// 텍스트 덩어리에서 네이버 URL 추출
// 예: "[네이버지도]\n식당명\n주소\nhttps://naver.me/xxx" → "https://naver.me/xxx"
function extractNaverUrl(text) {
  if (!text) return null;
  
  // 1. 그대로 유효한 URL이면 반환
  const trimmed = text.trim();
  if (isValidUrl(trimmed)) return trimmed;
  
  // 2. 텍스트에서 URL 패턴 추출 (네이버 우선)
  // 정규식: http(s)://로 시작하는 모든 URL
  const urlPattern = /(https?:\/\/[^\s"'<>)\]]+)/g;
  const matches = text.match(urlPattern);
  
  if (!matches || matches.length === 0) return null;
  
  // 3. 네이버 도메인 URL 우선 선택
  const naverPatterns = ['naver.me', 'naver.com', 'me2.do'];
  for (const pattern of naverPatterns) {
    const found = matches.find(url => url.includes(pattern));
    if (found) {
      // URL 끝의 구두점 제거 (예: "url." → "url")
      return found.replace(/[.,;:!?)\]\}>]+$/, '');
    }
  }
  
  // 4. 네이버 URL 없으면 첫 번째 URL 반환
  return matches[0].replace(/[.,;:!?)\]\}>]+$/, '');
}

// 텍스트에서 장소 이름 추출 (선택적 - 자동 입력용)
function extractPlaceName(text) {
  if (!text) return null;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  // [네이버지도] 다음 줄이 보통 장소명
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].includes('[네이버지도]') || lines[i].includes('[네이버 지도]')) {
      return lines[i + 1] || null;
    }
  }
  
  // [네이버지도] 없으면 첫 줄 (URL 아닌 줄)
  for (const line of lines) {
    if (!line.startsWith('http') && !line.includes('://') && line.length < 50) {
      return line;
    }
  }
  return null;
}

const isMobile = () => typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

async function compressImage(file, maxDim = 1568, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = Math.round((height * maxDim) / width); width = maxDim; }
          else { width = Math.round((width * maxDim) / height); height = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('이미지 오류'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('파일 오류'));
    reader.readAsDataURL(file);
  });
}

// API 호출 헬퍼
async function callAPI(endpoint, body) {
  let res;
  try {
    res = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (e) {
    throw new Error('네트워크 오류. 인터넷 연결 확인.');
  }
  
  // 응답을 텍스트로 먼저 받기 (JSON이 아닐 수도 있어서)
  const text = await res.text();
  
  // 빈 응답 처리
  if (!text || text.trim() === '') {
    throw new Error(`서버 응답 없음 (${res.status}). 함수 타임아웃 가능성. 다시 시도해주세요.`);
  }
  
  // JSON 파싱 시도
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    // JSON이 아닌 응답 = Vercel 에러 페이지 등
    console.error('JSON 파싱 실패:', text.substring(0, 200));
    if (text.includes('FUNCTION_INVOCATION_TIMEOUT') || text.includes('timeout')) {
      throw new Error('분석이 너무 오래 걸렸어요 (60초 초과). 다시 시도하거나 다른 장소로 시도해주세요.');
    }
    if (text.includes('FUNCTION_INVOCATION_FAILED')) {
      throw new Error('서버 함수 실행 실패. Vercel 로그 확인 필요.');
    }
    if (text.includes('NOT_FOUND') || res.status === 404) {
      throw new Error('API 경로를 찾을 수 없습니다. 배포 확인 필요.');
    }
    throw new Error(`서버 응답 오류 (${res.status}): ${text.substring(0, 100)}`);
  }
  
  if (!res.ok) {
    throw new Error(data.error || `오류 ${res.status}`);
  }
  
  return data;
}

function App() {
  const [view, setView] = useState('home');
  const [url, setUrl] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [result, setResult] = useState(null);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [analyzeStage, setAnalyzeStage] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [clipboardHint, setClipboardHint] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [analysisQueue, setAnalysisQueue] = useState([]);  // 분석 대기 큐
  const [history, setHistory] = useState([]);              // 분석 기록 (자동 저장)
  const [queueProcessing, setQueueProcessing] = useState(false);  // 큐 처리 중
  const [queueProgress, setQueueProgress] = useState({ current: 0, total: 0 });
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    setMobile(isMobile());
    try {
      const stored = localStorage.getItem('safebbang_saved');
      if (stored) setSavedPlaces(JSON.parse(stored));
      
      // 분석 큐 로드
      const queueData = localStorage.getItem('safebbang_queue');
      if (queueData) setAnalysisQueue(JSON.parse(queueData));
      
      // 분석 기록 로드
      const historyData = localStorage.getItem('safebbang_history');
      if (historyData) setHistory(JSON.parse(historyData));
    } catch (e) {}
    
    // PWA 설치 가능 여부 체크
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsInstalled(isStandalone);
    
    // PWA 설치 프롬프트 이벤트 캡처 (안드로이드 Chrome)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    
    // 설치 완료 이벤트
    const handleInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };
    window.addEventListener('appinstalled', handleInstalled);
    
    // 1. URL 쿼리에서 공유받은 데이터 처리 (PWA Share Target)
    const params = new URLSearchParams(window.location.search);
    const sharedText = params.get('text') || '';
    const sharedUrl = params.get('url') || '';
    const sharedTitle = params.get('title') || '';
    const combined = [sharedTitle, sharedText, sharedUrl].filter(Boolean).join('\n');
    
    if (combined) {
      const found = extractNaverUrl(combined);
      if (found) {
        window.history.replaceState({}, '', '/');
        // 자동 분석 대신 선택 화면으로
        setUrl(combined);
        setView('share-received');
        return () => {
          window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
          window.removeEventListener('appinstalled', handleInstalled);
        };
      }
    }
    
    checkClipboardForUrl();
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  // PWA 설치 실행
  const installPWA = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setInstallPrompt(null);
      setIsInstalled(true);
    }
  };

  // 클립보드에 네이버 URL 있는지 확인
  const checkClipboardForUrl = async () => {
    try {
      // navigator.clipboard.readText()는 페이지가 포커스 받아야 작동
      // 일부 브라우저는 사용자 인터랙션 필요
      if (!navigator.clipboard?.readText) return;
      
      // 페이지 로드 직후엔 권한 부족할 수 있으니 약간 지연
      await new Promise(r => setTimeout(r, 500));
      
      const text = await navigator.clipboard.readText();
      if (!text) return;
      
      const found = extractNaverUrl(text);
      if (found) {
        // 이미 분석된 URL인지 체크 (중복 방지)
        const recentlyAnalyzed = localStorage.getItem('safebbang_last_url');
        if (recentlyAnalyzed === found) return;
        
        // 클립보드 추천 표시
        setClipboardHint({ text, extractedUrl: found, placeName: extractPlaceName(text) });
      }
    } catch (e) {
      // 권한 거부 또는 미지원 - 조용히 무시
    }
  };

  // 자동 분석 (공유 시트나 클립보드 수락 시)
  const autoAnalyze = async (textOrUrl) => {
    const extractedUrl = extractNaverUrl(textOrUrl);
    if (!extractedUrl) {
      setView('link-input');
      setError('URL을 찾지 못했어요.');
      return;
    }
    
    const site = detectSite(extractedUrl);
    if (!site || !site.supported) {
      setView('link-input');
      setError('지원하지 않는 URL입니다.');
      return;
    }
    
    const apiEndpoint = site.id === 'smartstore' ? 'analyze-smartstore' : 'analyze-naver';
    
    setError('');
    setAnalyzeProgress(10);
    setAnalyzeStage(site.id === 'smartstore' ? '스마트스토어 처리 중' : '공유받은 링크 처리 중');
    
    try {
      const stages = [
        { msg: site.id === 'smartstore' ? '스마트스토어 접근 중' : '네이버 플레이스 접근 중', pct: 20 },
        { msg: '리뷰 100개 수집 중', pct: 40 },
        { msg: 'AI가 위험 신호 분석 중', pct: 70 },
        { msg: '결과 정리 중', pct: 90 }
      ];
      let stageIdx = 0;
      const interval = setInterval(() => {
        if (stageIdx < stages.length) {
          setAnalyzeStage(stages[stageIdx].msg);
          setAnalyzeProgress(stages[stageIdx].pct);
          stageIdx++;
        }
      }, 8000);
      
      const data = await callAPI(apiEndpoint, { url: extractedUrl });
      clearInterval(interval);
      setAnalyzeProgress(100);
      
      try { localStorage.setItem('safebbang_last_url', extractedUrl); } catch (e) {}
      
      saveToHistory(data);
      
      await new Promise(r => setTimeout(r, 200));
      setResult(data);
      setView('result');
      window.scrollTo(0, 0);
    } catch (e) {
      console.error(e);
      setError(`분석 실패: ${e.message}`);
      setView('link-input');
    }
  };

  // 클립보드 추천 수락
  const acceptClipboard = () => {
    if (!clipboardHint) return;
    setUrl(clipboardHint.text);
    setClipboardHint(null);
    setView('analyzing');
    autoAnalyze(clipboardHint.text);
  };

  const dismissClipboard = () => setClipboardHint(null);

  const saveSavedList = (places) => {
    try { localStorage.setItem('safebbang_saved', JSON.stringify(places)); } catch (e) {}
  };

  // 큐 저장
  const saveQueue = (queue) => {
    try { localStorage.setItem('safebbang_queue', JSON.stringify(queue)); } catch (e) {}
  };

  // 히스토리 저장 (자동, 최대 50개)
  const saveToHistory = (analysisResult) => {
    if (!analysisResult || !analysisResult.name) return;
    
    try {
      // 같은 장소 중복 방지: 이름과 sourceUrl 같으면 기존 것 업데이트
      const newHistoryItem = {
        ...analysisResult,
        analyzedAt: Date.now()
      };
      
      const filtered = history.filter(h => 
        !(h.name === analysisResult.name && h.sourceUrl === analysisResult.sourceUrl)
      );
      const newHistory = [newHistoryItem, ...filtered].slice(0, 50);  // 최대 50개
      setHistory(newHistory);
      localStorage.setItem('safebbang_history', JSON.stringify(newHistory));
    } catch (e) { console.error('히스토리 저장 실패', e); }
  };

  // 큐에 URL 추가
  const addToQueue = (url, placeName) => {
    const extractedUrl = extractNaverUrl(url);
    if (!extractedUrl) return false;
    
    // 중복 방지
    const exists = analysisQueue.some(q => q.url === extractedUrl);
    if (exists) return false;
    
    if (analysisQueue.length >= 10) {
      alert('큐는 최대 10개까지만 가능해요. 먼저 분석을 실행해주세요.');
      return false;
    }
    
    const newItem = {
      id: Date.now(),
      url: extractedUrl,
      placeName: placeName || extractPlaceName(url) || '이름 미상',
      addedAt: Date.now(),
      status: 'pending'  // pending | analyzing | done | error
    };
    
    const newQueue = [...analysisQueue, newItem];
    setAnalysisQueue(newQueue);
    saveQueue(newQueue);
    return true;
  };

  // 큐에서 제거
  const removeFromQueue = (id) => {
    const newQueue = analysisQueue.filter(q => q.id !== id);
    setAnalysisQueue(newQueue);
    saveQueue(newQueue);
  };

  // 큐 전체 비우기
  const clearQueue = () => {
    setAnalysisQueue([]);
    saveQueue([]);
  };

  // 큐 일괄 분석 (병렬, 최대 3개씩)
  const processQueue = async () => {
    if (analysisQueue.length === 0) return;
    
    setQueueProcessing(true);
    setQueueProgress({ current: 0, total: analysisQueue.length });
    
    const results = [];
    const queueCopy = [...analysisQueue];
    
    // 3개씩 병렬 처리
    const BATCH_SIZE = 3;
    let completed = 0;
    
    for (let i = 0; i < queueCopy.length; i += BATCH_SIZE) {
      const batch = queueCopy.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map(async (item) => {
          try {
            const site = detectSite(item.url);
            const apiEndpoint = site?.id === 'smartstore' ? 'analyze-smartstore' : 'analyze-naver';
            const data = await callAPI(apiEndpoint, { url: item.url });
            return { ...data, _queueItem: item };
          } catch (e) {
            return { _queueItem: item, _error: e.message };
          }
        })
      );
      
      batchResults.forEach(r => {
        if (r.status === 'fulfilled') {
          results.push(r.value);
          // 히스토리에 즉시 저장
          if (!r.value._error) saveToHistory(r.value);
        }
        completed++;
        setQueueProgress({ current: completed, total: queueCopy.length });
      });
    }
    
    setQueueProcessing(false);
    setQueueProgress({ current: 0, total: 0 });
    
    // 성공한 결과만 담은 장소로 자동 추가
    const successResults = results.filter(r => !r._error);
    if (successResults.length > 0) {
      const newSaved = [...savedPlaces];
      successResults.forEach(r => {
        const exists = newSaved.some(p => p.name === r.name);
        if (!exists && newSaved.length < 10) {
          newSaved.push({ ...r, savedAt: Date.now() });
        }
      });
      setSavedPlaces(newSaved);
      saveSavedList(newSaved);
    }
    
    // 큐 비우기
    clearQueue();
    
    // 결과 화면으로
    if (successResults.length >= 2) {
      // 2개 이상이면 비교 화면으로
      setView('compare');
    } else if (successResults.length === 1) {
      // 1개면 결과 화면으로
      setResult(successResults[0]);
      setView('result');
    } else {
      // 모두 실패
      alert('분석에 모두 실패했어요. 다시 시도해주세요.');
      setView('home');
    }
    window.scrollTo(0, 0);
  };

  const analyzeUrl = async () => {
    // 텍스트에서 URL 자동 추출
    const extractedUrl = extractNaverUrl(url);
    if (!extractedUrl) {
      setError('네이버 URL을 찾지 못했어요. 네이버 지도나 스마트스토어에서 공유한 링크를 붙여넣어주세요.');
      return;
    }
    
    if (!isValidUrl(extractedUrl)) { 
      setError('올바른 URL이 아니에요.'); 
      return; 
    }
    
    const site = detectSite(extractedUrl);
    if (!site) { setError('지원하지 않는 URL입니다.'); return; }
    if (!site.supported) {
      setError(`${site.name}는 현재 직접 분석을 지원하지 않아요. 아래 이미지 업로드를 이용해주세요.`);
      return;
    }

    setError('');
    setView('analyzing');
    
    // 사이트별 API 분기
    const apiEndpoint = site.id === 'smartstore' ? 'analyze-smartstore' : 'analyze-naver';
    const stageMessages = site.id === 'smartstore' 
      ? ['스마트스토어 접근 중', '상품 리뷰 100개 수집 중', 'AI가 구매 위험 분석 중', '결과 정리 중']
      : ['네이버 플레이스 접근 중', '리뷰 100개 수집 중 (약 30~40초)', 'AI가 위험 신호 분석 중', '결과 정리 중'];
    
    try {
      const stages = stageMessages.map((msg, i) => ({ msg, pct: 20 + i * 20 }));
      let stageIdx = 0;
      const interval = setInterval(() => {
        if (stageIdx < stages.length) {
          setAnalyzeStage(stages[stageIdx].msg);
          setAnalyzeProgress(stages[stageIdx].pct);
          stageIdx++;
        }
      }, 8000);

      const data = await callAPI(apiEndpoint, { url: extractedUrl });
      clearInterval(interval);
      setAnalyzeProgress(100);
      await new Promise(r => setTimeout(r, 200));

      // 히스토리에 자동 저장
      saveToHistory(data);

      setResult(data);
      setView('result');
      window.scrollTo(0, 0);
    } catch (e) {
      console.error(e);
      setError(`분석 실패: ${e.message}`);
      setView('link-input');
    }
  };

  const handleFiles = async (fileList) => {
    setError('');
    if (!fileList?.length) return;
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (!files.length) { setError('이미지만 가능합니다.'); return; }
    const remaining = 5 - uploadedImages.length;
    if (remaining <= 0) { setError('최대 5장.'); return; }
    
    setProcessing(true);
    try {
      const newImages = [];
      for (const f of files.slice(0, remaining)) {
        try {
          const compressed = await compressImage(f);
          newImages.push({ dataUrl: compressed, name: f.name });
        } catch (e) {}
      }
      if (newImages.length) setUploadedImages(prev => [...prev, ...newImages]);
    } finally { setProcessing(false); }
  };

  const removeImage = (idx) => setUploadedImages(prev => prev.filter((_, i) => i !== idx));

  const analyzeImages = async () => {
    if (!uploadedImages.length) return;
    setError('');
    setView('analyzing');
    setAnalyzeStage('이미지에서 리뷰 추출 + AI 분석 중'); 
    setAnalyzeProgress(40);

    try {
      const data = await callAPI('analyze-image', { 
        images: uploadedImages.map(img => ({ dataUrl: img.dataUrl }))
      });
      setAnalyzeProgress(100);
      await new Promise(r => setTimeout(r, 200));
      const resultWithSource = { ...data, sourceUrl: null };
      saveToHistory(resultWithSource);
      setResult(resultWithSource);
      setView('result');
      window.scrollTo(0, 0);
    } catch (e) {
      console.error(e);
      setError(`분석 실패: ${e.message}`);
      setView('image-input');
    }
  };

  const isSaved = useMemo(() => {
    if (!result) return false;
    return savedPlaces.some(p => p.name === result.name);
  }, [result, savedPlaces]);

  const toggleSave = () => {
    if (!result) return;
    let newList;
    if (isSaved) newList = savedPlaces.filter(p => p.name !== result.name);
    else {
      if (savedPlaces.length >= 10) { alert('최대 10개'); return; }
      newList = [...savedPlaces, { ...result, savedAt: Date.now() }];
    }
    setSavedPlaces(newList);
    saveSavedList(newList);
  };

  const goHome = () => {
    setView('home'); setResult(null); setUrl(''); setUploadedImages([]); setError('');
  };

  // 점수 기반 라벨 (AI 응답 무시하고 점수로만 결정 - 일관성 보장)
  const getScoreStyle = (s) => {
    if (s >= 75) return { color: C.green, bg: C.greenBg, label: '안전', emoji: '🟢', shortMsg: '안심하고 가도 됨' };
    if (s >= 55) return { color: '#7a8a17', bg: '#eef0d5', label: '대체로 안전', emoji: '🟡', shortMsg: '큰 위험 없음' };
    if (s >= 40) return { color: C.yellow, bg: C.yellowBg, label: '주의', emoji: '🟠', shortMsg: '신중히 결정 필요' };
    if (s >= 25) return { color: C.orange, bg: C.orangeBg, label: '위험', emoji: '🔴', shortMsg: '후회 가능성 큼' };
    return { color: C.red, bg: C.redBg, label: '매우 위험', emoji: '⛔', shortMsg: '예약 비추천' };
  };

  const sevStyle = (s) => {
    if (s === 'high') return { dot: C.red, label: '높음', bg: C.redBg, text: C.red };
    if (s === 'medium') return { dot: C.orange, label: '중간', bg: C.orangeBg, text: C.orange };
    return { dot: C.textLight, label: '낮음', bg: C.bgSubtle, text: C.textMid };
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
        <Header view={view} goHome={goHome} savedCount={savedPlaces.length} setView={setView} historyCount={history.length} />
        <div style={{ padding: '0 16px 100px' }}>
          {view === 'home' && <HomeView setView={setView} savedCount={savedPlaces.length} clipboardHint={clipboardHint} acceptClipboard={acceptClipboard} dismissClipboard={dismissClipboard} checkClipboardForUrl={checkClipboardForUrl} installPrompt={installPrompt} installPWA={installPWA} isInstalled={isInstalled} queueCount={analysisQueue.length} historyCount={history.length} />}
          {view === 'link-input' && <LinkInputView url={url} setUrl={setUrl} error={error} setError={setError} analyzeUrl={analyzeUrl} setView={setView} />}
          {view === 'image-input' && <ImageInputView mobile={mobile} uploadedImages={uploadedImages} processing={processing} dragActive={dragActive} setDragActive={setDragActive} error={error} galleryInputRef={galleryInputRef} cameraInputRef={cameraInputRef} handleFiles={handleFiles} removeImage={removeImage} analyzeImages={analyzeImages} />}
          {view === 'analyzing' && <AnalyzingView stage={analyzeStage} progress={analyzeProgress} />}
          {view === 'result' && result && <ResultView result={result} getScoreStyle={getScoreStyle} sevStyle={sevStyle} isSaved={isSaved} toggleSave={toggleSave} goHome={goHome} setView={setView} />}
          {view === 'saved' && <SavedView places={savedPlaces} setView={setView} setResult={setResult} getScoreStyle={getScoreStyle} setSavedPlaces={setSavedPlaces} saveSavedList={saveSavedList} />}
          {view === 'compare' && <CompareView places={savedPlaces} setView={setView} getScoreStyle={getScoreStyle} />}
          {view === 'compare-selected' && <CompareView places={savedPlaces} setView={setView} getScoreStyle={getScoreStyle} useSelected={true} />}
          {view === 'share-received' && <ShareReceivedView url={url} addToQueue={addToQueue} setView={setView} autoAnalyze={autoAnalyze} setAnalyzeStage={setAnalyzeStage} setAnalyzeProgress={setAnalyzeProgress} queueCount={analysisQueue.length} />}
          {view === 'queue' && <QueueView queue={analysisQueue} removeFromQueue={removeFromQueue} clearQueue={clearQueue} processQueue={processQueue} setView={setView} queueProcessing={queueProcessing} queueProgress={queueProgress} />}
          {view === 'history' && <HistoryView history={history} setHistory={setHistory} setResult={setResult} setView={setView} getScoreStyle={getScoreStyle} />}
        </div>
      </div>
    </div>
  );
}

function Header({ view, goHome, savedCount, setView, historyCount }) {
  return (
    <div style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 50, 
      background: '#fff', 
      borderBottom: `1px solid ${C.border}`, 
      padding: '12px 16px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between' 
    }}>
      <div onClick={goHome} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <img src="/logo/bread-64.png" alt="안전빵" style={{ width: 32, height: 32, display: 'block' }} />
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.025em', color: C.text }}>안전빵</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {historyCount > 0 && (
          <button onClick={() => setView('history')} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 4, 
            padding: '8px 12px', 
            background: C.bgSubtle, 
            color: C.textMid, 
            border: 'none', 
            borderRadius: 100, 
            fontSize: 12, 
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            📋 기록 {historyCount}
          </button>
        )}
        {savedCount > 0 && (
          <button onClick={() => setView('saved')} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 4, 
            padding: '8px 12px', 
            background: C.blueBg, 
            color: C.blue, 
            border: 'none', 
            borderRadius: 100, 
            fontSize: 12, 
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            <Bookmark size={11} fill="currentColor" />{savedCount}
          </button>
        )}
      </div>
    </div>
  );
}

function HomeView({ setView, savedCount, clipboardHint, acceptClipboard, dismissClipboard, checkClipboardForUrl, installPrompt, installPWA, isInstalled, queueCount, historyCount }) {
  return (
    <div style={{ padding: '24px 0 0' }}>
      {/* 메인 비주얼: 떠있는 빵 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, paddingTop: 8 }}>
        <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* 부드러운 그림자 (바닥) */}
          <div style={{
            position: 'absolute',
            bottom: -2,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 90,
            height: 14,
            background: 'radial-gradient(ellipse at center, rgba(217, 115, 13, 0.25) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(4px)'
          }} />
          {/* 빵 이미지 (떠있는 듯한 애니메이션) */}
          <img 
            src="/logo/bread-256.png" 
            alt="안전빵" 
            style={{ 
              width: 120, 
              height: 120, 
              objectFit: 'contain',
              animation: 'float 3s ease-in-out infinite',
              filter: 'drop-shadow(0 8px 16px rgba(217, 115, 13, 0.18))',
              position: 'relative',
              zIndex: 1
            }} 
          />
        </div>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
        `}</style>
      </div>

      <h1 style={{ 
        fontSize: 26, 
        fontWeight: 700, 
        color: C.text, 
        margin: '0 0 8px', 
        letterSpacing: '-0.03em', 
        lineHeight: 1.35, 
        textAlign: 'center' 
      }}>
        결제 전 <span style={{ color: C.red }}>후회</span>,<br />
        안전빵이 대신 막아드릴게요
      </h1>
      <p style={{ 
        fontSize: 14, 
        color: C.textMid, 
        margin: '0 0 28px', 
        lineHeight: 1.55, 
        textAlign: 'center',
        fontWeight: 500
      }}>
        리뷰 100개 안 읽어도 돼요.<br />
        AI가 30초 만에 위험 신호를 찾아드려요
      </p>

      {/* 클립보드 자동 감지 추천 카드 */}
      {clipboardHint && (
        <div style={{
          marginBottom: 16,
          padding: '16px 18px',
          background: C.blueBg,
          borderRadius: 16,
          animation: 'slide-in 0.3s ease-out'
        }}>
          <style>{`@keyframes slide-in { from { opacity: 0; transform: translateY(-8px);} to { opacity: 1; transform: translateY(0);}}`}</style>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>📋</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>방금 복사한 링크가 있어요</span>
            <button onClick={dismissClipboard} style={{ 
              marginLeft: 'auto', 
              width: 24, height: 24, 
              padding: 0, 
              background: 'transparent', 
              border: 'none', 
              color: C.textLight, 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <X size={14} />
            </button>
          </div>
          {clipboardHint.placeName && (
            <div style={{ 
              fontSize: 15, 
              fontWeight: 700, 
              color: C.text, 
              marginBottom: 12,
              padding: '10px 12px',
              background: '#fff',
              borderRadius: 10
            }}>
              📍 {clipboardHint.placeName}
            </div>
          )}
          <button onClick={acceptClipboard} style={{
            width: '100%',
            padding: '12px 16px',
            background: C.blue,
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}>
            바로 분석하기
          </button>
        </div>
      )}

      {/* 분석 대기 큐 카드 */}
      {queueCount > 0 && (
        <button onClick={() => setView('queue')} style={{
          width: '100%',
          padding: '18px 20px',
          background: 'linear-gradient(135deg, #fff5e6 0%, #ffe9c7 100%)',
          color: C.text,
          border: '2px solid #fcd34d',
          borderRadius: 14,
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          textAlign: 'left',
          cursor: 'pointer',
          animation: 'pulse-soft 2s ease-in-out infinite'
        }}>
          <style>{`
            @keyframes pulse-soft {
              0%, 100% { box-shadow: 0 0 0 0 rgba(252, 211, 77, 0.3); }
              50% { box-shadow: 0 0 0 8px rgba(252, 211, 77, 0); }
            }
          `}</style>
          <div style={{ 
            width: 44, 
            height: 44, 
            borderRadius: 12, 
            background: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexShrink: 0,
            fontSize: 22
          }}>
            📥
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, color: '#78350f' }}>
              분석 대기 {queueCount}개
            </div>
            <div style={{ fontSize: 12, color: '#92400e', lineHeight: 1.4 }}>
              지금 일괄 분석하고 한 번에 비교
            </div>
          </div>
          <ChevronRight size={20} color="#78350f" />
        </button>
      )}

      <button onClick={() => setView('link-input')} style={{ 
        width: '100%', 
        padding: '18px 20px', 
        background: C.blue, 
        color: '#fff', 
        border: 'none', 
        borderRadius: 14, 
        marginBottom: 8, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 14, 
        textAlign: 'left',
        boxShadow: '0 4px 12px rgba(49, 130, 246, 0.25)',
        cursor: 'pointer'
      }}>
        <div style={{ 
          width: 40, 
          height: 40, 
          borderRadius: 10, 
          background: 'rgba(255,255,255,0.18)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexShrink: 0 
        }}>
          <Link2 size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2, letterSpacing: '-0.015em' }}>
            네이버 링크로 분석
          </div>
          <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.4 }}>
            식당·미용실·병원 + 스마트스토어
          </div>
        </div>
        <ChevronRight size={20} />
      </button>

      {/* 클립보드 수동 확인 (감지 안 됐을 때) */}
      {!clipboardHint && (
        <button 
          onClick={checkClipboardForUrl}
          style={{
            width: '100%',
            padding: '14px 16px',
            background: C.bgSubtle,
            color: C.textMid,
            border: 'none',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}
        >
          📋 복사한 링크 자동 감지
        </button>
      )}

      {/* 보조: 이미지 업로드 */}
      <button onClick={() => setView('image-input')} style={{ 
        width: '100%', 
        padding: '16px 18px', 
        background: C.bgSubtle, 
        color: C.text, 
        border: 'none', 
        borderRadius: 14, 
        marginBottom: 32,
        display: 'flex', 
        alignItems: 'center', 
        gap: 12, 
        textAlign: 'left',
        cursor: 'pointer'
      }}>
        <div style={{ 
          width: 36, 
          height: 36, 
          borderRadius: 10, 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexShrink: 0 
        }}>
          <Camera size={18} color={C.textMid} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, color: C.text }}>리뷰 스크린샷 분석</div>
          <div style={{ fontSize: 11, color: C.textMid }}>야놀자·여기어때·에어비앤비 등</div>
        </div>
        <ChevronRight size={16} color={C.textLight} />
      </button>

      {/* 사용 안내 - 토스 스타일 카드 */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ 
          fontSize: 18, 
          fontWeight: 700, 
          color: C.text, 
          margin: '0 0 14px', 
          letterSpacing: '-0.02em' 
        }}>
          이렇게 쉬워요
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { n: 1, t: '네이버 지도에서 식당 클릭', e: '🔍' },
            { n: 2, t: '공유 버튼 → 안전빵 선택', e: '📤' },
            { n: 3, t: '30초 후 안전 점수 확인', e: '✨' }
          ].map(step => (
            <div key={step.n} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 14, 
              padding: '14px 16px', 
              background: C.bgSubtle, 
              borderRadius: 14 
            }}>
              <div style={{ 
                width: 28, 
                height: 28, 
                borderRadius: 8, 
                background: C.blue, 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: 13, 
                fontWeight: 700, 
                flexShrink: 0 
              }}>
                {step.n}
              </div>
              <div style={{ fontSize: 14, color: C.text, flex: 1, fontWeight: 600, lineHeight: 1.4 }}>
                {step.t}
              </div>
              <span style={{ fontSize: 22 }}>{step.e}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PWA 자동 설치 - 토스 스타일 강조 카드 */}
      <SmartInstallButton installPrompt={installPrompt} installPWA={installPWA} isInstalled={isInstalled} />

      {savedCount > 0 && (
        <div onClick={() => setView('saved')} style={{ 
          padding: '16px 18px', 
          background: C.bgSubtle, 
          borderRadius: 14, 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12 
        }}>
          <div style={{ 
            width: 36, 
            height: 36, 
            borderRadius: 10, 
            background: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <BookmarkCheck size={18} color={C.blue} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>담은 장소 {savedCount}개</div>
            <div style={{ fontSize: 12, color: C.textMid }}>AI 비교 분석으로 베스트 찾기</div>
          </div>
          <ChevronRight size={18} color={C.textLight} />
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: 11, color: C.textLight, marginTop: 40, paddingBottom: 20, fontWeight: 500 }}>
        안전빵 · 결제 전 후회를 막는 AI
      </div>
    </div>
  );
}

// 스마트 PWA 설치 버튼 - 토스 스타일
function SmartInstallButton({ installPrompt, installPWA, isInstalled }) {
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isKakaoInApp, setIsKakaoInApp] = useState(false);
  
  useEffect(() => {
    if (isInstalled) return;
    if (!isMobile()) return;
    
    const ua = navigator.userAgent;
    setIsIOS(/iPhone|iPad|iPod/i.test(ua));
    setIsKakaoInApp(/KAKAOTALK/i.test(ua));
    
    const wasDismissed = localStorage.getItem('safebbang_pwa_dismissed');
    if (wasDismissed) {
      const dismissedTime = parseInt(wasDismissed, 10);
      const daysPassed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      // 7일 지나면 다시 표시
      if (daysPassed < 7) setDismissed(true);
    }
  }, [isInstalled]);
  
  if (isInstalled || !isMobile() || dismissed) return null;
  
  const dismiss = () => {
    setDismissed(true);
    try { localStorage.setItem('safebbang_pwa_dismissed', String(Date.now())); } catch (e) {}
  };
  
  // 카카오톡 내장 브라우저
  if (isKakaoInApp) {
    return (
      <div style={{
        marginBottom: 24,
        padding: '20px 22px',
        background: '#fef3c7',
        borderRadius: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: 28 }}>📱</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#78350f', marginBottom: 6, letterSpacing: '-0.015em' }}>
              Chrome으로 열면 더 편해요
            </div>
            <div style={{ fontSize: 12, color: '#92400e', lineHeight: 1.6, marginBottom: 12 }}>
              카톡 내장 브라우저에선 홈 화면 추가가 안 돼요. 우측 상단 메뉴 → "다른 브라우저로 열기" → Chrome 선택
            </div>
            <button onClick={dismiss} style={{
              padding: '6px 12px',
              background: 'transparent',
              color: '#92400e',
              border: '1px solid #fcd34d',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              알겠어요
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // 안드로이드 자동 설치 가능 (Chrome 등)
  if (installPrompt) {
    return (
      <div style={{
        marginBottom: 24,
        padding: '20px 22px',
        background: 'linear-gradient(135deg, #3182f6 0%, #1b64da 100%)',
        borderRadius: 16,
        boxShadow: '0 8px 20px rgba(49, 130, 246, 0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
          <span style={{ fontSize: 32 }}>📲</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 4, letterSpacing: '-0.02em' }}>
              안전빵을 홈 화면에 추가하세요
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, fontWeight: 500 }}>
              네이버에서 공유 → 안전빵 → 자동 분석<br />
              매번 앱 열지 않아도 돼요
            </div>
          </div>
          <button onClick={dismiss} style={{ 
            width: 24, height: 24, 
            padding: 0, 
            background: 'transparent', 
            border: 'none', 
            color: 'rgba(255,255,255,0.6)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexShrink: 0 
          }}>
            <X size={14} />
          </button>
        </div>
        <button onClick={installPWA} style={{
          width: '100%',
          padding: '14px 16px',
          background: '#fff',
          color: C.blue,
          border: 'none',
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          letterSpacing: '-0.015em'
        }}>
          ⚡ 한 번에 설치하기
        </button>
      </div>
    );
  }
  
  // iOS Safari - 수동 안내
  if (isIOS) {
    return (
      <div style={{
        marginBottom: 24,
        padding: '20px 22px',
        background: C.blueBg,
        borderRadius: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: 28 }}>📲</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6, letterSpacing: '-0.015em' }}>
              홈 화면에 추가하면 더 편해요
            </div>
            <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.7, marginBottom: 12 }}>
              <span style={{ display: 'inline-block', padding: '2px 8px', background: '#fff', borderRadius: 6, marginRight: 4, fontWeight: 600 }}>1</span>
              Safari 하단 <strong>공유 버튼</strong> 탭<br />
              <span style={{ display: 'inline-block', padding: '2px 8px', background: '#fff', borderRadius: 6, marginRight: 4, fontWeight: 600, marginTop: 6 }}>2</span>
              <strong>"홈 화면에 추가"</strong> 선택<br />
              <span style={{ display: 'inline-block', padding: '2px 8px', background: '#fff', borderRadius: 6, marginRight: 4, fontWeight: 600, marginTop: 6 }}>3</span>
              네이버 공유 시트에 안전빵 등장 ✨
            </div>
            <button onClick={dismiss} style={{
              padding: '6px 12px',
              background: 'transparent',
              color: C.blue,
              border: `1px solid ${C.blue}`,
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              알겠어요
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // 기타 (안드로이드인데 자동 설치 이벤트 없음 - 너무 빨리 진입했거나 이미 거부)
  return null;
}

// 기존 InstallPWAHint는 SmartInstallButton로 대체되었으나, 호환성 위해 빈 컴포넌트로 유지
function InstallPWAHint() {
  return null;
}

function LinkInputView({ url, setUrl, error, setError, analyzeUrl, setView }) {
  // 자동 URL 추출
  const extractedUrl = url ? extractNaverUrl(url) : null;
  const placeName = url ? extractPlaceName(url) : null;
  const site = extractedUrl ? detectSite(extractedUrl) : null;
  
  // URL 형식 체크
  const isSearchUrl = extractedUrl && (extractedUrl.includes('/p/search/') || extractedUrl.includes('?query='));
  const isShortUrl = extractedUrl && (extractedUrl.includes('naver.me/') || extractedUrl.includes('me2.do/'));
  const isLikelyPlaceUrl = extractedUrl && (
    extractedUrl.includes('pcmap.place.naver.com') || 
    extractedUrl.includes('m.place.naver.com') || 
    extractedUrl.includes('/entry/place/') ||
    extractedUrl.includes('/entry/restaurant/') ||
    isShortUrl
  );
  
  // 사용자가 입력한 게 URL인지 텍스트 덩어리인지
  const isTextBlock = url && url.trim().length > 0 && !isValidUrl(url.trim()) && extractedUrl;

  return (
    <div style={{ padding: '24px 0 0' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
        네이버 플레이스 링크
      </h2>
      <p style={{ fontSize: 13, color: C.textMid, margin: '0 0 16px', lineHeight: 1.6 }}>
        네이버 지도에서 <strong>공유</strong> 버튼으로 받은 텍스트를 통째로 붙여넣어도 돼요.
      </p>

      {/* 올바른 URL 가져오는 방법 안내 */}
      <details style={{ marginBottom: 16, padding: '12px 14px', background: C.bgSubtle, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
        <summary style={{ fontWeight: 600, color: C.text, listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          ℹ️ 어떻게 가져오나요?
          <ChevronDown size={12} style={{ marginLeft: 'auto' }} />
        </summary>
        <div style={{ marginTop: 10, color: C.textMid, lineHeight: 1.7 }}>
          <strong style={{ color: C.text }}>가장 쉬운 방법</strong><br />
          1. 네이버 지도 앱에서 식당 검색 → 클릭<br />
          2. 상세 페이지에서 <strong>공유 버튼</strong> 탭<br />
          3. 카톡/메모로 보내거나 URL 복사<br />
          4. 받은 내용을 <strong>통째로 붙여넣기</strong><br />
          <br />
          <strong style={{ color: C.green }}>안전빵이 자동으로 URL만 찾아냅니다.</strong>
        </div>
      </details>

      <textarea
        value={url}
        onChange={(e) => { setUrl(e.target.value); setError(''); }}
        placeholder="네이버 지도에서 공유받은 내용을 붙여넣으세요. URL만 있어도 OK."
        rows={4}
        autoFocus
        style={{ width: '100%', padding: '14px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', background: C.bgSubtle, color: C.text, resize: 'none', lineHeight: 1.5, marginBottom: 12 }}
      />

      {/* 텍스트 덩어리에서 URL 자동 추출됨 표시 */}
      {isTextBlock && (
        <div style={{ padding: '12px 14px', background: '#f0f9ff', border: `1px solid #bae6fd`, borderRadius: 8, marginBottom: 12, fontSize: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: C.blue, fontWeight: 600 }}>
            <Sparkles size={12} fill={C.blue} />
            <span>자동으로 링크를 찾았어요</span>
          </div>
          {placeName && (
            <div style={{ fontSize: 13, color: C.text, fontWeight: 600, marginBottom: 4 }}>
              📍 {placeName}
            </div>
          )}
          <div style={{ fontSize: 11, color: C.textMid, fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all' }}>
            {extractedUrl}
          </div>
        </div>
      )}

      {/* 검색 페이지 URL 감지 시 즉시 경고 */}
      {extractedUrl && isSearchUrl && (
        <div style={{ display: 'flex', gap: 8, padding: '12px 14px', background: C.redBg, color: C.red, borderRadius: 8, fontSize: 12, marginBottom: 12, fontWeight: 500, lineHeight: 1.5 }}>
          <AlertCircle size={14} />
          <div>
            <strong>검색 결과 페이지예요</strong><br />
            식당을 클릭해서 들어간 상세 페이지에서 공유 → 다시 시도해주세요.
          </div>
        </div>
      )}

      {site && !isSearchUrl && !isTextBlock && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: site.supported ? C.greenBg : C.orangeBg, color: site.supported ? C.green : C.orange, borderRadius: 8, fontSize: 12, marginBottom: 12, fontWeight: 600 }}>
          {site.supported ? <Check size={14} /> : <AlertCircle size={14} />}
          <span>{site.emoji} {site.name} 감지됨 {isShortUrl && '(단축 URL · 자동 펼침)'}</span>
        </div>
      )}

      {site && !site.supported && (
        <div style={{ padding: '12px 14px', background: C.bgSubtle, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.textMid, lineHeight: 1.6, marginBottom: 14 }}>
          {site.name}는 직접 크롤링 미지원. <button onClick={() => setView('image-input')} style={{ color: C.blue, background: 'transparent', border: 'none', padding: 0, fontSize: 12, fontWeight: 600, textDecoration: 'underline' }}>리뷰 캡처 업로드</button>를 이용해주세요.
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', gap: 8, padding: '10px 14px', background: C.redBg, color: C.red, borderRadius: 6, fontSize: 12, marginBottom: 14, lineHeight: 1.5 }}>
          <AlertCircle size={14} />
          <div>{error}</div>
        </div>
      )}

      <button 
        onClick={analyzeUrl} 
        disabled={!extractedUrl || !site?.supported || isSearchUrl} 
        style={{ width: '100%', padding: '15px 16px', background: (extractedUrl && site?.supported && !isSearchUrl) ? C.text : C.border, color: (extractedUrl && site?.supported && !isSearchUrl) ? C.bg : C.textLight, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
      >
        <Sparkles size={16} /> 손해 위험 분석 시작
      </button>

      <p style={{ fontSize: 11, color: C.textLight, marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
        리뷰 100개 수집 + AI 분석 · 약 40~55초
      </p>
    </div>
  );
}

function ImageInputView({ mobile, uploadedImages, processing, dragActive, setDragActive, error, galleryInputRef, cameraInputRef, handleFiles, removeImage, analyzeImages }) {
  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFiles(e.dataTransfer.files);
  };

  return (
    <div style={{ padding: '24px 0 0' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: '0 0 6px', letterSpacing: '-0.02em' }}>리뷰 캡처 분석</h2>
      <p style={{ fontSize: 13, color: C.textMid, margin: '0 0 20px', lineHeight: 1.6 }}>
        야놀자·여기어때·에어비앤비 등 어떤 사이트든 리뷰 화면을 캡처해 올려주세요.
      </p>

      {mobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <button onClick={() => galleryInputRef.current?.click()} disabled={processing || uploadedImages.length >= 5} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: C.bgSubtle, border: `1.5px solid ${C.borderStrong}`, borderRadius: 10, textAlign: 'left', width: '100%', opacity: uploadedImages.length >= 5 ? 0.5 : 1 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={20} color={C.text} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>갤러리에서 선택</div>
              <div style={{ fontSize: 11, color: C.textMid }}>저장된 스크린샷</div>
            </div>
            <ChevronRight size={16} color={C.textLight} />
          </button>
          <button onClick={() => cameraInputRef.current?.click()} disabled={processing || uploadedImages.length >= 5} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: C.bgSubtle, border: `1.5px solid ${C.borderStrong}`, borderRadius: 10, textAlign: 'left', width: '100%', opacity: uploadedImages.length >= 5 ? 0.5 : 1 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={20} color={C.text} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>카메라 촬영</div>
              <div style={{ fontSize: 11, color: C.textMid }}>다른 화면 즉시 캡처</div>
            </div>
            <ChevronRight size={16} color={C.textLight} />
          </button>
          <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} style={{ display: 'none' }} />
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} style={{ display: 'none' }} />
        </div>
      ) : (
        <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => galleryInputRef.current?.click()} style={{ border: `2px dashed ${dragActive ? C.text : C.borderStrong}`, borderRadius: 10, padding: '32px 20px', background: dragActive ? C.bgHover : C.bgSubtle, textAlign: 'center', cursor: 'pointer', marginBottom: 16 }}>
          <Upload size={28} color={C.textMid} />
          <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginTop: 12, marginBottom: 4 }}>클릭 또는 드래그</div>
          <div style={{ fontSize: 12, color: C.textLight }}>최대 5장</div>
          <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} style={{ display: 'none' }} />
        </div>
      )}

      {processing && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, fontSize: 13, color: C.textMid }}>
          <Spinner /> 처리 중...
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMid, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            업로드됨 ({uploadedImages.length}/5)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {uploadedImages.map((img, i) => (
              <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`, aspectRatio: '3/4', background: C.bgSubtle }}>
                <img src={img.dataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', gap: 8, padding: '10px 14px', background: C.redBg, color: C.red, borderRadius: 6, fontSize: 12, marginBottom: 14 }}>
          <AlertCircle size={14} />
          <div>{error}</div>
        </div>
      )}

      <button onClick={analyzeImages} disabled={!uploadedImages.length || processing} style={{ width: '100%', padding: '15px 16px', background: (uploadedImages.length && !processing) ? C.text : C.border, color: (uploadedImages.length && !processing) ? C.bg : C.textLight, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Sparkles size={16} /> 분석 시작
      </button>
    </div>
  );
}

function AnalyzingView({ stage, progress }) {
  return (
    <div style={{ padding: '40px 0 0' }}>
      {/* 통통 튀는 빵 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32, paddingTop: 8 }}>
        <div style={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 70,
            height: 10,
            background: 'radial-gradient(ellipse at center, rgba(217, 115, 13, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(3px)',
            animation: 'shadow-pulse 1.2s ease-in-out infinite'
          }} />
          <img 
            src="/logo/bread-128.png" 
            alt="" 
            style={{ 
              width: 90, 
              height: 90, 
              objectFit: 'contain',
              animation: 'bounce 1.2s ease-in-out infinite',
              filter: 'drop-shadow(0 6px 12px rgba(217, 115, 13, 0.2))',
              position: 'relative'
            }} 
          />
        </div>
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-12px) scale(1.02); }
          }
          @keyframes shadow-pulse {
            0%, 100% { width: 70px; opacity: 0.4; }
            50% { width: 50px; opacity: 0.2; }
          }
        `}</style>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>{stage}</div>
        <div style={{ fontSize: 12, color: C.textLight }}>{progress}%</div>
      </div>

      <div style={{ width: '100%', height: 4, background: C.bgSubtle, borderRadius: 2, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ width: `${progress}%`, height: '100%', background: C.text, transition: 'width 0.5s ease' }} />
      </div>

      <div style={{ padding: '14px 16px', background: C.bgSubtle, borderRadius: 8, fontSize: 12, color: C.textMid, lineHeight: 1.7 }}>
        <strong style={{ color: C.text }}>지금 일어나는 일</strong><br />
        • Apify가 네이버 플레이스 리뷰 수집<br />
        • OpenAI가 반복 부정 신호 추출<br />
        • 위생·응대·가성비 등 속성별 점수화<br />
        • 결제 전 후회 가능성 진단
      </div>
    </div>
  );
}

function ResultView({ result, getScoreStyle, sevStyle, isSaved, toggleSave, goHome, setView }) {
  const sc = getScoreStyle(result.safetyScore);

  return (
    <div style={{ padding: '20px 0 0' }}>
      {result.sourceUrl && (
        <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: C.bgSubtle, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, color: C.textMid, textDecoration: 'none', marginBottom: 14, fontWeight: 500 }}>
          <External size={11} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {result.siteName || '원본'} 페이지
          </span>
          <ChevronRight size={11} />
        </a>
      )}

      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 32 }}>{result.emoji || '📍'}</span>
        {result.categoryLabel && (
          <span style={{ 
            padding: '4px 10px', 
            background: C.bgSubtle, 
            color: C.textMid, 
            border: `1px solid ${C.border}`,
            borderRadius: 100, 
            fontSize: 11, 
            fontWeight: 600 
          }}>
            {result.categoryLabel}
          </span>
        )}
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
        {result.name}
      </h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 12, color: C.textMid, marginBottom: 18 }}>
        {result.location && result.location !== '위치 정보 없음' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {result.location}</span>
        )}
        {result.reviewCount > 0 && <span>리뷰 {result.reviewCount.toLocaleString()}개 분석</span>}
      </div>

      <button onClick={toggleSave} style={{ width: '100%', padding: '12px 14px', marginBottom: 18, background: isSaved ? C.text : C.bgSubtle, color: isSaved ? C.bg : C.text, border: `1px solid ${isSaved ? C.text : C.border}`, borderRadius: 8, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        {isSaved ? '담은 장소' : '안전빵에 담아 비교하기'}
      </button>

      {/* 메인 점수 카드 - 더 직관적으로 */}
      <div style={{ padding: '20px 22px', background: sc.bg, borderRadius: 12, marginBottom: 20, borderLeft: `4px solid ${sc.color}` }}>
        {/* 상단: 이모지 + 라벨 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 24 }}>{sc.emoji}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: sc.color, letterSpacing: '-0.01em' }}>{sc.label}</span>
          <span style={{ fontSize: 12, color: C.textMid, marginLeft: 'auto' }}>{sc.shortMsg}</span>
        </div>
        
        {/* 점수 게이지 */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: sc.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{result.safetyScore}</span>
            <span style={{ fontSize: 14, color: C.textMid, fontWeight: 600 }}>/ 100</span>
            <span style={{ fontSize: 11, color: C.textLight, marginLeft: 'auto' }}>안전 점수 (100이 가장 안전)</span>
          </div>
          {/* 시각적 게이지 바 */}
          <div style={{ width: '100%', height: 8, background: '#ffffff', borderRadius: 4, overflow: 'hidden', position: 'relative', border: `1px solid ${C.border}` }}>
            {/* 그라데이션 배경 (위험 → 안전) */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #fdecec 0%, #fbf0e1 25%, #fbf3db 50%, #eef0d5 75%, #ddedea 100%)', opacity: 0.4 }} />
            {/* 실제 점수 채우기 */}
            <div style={{ width: `${result.safetyScore}%`, height: '100%', background: sc.color, transition: 'width 0.6s ease', position: 'relative', zIndex: 1 }} />
            {/* 점수 위치 마커 */}
            <div style={{ position: 'absolute', left: `calc(${result.safetyScore}% - 2px)`, top: -3, width: 4, height: 14, background: sc.color, borderRadius: 2, zIndex: 2 }} />
          </div>
          {/* 기준선 라벨 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: C.textLight, fontWeight: 500 }}>
            <span>🔴 위험</span>
            <span>🟠 주의</span>
            <span>🟡 보통</span>
            <span>🟢 안전</span>
          </div>
        </div>

        {/* 한 줄 요약 */}
        <div style={{ fontSize: 14, color: C.text, fontWeight: 500, lineHeight: 1.55, padding: '12px 14px', background: 'rgba(255,255,255,0.6)', borderRadius: 6 }}>
          {result.oneLineSummary}
        </div>
      </div>

      {/* 🆕 큰 추천/비추천 배지 */}
      {result.verdict && <VerdictBadge result={result} />}

      {result.recentSignal && result.recentSignal !== '특이 신호 없음' && (
        <div style={{ display: 'flex', gap: 10, padding: '12px 14px', background: C.orangeBg, borderRadius: 8, marginBottom: 20 }}>
          <TrendingDown size={16} color={C.orange} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, marginBottom: 2, textTransform: 'uppercase' }}>최근 악화 신호</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{result.recentSignal}</div>
          </div>
        </div>
      )}

      {result.ratingDistribution && <RatingDistribution distribution={result.ratingDistribution} avgRating={result.avgRating} reviewCount={result.reviewCount} />}
      {result.aspectScores?.length > 0 && <AspectScores aspects={result.aspectScores} />}
      <ProsConsLayout topRisks={result.topRisks} topPositives={result.topPositives} sevStyle={sevStyle} />
      <PersonalScenario result={result} />

      {/* 블로그 리뷰 깊은 분석 (옵션 C: 사용자 선택) */}
      {result.sourceUrl && result.placeId && (
        <BlogAnalysisSection placeId={result.placeId} />
      )}

      {result.avoidIf?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 12px', letterSpacing: '-0.015em' }}>이런 분께는 비추천</h3>
          {result.avoidIf.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 13, color: C.text }}>
              <X size={14} color={C.red} />{p}
            </div>
          ))}
        </div>
      )}

      {result.priceJudgment && result.priceJudgment !== '가격 정보 부족' && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 8px', letterSpacing: '-0.015em' }}>가격 대비 판단</h3>
          <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6, margin: 0 }}>{result.priceJudgment}</p>
        </div>
      )}

      <div style={{ height: 1, background: C.border, margin: '24px 0' }} />

      {/* 🆕 다음 후보 분석 - 큰 메인 액션 */}
      <div style={{
        padding: '18px 16px',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%)',
        border: '1px solid #d4dbff',
        borderRadius: 12,
        marginBottom: 12
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>
          🔄 다른 후보도 비교해보세요
        </div>
        <div style={{ fontSize: 11, color: C.textMid, marginBottom: 12, lineHeight: 1.5 }}>
          네이버에서 다른 식당 공유받아 안전빵에 붙여넣으면 자동 분석.<br />
          "담아두기"로 여러 곳 한꺼번에 비교 가능.
        </div>
        <button 
          onClick={() => setView('link-input')} 
          style={{ 
            width: '100%', padding: '12px 16px', background: '#5b6ee1', color: '#fff', 
            border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' 
          }}
        >
          <Link2 size={14} /> 다음 후보 분석하기
        </button>
      </div>

      <button onClick={() => setView('home')} style={{ width: '100%', padding: '12px 16px', background: C.bgSubtle, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8, cursor: 'pointer' }}>
        🏠 안전빵 홈으로
      </button>
      
      <button onClick={() => setView('saved')} style={{ width: '100%', padding: '12px 16px', background: C.bg, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
        <BarChart size={14} /> 담은 장소 비교
      </button>
    </div>
  );
}

function VerdictBadge({ result }) {
  const verdictMap = {
    recommend: { 
      label: '추천', 
      icon: '👍',
      color: C.green, 
      bg: 'linear-gradient(135deg, #ddedea 0%, #c5dfd6 100%)',
      borderColor: C.green,
      tagColor: '#fff'
    },
    consider: { 
      label: '고려해볼만', 
      icon: '🟢',
      color: '#7a8a17', 
      bg: 'linear-gradient(135deg, #eef0d5 0%, #e0e4b8 100%)',
      borderColor: '#7a8a17',
      tagColor: '#fff'
    },
    caution: { 
      label: '신중히 결정', 
      icon: '⚠️',
      color: C.orange, 
      bg: 'linear-gradient(135deg, #fbf0e1 0%, #f5dbb0 100%)',
      borderColor: C.orange,
      tagColor: '#fff'
    },
    avoid: { 
      label: '비추천', 
      icon: '👎',
      color: C.red, 
      bg: 'linear-gradient(135deg, #fdecec 0%, #f9c8c8 100%)',
      borderColor: C.red,
      tagColor: '#fff'
    },
    strongly_avoid: { 
      label: '강력 비추', 
      icon: '🚫',
      color: '#991b1b', 
      bg: 'linear-gradient(135deg, #fde0e0 0%, #f5b5b5 100%)',
      borderColor: '#991b1b',
      tagColor: '#fff'
    }
  };
  
  const v = verdictMap[result.verdict] || verdictMap.caution;
  const reasons = result.verdictReasons || [];
  
  return (
    <div style={{ 
      padding: '18px 20px', 
      background: v.bg, 
      borderRadius: 12, 
      marginBottom: 20, 
      border: `2px solid ${v.borderColor}` 
    }}>
      {/* 상단: 큰 추천/비추천 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <span style={{ fontSize: 36 }}>{v.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ 
            display: 'inline-block', 
            padding: '4px 12px', 
            background: v.color, 
            color: v.tagColor, 
            borderRadius: 100, 
            fontSize: 12, 
            fontWeight: 700, 
            marginBottom: 4 
          }}>
            안전빵 판단: {v.label}
          </div>
          {result.verdictHeadline && (
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, lineHeight: 1.3, letterSpacing: '-0.015em' }}>
              {result.verdictHeadline}
            </div>
          )}
        </div>
      </div>

      {/* 이유 3가지 */}
      {reasons.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '12px 14px', marginBottom: (result.bestFor || result.worstFor) ? 10 : 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMid, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            이렇게 판단했어요
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reasons.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1.2 }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>{r.title}</div>
                  <div style={{ fontSize: 11.5, color: C.textMid, lineHeight: 1.5 }}>{r.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 추천/비추 대상 */}
      {result.bestFor && (result.verdict === 'recommend' || result.verdict === 'consider') && (
        <div style={{ 
          display: 'flex', gap: 8, padding: '10px 12px', 
          background: 'rgba(255,255,255,0.6)', borderRadius: 6, fontSize: 12,
          marginTop: 8
        }}>
          <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓ 추천:</span>
          <span style={{ color: C.text, lineHeight: 1.5 }}>{result.bestFor}</span>
        </div>
      )}
      {result.worstFor && (result.verdict === 'avoid' || result.verdict === 'strongly_avoid' || result.verdict === 'caution') && (
        <div style={{ 
          display: 'flex', gap: 8, padding: '10px 12px', 
          background: 'rgba(255,255,255,0.6)', borderRadius: 6, fontSize: 12,
          marginTop: 8
        }}>
          <span style={{ color: C.red, fontWeight: 700, flexShrink: 0 }}>✗ 비추:</span>
          <span style={{ color: C.text, lineHeight: 1.5 }}>{result.worstFor}</span>
        </div>
      )}
    </div>
  );
}

function RatingDistribution({ distribution, avgRating, reviewCount }) {
  const stars = [5, 4, 3, 2, 1];
  const lowRatio = (distribution[1] || 0) + (distribution[2] || 0);
  const isHighRisk = lowRatio >= 20;
  return (
    <div style={{ padding: '14px 16px', background: C.bgSubtle, borderRadius: 10, marginBottom: 20, border: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 8, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMid, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>별점 분포</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{avgRating?.toFixed(1) || '-'}</span>
            <span style={{ fontSize: 11, color: C.textLight }}>/ 5.0</span>
            {reviewCount && <span style={{ fontSize: 10, color: C.textLight, marginLeft: 4 }}>({reviewCount.toLocaleString()})</span>}
          </div>
        </div>
        {isHighRisk && (
          <div style={{ padding: '4px 9px', background: C.redBg, color: C.red, borderRadius: 5, fontSize: 11, fontWeight: 600 }}>⚠ 1~2점 {lowRatio}%</div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {stars.map(star => {
          const pct = distribution[star] || 0;
          const barColor = star >= 4 ? C.green : star === 3 ? C.yellow : C.red;
          return (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 11 }}>
              <span style={{ width: 20, color: C.textMid, fontWeight: 600 }}>{star}★</span>
              <div style={{ flex: 1, height: 8, background: C.bg, borderRadius: 2, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                <div style={{ width: `${pct}%`, height: '100%', background: barColor, transition: 'width 0.5s ease' }} />
              </div>
              <span style={{ width: 32, textAlign: 'right', color: C.textMid, fontVariantNumeric: 'tabular-nums', fontSize: 11, fontWeight: 500 }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AspectScores({ aspects }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 4px', letterSpacing: '-0.015em' }}>속성별 점수</h3>
      <p style={{ fontSize: 11, color: C.textLight, margin: '0 0 10px' }}>AI가 리뷰에서 속성별 긍정·부정 비율 분석</p>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
        {aspects.map((asp, i) => {
          const sc = asp.score >= 70 ? C.green : asp.score >= 50 ? C.yellow : asp.score >= 30 ? C.orange : C.red;
          const trendIcon = asp.trend === 'down' ? '↓' : asp.trend === 'up' ? '↑' : '→';
          const trendColor = asp.trend === 'down' ? C.red : asp.trend === 'up' ? C.green : C.textLight;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderBottom: i < aspects.length - 1 ? `1px solid ${C.border}` : 'none', background: C.bg }}>
              <div style={{ minWidth: 64 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{asp.name}</div>
                {asp.mentions && <div style={{ fontSize: 9, color: C.textLight, marginTop: 1 }}>{asp.mentions}건</div>}
              </div>
              <div style={{ flex: 1, height: 8, background: C.bgSubtle, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${asp.score}%`, height: '100%', background: sc, transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, minWidth: 50, justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: sc }}>{asp.score}</span>
                <span style={{ fontSize: 12, color: trendColor, fontWeight: 600 }}>{trendIcon}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProsConsLayout({ topRisks, topPositives, sevStyle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 4px', letterSpacing: '-0.015em' }}>결정 전 양면 확인</h3>
      <p style={{ fontSize: 11, color: C.textLight, margin: '0 0 10px' }}>탭하면 AI가 인용한 실제 리뷰</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '9px 14px', background: C.redBg, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ThumbsDown size={12} color={C.red} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.red, textTransform: 'uppercase' }}>놓치면 손해</span>
          </div>
          {(topRisks || []).map((r, i) => (
            <ExpandableItem key={i} item={r} type="risk" sevStyle={sevStyle} isLast={i === topRisks.length - 1} />
          ))}
        </div>
        {topPositives?.length > 0 && (
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '9px 14px', background: C.greenBg, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ThumbsUp size={12} color={C.green} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: 'uppercase' }}>인정할 점</span>
            </div>
            {topPositives.map((p, i) => (
              <ExpandableItem key={i} item={p} type="positive" isLast={i === topPositives.length - 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExpandableItem({ item, type, sevStyle, isLast }) {
  const [expanded, setExpanded] = useState(false);
  const hasEvidence = item.evidenceReviews?.length > 0;
  const accentColor = type === 'risk' ? C.red : C.green;
  const sev = type === 'risk' && item.severity ? sevStyle(item.severity) : null;
  return (
    <div style={{ borderBottom: isLast ? 'none' : `1px solid ${C.border}` }}>
      <div onClick={() => hasEvidence && setExpanded(!expanded)} style={{ padding: '12px 14px', cursor: hasEvidence ? 'pointer' : 'default' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.title}</span>
          {sev && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '1px 6px', background: sev.bg, color: sev.text, borderRadius: 3, fontSize: 10, fontWeight: 600 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: sev.dot }} />{sev.label}
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.5, marginBottom: hasEvidence ? 6 : 0 }}>{item.detail}</div>
        {hasEvidence && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: accentColor, fontWeight: 600 }}>
            <Quote size={10} fill={accentColor} />
            리뷰 {item.evidenceCount || item.evidenceReviews.length}건
            <ChevronDown size={11} style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
          </div>
        )}
      </div>
      {expanded && hasEvidence && (
        <div style={{ padding: '0 14px 14px' }}>
          {item.evidenceReviews.map((rev, i) => (
            <div key={i} style={{ padding: '10px 12px', background: C.bgSubtle, borderRadius: 6, borderLeft: `2px solid ${C.borderStrong}`, marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4, fontSize: 10 }}>
                <span style={{ color: C.orange, letterSpacing: '0.05em', fontSize: 11 }}>{'★'.repeat(rev.rating || 0)}{'☆'.repeat(5 - (rev.rating || 0))}</span>
                <span style={{ color: C.textLight }}>·</span>
                <span style={{ color: C.textLight }}>{rev.date || '날짜 미상'}</span>
              </div>
              <div style={{ fontSize: 12, color: C.text, lineHeight: 1.55 }}>"{rev.text}"</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogAnalysisSection({ placeId }) {
  const [state, setState] = useState('idle'); // idle | loading | loaded | error | empty
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    setState('loading');
    setError('');
    try {
      const res = await callAPI('analyze-blog', { placeId });
      if (res.noBlogReviews) {
        setState('empty');
        setData(res);
      } else {
        setData(res);
        setState('loaded');
      }
    } catch (e) {
      setError(e.message);
      setState('error');
    }
  };

  // 시작 전: 유도 버튼
  if (state === 'idle') {
    return (
      <div style={{ 
        marginBottom: 24, 
        padding: 18, 
        background: 'linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%)', 
        borderRadius: 12, 
        border: '1px solid #d4dbff' 
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#5b6ee1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
            <Sparkles size={18} fill="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 4px', letterSpacing: '-0.015em' }}>
              블로그 리뷰까지 깊게 분석
            </h3>
            <p style={{ fontSize: 12, color: C.textMid, margin: 0, lineHeight: 1.6 }}>
              네이버 블로그 후기 40개에서 <strong style={{ color: C.text }}>광고 자동 필터링</strong> →<br />
              진짜 후기만 추출해 더 깊은 위험·장점 발견
            </p>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: C.textMid, lineHeight: 1.7 }}>
            <strong style={{ color: C.text }}>왜 필요한가요?</strong><br />
            방문자 리뷰는 짧고 표면적이에요. 블로그는 자세하지만 광고가 60~80%.<br />
            AI가 협찬·체험단·정형화된 칭찬 패턴을 가려내고 진짜 후기에서만 인사이트를 뽑아냅니다.
          </div>
        </div>

        <button 
          onClick={analyze}
          style={{ 
            width: '100%', padding: '12px 14px', 
            background: '#5b6ee1', color: '#fff', 
            border: 'none', borderRadius: 8, 
            fontSize: 13, fontWeight: 600, 
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
          }}
        >
          <Sparkles size={13} fill="#fff" /> 블로그 리뷰 분석 시작 (약 30~60초 추가)
        </button>
      </div>
    );
  }

  // 로딩 중
  if (state === 'loading') {
    return (
      <div style={{ marginBottom: 24, padding: 24, background: '#f0f4ff', borderRadius: 12, border: '1px solid #d4dbff', textAlign: 'center' }}>
        <div style={{ marginBottom: 16 }}>
          <Spinner size={28} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>
          블로그 리뷰 수집 + 광고 필터링 중
        </div>
        <div style={{ fontSize: 11, color: C.textMid, lineHeight: 1.6 }}>
          1. Apify가 블로그 글 40개 수집<br />
          2. AI가 광고/진짜 후기 판별<br />
          3. 진짜 후기에서 깊은 신호 추출
        </div>
      </div>
    );
  }

  // 에러
  if (state === 'error') {
    return (
      <div style={{ marginBottom: 24, padding: 16, background: C.redBg, borderRadius: 10, border: `1px solid ${C.red}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
          <AlertCircle size={16} color={C.red} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.red, marginBottom: 4 }}>블로그 분석 실패</div>
            <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{error}</div>
          </div>
        </div>
        <button onClick={analyze} style={{ padding: '6px 12px', background: C.bg, color: C.text, border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
          다시 시도
        </button>
      </div>
    );
  }

  // 블로그 리뷰 없음
  if (state === 'empty') {
    return (
      <div style={{ marginBottom: 24, padding: 16, background: C.bgSubtle, borderRadius: 10, border: `1px solid ${C.border}`, textAlign: 'center' }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>📭</div>
        <div style={{ fontSize: 13, color: C.text, fontWeight: 600, marginBottom: 4 }}>블로그 리뷰가 거의 없어요</div>
        <div style={{ fontSize: 11, color: C.textMid }}>{data?.message || '방문자 리뷰 분석만으로 충분합니다.'}</div>
      </div>
    );
  }

  // 로드 완료 - 결과 표시
  const adRatioColor = data.adRatio >= 70 ? C.red : data.adRatio >= 50 ? C.orange : data.adRatio >= 30 ? C.yellow : C.green;
  const trustColor = data.trustScore >= 70 ? C.green : data.trustScore >= 50 ? C.yellow : data.trustScore >= 30 ? C.orange : C.red;

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 4px', letterSpacing: '-0.015em', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Sparkles size={15} color="#5b6ee1" fill="#5b6ee1" />
        블로그 리뷰 깊은 분석
      </h3>
      <p style={{ fontSize: 11, color: C.textLight, margin: '0 0 12px' }}>광고 필터링 후 진짜 후기에서 추출한 인사이트</p>

      {/* 광고 비율 + 신뢰도 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <div style={{ padding: '12px 14px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>광고 비율</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: adRatioColor, letterSpacing: '-0.02em' }}>{data.adRatio}</span>
            <span style={{ fontSize: 11, color: C.textLight }}>%</span>
          </div>
          <div style={{ fontSize: 10, color: C.textMid, marginTop: 2 }}>{data.adReviews}/{data.totalReviews}개 광고로 판단</div>
        </div>
        <div style={{ padding: '12px 14px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>신뢰도</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: trustColor, letterSpacing: '-0.02em' }}>{data.trustScore}</span>
            <span style={{ fontSize: 11, color: C.textLight }}>/100</span>
          </div>
          <div style={{ fontSize: 10, color: C.textMid, marginTop: 2 }}>블로그 후기 신뢰성</div>
        </div>
      </div>

      {/* 핵심 요약 */}
      {data.summary && (
        <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%)', borderRadius: 10, marginBottom: 14, borderLeft: '3px solid #5b6ee1' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#5b6ee1', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>핵심 발견</div>
          <div style={{ fontSize: 13, color: C.text, fontWeight: 500, lineHeight: 1.55 }}>{data.summary}</div>
        </div>
      )}

      {/* 시간 트렌드 */}
      {data.timeTrend && (
        <div style={{ marginBottom: 14, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', background: C.bgSubtle, borderBottom: `1px solid ${C.border}`, fontSize: 12, fontWeight: 700, color: C.text }}>📈 시간 흐름</div>
          {data.timeTrend.improving && data.timeTrend.improving !== '특별한 개선 신호 없음' && (
            <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 8, background: C.bg }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.green, minWidth: 36 }}>↑ 개선</span>
              <span style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{data.timeTrend.improving}</span>
            </div>
          )}
          {data.timeTrend.worsening && data.timeTrend.worsening !== '특별한 악화 신호 없음' && (
            <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 8, background: C.bg }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.red, minWidth: 36 }}>↓ 악화</span>
              <span style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{data.timeTrend.worsening}</span>
            </div>
          )}
          {data.timeTrend.stable && (
            <div style={{ padding: '10px 14px', display: 'flex', gap: 8, background: C.bg }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.textMid, minWidth: 36 }}>→ 유지</span>
              <span style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{data.timeTrend.stable}</span>
            </div>
          )}
        </div>
      )}

      {/* 놓쳤을 위험 신호 */}
      {data.warnings?.length > 0 && (
        <div style={{ marginBottom: 14, padding: '14px 16px', background: C.redBg, borderRadius: 10, border: `1px solid ${C.red}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.red, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            ⚠ 방문자 리뷰만 봤다면 놓쳤을 위험
          </div>
          {data.warnings.map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '4px 0', fontSize: 12, color: C.text, lineHeight: 1.55 }}>
              <span style={{ color: C.red, fontWeight: 700 }}>•</span>
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* 진짜 후기들이 칭찬하는 점 */}
      {data.hiddenStrengths?.length > 0 && (
        <div style={{ marginBottom: 14, padding: '14px 16px', background: C.greenBg, borderRadius: 10, border: `1px solid ${C.green}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            ✓ 진짜 후기들이 공통으로 칭찬
          </div>
          {data.hiddenStrengths.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '4px 0', fontSize: 12, color: C.text, lineHeight: 1.55 }}>
              <span style={{ color: C.green, fontWeight: 700 }}>•</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* 심층 인사이트 */}
      {data.deepInsights?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 8 }}>💡 심층 인사이트</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.deepInsights.map((insight, i) => {
              const senColor = insight.sentiment === 'positive' ? C.green : insight.sentiment === 'negative' ? C.red : C.textMid;
              const senBg = insight.sentiment === 'positive' ? C.greenBg : insight.sentiment === 'negative' ? C.redBg : C.bgSubtle;
              return (
                <div key={i} style={{ padding: '11px 13px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, borderLeft: `3px solid ${senColor}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: senColor, background: senBg, padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase' }}>{insight.category}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: C.text }}>{insight.title}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: C.textMid, lineHeight: 1.5 }}>{insight.detail}</div>
                  {insight.fromReviews && <div style={{ fontSize: 10, color: C.textLight, marginTop: 4 }}>{insight.fromReviews}개 후기에서 발견</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 광고 vs 진짜 예시 */}
      {data.evidenceQuotes?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 8 }}>📋 광고 vs 진짜 후기 예시</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {data.evidenceQuotes.map((q, i) => (
              <div key={i} style={{ padding: '10px 12px', background: q.type === 'ad' ? '#fff4e6' : C.greenBg, borderRadius: 6, border: `1px solid ${q.type === 'ad' ? '#ffd9a8' : '#c5dfd6'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: q.type === 'ad' ? C.orange : C.green, padding: '1px 6px', background: q.type === 'ad' ? '#fff' : '#fff', borderRadius: 3, textTransform: 'uppercase' }}>
                    {q.type === 'ad' ? '🚫 광고로 판단' : '✓ 진짜 후기'}
                  </span>
                  <span style={{ fontSize: 10, color: C.textMid }}>{q.reason}</span>
                </div>
                <div style={{ fontSize: 12, color: C.text, lineHeight: 1.55, fontStyle: 'italic' }}>"{q.text}"</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PersonalScenario({ result }) {
  const [situation, setSituation] = useState('');
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!situation.trim()) return;
    setLoading(true);
    try {
      const data = await callAPI('scenario', { place: result, situation });
      setScenario(data);
    } catch (e) { alert('실패: ' + e.message); }
    finally { setLoading(false); }
  };

  const verdictStyle = (v) => {
    if (v === 'stop') return { c: C.red, bg: C.redBg, label: '내 상황엔 비추천' };
    if (v === 'caution') return { c: C.orange, bg: C.orangeBg, label: '내 상황엔 신중히' };
    return { c: C.green, bg: C.greenBg, label: '내 상황엔 추천' };
  };

  return (
    <div style={{ marginBottom: 24, padding: 16, background: 'linear-gradient(135deg, #fef6e7 0%, #fbf3db 100%)', borderRadius: 10, border: '1px solid #fbf3db' }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Sparkles size={15} color={C.orange} fill={C.orange} />
        내 상황에서 발생할 손실
      </h3>
      <p style={{ fontSize: 11, color: C.textMid, margin: '0 0 12px' }}>인원·목적·예산 입력 → AI 맞춤 시뮬레이션</p>
      {!scenario && (
        <>
          <textarea value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="예: 5세 아이와 가족 식사, 알레르기 있음" rows={3} disabled={loading} style={{ width: '100%', padding: '11px 13px', border: `1px solid ${C.borderStrong}`, borderRadius: 6, fontSize: 13, outline: 'none', boxSizing: 'border-box', background: C.bg, color: C.text, resize: 'vertical', lineHeight: 1.5, marginBottom: 10 }} />
          <button onClick={generate} disabled={!situation.trim() || loading} style={{ width: '100%', padding: '11px 14px', background: situation.trim() && !loading ? C.text : C.border, color: situation.trim() && !loading ? C.bg : C.textLight, border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {loading ? <><Spinner /> 생성 중...</> : <><User size={13} /> 내 시나리오 보기</>}
          </button>
        </>
      )}
      {scenario && (
        <div style={{ background: C.bg, borderRadius: 8, padding: '14px 16px', borderLeft: `3px solid ${scenario.lossLevel === 'high' ? C.red : scenario.lossLevel === 'medium' ? C.orange : C.green}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: 'uppercase', marginBottom: 4 }}>당신의 상황 기준</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.45, marginBottom: 12 }}>{scenario.headline}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 12 }}>
            {scenario.scenarios?.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: C.bgSubtle, borderRadius: 6 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, marginBottom: 3 }}>{s.title}</div>
                  <div style={{ fontSize: 11.5, color: C.textMid, lineHeight: 1.5 }}>{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
          {scenario.estimatedLoss && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 12px', background: C.redBg, color: C.red, borderRadius: 5, fontSize: 12.5, fontWeight: 600, marginBottom: 10 }}>
              <TrendingDown size={13} />
              <span>예상 손실: {scenario.estimatedLoss}</span>
            </div>
          )}
          
          {/* 🆕 큰 판단 카드 */}
          <div style={{ 
            padding: '14px 16px', 
            borderRadius: 8, 
            background: verdictStyle(scenario.verdict).bg, 
            marginBottom: 10,
            border: `2px solid ${verdictStyle(scenario.verdict).c}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>
                {scenario.verdict === 'go' ? '👍' : scenario.verdict === 'stop' ? '🚫' : '⚠️'}
              </span>
              <div style={{ 
                padding: '3px 10px', 
                color: '#fff', 
                background: verdictStyle(scenario.verdict).c, 
                borderRadius: 100, 
                fontSize: 11, 
                fontWeight: 700 
              }}>
                {scenario.verdictLabel || verdictStyle(scenario.verdict).label}
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10, lineHeight: 1.4 }}>
              {scenario.verdictMessage}
            </div>
            
            {/* 이유 리스트 */}
            {scenario.verdictReasons?.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 6, padding: '10px 12px', marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  판단 근거
                </div>
                {scenario.verdictReasons.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, padding: '3px 0', fontSize: 11.5, color: C.text, lineHeight: 1.5 }}>
                    <span style={{ flexShrink: 0 }}>{r.icon}</span>
                    <span>{r.reason}</span>
                  </div>
                ))}
              </div>
            )}
            
            {scenario.alternativeHint && (
              <div style={{ fontSize: 11.5, color: C.textMid, lineHeight: 1.5, padding: '6px 0' }}>
                💡 {scenario.alternativeHint}
              </div>
            )}
          </div>
          
          {/* 🆕 그래도 간다면 팁 */}
          {scenario.ifGoTips?.length > 0 && (
            <div style={{ padding: '12px 14px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                그래도 간다면 이건 챙기세요
              </div>
              {scenario.ifGoTips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '3px 0', fontSize: 12, color: C.text, lineHeight: 1.5 }}>
                  <span style={{ color: C.orange, fontWeight: 700, flexShrink: 0 }}>•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}
          
          <button onClick={() => { setScenario(null); setSituation(''); }} style={{ padding: '6px 11px', background: 'transparent', color: C.textMid, border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 11, fontWeight: 500 }}>다른 상황</button>
        </div>
      )}
    </div>
  );
}

// 공유받은 직후 - 지금 분석 vs 큐에 담기 선택
function ShareReceivedView({ url, addToQueue, setView, autoAnalyze, setAnalyzeStage, setAnalyzeProgress, queueCount }) {
  const extractedUrl = extractNaverUrl(url);
  const placeName = extractPlaceName(url) || '이름 미상';
  const [adding, setAdding] = useState(false);
  
  const handleAddToQueue = () => {
    setAdding(true);
    const success = addToQueue(url, placeName);
    if (success) {
      // 1.5초 후 자동으로 안내 + 홈으로
      setTimeout(() => {
        setView('home');
      }, 1500);
    } else {
      setAdding(false);
    }
  };
  
  const handleAnalyzeNow = () => {
    setView('analyzing');
    setAnalyzeStage('공유받은 링크 처리 중');
    setAnalyzeProgress(10);
    autoAnalyze(url);
  };
  
  if (adding) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>📥</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8, letterSpacing: '-0.02em' }}>
          큐에 담겼어요!
        </div>
        <div style={{ fontSize: 14, color: C.textMid, lineHeight: 1.6, marginBottom: 24 }}>
          이제 네이버로 돌아가서<br />다른 곳도 둘러보세요
        </div>
        <div style={{ 
          display: 'inline-block', 
          padding: '8px 16px', 
          background: C.blueBg, 
          color: C.blue, 
          borderRadius: 100, 
          fontSize: 13, 
          fontWeight: 700 
        }}>
          대기 중 {queueCount + 1}개
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ 
        padding: '20px 22px', 
        background: C.bgSubtle, 
        borderRadius: 16, 
        marginBottom: 24,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.textMid, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          공유받은 장소
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: '-0.02em' }}>
          📍 {placeName}
        </div>
      </div>
      
      <h2 style={{ 
        fontSize: 22, 
        fontWeight: 700, 
        color: C.text, 
        margin: '0 0 8px', 
        letterSpacing: '-0.025em',
        textAlign: 'center'
      }}>
        어떻게 분석할까요?
      </h2>
      <p style={{ 
        fontSize: 13, 
        color: C.textMid, 
        margin: '0 0 28px', 
        lineHeight: 1.5, 
        textAlign: 'center' 
      }}>
        한 곳만 빠르게? 여러 곳 모아서?
      </p>
      
      {/* 옵션 1: 지금 바로 분석 */}
      <button onClick={handleAnalyzeNow} style={{
        width: '100%',
        padding: '20px 20px',
        background: C.blue,
        color: '#fff',
        border: 'none',
        borderRadius: 14,
        marginBottom: 12,
        textAlign: 'left',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(49, 130, 246, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ 
            width: 44, 
            height: 44, 
            borderRadius: 12, 
            background: 'rgba(255,255,255,0.18)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 22
          }}>
            ⚡
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3, letterSpacing: '-0.015em' }}>
              지금 바로 분석
            </div>
            <div style={{ fontSize: 12, opacity: 0.9, lineHeight: 1.4 }}>
              30초 후 결과 확인
            </div>
          </div>
          <ChevronRight size={20} />
        </div>
      </button>
      
      {/* 옵션 2: 큐에 담기 */}
      <button onClick={handleAddToQueue} style={{
        width: '100%',
        padding: '20px 20px',
        background: '#fff5e6',
        color: C.text,
        border: '2px solid #fcd34d',
        borderRadius: 14,
        marginBottom: 16,
        textAlign: 'left',
        cursor: 'pointer'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ 
            width: 44, 
            height: 44, 
            borderRadius: 12, 
            background: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 22
          }}>
            📥
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3, color: '#78350f', letterSpacing: '-0.015em' }}>
              큐에 담기 {queueCount > 0 && `(현재 ${queueCount}개)`}
            </div>
            <div style={{ fontSize: 12, color: '#92400e', lineHeight: 1.4 }}>
              여러 곳 모아서 한 번에 비교
            </div>
          </div>
          <ChevronRight size={20} color="#78350f" />
        </div>
      </button>
      
      <button onClick={() => setView('home')} style={{
        width: '100%',
        padding: '12px 14px',
        background: 'transparent',
        color: C.textLight,
        border: 'none',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer'
      }}>
        취소
      </button>
    </div>
  );
}

// 큐 화면 - 대기 항목 보기 + 일괄 분석
function QueueView({ queue, removeFromQueue, clearQueue, processQueue, setView, queueProcessing, queueProgress }) {
  if (queueProcessing) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ marginBottom: 24 }}>
          <Spinner size={36} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 6, letterSpacing: '-0.02em' }}>
          일괄 분석 중...
        </div>
        <div style={{ fontSize: 14, color: C.textMid, lineHeight: 1.5, marginBottom: 28 }}>
          {queueProgress.current}/{queueProgress.total} 완료
        </div>
        
        <div style={{ width: '100%', height: 8, background: C.bgSubtle, borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ 
            width: `${(queueProgress.current / queueProgress.total) * 100}%`, 
            height: '100%', 
            background: C.blue, 
            transition: 'width 0.5s ease' 
          }} />
        </div>
        
        <div style={{ fontSize: 12, color: C.textLight, marginTop: 20 }}>
          ⚠️ 화면을 닫지 마세요
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: '0 0 6px', letterSpacing: '-0.025em' }}>
          분석 대기 큐
        </h1>
        <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.5, margin: 0 }}>
          {queue.length === 0 ? '대기 중인 항목이 없어요' : `${queue.length}개 대기 중 · 한 번에 분석하고 비교`}
        </p>
      </div>
      
      {queue.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, marginBottom: 24 }}>
            네이버에서 공유받을 때<br />"큐에 담기"를 선택해보세요
          </p>
          <button onClick={() => setView('home')} style={{ 
            padding: '12px 20px', 
            background: C.blue, 
            color: '#fff', 
            border: 'none', 
            borderRadius: 10, 
            fontSize: 14, 
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            홈으로
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {queue.map((item, idx) => (
              <div key={item.id} style={{
                padding: '14px 16px',
                background: C.bgSubtle,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <div style={{ 
                  width: 28, 
                  height: 28, 
                  borderRadius: 8, 
                  background: '#fff', 
                  color: C.textMid, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: 12, 
                  fontWeight: 700, 
                  flexShrink: 0 
                }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontSize: 14, 
                    fontWeight: 600, 
                    color: C.text, 
                    marginBottom: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.placeName}
                  </div>
                  <div style={{ fontSize: 11, color: C.textLight }}>
                    {timeAgo(item.addedAt)}
                  </div>
                </div>
                <button onClick={() => removeFromQueue(item.id)} style={{ 
                  width: 28, 
                  height: 28, 
                  padding: 0,
                  background: 'transparent', 
                  border: 'none', 
                  color: C.textLight, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6
                }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          
          {/* 안내 */}
          <div style={{ 
            padding: '12px 14px', 
            background: C.blueBg, 
            borderRadius: 10, 
            fontSize: 12, 
            color: C.blue, 
            lineHeight: 1.6, 
            marginBottom: 16, 
            fontWeight: 500 
          }}>
            💡 분석은 약 {Math.ceil(queue.length / 3) * 40}초 걸려요 (3개씩 병렬 처리)
          </div>
          
          {/* 일괄 분석 버튼 */}
          <button onClick={processQueue} style={{
            width: '100%',
            padding: '16px 20px',
            background: C.blue,
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(49, 130, 246, 0.25)'
          }}>
            <Sparkles size={16} fill="#fff" />
            {queue.length}개 일괄 분석 + 자동 비교
          </button>
          
          <button onClick={() => { 
            if (confirm('큐를 비울까요?')) clearQueue(); 
          }} style={{
            width: '100%',
            padding: '12px 16px',
            background: 'transparent',
            color: C.textMid,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            전체 비우기
          </button>
        </>
      )}
    </div>
  );
}

// 분석 기록 화면
function HistoryView({ history, setHistory, setResult, setView, getScoreStyle }) {
  // 날짜별 그룹
  const grouped = useMemo(() => {
    const groups = { '오늘': [], '어제': [], '이번 주': [], '이전': [] };
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    history.forEach(item => {
      const diff = now - (item.analyzedAt || 0);
      if (diff < oneDay) groups['오늘'].push(item);
      else if (diff < 2 * oneDay) groups['어제'].push(item);
      else if (diff < 7 * oneDay) groups['이번 주'].push(item);
      else groups['이전'].push(item);
    });
    
    return groups;
  }, [history]);
  
  const viewItem = (item) => {
    setResult(item);
    setView('result');
    window.scrollTo(0, 0);
  };
  
  const removeItem = (idx) => {
    if (!confirm('이 분석 기록을 삭제할까요?')) return;
    const newHistory = history.filter((_, i) => i !== idx);
    setHistory(newHistory);
    try { localStorage.setItem('safebbang_history', JSON.stringify(newHistory)); } catch (e) {}
  };
  
  const clearAll = () => {
    if (!confirm('모든 분석 기록을 삭제할까요?')) return;
    setHistory([]);
    try { localStorage.setItem('safebbang_history', JSON.stringify([])); } catch (e) {}
  };
  
  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: '0 0 6px', letterSpacing: '-0.025em' }}>
            분석 기록
          </h1>
          <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.5, margin: 0 }}>
            {history.length === 0 ? '아직 분석한 적이 없어요' : `${history.length}개 (최대 50개)`}
          </p>
        </div>
        {history.length > 0 && (
          <button onClick={clearAll} style={{
            padding: '6px 12px',
            background: 'transparent',
            color: C.textLight,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            전체 삭제
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, marginBottom: 24 }}>
            분석한 결과가 자동으로 여기 저장돼요<br />언제든 다시 확인할 수 있어요
          </p>
          <button onClick={() => setView('home')} style={{ 
            padding: '12px 20px', 
            background: C.blue, 
            color: '#fff', 
            border: 'none', 
            borderRadius: 10, 
            fontSize: 14, 
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            지금 분석하기
          </button>
        </div>
      ) : (
        <>
          {Object.entries(grouped).map(([groupName, items]) => 
            items.length > 0 && (
              <div key={groupName} style={{ marginBottom: 28 }}>
                <div style={{ 
                  fontSize: 11, 
                  fontWeight: 700, 
                  color: C.textMid, 
                  marginBottom: 10, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  {groupName} ({items.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map((item, i) => {
                    const realIdx = history.findIndex(h => h.analyzedAt === item.analyzedAt && h.name === item.name);
                    const sc = getScoreStyle(item.safetyScore || 50);
                    const isStale = (Date.now() - (item.analyzedAt || 0)) > 7 * 24 * 60 * 60 * 1000;
                    
                    return (
                      <div key={`${groupName}-${i}`} style={{
                        padding: '14px 16px',
                        background: C.bgSubtle,
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        cursor: 'pointer',
                        opacity: isStale ? 0.7 : 1
                      }} onClick={() => viewItem(item)}>
                        <div style={{ 
                          width: 44, 
                          height: 44, 
                          borderRadius: 12, 
                          background: sc.bg, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          flexShrink: 0,
                          fontSize: 20
                        }}>
                          {item.emoji || '📍'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                            <div style={{ 
                              fontSize: 14, 
                              fontWeight: 700, 
                              color: C.text,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1
                            }}>
                              {item.name}
                            </div>
                            {item.categoryLabel && (
                              <span style={{ 
                                fontSize: 10, 
                                color: C.textMid, 
                                background: '#fff', 
                                padding: '1px 6px', 
                                borderRadius: 4, 
                                flexShrink: 0,
                                fontWeight: 600
                              }}>
                                {item.categoryLabel}
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                            <span style={{ color: sc.color, fontWeight: 700 }}>
                              {sc.emoji} {item.safetyScore}점
                            </span>
                            <span style={{ color: C.textLight }}>
                              {timeAgo(item.analyzedAt)}
                            </span>
                            {isStale && (
                              <span style={{ color: C.orange, fontWeight: 600 }}>
                                · 7일 경과
                              </span>
                            )}
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); removeItem(realIdx); }} style={{ 
                          width: 28, 
                          height: 28, 
                          padding: 0,
                          background: 'transparent', 
                          border: 'none', 
                          color: C.textLight, 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 6,
                          flexShrink: 0
                        }}>
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}

// 시간 표시 헬퍼 (몇 분 전, 몇 시간 전 등)
function timeAgo(timestamp) {
  if (!timestamp) return '';
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return '방금';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function SavedView({ places, setView, setResult, getScoreStyle, setSavedPlaces, saveSavedList }) {
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());
  
  const removePlace = (idx) => {
    if (!confirm(`"${places[idx].name}" 삭제?`)) return;
    const newList = places.filter((_, i) => i !== idx);
    setSavedPlaces(newList);
    saveSavedList(newList);
    const newSelected = new Set(selected);
    newSelected.delete(idx);
    setSelected(newSelected);
  };
  
  const toggleSelect = (idx) => {
    const newSelected = new Set(selected);
    if (newSelected.has(idx)) newSelected.delete(idx);
    else {
      if (newSelected.size >= 5) {
        alert('최대 5개까지 비교 가능해요');
        return;
      }
      newSelected.add(idx);
    }
    setSelected(newSelected);
  };
  
  const startSelectMode = () => {
    setSelectMode(true);
    setSelected(new Set());
  };
  
  const cancelSelectMode = () => {
    setSelectMode(false);
    setSelected(new Set());
  };
  
  const compareSelected = () => {
    if (selected.size < 2) {
      alert('비교하려면 최소 2개 선택해주세요');
      return;
    }
    const selectedPlaces = Array.from(selected).map(idx => places[idx]);
    // CompareView가 places prop을 받으니까 임시로 selectedPlaces를 sessionStorage에 저장
    try {
      sessionStorage.setItem('safebbang_compare_places', JSON.stringify(selectedPlaces));
    } catch (e) {}
    setView('compare-selected');
  };
  
  const selectAll = () => {
    setSelected(new Set(places.map((_, i) => i).slice(0, 5)));
  };
  
  return (
    <div style={{ padding: '20px 0 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: 0, letterSpacing: '-0.025em' }}>
          담은 장소
        </h1>
        {places.length >= 2 && !selectMode && (
          <button onClick={startSelectMode} style={{
            padding: '7px 13px',
            background: C.blueBg,
            color: C.blue,
            border: 'none',
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            ✓ 선택해서 비교
          </button>
        )}
      </div>
      <p style={{ fontSize: 13, color: C.textMid, margin: '0 0 20px', lineHeight: 1.5 }}>
        {places.length === 0 ? '아직 담은 곳이 없어요' : `${places.length}개 담겨있음`}
        {selectMode && selected.size > 0 && ` · ${selected.size}개 선택됨`}
      </p>
      
      {places.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, marginBottom: 20 }}>
            분석 후 "안전빵에 담아 비교하기"로<br />여러 곳을 모아 비교할 수 있어요.
          </p>
          <button onClick={() => setView('link-input')} style={{ 
            padding: '12px 20px', 
            background: C.blue, 
            color: '#fff', 
            border: 'none', 
            borderRadius: 10, 
            fontSize: 14, 
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            지금 분석하기
          </button>
        </div>
      )}
      
      {/* 선택 모드 액션 바 */}
      {selectMode && places.length >= 2 && (
        <div style={{
          position: 'sticky',
          top: 60,
          zIndex: 40,
          padding: '12px 14px',
          background: C.blueBg,
          borderRadius: 12,
          marginBottom: 16,
          display: 'flex',
          gap: 8,
          alignItems: 'center'
        }}>
          <button onClick={selectAll} style={{
            padding: '7px 12px',
            background: '#fff',
            color: C.blue,
            border: 'none',
            borderRadius: 7,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            전체 선택
          </button>
          <button onClick={cancelSelectMode} style={{
            padding: '7px 12px',
            background: 'transparent',
            color: C.textMid,
            border: `1px solid ${C.border}`,
            borderRadius: 7,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            취소
          </button>
          <button 
            onClick={compareSelected}
            disabled={selected.size < 2}
            style={{
              flex: 1,
              padding: '9px 14px',
              background: selected.size >= 2 ? C.blue : C.border,
              color: selected.size >= 2 ? '#fff' : C.textLight,
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: selected.size >= 2 ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5
            }}
          >
            <BarChart size={13} />
            {selected.size >= 2 ? `${selected.size}개 비교 분석` : '2개 이상 선택'}
          </button>
        </div>
      )}
      
      {/* 비선택 모드: 전체 비교 버튼 */}
      {!selectMode && places.length >= 2 && (
        <button 
          onClick={() => setView('compare')} 
          style={{ 
            width: '100%', 
            padding: '14px', 
            marginBottom: 16, 
            background: C.blue, 
            color: '#fff', 
            border: 'none', 
            borderRadius: 12, 
            fontSize: 14, 
            fontWeight: 700, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 6,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(49, 130, 246, 0.2)'
          }}
        >
          <BarChart size={15} /> {places.length}개 전체 비교 분석
        </button>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {places.map((p, i) => {
          const sc = getScoreStyle(p.safetyScore);
          const isSelected = selected.has(i);
          
          return (
            <div 
              key={i} 
              onClick={selectMode ? () => toggleSelect(i) : undefined}
              style={{ 
                padding: 14, 
                background: selectMode && isSelected ? C.blueBg : C.bg, 
                border: `${selectMode && isSelected ? 2 : 1}px solid ${selectMode && isSelected ? C.blue : C.border}`, 
                borderRadius: 12,
                cursor: selectMode ? 'pointer' : 'default',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                {/* 체크박스 (선택 모드에서만) */}
                {selectMode && (
                  <div style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: `2px solid ${isSelected ? C.blue : C.borderStrong}`,
                    background: isSelected ? C.blue : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2
                  }}>
                    {isSelected && <Check size={14} color="#fff" strokeWidth={3} />}
                  </div>
                )}
                <span style={{ fontSize: 24 }}>{p.emoji || '📍'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{p.name}</div>
                    {p.categoryLabel && (
                      <span style={{ 
                        fontSize: 10, 
                        color: C.textMid, 
                        background: C.bgSubtle, 
                        padding: '1px 6px', 
                        borderRadius: 4, 
                        fontWeight: 600 
                      }}>
                        {p.categoryLabel}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: C.textLight }}>{p.location}</div>
                </div>
                <div style={{ 
                  padding: '4px 10px', 
                  background: sc.bg, 
                  color: sc.color, 
                  borderRadius: 6, 
                  fontSize: 13, 
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {p.safetyScore}
                </div>
              </div>
              <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.5, marginBottom: selectMode ? 0 : 10 }}>
                {p.oneLineSummary}
              </div>
              {!selectMode && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => { setResult(p); setView('result'); }} style={{ 
                    flex: 1, 
                    padding: '8px 10px', 
                    background: C.bgSubtle, 
                    color: C.text, 
                    border: 'none', 
                    borderRadius: 7, 
                    fontSize: 12, 
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}>
                    자세히
                  </button>
                  <button onClick={() => removePlace(i)} style={{ 
                    padding: '8px 12px', 
                    background: 'transparent', 
                    color: C.textLight, 
                    border: `1px solid ${C.border}`, 
                    borderRadius: 7, 
                    fontSize: 12, 
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}>
                    삭제
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CompareView({ places, setView, getScoreStyle, useSelected }) {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 선택된 항목만 비교하는 경우 sessionStorage에서 읽기
  const actualPlaces = useMemo(() => {
    if (useSelected) {
      try {
        const stored = sessionStorage.getItem('safebbang_compare_places');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return places;
  }, [useSelected, places]);

  useEffect(() => { runCompare(); }, []);

  const runCompare = async () => {
    setLoading(true);
    try {
      const data = await callAPI('compare', { places: actualPlaces });
      setComparison(data);
    } catch (e) { alert('실패: ' + e.message); }
    finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <Spinner size={28} />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '14px 0 6px' }}>AI 비교 분석 중</h3>
        <p style={{ fontSize: 13, color: C.textMid }}>{actualPlaces.length}곳 종합 분석</p>
      </div>
    );
  }
  if (!comparison) return null;
  const winner = actualPlaces[comparison.winner];

  return (
    <div style={{ padding: '20px 0 0' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: '0 0 6px', letterSpacing: '-0.02em' }}>AI 비교 분석</h1>
      <p style={{ fontSize: 13, color: C.textMid, margin: '0 0 20px', lineHeight: 1.6 }}>담은 {actualPlaces.length}곳 중 가장 안전한 선택</p>
      <div style={{ padding: '20px 22px', background: 'linear-gradient(135deg, #ddedea 0%, #d3e8df 100%)', borderRadius: 12, borderLeft: `4px solid ${C.green}`, marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 8, textTransform: 'uppercase' }}>🏆 AI 추천</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 6 }}>{winner?.name}</div>
        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, marginBottom: 14 }}>{comparison.winnerReason}</div>
        <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.6)', borderRadius: 6, fontSize: 12, fontWeight: 500, color: C.text, lineHeight: 1.55 }}>💡 {comparison.finalAdvice}</div>
      </div>
      {comparison.categoryBest && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 10px' }}>카테고리별 1등</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
            {Object.entries(comparison.categoryBest).map(([cat, idx]) => (
              <div key={cat} style={{ padding: '11px 12px', background: C.bgSubtle, border: `1px solid ${C.border}`, borderRadius: 7 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: 'uppercase', marginBottom: 4 }}>{cat} 1등</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{actualPlaces[parseInt(idx)]?.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 10px' }}>장소별 분석</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {actualPlaces.map((p, i) => {
          const sc = getScoreStyle(p.safetyScore);
          const cmp = comparison.comparison.find(c => c.placeIndex === i);
          const isWinner = i === comparison.winner;
          const vs = !cmp ? null : cmp.verdict === 'go' ? { c: C.green, bg: C.greenBg } : cmp.verdict === 'stop' ? { c: C.red, bg: C.redBg } : { c: C.orange, bg: C.orangeBg };
          return (
            <div key={i} style={{ padding: 16, background: C.bg, border: isWinner ? `2px solid ${C.green}` : `1px solid ${C.border}`, borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{p.emoji || '📍'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{p.name}</span>
                    {isWinner && <span style={{ padding: '2px 7px', background: C.green, color: '#fff', borderRadius: 100, fontSize: 9, fontWeight: 700 }}>⭐ 추천</span>}
                  </div>
                  <div style={{ fontSize: 11, color: C.textLight }}>{p.location}</div>
                </div>
                <div style={{ padding: '3px 9px', background: sc.bg, color: sc.color, borderRadius: 4, fontSize: 13, fontWeight: 700 }}>{p.safetyScore}</div>
              </div>
              {cmp && (
                <>
                  {vs && <div style={{ display: 'inline-block', padding: '3px 9px', background: vs.bg, color: vs.c, borderRadius: 4, fontSize: 10, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase' }}>{cmp.verdictLabel}</div>}
                  <div style={{ background: C.bgSubtle, borderRadius: 6, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', gap: 8, fontSize: 12 }}><span style={{ minWidth: 32, fontWeight: 700, color: C.green }}>강점</span><span style={{ color: C.text, lineHeight: 1.5 }}>{cmp.strength}</span></div>
                    <div style={{ display: 'flex', gap: 8, fontSize: 12 }}><span style={{ minWidth: 32, fontWeight: 700, color: C.red }}>약점</span><span style={{ color: C.text, lineHeight: 1.5 }}>{cmp.weakness}</span></div>
                    <div style={{ display: 'flex', gap: 8, fontSize: 12 }}><span style={{ minWidth: 32, fontWeight: 700, color: C.orange }}>적합</span><span style={{ color: C.text, lineHeight: 1.5 }}>{cmp.bestFor}</span></div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <button onClick={runCompare} style={{ width: '100%', padding: '11px 14px', background: C.bgSubtle, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 500 }}>↻ 다시 비교</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
