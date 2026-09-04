const app=document.querySelector('#app');

const RADAR_CONFIG={radiusMeters:30,newSpaceMeters:120,signalCooldownKey:'idealRadarSeenSignals'};
const AXES=['애정표현','연락','관계 거리감','갈등 해결','데이트 스타일','계획 성향'];
const QUESTIONS=[
 ['애정표현','호감이 생기면 나는?',['먼저 표현한다','천천히 확신을 기다린다']],
 ['애정표현','기념일에는?',['작게라도 꼭 챙긴다','평소가 더 중요하다']],
 ['애정표현','좋아한다는 말은?',['자주 하는 편','행동으로 보여주는 편']],
 ['연락','연인과 연락은?',['틈날 때마다 자주','각자 리듬을 존중']],
 ['연락','답장이 늦으면?',['조금 신경 쓰인다','바쁘겠거니 한다']],
 ['연락','하루를 마치며?',['짧게라도 통화하고 싶다','메시지만으로도 충분하다']],
 ['관계 거리감','주말 일정은?',['함께 보내고 싶다','각자 시간도 중요하다']],
 ['관계 거리감','친구 모임에 연인을?',['자연스럽게 함께','각자 인간관계 유지']],
 ['관계 거리감','취미가 다르면?',['함께 해보려 한다','각자 즐겨도 좋다']],
 ['갈등 해결','서운한 일이 생기면?',['바로 이야기한다','정리할 시간이 필요하다']],
 ['갈등 해결','다툰 뒤 먼저 연락은?',['먼저 풀려고 한다','감정이 가라앉길 기다린다']],
 ['갈등 해결','의견이 다를 때?',['끝까지 대화한다','일단 서로 인정한다']],
 ['데이트 스타일','쉬는 날 데이트는?',['새로운 곳을 찾아간다','익숙한 곳이 편하다']],
 ['데이트 스타일','여행은?',['여기저기 많이 본다','한곳에서 여유롭게']],
 ['데이트 스타일','데이트 비용은?',['경험에 아끼지 않는다','합리적으로 쓰는 편']],
 ['계획 성향','데이트 계획은?',['미리 정한다','그날 느낌대로']],
 ['계획 성향','약속 시간은?',['여유 있게 도착','딱 맞춰 도착']],
 ['계획 성향','갑작스러운 제안은?',['재미있으면 바로 간다','일정부터 확인한다']]
];
const ROUNDS=[
 {label:'취향',q:'주말 데이트라면?',a:['🏠 집에서 영화','🌇 새로운 곳 가보기'],other:1},
 {label:'연애 스타일',q:'연락이 뜸해진 연인에게 나는?',a:['💬 직접 물어본다','🌿 조금 기다린다'],other:0},
 {label:'가치관',q:'연애에서 더 중요한 것은?',a:['✨ 설렘','🫶 안정감'],other:1}
];
const IDEAL_FIELDS={
 height:['상관없음','아담한 편','평균','큰 편'],body:['슬림','보통','탄탄','볼륨감'],face:['다정한 인상','도회적인 인상','웃는 인상','차분한 인상'],hair:['짧은 머리','중간 길이','긴 머리','웨이브'],fashion:['캐주얼','미니멀','스트릿','포멀'],mood:['편안함','밝음','차분함','개성 있음']
};

