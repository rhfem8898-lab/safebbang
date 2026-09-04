const $ = (s) => document.querySelector(s);
const app = document.querySelector('#app');
const defaults = {
  screen: 'welcome', idealGender: '', selfGender: '', idealStyle: '다정한 인상',
  selfStyle: '편안한 인상', quiz: [], personality: '다정한 자유주의자',
  signal: '', unlocked: [], round: 0, answers: [], tickets: 4
};
let state = load();

function load(){ try { return {...defaults, ...JSON.parse(localStorage.getItem('idealRadarMvp') || '{}')}; } catch { return {...defaults}; } }
function save(){ localStorage.setItem('idealRadarMvp', JSON.stringify(state)); }
function go(screen, patch={}){ state={...state,...patch,screen}; save(); render(); window.scrollTo({top:0,behavior:'smooth'}); }
function genderAvatar(gender, kind='self'){ if(gender==='male') return kind==='ideal'?'🧑🏻':'👨🏻'; if(gender==='female') return kind==='ideal'?'👩🏻':'👩🏽'; return '🙂'; }
function shell(content, step=''){ app.innerHTML=`<section class="phone"><header class="top"><div class="brand">이상형 <i>레이더</i></div><div class="step">${step}</div></header><div class="main">${content}</div></section>`; bind(); }
function btn(label, action, cls='primary', disabled=false){ return `<button class="${cls}" data-action="${action}" ${disabled?'disabled':''}>${label}</button>`; }

const questions=[
  {q:'호감이 생기면 나는?',a:['먼저 표현하는 편','천천히 확신을 기다리는 편']},
  {q:'가장 편안한 데이트는?',a:['계획 없이 발견하는 하루','정성껏 계획한 하루']},
  {q:'연인과 연락은?',a:['틈날 때마다 자주','서로의 리듬을 존중']}
];
const rounds=[
  {label:'취향',q:'주말 데이트라면?',a:['🏠 집에서 영화','🌇 새로운 곳 가보기'],other:1},
  {label:'관계',q:'연락이 뜸해진 연인에게 나는?',a:['💬 직접 물어본다','🌿 조금 기다린다'],other:0},
  {label:'가치관',q:'연애에서 더 중요한 것은?',a:['✨ 설렘','🫶 안정감'],other:1}
];

function render(){
  const s=state.screen;
  if(s==='welcome') return shell(`<div class="eyebrow">No swipe. Just signal.</div><h1>찾지 않아도,<br>마주치면 알게 돼요.</h1><p>내 이상형을 만들어두면 현실에서 가까이 스쳤을 때 레이더가 조용히 알려드려요.</p><div class="hero-orbit"><div class="orbit"></div><div class="sweep"></div><span class="blip b1"></span><span class="blip b2"></span><div class="heart">💗</div></div><div class="spacer"></div>${btn('내 레이더 만들기','ideal-gender')}<div class="footer-note">MVP 체험 · 입력 내용은 이 기기에만 저장돼요</div>`);
  if(s==='ideal-gender') return genderScreen('ideal');
  if(s==='ideal-style') return styleScreen('ideal');
  if(s==='quiz') return quizScreen();
  if(s==='self-gender') return genderScreen('self');
  if(s==='self-style') return styleScreen('self');
  if(s==='ready') return readyScreen();
  if(s==='radar') return radarScreen();
  if(s==='signal') return signalScreen();
  if(s==='insights') return insightsScreen();
  if(s==='mutual') return mutualScreen();
  if(s==='reveal') return revealScreen();
  if(s==='round') return roundScreen();
  if(s==='decision') return decisionScreen();
  if(s==='connected') return connectedScreen();
}

