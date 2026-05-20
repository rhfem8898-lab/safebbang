const { useState, useEffect, useRef, useMemo } = React;

const C = {
  bg: '#ffffff', bgSubtle: '#f7f6f3', bgHover: '#f1f1ef',
  border: '#e9e9e7', borderStrong: '#d3d2cf',
  text: '#37352f', textMid: '#787774', textLight: '#9b9a97',
  red: '#e03e3e', redBg: '#fdecec',
  orange: '#d9730d', orangeBg: '#fbf0e1',
  yellow: '#dfab01', yellowBg: '#fbf3db',
  green: '#0f7b0f', greenBg: '#ddedea',
  blue: '#2383e2',
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
  const res = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `오류 ${res.status}`);
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
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    setMobile(isMobile());
    try {
      const stored = localStorage.getItem('safebbang_saved');
      if (stored) setSavedPlaces(JSON.parse(stored));
    } catch (e) {}
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('url') || params.get('text');
    if (sharedUrl && isValidUrl(sharedUrl)) {
      setUrl(sharedUrl);
      setView('link-input');
    }
  }, []);

  const saveSavedList = (places) => {
    try { localStorage.setItem('safebbang_saved', JSON.stringify(places)); } catch (e) {}
  };

  const analyzeUrl = async () => {
    if (!isValidUrl(url)) { setError('올바른 URL을 입력해주세요.'); return; }
    const site = detectSite(url);
    if (!site) { setError('지원하지 않는 URL입니다.'); return; }
    if (site.id !== 'naver') {
      setError(`${site.name}는 현재 직접 분석을 지원하지 않아요. 아래 이미지 업로드를 이용해주세요.`);
      return;
    }

    setError('');
    setView('analyzing');
    
    try {
      const stages = [
        { msg: '네이버 플레이스 접근 중', pct: 20 },
        { msg: '리뷰 수집 중 (약 30초)', pct: 40 },
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
      }, 6000);

      const data = await callAPI('analyze-naver', { url });
      clearInterval(interval);
      setAnalyzeProgress(100);
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
      setResult({ ...data, sourceUrl: null });
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

  const getScoreStyle = (s) => {
    if (s >= 70) return { color: C.green, bg: C.greenBg, label: '안전' };
    if (s >= 50) return { color: C.yellow, bg: C.yellowBg, label: '주의' };
    if (s >= 30) return { color: C.orange, bg: C.orangeBg, label: '주의' };
    return { color: C.red, bg: C.redBg, label: '위험' };
  };

  const sevStyle = (s) => {
    if (s === 'high') return { dot: C.red, label: '높음', bg: C.redBg, text: C.red };
    if (s === 'medium') return { dot: C.orange, label: '중간', bg: C.orangeBg, text: C.orange };
    return { dot: C.textLight, label: '낮음', bg: C.bgSubtle, text: C.textMid };
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
        <Header view={view} goHome={goHome} savedCount={savedPlaces.length} setView={setView} />
        <div style={{ padding: '0 16px 100px' }}>
          {view === 'home' && <HomeView setView={setView} savedCount={savedPlaces.length} />}
          {view === 'link-input' && <LinkInputView url={url} setUrl={setUrl} error={error} setError={setError} analyzeUrl={analyzeUrl} setView={setView} />}
          {view === 'image-input' && <ImageInputView mobile={mobile} uploadedImages={uploadedImages} processing={processing} dragActive={dragActive} setDragActive={setDragActive} error={error} galleryInputRef={galleryInputRef} cameraInputRef={cameraInputRef} handleFiles={handleFiles} removeImage={removeImage} analyzeImages={analyzeImages} />}
          {view === 'analyzing' && <AnalyzingView stage={analyzeStage} progress={analyzeProgress} />}
          {view === 'result' && result && <ResultView result={result} getScoreStyle={getScoreStyle} sevStyle={sevStyle} isSaved={isSaved} toggleSave={toggleSave} goHome={goHome} setView={setView} />}
          {view === 'saved' && <SavedView places={savedPlaces} setView={setView} setResult={setResult} getScoreStyle={getScoreStyle} setSavedPlaces={setSavedPlaces} saveSavedList={saveSavedList} />}
          {view === 'compare' && <CompareView places={savedPlaces} setView={setView} getScoreStyle={getScoreStyle} />}
        </div>
      </div>
    </div>
  );
}

