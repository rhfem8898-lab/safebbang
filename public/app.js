const { useEffect, useMemo, useState } = React;

const COLORS = {
  bg: '#F7F5F2',
  panel: '#FFFFFF',
  text: '#201F1D',
  sub: '#6F6B66',
  line: '#E8E3DD',
  soft: '#F1EEEA',
  accent: '#F36B7F',
  accentSoft: '#FFE9EE',
  warm: '#8E6652',
  success: '#3D7A5D'
};

const demoStories = [
  {
    id: 'demo-1',
    context: '단국대 축제 · 어제 저녁',
    story: '비가 많이 왔을 때 우산을 잠깐 같이 썼던 분을 찾고 있어요. 별 이야기는 못 했는데 계속 생각나요.',
    note: '데모 예시'
  },
  {
    id: 'demo-2',
    context: '카페 · 이번 주',
    story: '충전기를 빌려주셨던 분. 나가면서 인사만 하고 헤어졌는데 다시 만나고 싶어요.',
    note: '데모 예시'
  }
];

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

const Icon = ({ children, active }) => (
  <div style={{ width: 24, height: 24, display: 'grid', placeItems: 'center', color: active ? COLORS.text : '#9B958F' }}>{children}</div>
);

const SearchIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>;
const HomeIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 10.5 12 4l8 6.5V20H4z"/></svg>;
const UserIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-4 3.4-6 7-6s6.2 2 7 6"/></svg>;
const HeartIcon = ({ filled = false }) => <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? COLORS.accent : 'none'} stroke={COLORS.accent} strokeWidth="1.8"><path d="M20.8 4.7c-2.1-2.1-5.5-2.1-7.6 0L12 5.9l-1.2-1.2a5.37 5.37 0 0 0-7.6 7.6L12 21l8.8-8.7c2.1-2.1 2.1-5.5 0-7.6Z"/></svg>;

function Button({ children, onClick, secondary = false, disabled = false }) {
  return <button onClick={onClick} disabled={disabled} style={{
    width: '100%', border: secondary ? `1px solid ${COLORS.line}` : 'none',
    background: disabled ? '#DDD8D2' : secondary ? COLORS.panel : COLORS.text,
    color: disabled ? '#96908A' : secondary ? COLORS.text : '#fff',
    borderRadius: 16, padding: '15px 18px', fontWeight: 700, fontSize: 15,
    boxShadow: 'none'
  }}>{children}</button>;
}

function Card({ children, onClick, style = {} }) {
  return <div onClick={onClick} style={{
    background: COLORS.panel, border: `1px solid ${COLORS.line}`, borderRadius: 22,
    padding: 20, ...style
  }}>{children}</div>;
}

function Tag({ children }) {
  return <span style={{ fontSize: 12, color: COLORS.sub, background: COLORS.soft, borderRadius: 999, padding: '6px 9px' }}>{children}</span>;
}

function Header({ title, back }) {
  return <div style={{ height: 58, display: 'flex', alignItems: 'center', gap: 10 }}>
    {back && <button onClick={back} style={{ border: 0, background: 'transparent', fontSize: 24, padding: 0 }}>‹</button>}
    <div style={{ fontSize: 19, fontWeight: 800 }}>{title}</div>
  </div>;
}

