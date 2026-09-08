(() => {
  const FIELDS=['face','hair','bangs','hairColor','eye','eyelid','height','body','fashion','mood'];
  const LABEL={gender:'성별',face:'얼굴 스타일',hair:'헤어스타일',bangs:'앞머리',hairColor:'헤어 컬러',eye:'눈 모양',eyelid:'쌍꺼풀',height:'키',body:'몸매',fashion:'패션 스타일',mood:'분위기'};
  const OPTIONS={
    face:['청순','발랄','시크','큐트'],
    hair:['기본 생머리','웨이브','포니테일','로우번','하프업','단발','양갈래','똥머리'],
    bangs:['없음','시스루','일자','가르마','측면'],
    hairColor:['블랙','다크브라운','초코브라운','애쉬브라운','베이지블론드','핑크브라운','애쉬그레이'],
    eye:['둥근 눈','긴 눈','올라간 눈','처진 눈'],
    eyelid:['무쌍','속쌍','쌍꺼풀'],
    height:['155cm','160cm','165cm','170cm'],
    body:['슬림','보통','상체 볼륨형','하체 볼륨형','글래머러스'],
    fashion:['캐주얼','러블리','시크','스포티','포멀','섹시'],
    mood:['청순','발랄','도도','섹시']
  };
  const DEFAULTS={face:'청순',hair:'기본 생머리',bangs:'시스루',hairColor:'다크브라운',eye:'둥근 눈',eyelid:'속쌍',height:'160cm',body:'보통',fashion:'캐주얼',mood:'청순'};
  const TABS=['gender',...FIELDS];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slug=s=>String(s).replace(/\s+/g,'-').replace(/[^a-zA-Z0-9가-힣-]/g,'');
  const modelFor=k=>k==='ideal'?state.ideal:state.self;
  const isAny=(m,f)=>m[f]==='상관없음';

  // True part registry. Only isolated character-part assets belong here.
  // UI screenshots and catalog sheets are intentionally ignored.
  window.IDEAL_RADAR_PARTS=window.IDEAL_RADAR_PARTS||{};
  const part=(field,value)=>window.IDEAL_RADAR_PARTS?.[field]?.[value]||null;

  function migrate(m,isIdeal){
    Object.entries(DEFAULTS).forEach(([k,v])=>{if(!m[k])m[k]=v});
    if(!isIdeal) FIELDS.forEach(k=>{if(m[k]==='상관없음')m[k]=DEFAULTS[k]});
  }
  migrate(state.ideal,true);migrate(state.self,false);
  state.ideal.priority=(state.ideal.priority||[]).filter(x=>FIELDS.includes(x)).slice(0,2);
  state.avatarSchemaVersion=22;
  Object.entries(OPTIONS).forEach(([k,v])=>AVATAR_FIELDS[k]=['상관없음',...v]);
  save();

  function thumb(field,value){
    const src=part(field,value);
    const cls=`v22-thumb ${field} ${src?'has-part':''}`;
    const style=src?` style="background-image:url('${src}')"`:'';
    return `<span class="${cls}" data-field="${field}" data-value="${esc(value)}"${style}></span>`;
  }
  function optionGrid(kind,field){
    const m=modelFor(kind),vals=field==='gender'?['여성','남성']:OPTIONS[field];
    return `<div class="v22-options ${field}">${vals.map(v=>`<button class="v22-option ${m[field]===v?'selected':''}" data-v22-select="1" data-kind="${kind}" data-field="${field}" data-value="${esc(v)}">${thumb(field,v)}<b>${esc(v)}</b></button>`).join('')}</div>`;
  }
  function controls(kind,field){
    if(kind!=='ideal'||field==='gender')return '';
    const m=state.ideal,on=m.priority.includes(field),any=isAny(m,field);
    return `<div class="v22-controls"><label><input type="checkbox" data-v22-any="${field}" ${any?'checked':''}> 상관없음</label><button type="button" class="v22-priority ${on?'on':''}" data-v22-priority="${field}" ${any?'disabled':''}>★ 중요 ${on?'선택됨':m.priority.length+'/2'}</button></div>`;
  }
  function summary(kind){
    const m=modelFor(kind);
    return FIELDS.map(f=>`<span class="summary-chip ${kind==='ideal'&&state.ideal.priority.includes(f)?'important':''}">${LABEL[f]} · ${isAny(m,f)?'상관없음':esc(m[f])}</span>`).join('');
  }
  function stageClasses(m){return FIELDS.map(f=>`v22-${f}-${slug(isAny(m,f)?DEFAULTS[f]:m[f])}`).join(' ')}
  function layers(kind){
    const m=modelFor(kind),resolved={};
    FIELDS.forEach(f=>resolved[f]=isAny(m,f)?DEFAULTS[f]:m[f]);
    const layerFields=['body','fashion','face','eye','eyelid','hair','bangs'];
    const imgs=layerFields.map(f=>{const src=part(f,resolved[f]);return src?`<img class="v22-layer layer-${f}" src="${src}" alt="">`:''}).join('');
    const hasReal=layerFields.some(f=>!!part(f,resolved[f]));
    return `<div class="v22-stage-art ${stageClasses(m)}" data-real-parts="${hasReal?'1':'0'}"><div class="v22-mood"></div><div class="v22-fallback"></div>${imgs}<div class="v22-eye-guide"><i></i><i></i></div><div class="v22-bang-guide"></div><div class="v22-status">${hasReal?'실제 분리 에셋 조합':'MASTER 기준 미리보기 · 분리 에셋 대기'}</div></div>`;
  }
  function visual(kind){
    const m=modelFor(kind);
    return `<div class="v22-avatar">${layers(kind)}<div class="v22-caption"><b>${kind==='ideal'?'MY IDEAL':'MY SELF'}</b><span>${esc(isAny(m,'face')?DEFAULTS.face:m.face)} · ${esc(isAny(m,'hair')?DEFAULTS.hair:m.hair)} · ${esc(isAny(m,'body')?DEFAULTS.body:m.body)}</span></div></div>`;
  }
  function mount(kind){
    state.avatarTab=state.avatarTab||{ideal:'gender',self:'gender'};
    let tab=TABS.includes(state.avatarTab[kind])?state.avatarTab[kind]:'gender';
    state.avatarTab[kind]=tab;
    const idx=TABS.indexOf(tab),m=modelFor(kind);
    app.innerHTML=`<main class="v22-builder"><aside class="v22-side"><div class="ref-brand">⌁ 이상형 레이더</div><div class="v22-progress"><b>${kind==='ideal'?'내 이상형':'나의 모습'}</b><span>${idx+1} / ${TABS.length}</span><i><em style="width:${((idx+1)/TABS.length)*100}%"></em></i></div>${TABS.map((t,i)=>`<button class="v22-step ${t===tab?'active':''}" data-v22-tab="${t}"><span>${i+1}</span>${LABEL[t]}</button>`).join('')}</aside><section class="v22-stage">${visual(kind)}<div class="v22-summary">${summary(kind)}</div></section><section class="v22-editor"><header><span>STEP ${idx+1}</span><h1>${LABEL[tab]}</h1><p>${kind==='ideal'?'내가 끌리는 모습을 골라주세요.':'나와 가장 가까운 모습을 골라주세요.'}</p>${controls(kind,tab)}</header>${optionGrid(kind,tab)}<footer><button class="ref-prev" data-v22-nav="prev">이전</button><button class="ref-next" data-v22-nav="next">${idx===TABS.length-1?(kind==='ideal'?'성격 진단하기':'준비 완료'):'다음'} →</button></footer></section></main>`;
    bindV22(kind,tab,idx,m);
  }
  function bindV22(kind,tab,idx,m){
    document.querySelectorAll('[data-v22-tab]').forEach(el=>el.onclick=()=>{state.avatarTab[kind]=el.dataset.v22Tab;save();mount(kind)});
    document.querySelectorAll('[data-v22-select]').forEach(el=>el.onclick=e=>{e.preventDefault();const f=el.dataset.field,v=el.dataset.value;m[f]=v;if(kind==='ideal'&&v==='상관없음')state.ideal.priority=state.ideal.priority.filter(x=>x!==f);save();mount(kind)});
    document.querySelectorAll('[data-v22-any]').forEach(el=>el.onchange=()=>{const f=el.dataset.v22Any;if(el.checked){m[f]='상관없음';state.ideal.priority=state.ideal.priority.filter(x=>x!==f)}else m[f]=DEFAULTS[f];save();mount(kind)});
    document.querySelectorAll('[data-v22-priority]').forEach(el=>el.onclick=e=>{e.preventDefault();const f=el.dataset.v22Priority,p=state.ideal.priority||[];if(p.includes(f))state.ideal.priority=p.filter(x=>x!==f);else if(p.length<2)state.ideal.priority=[...p,f];else{state.ideal.priority=[p[1],f]}save();mount(kind)});
    document.querySelectorAll('[data-v22-nav]').forEach(el=>el.onclick=()=>{let n=idx+(el.dataset.v22Nav==='next'?1:-1);if(n<0)return action('back');if(n>=TABS.length)return action('avatar-next');state.avatarTab[kind]=TABS[n];save();mount(kind)});
  }

  // Matching now includes every finalized appearance field.
  appearanceMatch=function(ideal,self){
    if(ideal.gender&&self.gender&&ideal.gender!==self.gender)return {eligible:false,score:0,reason:'gender'};
    let earned=0,total=0,ignored=0;
    for(const field of FIELDS){
      if(ideal[field]==='상관없음'){ignored++;continue}
      const weight=ideal.priority?.includes(field)?2:1;
      total+=weight;
      if(ideal[field]===self[field])earned+=weight;
    }
    const score=total?Math.round(earned/total*100):100;
    return {eligible:score>=RADAR_CONFIG.appearanceMatchThreshold,score,ignored,threshold:RADAR_CONFIG.appearanceMatchThreshold};
  };
  demoPartnerSelf=function(){const o={gender:state.ideal.gender};FIELDS.forEach(f=>o[f]=state.ideal[f]==='상관없음'?DEFAULTS[f]:state.ideal[f]);return o};
  avatarEditor=function(kind){mount(kind)};
  render();
})();