function Header({ view, goHome, savedCount, setView }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${C.border}`, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div onClick={goHome} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <img src="/logo/bread-64.png" alt="안전빵" style={{ width: 36, height: 36, display: 'block' }} />
        <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>안전빵</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {savedCount > 0 && (
          <button onClick={() => setView('saved')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 11px', background: C.text, color: C.bg, border: 'none', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
            <Bookmark size={12} fill="currentColor" /><span>{savedCount}</span>
          </button>
        )}
      </div>
    </div>
  );
}

function HomeView({ setView, savedCount }) {
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

      <h1 style={{ fontSize: 30, fontWeight: 700, color: C.text, margin: '0 0 10px', letterSpacing: '-0.025em', lineHeight: 1.2, textAlign: 'center' }}>
        결제 전, <span style={{ color: C.red }}>후회</span>부터 막으세요
      </h1>
      <p style={{ fontSize: 14, color: C.textMid, margin: '0 0 32px', lineHeight: 1.6, textAlign: 'center' }}>
        식당·카페·병원·미용실, 숙소까지<br />
        AI가 리뷰 100개 읽고 위험 신호 진단
      </p>

      <button onClick={() => setView('link-input')} style={{ width: '100%', padding: '20px', background: C.text, color: C.bg, border: 'none', borderRadius: 12, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
        <div style={{ width: 44, height: 44, borderRadius: 9, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Link2 size={22} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>네이버 플레이스 링크로 분석</div>
          <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.4 }}>식당·카페·병원·미용실 등 모든 장소</div>
        </div>
        <ChevronRight size={18} />
      </button>

      <div style={{ marginBottom: 28, padding: '12px 14px', background: C.bgSubtle, border: `1px dashed ${C.borderStrong}`, borderRadius: 10, fontSize: 11, color: C.textMid, lineHeight: 1.6 }}>
        💡 야놀자·여기어때는 아래 <strong>이미지 캡처 업로드</strong>로 분석
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: C.border }}></div>
          <span style={{ fontSize: 11, color: C.textLight, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>또는</span>
          <div style={{ flex: 1, height: 1, background: C.border }}></div>
        </div>
        <button onClick={() => setView('image-input')} style={{ width: '100%', padding: '16px', background: C.bg, color: C.text, border: `1.5px solid ${C.border}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: C.bgSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Camera size={18} color={C.textMid} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>리뷰 스크린샷 업로드</div>
            <div style={{ fontSize: 11, color: C.textMid }}>야놀자/여기어때/모든 사이트 가능</div>
          </div>
          <ChevronRight size={16} color={C.textLight} />
        </button>
      </div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
          이렇게 사용하세요
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { n: 1, t: '네이버 지도에서 식당·카페 검색', e: '🔍' },
            { n: 2, t: '장소 페이지 → 공유 → 링크 복사', e: '🔗' },
            { n: 3, t: '안전빵 열고 링크 붙여넣기', e: '🛡' },
            { n: 4, t: '30초 후 손해 위험 확인', e: '✨' }
          ].map(step => (
            <div key={step.n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: C.bgSubtle, borderRadius: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: C.text, color: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                {step.n}
              </div>
              <div style={{ fontSize: 13, color: C.text, flex: 1, lineHeight: 1.5 }}>{step.t}</div>
              <span style={{ fontSize: 18 }}>{step.e}</span>
            </div>
          ))}
        </div>
      </div>

      {savedCount > 0 && (
        <div onClick={() => setView('saved')} style={{ padding: '14px 16px', background: C.bgSubtle, border: `1px solid ${C.border}`, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
          <BookmarkCheck size={18} color={C.text} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>담은 장소 {savedCount}개</div>
            <div style={{ fontSize: 11, color: C.textMid }}>AI 비교 분석</div>
          </div>
          <ChevronRight size={16} color={C.textLight} />
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: 11, color: C.textLight, marginTop: 40, paddingBottom: 20 }}>
        안전빵 · 결제 전 후회를 막는 AI
      </div>
    </div>
  );
}