function Home({ state, setState, setTab }) {
  const status = state.status || 'empty';
  const hero = {
    empty: ['다시 마주하고 싶은 사람이 있나요?', '현실에서 스친 사람을 찾거나, 이미 마음에 있는 사람을 담아보세요.'],
    searching: ['그 사람을 찾고 있어요.', '아직 새로운 소식은 없어요.'],
    heart: ['마음에 담아두었어요.', '현실에서 다시 마주치는 순간만 두근이 알려줄 수 있어요.'],
    pulse: ['누군가의 마음이 가까워졌어요.', '누군지 보여주지 않아요. 지금의 순간만 느껴보세요.'],
    mutual: ['서로의 마음이 같아요.', '이제 앱보다 현실에서 이어가는 편이 더 중요해요.']
  }[status];

  return <div style={{ padding: '18px 18px 110px' }}>
    <div style={{ fontSize: 14, color: COLORS.sub, marginBottom: 42 }}>두근</div>
    <div style={{ minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center', animation: 'fadeup .35s ease' }}>
      {(status === 'pulse' || status === 'mutual') && <div style={{ marginBottom: 18, animation: 'heartbeat 1.2s ease 1' }}><HeartIcon filled={status === 'mutual'} /></div>}
      <h1 style={{ fontSize: 30, lineHeight: 1.22, letterSpacing: '-0.04em', marginBottom: 14 }}>{hero[0]}</h1>
      <p style={{ color: COLORS.sub, fontSize: 16, lineHeight: 1.6 }}>{hero[1]}</p>
    </div>

    {status === 'empty' && <div style={{ display: 'grid', gap: 10 }}>
      <Button onClick={() => setTab('find')}>사람 찾기</Button>
      <Button secondary onClick={() => setState({ ...state, status: 'heart' })}>이미 마음에 있는 사람이 있어요</Button>
    </div>}

    {status === 'searching' && <Card style={{ marginTop: 22 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>찾는 마음</div>
      <div style={{ fontSize: 14, color: COLORS.sub }}>공개 피드가 아니라 관련될 가능성이 있는 사람에게 먼저 닿도록 설계하는 단계예요.</div>
    </Card>}

    {status === 'heart' && <Card style={{ marginTop: 22, background: '#FFFDFC' }}>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>두근 켜기</div>
      <div style={{ fontSize: 14, color: COLORS.sub, marginBottom: 16 }}>서로 가까워진 순간만 확인하기 위해 위치 권한이 필요해요. 현재 위치나 이동경로를 상대에게 보여주지 않아요.</div>
      <Button onClick={() => setState({ ...state, status: 'pulse' })}>데모로 두근 보기</Button>
    </Card>}

    {status === 'pulse' && <Card style={{ marginTop: 22, background: COLORS.accentSoft, borderColor: '#FFD2DB' }}>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>두근</div>
      <div style={{ fontSize: 14, color: '#85515C', marginBottom: 16 }}>거리, 방향, 현재 근처 여부는 보여주지 않아요.</div>
      <Button onClick={() => setState({ ...state, status: 'mutual' })}>데모로 서로 확인하기</Button>
    </Card>}

    {status === 'mutual' && <Card style={{ marginTop: 22 }}>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>이제 현실에서 이어가도 좋을 것 같아요.</div>
      <div style={{ fontSize: 14, color: COLORS.sub }}>정체가 아직 확실하지 않다면 양쪽 모두 원할 때만 확인하도록 이어집니다.</div>
    </Card>}

    <section style={{ marginTop: 34 }}>
      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>내 이야기일지도</div>
      <div style={{ display: 'grid', gap: 10 }}>
        {demoStories.slice(0,1).map(story => <Card key={story.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><Tag>{story.context}</Tag><span style={{ fontSize: 11, color: '#A29C96' }}>{story.note}</span></div>
          <div style={{ fontSize: 15, lineHeight: 1.65, marginBottom: 16 }}>{story.story}</div>
          <Button secondary onClick={() => setTab('find')}>혹시 나인 것 같아요</Button>
        </Card>)}
      </div>
    </section>
  </div>;
}

function Find({ state, setState }) {
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name:'', context:'', when:'', memory:'', event:'' });
  const [submitted, setSubmitted] = useState(false);

  const reset = () => { setMode(null); setStep(0); setSubmitted(false); setForm({ name:'', context:'', when:'', memory:'', event:'' }); };

  if (submitted) {
    return <div style={{ padding: '0 18px 110px' }}>
      <Header title="찾기" back={reset}/>
      <div style={{ paddingTop: 30 }}>
        <Tag>{mode === 'known' ? '이름을 알아요' : '이름을 몰라요'}</Tag>
        <h2 style={{ fontSize: 28, margin: '18px 0 12px' }}>{mode === 'known' ? '이 사람을 마음에 담을까요?' : '찾는 마음을 남겼어요.'}</h2>
        <p style={{ color: COLORS.sub, lineHeight: 1.65, marginBottom: 28 }}>{mode === 'known' ? '상대에게 바로 알림이 가지 않아요. 두근은 관계의 가능성이 생겼을 때만 작동합니다.' : '정확한 장소와 세부 기억은 찾는 데만 쓰고, 공개 카드에는 더 거친 정보만 보여줍니다.'}</p>
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: COLORS.sub, marginBottom: 8 }}>미리보기 · 데모 상태</div>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>{mode === 'known' ? (form.name || '이름 입력') : `${form.context || '장소'} · ${form.when || '시간'}`}</div>
          <div style={{ fontSize: 15, lineHeight: 1.65 }}>{mode === 'known' ? '실제 후보 검색은 백엔드 연결 후 활성화됩니다.' : (form.event || form.memory || '기억을 입력해 주세요.')}</div>
        </Card>
        <Button onClick={() => { setState({ ...state, status: mode === 'known' ? 'heart' : 'searching' }); reset(); }}>{mode === 'known' ? '마음에 담기' : '찾기 시작하기'}</Button>
      </div>
    </div>;
  }

  if (!mode) {
    return <div style={{ padding: '0 18px 110px' }}>
      <Header title="찾기"/>
      <div style={{ paddingTop: 24 }}>
        <h2 style={{ fontSize: 28, marginBottom: 10 }}>어떤 사람을 찾고 있나요?</h2>
        <p style={{ color: COLORS.sub, marginBottom: 28 }}>이름을 알아도, 몰라도 시작할 수 있어요.</p>
        <div style={{ display: 'grid', gap: 12 }}>
          <Card onClick={() => setMode('known')} style={{ cursor: 'pointer' }}><div style={{ fontSize: 18, fontWeight: 800, marginBottom: 7 }}>이름을 알아요</div><div style={{ color: COLORS.sub, fontSize: 14 }}>이름과 공개된 소속 정보로 찾기</div></Card>
          <Card onClick={() => setMode('unknown')} style={{ cursor: 'pointer' }}><div style={{ fontSize: 18, fontWeight: 800, marginBottom: 7 }}>이름을 몰라요</div><div style={{ color: COLORS.sub, fontSize: 14 }}>어디서, 언제, 어떤 순간이었는지로 찾기</div></Card>
        </div>

        <section style={{ marginTop: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 12 }}><div style={{ fontWeight: 800 }}>숲</div><span style={{ fontSize: 12, color: COLORS.sub }}>찾기 인프라 · 데모 예시</span></div>
          <div style={{ display: 'grid', gap: 10 }}>
            {demoStories.map(story => <Card key={story.id}><Tag>{story.context}</Tag><div style={{ marginTop: 12, lineHeight: 1.65, fontSize: 14 }}>{story.story}</div><div style={{ marginTop: 14, fontWeight: 700, fontSize: 14 }}>혹시 내 이야기일지도</div></Card>)}
          </div>
        </section>
      </div>
    </div>;
  }

  if (mode === 'known') {
    return <div style={{ padding: '0 18px 110px' }}>
      <Header title="이름으로 찾기" back={reset}/>
      <div style={{ paddingTop: 24 }}>
        <label style={{ fontSize: 13, color: COLORS.sub }}>이름</label>
        <input value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="이름을 입력해 주세요" style={inputStyle}/>
        <label style={{ fontSize: 13, color: COLORS.sub }}>소속이나 기억나는 정보</label>
        <input value={form.context} onChange={e => setForm({...form, context:e.target.value})} placeholder="예: 단국대, 2학년" style={inputStyle}/>
        <p style={helpStyle}>현재 위치, 최근 동선, 몇 번 마주쳤는지 같은 정보는 검색 조건으로 쓰지 않습니다.</p>
        <Button disabled={!form.name.trim()} onClick={() => setSubmitted(true)}>안전한 후보 찾기</Button>
      </div>
    </div>;
  }

  const steps = [
    ['어디에서 만났나요?', '장소나 행사 정도만 적어주세요.', 'context', '예: 단국대 축제, 강남역 근처 카페'],
    ['언제였나요?', '정확한 시각은 내부 매칭에만 쓸 수 있어요.', 'when', '예: 어제 저녁 7시쯤'],
    ['무엇이 기억나나요?', '옷, 물건, 대화처럼 그 순간을 떠올릴 단서를 적어주세요.', 'memory', '예: 검은 모자, 노란 우산'],
    ['어떤 일이 있었나요?', '공개 카드에는 이 이야기가 중심이 됩니다.', 'event', '예: 비가 와서 우산을 잠깐 같이 썼어요']
  ];
  const current = steps[step];
  const key = current[2];
  return <div style={{ padding: '0 18px 110px' }}>
    <Header title="기억으로 찾기" back={() => step === 0 ? reset() : setStep(step-1)}/>
    <div style={{ paddingTop: 22 }}>
      <div style={{ fontSize: 12, color: COLORS.sub, marginBottom: 14 }}>{step+1} / {steps.length}</div>
      <h2 style={{ fontSize: 28, marginBottom: 10 }}>{current[0]}</h2>
      <p style={{ color: COLORS.sub, marginBottom: 24 }}>{current[1]}</p>
      {key === 'event' ? <textarea value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} placeholder={current[3]} style={{...inputStyle, minHeight: 150, resize: 'none'}}/> : <input value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} placeholder={current[3]} style={inputStyle}/>} 
      {(key === 'when' || key === 'memory') && <p style={helpStyle}>이 내용은 공개 글에는 보이지 않고, 찾는 데만 사용되도록 설계합니다.</p>}
      <Button disabled={!form[key].trim()} onClick={() => step === steps.length-1 ? setSubmitted(true) : setStep(step+1)}>{step === steps.length-1 ? '기억 카드 미리보기' : '다음'}</Button>
    </div>
  </div>;
}