function genderScreen(kind){
  const ideal=kind==='ideal', value=ideal?state.idealGender:state.selfGender;
  return shell(`<div class="eyebrow">Make · ${ideal?'Ideal':'Me'}</div><h1>${ideal?'어떤 사람에게<br>마음이 가나요?':'실제 나를<br>만들어볼게요.'}</h1><p>아바타의 성별을 먼저 선택해주세요. 나중에 언제든 바꿀 수 있어요.</p><div class="options"><button class="option ${value==='female'?'selected':''}" data-set-gender="female"><span class="icon">👩</span><span>여성 아바타</span></button><button class="option ${value==='male'?'selected':''}" data-set-gender="male"><span class="icon">🧑</span><span>남성 아바타</span></button></div><div class="spacer"></div>${btn('다음','gender-next','primary',!value)}${btn('이전','back','ghost')}`,ideal?'1 / 3':'3 / 3');
}
function styleScreen(kind){
  const ideal=kind==='ideal', value=ideal?state.idealStyle:state.selfStyle, gender=ideal?state.idealGender:state.selfGender;
  const styles=ideal?['다정한 인상','도회적인 분위기','웃는 모습','차분한 분위기']:['편안한 인상','밝은 분위기','차분한 분위기','개성 있는 스타일'];
  return shell(`<div class="eyebrow">Avatar</div><h2>${ideal?'내가 찾는 사람':'상대에게 보일 나'}</h2><p>지금은 대표 분위기만 골라요. 정식 버전에서는 얼굴형·헤어·패션을 더 세밀하게 만들 수 있어요.</p><div class="avatar-wrap"><div class="avatar">${genderAvatar(gender,ideal?'ideal':'self')}<small>${value}</small></div></div><div class="chips">${styles.map(x=>`<button class="chip ${x===value?'selected':''}" data-style="${x}">${x}</button>`).join('')}</div><div class="spacer"></div>${btn(ideal?'성격 테스트로':'완성하기','style-next')}${btn('이전','back','ghost')}`,ideal?'1 / 3':'3 / 3');
}
function quizScreen(){
  const i=state.quiz.length, done=i>=questions.length;
  if(done) return shell(`<div class="eyebrow">Your type</div><h1>당신은<br>${state.personality}예요.</h1><div class="summary"><div style="font-size:46px">💙</div><h2 style="margin-top:8px">다정한 자유주의자</h2><p>마음은 섬세하지만 서로의 리듬도 존중해요. 설렘과 편안함 사이의 균형을 중요하게 생각해요.</p><span class="tag">#따뜻함 #자유로움 #솔직함</span></div><div class="spacer"></div>${btn('실제 나 만들기','self-gender')}${btn('답변 다시 하기','quiz-reset','ghost')}`,'2 / 3');
  const q=questions[i];
  return shell(`<div class="qnum">QUESTION ${i+1} / ${questions.length}</div><div class="progress"><span style="width:${(i/questions.length)*100}%"></span></div><h1>${q.q}</h1><p>더 나다운 쪽을 골라주세요. 정답은 없어요.</p><div class="options">${q.a.map((x,n)=>`<button class="option" data-quiz="${n}"><span class="icon">${n?'🌙':'☀️'}</span><span>${x}</span></button>`).join('')}</div><div class="spacer"></div>${btn('이전','back','ghost')}`,'2 / 3');
}
function readyScreen(){
  return shell(`<div class="eyebrow">Ready</div><h1>이제 준비됐어요.</h1><p>평소처럼 지내세요.<br>우리가 가까이 있는 신호를 찾아드릴게요.</p><div class="summary"><div class="duo"><div><div class="mini-avatar">${genderAvatar(state.idealGender,'ideal')}</div><b>내가 찾는 사람</b></div><em>♥</em><div><div class="mini-avatar">${genderAvatar(state.selfGender)}</div><b>실제 나</b></div></div><div style="text-align:center"><span class="tag">💙 ${state.personality}</span></div></div><div class="notice">레이더는 상대를 지도에 표시하지 않아요. 30m 안에 들어온 순간 조건만 비교하고, 같은 공간의 같은 사람에게는 한 번만 신호를 줍니다.</div><div class="spacer"></div>${btn('레이더 켜기','radar')}`);
}
function radarScreen(){
  return shell(`<div class="eyebrow">Radar on</div><h2>주변에서 신호를<br>찾고 있어요.</h2><div class="radar-card"><div class="radar-status">● LIVE · 30M</div><div class="radar-mini"><div class="orbit"></div><div class="sweep"></div><div class="heart">💗</div></div><p>정확한 위치나 사람 수는 표시하지 않아요.</p></div><div class="test-panel"><span>MVP 테스트 시그널</span><div class="test-grid"><button data-signal="FIND">💓 FIND</button><button data-signal="FOUND">✨ FOUND</button><button data-signal="MUTUAL">💞 MUTUAL</button></div></div><div class="spacer"></div>${btn('위치 권한 확인','location','secondary')}${btn('처음부터 다시','reset','ghost')}`);
}
function signalScreen(){
  const type=state.signal;
  const data={FIND:['💓','내가 찾던 사람이 있어요.','근처에 당신이 찾던 모습과 닮은 사람이 있어요.'],FOUND:['✨','누군가가 찾던 사람이 당신이에요.','근처 누군가의 이상형에 당신이 부합했어요.'],MUTUAL:['💞','서로가 서로를 찾고 있었어요.','근처에 서로가 서로의 이상형인 사람이 있어요.']}[type];
  const next=type==='FIND'?'insights':type==='MUTUAL'?'mutual':'radar';
  return shell(`<div class="signal"><div class="signal-icon">${data[0]}</div><div class="eyebrow">${type} SIGNAL</div><h1>${data[1]}</h1><p>${data[2]}</p>${type==='FIND'?'<div class="score">86<small>% MATCH</small></div>':''}${type==='FOUND'?'<div class="summary"><b>매우 높은 일치</b><p style="font-size:13px;margin-top:5px">상대의 정보나 점수는 공개하지 않아요.</p></div>':''}<div class="notice">이 신호만으로 주변 사람을 특정할 수 없도록 이름·사진·정확한 거리·인원은 숨겨져 있어요.</div></div><div class="spacer"></div>${btn(type==='MUTUAL'?'서로 알아보기':type==='FIND'?'어떤 사람인지 알아보기':'레이더로 돌아가기',next)}${btn('레이더로 돌아가기','radar','ghost')}`);
}
function insightsScreen(){
  const items=[['❤️','연애 스타일','마음을 표현하는 데 솔직해요'],['💬','연락 스타일','짧아도 자주 이어가는 편'],['🫶','관계 스타일','서로의 일상을 존중해요'],['🔥','갈등 방식','감정을 정리한 뒤 대화해요'],['🎡','데이트 취향','새로운 장소를 좋아해요'],['🌙','생활 패턴','늦은 저녁이 편안해요']];
  return shell(`<div class="eyebrow">Know</div><h1>무엇이 가장<br>궁금한가요?</h1><p>처음 두 가지는 무료예요. 직접 골라 상대의 내면을 조금씩 알아보세요.</p><div class="cards">${items.map((x,i)=>`<button class="insight ${state.unlocked.length>=2&&!state.unlocked.includes(i)?'locked':''}" data-insight="${i}"><span class="emoji">${x[0]}</span><b>${x[1]}</b><span>${state.unlocked.includes(i)?x[2]:'탭해서 열기'}</span></button>`).join('')}</div><div class="spacer"></div>${btn('MUTUAL 시그널 체험','force-mutual','secondary')}${btn('레이더로 돌아가기','radar','ghost')}`);
}
function mutualScreen(){
  return shell(`<div class="signal"><div class="signal-icon">💞</div><div class="eyebrow">Signal match</div><h1>서로의 신호가<br>맞닿았어요.</h1><p>둘 다 ‘알아보기’를 눌러야 다음 단계가 열려요. MVP에서는 상대의 동의가 완료된 상태를 재현합니다.</p><div class="summary"><b>상대도 당신을 궁금해해요</b><p style="font-size:13px;margin-top:6px">실제 사진과 이름은 아직 공개되지 않아요.</p></div></div><div class="spacer"></div>${btn('이 사람을 알아볼래요','reveal')}${btn('지금은 아니에요','radar','ghost')}`);
}
function revealScreen(){
  return shell(`<div class="eyebrow">First reveal</div><h1>이런 사람이에요.</h1><div class="reveal"><div class="avatar">${genderAvatar(state.idealGender==='male'?'male':'female','ideal')}</div><p><strong>20대 중반</strong><br>💙 다정한 자유주의자<br>${state.idealStyle}</p></div><p>사진이 아니라, 상대가 직접 만든 자기 아바타가 먼저 공개돼요. 세 번의 대화를 통해 생각을 알아가세요.</p><div class="spacer"></div>${btn('3 Questions 시작','start-round')}`);
}
function roundScreen(){
  const i=state.round, r=rounds[i], mine=state.answers[i];
  return shell(`<div class="round-label">ROUND ${i+1} · ${r.label}</div><div class="progress"><span style="width:${((i+1)/3)*100}%"></span></div><h1>${r.q}</h1><div class="round-card">${r.a.map((x,n)=>`<button class="choice ${mine===n?'selected':''}" data-answer="${n}">${x}</button>`).join('')}${mine!==undefined?`<div class="result-bar"><span>나 · ${mine+1}번</span><span class="${mine===r.other?'same':''}">상대 · ${r.other+1}번</span></div><p style="font-size:12px;margin-top:12px">${mine===r.other?'같은 답을 골랐어요.':'다른 답이라 더 궁금해졌어요.'} · 대화 OPEN</p>`:''}</div><div class="spacer"></div>${btn(i===2?'최종 선택으로':'다음 질문','round-next','primary',mine===undefined)}`);
}
function decisionScreen(){
  return shell(`<div class="eyebrow">Final signal</div><h1>이 인연,<br>여기서 끝낼까요?</h1><p>선택은 동시에 비공개로 진행돼요. 서로 같은 마음일 때만 실제 프로필과 자유 대화가 열립니다.</p><div class="summary"><div class="duo"><div><div class="mini-avatar">${genderAvatar(state.selfGender)}</div><b>나</b></div><em>?</em><div><div class="mini-avatar">${genderAvatar(state.idealGender,'ideal')}</div><b>그 사람</b></div></div></div><span class="ticket">🎟 보유 티켓 ${state.tickets}장</span><div class="decision"><button class="yes" data-action="connect">더 알아가고 싶어요 · 🎟 2</button><button class="no" data-action="end">여기까지 할게요</button></div><div class="notice">둘 다 YES면 각 2장 소모. 한 명만 YES면 선택자에게 1장을 돌려주는 정책을 가정한 MVP예요.</div>`);
}
function connectedScreen(){
  return shell(`<div class="signal"><div class="signal-icon">🎉</div><div class="eyebrow">Connected</div><h1>마음이 같았어요.</h1><p>이 순간 처음으로 실제 프로필과 자유 대화가 열립니다.</p><div class="reveal"><div style="font-size:72px">${genderAvatar(state.idealGender,'ideal')}</div><h2 style="margin:10px 0 4px">레이더 메이트</h2><p style="margin:0">26세 · 서울<br>“좋은 대화와 느긋한 산책을 좋아해요.”</p></div></div><div class="spacer"></div>${btn('대화 시작하기','chat-demo')}${btn('레이더로 돌아가기','radar','ghost')}`);
}