function LinkInputView({ url, setUrl, error, setError, analyzeUrl, setView }) {
  const site = url ? detectSite(url) : null;

  return (
    <div style={{ padding: '24px 0 0' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
        네이버 플레이스 링크
      </h2>
      <p style={{ fontSize: 13, color: C.textMid, margin: '0 0 20px', lineHeight: 1.6 }}>
        식당·카페·병원·미용실 등 네이버에 등록된 모든 장소를 분석합니다.
      </p>

      <textarea
        value={url}
        onChange={(e) => { setUrl(e.target.value); setError(''); }}
        placeholder="https://map.naver.com/p/entry/place/... 또는 https://naver.me/..."
        rows={3}
        autoFocus
        style={{ width: '100%', padding: '14px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', background: C.bgSubtle, color: C.text, resize: 'none', lineHeight: 1.5, marginBottom: 12 }}
      />

      {site && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: site.supported ? C.greenBg : C.orangeBg, color: site.supported ? C.green : C.orange, borderRadius: 8, fontSize: 12, marginBottom: 12, fontWeight: 600 }}>
          {site.supported ? <Check size={14} /> : <AlertCircle size={14} />}
          <span>{site.emoji} {site.name} 감지됨</span>
        </div>
      )}

      {site && !site.supported && (
        <div style={{ padding: '12px 14px', background: C.bgSubtle, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.textMid, lineHeight: 1.6, marginBottom: 14 }}>
          {site.name}는 직접 크롤링 미지원. <button onClick={() => setView('image-input')} style={{ color: C.blue, background: 'transparent', border: 'none', padding: 0, fontSize: 12, fontWeight: 600, textDecoration: 'underline' }}>리뷰 캡처 업로드</button>를 이용해주세요.
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', gap: 8, padding: '10px 14px', background: C.redBg, color: C.red, borderRadius: 6, fontSize: 12, marginBottom: 14 }}>
          <AlertCircle size={14} />
          <div>{error}</div>
        </div>
      )}

      <button onClick={analyzeUrl} disabled={!url.trim() || (site && !site.supported)} style={{ width: '100%', padding: '15px 16px', background: (url.trim() && site?.supported) ? C.text : C.border, color: (url.trim() && site?.supported) ? C.bg : C.textLight, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Sparkles size={16} /> 손해 위험 분석 시작
      </button>

      <p style={{ fontSize: 11, color: C.textLight, marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
        리뷰 80개 수집 + AI 분석 · 약 30~60초
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

      <div style={{ marginBottom: 8 }}><span style={{ fontSize: 32 }}>{result.emoji || '📍'}</span></div>
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

      <div style={{ padding: '18px 20px', background: sc.bg, borderRadius: 10, marginBottom: 20, borderLeft: `3px solid ${sc.color}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: sc.color, letterSpacing: '-0.025em', lineHeight: 1 }}>{result.safetyScore}</span>
          <span style={{ fontSize: 14, color: sc.color, fontWeight: 600 }}>/ 100</span>
          <span style={{ padding: '2px 8px', background: sc.color, color: '#fff', borderRadius: 3, fontSize: 11, fontWeight: 700, marginLeft: 'auto' }}>{result.scoreLabel}</span>
        </div>
        <div style={{ fontSize: 14, color: C.text, fontWeight: 500, lineHeight: 1.55 }}>{result.oneLineSummary}</div>
      </div>

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

      <button onClick={() => setView('link-input')} style={{ width: '100%', padding: '12px 16px', background: C.bgSubtle, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 10 }}>
        <Link2 size={14} /> 다른 곳 분석
      </button>
      <button onClick={() => setView('saved')} style={{ width: '100%', padding: '12px 16px', background: C.bg, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <BarChart size={14} /> 담은 장소 비교
      </button>
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
    if (v === 'stop') return { c: C.red, bg: C.redBg, label: '예약 중단 권장' };
    if (v === 'caution') return { c: C.orange, bg: C.orangeBg, label: '신중히 결정' };
    return { c: C.green, bg: C.greenBg, label: '예약해도 무방' };
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
          <div style={{ padding: '11px 14px', borderRadius: 6, background: verdictStyle(scenario.verdict).bg, marginBottom: 10 }}>
            <div style={{ display: 'inline-block', padding: '2px 8px', color: '#fff', background: verdictStyle(scenario.verdict).c, borderRadius: 3, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>
              {verdictStyle(scenario.verdict).label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: verdictStyle(scenario.verdict).c, marginBottom: 4 }}>{scenario.verdictMessage}</div>
            {scenario.alternativeHint && <div style={{ fontSize: 11.5, color: C.textMid, lineHeight: 1.5 }}>💡 {scenario.alternativeHint}</div>}
          </div>
          <button onClick={() => { setScenario(null); setSituation(''); }} style={{ padding: '6px 11px', background: 'transparent', color: C.textMid, border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 11, fontWeight: 500 }}>다른 상황</button>
        </div>
      )}
    </div>
  );
}

function SavedView({ places, setView, setResult, getScoreStyle, setSavedPlaces, saveSavedList }) {
  const removePlace = (idx) => {
    if (!confirm(`"${places[idx].name}" 삭제?`)) return;
    const newList = places.filter((_, i) => i !== idx);
    setSavedPlaces(newList);
    saveSavedList(newList);
  };
  return (
    <div style={{ padding: '20px 0 0' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: '0 0 6px', letterSpacing: '-0.02em' }}>담은 장소</h1>
      <p style={{ fontSize: 13, color: C.textMid, margin: '0 0 20px', lineHeight: 1.6 }}>
        {places.length === 0 ? '아직 담은 곳이 없어요' : `${places.length}개`}
      </p>
      {places.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, marginBottom: 20 }}>
            분석 후 "안전빵에 담아 비교하기"로<br />여러 곳을 모아 비교할 수 있어요.
          </p>
          <button onClick={() => setView('link-input')} style={{ padding: '10px 16px', background: C.text, color: C.bg, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
            지금 분석하기
          </button>
        </div>
      )}
      {places.length >= 2 && (
        <button onClick={() => setView('compare')} style={{ width: '100%', padding: '14px', marginBottom: 16, background: C.text, color: C.bg, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <BarChart size={15} /> AI로 {places.length}곳 비교 분석
        </button>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {places.map((p, i) => {
          const sc = getScoreStyle(p.safetyScore);
          return (
            <div key={i} style={{ padding: 14, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{p.emoji || '📍'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: C.textLight }}>{p.location}</div>
                </div>
                <div style={{ padding: '3px 9px', background: sc.bg, color: sc.color, borderRadius: 4, fontSize: 13, fontWeight: 700 }}>{p.safetyScore}</div>
              </div>
              <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.5, marginBottom: 10 }}>{p.oneLineSummary}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { setResult(p); setView('result'); }} style={{ flex: 1, padding: '7px 10px', background: C.bgSubtle, color: C.text, border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 12, fontWeight: 500 }}>자세히</button>
                <button onClick={() => removePlace(i)} style={{ padding: '7px 10px', background: C.bg, color: C.red, border: `1px solid ${C.redBg}`, borderRadius: 5, fontSize: 12, fontWeight: 500 }}>삭제</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CompareView({ places, setView, getScoreStyle }) {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { runCompare(); }, []);

  const runCompare = async () => {
    setLoading(true);
    try {
      const data = await callAPI('compare', { places });
      setComparison(data);
    } catch (e) { alert('실패: ' + e.message); }
    finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <Spinner size={28} />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '14px 0 6px' }}>AI 비교 분석 중</h3>
        <p style={{ fontSize: 13, color: C.textMid }}>{places.length}곳 종합 분석</p>
      </div>
    );
  }
  if (!comparison) return null;
  const winner = places[comparison.winner];

  return (
    <div style={{ padding: '20px 0 0' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: '0 0 6px', letterSpacing: '-0.02em' }}>AI 비교 분석</h1>
      <p style={{ fontSize: 13, color: C.textMid, margin: '0 0 20px', lineHeight: 1.6 }}>담은 {places.length}곳 중 가장 안전한 선택</p>
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
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{places[parseInt(idx)]?.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 10px' }}>장소별 분석</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {places.map((p, i) => {
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