const inputStyle = {
  width: '100%', border: `1px solid ${COLORS.line}`, background: '#fff', borderRadius: 16,
  padding: '15px 16px', fontSize: 15, outline: 'none', margin: '8px 0 18px', color: COLORS.text
};
const helpStyle = { fontSize: 13, lineHeight: 1.55, color: COLORS.sub, margin: '-4px 0 22px' };

function Profile({ state, setState }) {
  return <div style={{ padding: '0 18px 110px' }}>
    <Header title="나"/>
    <div style={{ paddingTop: 24 }}>
      <Card>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>두근 데모</div>
        <div style={{ color: COLORS.sub, fontSize: 14, lineHeight: 1.6 }}>현재는 로컬 데모 상태입니다. 실제 사용자, 실제 호감, 실제 활동 데이터를 만들지 않습니다.</div>
      </Card>
      <div style={{ marginTop: 28, display: 'grid', gap: 12 }}>
        <Card><div style={{ fontWeight: 700, marginBottom: 6 }}>개인정보 원칙</div><div style={{ fontSize: 14, color: COLORS.sub }}>사람을 찾는 것은 허용하지만, 위치 상태를 추적하는 기능은 만들지 않습니다.</div></Card>
        <Card><div style={{ fontWeight: 700, marginBottom: 6 }}>권한</div><div style={{ fontSize: 14, color: COLORS.sub }}>위치와 알림 권한은 첫 실행이 아니라 필요한 순간에 이유를 설명한 뒤 요청합니다.</div></Card>
      </div>
      <div style={{ marginTop: 30 }}><Button secondary onClick={() => setState({ status:'empty' })}>데모 상태 초기화</Button></div>
    </div>
  </div>;
}