function bind(){
  document.querySelectorAll('[data-action]').forEach(el=>el.onclick=()=>action(el.dataset.action));
  document.querySelectorAll('[data-set-gender]').forEach(el=>el.onclick=()=>{ const key=state.screen.startsWith('ideal')?'idealGender':'selfGender'; state[key]=el.dataset.setGender; save(); render(); });
  document.querySelectorAll('[data-style]').forEach(el=>el.onclick=()=>{ const key=state.screen.startsWith('ideal')?'idealStyle':'selfStyle'; state[key]=el.dataset.style; save(); render(); });
  document.querySelectorAll('[data-quiz]').forEach(el=>el.onclick=()=>{state.quiz.push(+el.dataset.quiz);save();render();});
  document.querySelectorAll('[data-signal]').forEach(el=>el.onclick=()=>go('signal',{signal:el.dataset.signal}));
  document.querySelectorAll('[data-insight]').forEach(el=>el.onclick=()=>{const i=+el.dataset.insight;if(state.unlocked.includes(i))return;if(state.unlocked.length>=2){alert('무료 공개는 두 가지까지예요. 정식 버전에서는 광고 또는 코인으로 더 열 수 있어요.');return;}state.unlocked.push(i);save();render();});
  document.querySelectorAll('[data-answer]').forEach(el=>el.onclick=()=>{state.answers[state.round]=+el.dataset.answer;save();render();});
}
function action(a){
  if(a==='ideal-gender') return go('ideal-gender');
  if(a==='gender-next') return go(state.screen==='ideal-gender'?'ideal-style':'self-style');
  if(a==='style-next') return go(state.screen==='ideal-style'?'quiz':'ready');
  if(a==='self-gender') return go('self-gender');
  if(a==='quiz-reset') return go('quiz',{quiz:[]});
  if(a==='radar') return go('radar');
  if(a==='insights') return go('insights');
  if(a==='mutual'||a==='force-mutual') return go('mutual',{signal:'MUTUAL'});
  if(a==='reveal') return go('reveal');
  if(a==='start-round') return go('round',{round:0,answers:[]});
  if(a==='round-next'){ if(state.round<2)return go('round',{round:state.round+1}); return go('decision'); }
  if(a==='connect') return go('connected',{tickets:Math.max(0,state.tickets-2)});
  if(a==='end'){ alert('이번 신호는 여기까지예요. 좋은 인연은 다시 찾아올 거예요.'); return go('radar'); }
  if(a==='chat-demo') return alert('MVP에서는 연결 완료까지 체험할 수 있어요. 실제 채팅은 서버 연동 단계에서 열립니다.');
  if(a==='location'){
    if(!navigator.geolocation) return alert('이 브라우저에서는 위치 기능을 지원하지 않아요.');
    return navigator.geolocation.getCurrentPosition(()=>alert('위치 권한이 확인됐어요. 레이더가 30m 반경을 탐색합니다.'),()=>alert('위치 권한이 꺼져 있어요. MVP 테스트 버튼으로 흐름을 체험할 수 있어요.'),{timeout:5000});
  }
  if(a==='reset'){ if(confirm('저장된 MVP 진행 내용을 지우고 처음부터 시작할까요?')){localStorage.removeItem('idealRadarMvp');state={...defaults};render();}return; }
  if(a==='back'){ const map={'ideal-gender':'welcome','ideal-style':'ideal-gender','quiz':'ideal-style','self-gender':'quiz','self-style':'self-gender'}; return go(map[state.screen]||'welcome'); }
}
render();
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