const defaults={
 screen:'welcome',ideal:{gender:'여성',height:'평균',body:'보통',face:'다정한 인상',hair:'중간 길이',fashion:'캐주얼',mood:'편안함',priority:['face','mood']},
 self:{gender:'여성',height:'평균',body:'보통',face:'다정한 인상',hair:'중간 길이',fashion:'캐주얼',mood:'편안함'},
 personality:{answers:[],scores:{'애정표현':50,'연락':50,'관계 거리감':50,'갈등 해결':50,'데이트 스타일':50,'계획 성향':50},archetype:'다정한 자유주의자'},
 signal:'',unlocked:[],round:0,roundAnswers:[],tickets:4,lastCoords:null
};
function deepMerge(base,saved){
 if(Array.isArray(base))return Array.isArray(saved)?saved:base.slice();
 if(base&&typeof base==='object'){const out={...base};if(saved&&typeof saved==='object')for(const k of Object.keys(saved))out[k]=k in base?deepMerge(base[k],saved[k]):saved[k];return out}
 return saved===undefined?base:saved;
}
function load(){try{return deepMerge(defaults,JSON.parse(localStorage.getItem('idealRadarMvp')||'{}'))}catch{return deepMerge(defaults,{})}}
function save(){localStorage.setItem('idealRadarMvp',JSON.stringify(state))}
let state=load();
function go(screen,patch={}){state=deepMerge(state,{...patch,screen});save();render();window.scrollTo({top:0,behavior:'smooth'})}
function btn(label,action,cls='primary',disabled=false){return `<button class="${cls}" data-action="${action}" ${disabled?'disabled':''}>${label}</button>`}
function shell(content,step=''){app.innerHTML=`<section class="phone"><header class="top"><div class="brand">이상형 <i>레이더</i></div><div class="step">${step}</div></header><div class="main">${content}</div></section>`;bind()}
function avatar(model){const female=model.gender==='여성';const hair=model.hair||'';const face=female?'👩':'🧑';const hairMark=hair.includes('웨이브')?'〰':hair.includes('긴')?'⌇':hair.includes('짧')?'˙':'•';return `<div class="avatar-art"><span class="hair-mark">${hairMark}</span><span>${face}</span><small>${model.fashion||''}</small></div>`}
function fieldLabel(k){return {height:'키',body:'체형',face:'얼굴/인상',hair:'헤어',fashion:'패션',mood:'분위기'}[k]}
function render(){
 const s=state.screen;
 if(s==='welcome')return welcome();
 if(s==='ideal')return avatarEditor('ideal');
 if(s==='personality')return personalityScreen();
 if(s==='personality-result')return personalityResult();
 if(s==='self')return avatarEditor('self');
 if(s==='ready')return ready();
 if(s==='radar')return radar();
 if(s==='signal')return signal();
 if(s==='know')return know();
 if(s==='mutual')return mutual();
 if(s==='round')return round();
 if(s==='decision')return decision();
 if(s==='connected')return connected();
}
function welcome(){return shell(`<div class="eyebrow">MAKE → RADAR → SIGNAL → KNOW → CONNECT</div><h1>외모는 우리가 찾아드릴게요.<br>마음은 직접 알아보세요.</h1><p>사람 목록을 넘기지 않아도 돼요. 이상형을 만들어두고 평소처럼 생활하면, 가까운 곳에 조건이 맞는 사람이 나타났을 때 레이더가 먼저 알려드려요.</p><div class="hero-orbit"><div class="orbit"></div><div class="sweep"></div><span class="blip b1"></span><span class="blip b2"></span><div class="heart">💗</div></div><div class="spacer"></div>${btn('내 이상형 만들기','start')}<div class="footer-note">검색 · 사람 목록 · swipe · 임의 DM 없음</div>`) }
function avatarEditor(kind){
 const ideal=kind==='ideal',model=ideal?state.ideal:state.self;
 const rows=Object.keys(IDEAL_FIELDS).map(k=>`<div class="builder-row"><div class="builder-title"><b>${fieldLabel(k)}</b>${ideal&&state.ideal.priority.includes(k)?'<span>중요</span>':''}</div><div class="chips">${IDEAL_FIELDS[k].map(v=>`<button class="chip ${model[k]===v?'selected':''}" data-model="${kind}" data-field="${k}" data-value="${v}">${v}</button>`).join('')}</div>${ideal?`<button class="weight ${state.ideal.priority.includes(k)?'on':''}" data-priority="${k}">★ 중요하게 보기</button>`:''}</div>`).join('');
 return shell(`<div class="eyebrow">MAKE · ${ideal?'IDEAL':'SELF'}</div><h1>${ideal?'내 이상형을 만드세요':'내가 어떻게 생겼는지 만드세요'}</h1><p>${ideal?'설문지가 아니라 캐릭터를 만드는 것처럼 골라보세요. 중요하게 보는 외모 특성은 최대 2개까지 가중치를 높일 수 있어요.':'이상형과 같은 방식으로 나를 만들어요. MVP에서는 자기보고 방식이며 사진 AI 검증은 사용하지 않습니다.'}</p><div class="avatar-stage">${avatar(model)}<div><b>${model.gender}</b><span>${model.face} · ${model.mood}</span></div></div><div class="builder-row"><div class="builder-title"><b>성별</b></div><div class="chips"><button class="chip ${model.gender==='여성'?'selected':''}" data-model="${kind}" data-field="gender" data-value="여성">여성</button><button class="chip ${model.gender==='남성'?'selected':''}" data-model="${kind}" data-field="gender" data-value="남성">남성</button></div></div>${rows}<div class="spacer"></div>${btn(ideal?'성격 진단하기':'준비 완료','avatar-next')}${btn('이전','back','ghost')}`,ideal?'1 / 3':'3 / 3')
}
function personalityScreen(){
 const i=state.personality.answers.length;
 if(i>=QUESTIONS.length)return go('personality-result');
 const [axis,q,a]=QUESTIONS[i];
 return shell(`<div class="eyebrow">MAKE · PERSONALITY</div><div class="qnum">${i+1} / ${QUESTIONS.length} · ${axis}</div><div class="progress"><span style="width:${(i/QUESTIONS.length)*100}%"></span></div><h1>${q}</h1><p>더 나다운 쪽을 골라주세요. 원하는 상대의 성격을 고르는 테스트가 아니라, 나를 이해하기 위한 진단이에요.</p><div class="options"><button class="option" data-quiz="0"><span class="icon">A</span><span>${a[0]}</span></button><button class="option" data-quiz="1"><span class="icon">B</span><span>${a[1]}</span></button></div><div class="spacer"></div>${btn('이전','quiz-back','ghost')}`,'2 / 3')
}
function calculatePersonality(){
 const scores={};AXES.forEach(x=>scores[x]=0);const counts={};AXES.forEach(x=>counts[x]=0);
 state.personality.answers.forEach((ans,i)=>{const axis=QUESTIONS[i][0];scores[axis]+=ans===0?75:25;counts[axis]++});AXES.forEach(x=>scores[x]=Math.round(scores[x]/Math.max(1,counts[x])));
 const avg=Object.values(scores).reduce((a,b)=>a+b,0)/AXES.length;
 let archetype='다정한 자유주의자';if(scores['계획 성향']>60&&scores['애정표현']>60)archetype='섬세한 로맨티스트';else if(scores['데이트 스타일']>60&&scores['관계 거리감']<50)archetype='호기심 많은 탐험가';else if(avg<45)archetype='차분한 현실주의자';
 state.personality.scores=scores;state.personality.archetype=archetype;save();
}
function personalityResult(){calculatePersonality();return shell(`<div class="eyebrow">YOUR CHARACTER</div><h1>${state.personality.archetype}</h1><p>성격은 매칭의 외모 필터에 넣지 않아요. 나중에 상대가 당신의 내면을 알아갈 때 쓰입니다.</p><div class="summary"><div class="personality-avatar">💙</div>${AXES.map(x=>`<div class="axis"><span>${x}</span><div><i style="width:${state.personality.scores[x]}%"></i></div><b>${state.personality.scores[x]}</b></div>`).join('')}</div><div class="spacer"></div>${btn('내 아바타 만들기','to-self')}${btn('다시 진단하기','quiz-reset','ghost')}`,'2 / 3')}
function ready(){return shell(`<div class="eyebrow">READY</div><h1>준비가 끝났어요.<br>이제 평소처럼 지내세요.</h1><div class="summary"><div class="duo"><div>${avatar(state.ideal)}<b>IDEAL</b></div><em>↔</em><div>${avatar(state.self)}<b>SELF</b></div></div></div><div class="notice">매칭은 A.IDEAL ↔ B.SELF, B.IDEAL ↔ A.SELF를 따로 비교합니다. 외모 조건은 시스템이 발견하고, 내면 궁합은 사용자가 직접 알아가며 판단해요.</div><div class="spacer"></div>${btn('RADAR 켜기','radar')}`)}
function radar(){return shell(`<div class="eyebrow">RADAR</div><h2>평소처럼 지내세요.<br>레이더가 보고 있어요.</h2><div class="radar-card"><div class="radar-status">● LIVE · ${RADAR_CONFIG.radiusMeters}M</div><div class="radar-mini"><div class="orbit"></div><div class="sweep"></div><div class="heart">💗</div></div><p>정확한 위치, 거리, 주변 인원, 사용자 목록은 표시하지 않아요.</p></div><div class="test-panel"><span>MVP SIGNAL DEMO</span><div class="test-grid"><button data-signal="FIND">💓 FIND</button><button data-signal="FOUND">✨ FOUND</button><button data-signal="MUTUAL">💞 MUTUAL</button></div></div><div class="notice"><b>30m 감지 · 같은 공간 1회</b><br>동일 상대의 반복 신호를 막고, 두 사람이 약 ${RADAR_CONFIG.newSpaceMeters}m 이상 이동해 새로운 공간에서 다시 만나면 다시 신호가 가능하도록 정책값을 상수로 분리해뒀어요.</div><div class="spacer"></div>${btn('위치 권한 확인','location','secondary')}${btn('처음부터 다시','reset','ghost')}`)}
function signal(){
 const type=state.signal;const data={FIND:['💓','내 이상형이 주변에 있어요','내 IDEAL에 가까운 SELF를 가진 사람이 30m 안에 감지됐어요.'],FOUND:['✨','누군가가 찾던 모습이 당신이에요','내 SELF가 누군가의 IDEAL 조건에 들어왔어요. 좋아요를 받았다는 뜻은 아니에요.'],MUTUAL:['💞','서로가 서로의 이상형이에요','A.IDEAL ↔ B.SELF와 B.IDEAL ↔ A.SELF가 모두 맞았어요.']}[type];
 return shell(`<div class="signal"><div class="signal-icon">${data[0]}</div><div class="eyebrow">${type}</div><h1>${data[1]}</h1><p>${data[2]}</p><div class="notice">이 단계에서는 실제 사진 · 실명 · 정확한 거리 · 지도 위치 · 주변 인원 · 검색 가능한 프로필을 공개하지 않습니다.</div></div><div class="spacer"></div>${type==='FIND'?btn('내면 조금 알아보기','know'):''}${type==='MUTUAL'?btn('서로 알아가기','mutual'):''}${btn('레이더로 돌아가기','radar','ghost')}`)
}
function know(){const items=[['❤️','연애 스타일','마음을 표현할 때 솔직한 편이에요'],['💬','연락 스타일','짧게라도 자주 이어가는 편이에요'],['🫶','관계 성향','함께와 각자의 시간을 균형 있게 봐요'],['🔥','갈등 해결','감정을 정리한 뒤 대화하려 해요'],['🎡','데이트 취향','새로운 장소를 발견하는 걸 좋아해요'],['🌙','생활 패턴','늦은 저녁에 여유를 느껴요']];return shell(`<div class="eyebrow">KNOW</div><h1>외모 다음은,<br>마음을 알아볼 차례예요.</h1><p>처음 2개 카테고리는 무료예요. 상대가 어떤 사람인지 조금씩 알아가세요.</p><div class="cards">${items.map((x,i)=>`<button class="insight ${state.unlocked.length>=2&&!state.unlocked.includes(i)?'locked':''}" data-insight="${i}"><span class="emoji">${x[0]}</span><b>${x[1]}</b><span>${state.unlocked.includes(i)?x[2]:'탭해서 열기'}</span></button>`).join('')}</div><div class="notice">추가 내면 정보는 추후 결제 · 광고 · coin 등 수익화 레이어가 될 수 있어요. 외모 발견은 trigger, 내면 탐색은 engagement입니다.</div><div class="spacer"></div>${btn('MUTUAL 상황 체험','force-mutual','secondary')}${btn('레이더로 돌아가기','radar','ghost')}`)}
function mutual(){return shell(`<div class="signal"><div class="signal-icon">💞</div><div class="eyebrow">MUTUAL</div><h1>서로가 서로의<br>이상형이에요.</h1><p>바로 사진이나 자유 채팅을 열지 않아요. 먼저 상대가 직접 만든 SELF 아바타와 최소 정보만 공개합니다.</p></div><div class="reveal mini-reveal">${avatar(state.ideal)}<p><strong>20대 중반</strong><br>💙 ${state.personality.archetype}</p></div><div class="notice">실제 사진과 닉네임은 아직 비공개예요. 3 ROUND 동안 서로의 생각을 알아가고 마지막에 둘 다 원할 때만 연결됩니다.</div><div class="spacer"></div>${btn('3 ROUND 시작','start-round')}${btn('지금은 아니에요','radar','ghost')}`)}
function round(){const i=state.round,r=ROUNDS[i],mine=state.roundAnswers[i];return shell(`<div class="round-label">ROUND ${i+1} · ${r.label}</div><div class="progress"><span style="width:${((i+1)/3)*100}%"></span></div><h1>${r.q}</h1><p>둘 다 답한 뒤 서로의 선택이 공개되고, 잠깐 대화할 수 있어요.</p><div class="round-card">${r.a.map((x,n)=>`<button class="choice ${mine===n?'selected':''}" data-answer="${n}">${x}</button>`).join('')}${mine!==undefined?`<div class="result-bar"><span>나 · ${mine+1}번</span><span class="${mine===r.other?'same':''}">상대 · ${r.other+1}번</span></div><div class="chat-window"><b>대화 OPEN · 2:30</b><p>${mine===r.other?'같은 답을 골랐네요. 왜 이쪽이 더 좋아요?':'우리는 답이 달랐네요. 서로 이유를 물어보세요.'}</p></div>`:''}</div><div class="spacer"></div>${btn(i===2?'최종 선택으로':'다음 ROUND','round-next','primary',mine===undefined)}`)}
function decision(){return shell(`<div class="eyebrow">FINAL CHOICE</div><h1>더 알아가고 싶나요?</h1><p>선택은 서로에게 보이지 않게 진행돼요.</p><span class="ticket">🎟 보유 티켓 ${state.tickets}장</span><div class="decision"><button class="yes" data-action="connect">더 알아가고 싶어요 · 🎟2</button><button class="no" data-action="end">여기까지</button></div><div class="notice"><b>YES / YES</b> → 양쪽 각 2장 차감, 실제 프로필 + 자유 채팅 OPEN<br><b>YES / NO</b> → YES 사용자는 1장 반환되어 최종 1장 소비, NO 사용자는 소비 없음</div>`)}
function connected(){return shell(`<div class="signal"><div class="signal-icon">🎉</div><div class="eyebrow">CONNECT</div><h1>둘 다 같은 선택을 했어요.</h1><p>이 순간 처음으로 실제 프로필과 자유로운 대화가 열립니다.</p><div class="real-profile"><div class="photo-placeholder">PHOTO</div><div><h2>레이더 메이트</h2><p>26세 · 서울<br>“좋은 대화와 느긋한 산책을 좋아해요.”</p></div></div></div><div class="spacer"></div>${btn('자유 채팅 시작','chat')}${btn('레이더로 돌아가기','radar','ghost')}`)}
function bind(){
 document.querySelectorAll('[data-action]').forEach(el=>el.onclick=()=>action(el.dataset.action));
 document.querySelectorAll('[data-model]').forEach(el=>el.onclick=()=>{const model=el.dataset.model,field=el.dataset.field;state[model][field]=el.dataset.value;save();render()});
 document.querySelectorAll('[data-priority]').forEach(el=>el.onclick=()=>{const k=el.dataset.priority,p=state.ideal.priority;if(p.includes(k))state.ideal.priority=p.filter(x=>x!==k);else if(p.length<2)state.ideal.priority=[...p,k];else alert('중요 특성은 최대 2개까지 선택할 수 있어요.');save();render()});
 document.querySelectorAll('[data-quiz]').forEach(el=>el.onclick=()=>{state.personality.answers.push(+el.dataset.quiz);save();render()});
 document.querySelectorAll('[data-signal]').forEach(el=>el.onclick=()=>triggerDemoSignal(el.dataset.signal));
 document.querySelectorAll('[data-insight]').forEach(el=>el.onclick=()=>{const i=+el.dataset.insight;if(state.unlocked.includes(i))return;if(state.unlocked.length>=2)return alert('MVP 무료 공개는 2개까지예요.');state.unlocked.push(i);save();render()});
 document.querySelectorAll('[data-answer]').forEach(el=>el.onclick=()=>{state.roundAnswers[state.round]=+el.dataset.answer;save();render()});
}
function action(a){
 if(a==='start')return go('ideal');if(a==='avatar-next')return go(state.screen==='ideal'?'personality':'ready');if(a==='to-self')return go('self');
 if(a==='quiz-back'){if(state.personality.answers.length){state.personality.answers.pop();save();render()}else go('ideal');return}
 if(a==='quiz-reset'){state.personality.answers=[];save();return go('personality')}
 if(a==='radar')return go('radar');if(a==='know')return go('know');if(a==='mutual'||a==='force-mutual')return go('mutual',{signal:'MUTUAL'});if(a==='start-round')return go('round',{round:0,roundAnswers:[]});
 if(a==='round-next'){if(state.round<2)return go('round',{round:state.round+1});return go('decision')}
 if(a==='connect')return go('connected',{tickets:Math.max(0,state.tickets-2)});if(a==='end'){if(confirm('여기까지 할까요?'))return go('radar')}
 if(a==='chat')return alert('MVP에서는 CONNECT까지 체험할 수 있어요. 실제 자유 채팅은 서버 연동 단계에서 열립니다.');
 if(a==='location'){if(!navigator.geolocation)return alert('이 브라우저는 위치 기능을 지원하지 않아요.');return navigator.geolocation.getCurrentPosition(pos=>{state.lastCoords={lat:pos.coords.latitude,lng:pos.coords.longitude};save();alert(`위치 권한 확인 완료 · ${RADAR_CONFIG.radiusMeters}m 탐색 기준으로 테스트합니다.`)},()=>alert('위치 권한이 꺼져 있어요. MVP 데모 버튼으로 흐름을 체험할 수 있어요.'),{enableHighAccuracy:true,timeout:5000})}
 if(a==='reset'){if(confirm('저장된 MVP 데이터를 지우고 처음부터 시작할까요?')){localStorage.removeItem('idealRadarMvp');state=deepMerge(defaults,{});render()}return}
 if(a==='back'){const map={ideal:'welcome',personality:'ideal',self:'personality-result'};return go(map[state.screen]||'welcome')}
}
function distanceMeters(a,b){const R=6371e3,p1=a.lat*Math.PI/180,p2=b.lat*Math.PI/180,dp=(b.lat-a.lat)*Math.PI/180,dl=(b.lng-a.lng)*Math.PI/180;const h=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;return 2*R*Math.atan2(Math.sqrt(h),Math.sqrt(1-h))}
function triggerDemoSignal(type){
 const key=`demo-${type}`;let seen={};try{seen=JSON.parse(localStorage.getItem(RADAR_CONFIG.signalCooldownKey)||'{}')}catch{}
 if(state.lastCoords&&seen[key]?.coords&&distanceMeters(state.lastCoords,seen[key].coords)<RADAR_CONFIG.newSpaceMeters){alert('같은 공간에서 이미 이 상대의 신호를 받았어요. 새로운 공간에서 다시 만나면 다시 발생할 수 있어요.');return}
 seen[key]={at:Date.now(),coords:state.lastCoords};localStorage.setItem(RADAR_CONFIG.signalCooldownKey,JSON.stringify(seen));go('signal',{signal:type})
}
render();
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