function BottomNav({ tab, setTab }) {
  const items = [
    ['home','홈',<HomeIcon/>], ['find','찾기',<SearchIcon/>], ['me','나',<UserIcon/>]
  ];
  return <div style={{
    position:'fixed', left:0, right:0, bottom:0, background:'rgba(247,245,242,.94)', backdropFilter:'blur(18px)',
    borderTop:`1px solid ${COLORS.line}`, padding:'9px max(18px, env(safe-area-inset-right)) calc(9px + env(safe-area-inset-bottom)) max(18px, env(safe-area-inset-left))', zIndex:20
  }}><div style={{ maxWidth:560, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3,1fr)' }}>
    {items.map(([id,label,icon]) => <button key={id} onClick={() => setTab(id)} style={{ border:0, background:'transparent', padding:'6px 0', display:'grid', justifyItems:'center', gap:3, color:tab===id?COLORS.text:'#9B958F' }}>
      <Icon active={tab===id}>{icon}</Icon><span style={{fontSize:11,fontWeight:tab===id?800:600}}>{label}</span>
    </button>)}
  </div></div>;
}

function App() {
  const [tab, setTab] = useState('home');
  const [state, setState] = usePersistentState('dugeun-v2-demo', { status:'empty' });
  const screen = useMemo(() => {
    if (tab === 'find') return <Find state={state} setState={setState}/>;
    if (tab === 'me') return <Profile state={state} setState={setState}/>;
    return <Home state={state} setState={setState} setTab={setTab}/>;
  }, [tab, state]);

  return <div style={{ minHeight:'100vh', background:COLORS.bg }}>
    <main style={{ maxWidth:560, minHeight:'100vh', margin:'0 auto', background:COLORS.bg }}>{screen}</main>
    <BottomNav tab={tab} setTab={setTab}/>
  </div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
