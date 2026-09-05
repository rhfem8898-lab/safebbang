(() => {
  // Female customization v17: finalized option schema + backward-compatible state migration.
  const femaleOptions={
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
  const oldToNew={height:{'아담한 편':'155cm','평균':'160cm','큰 편':'170cm'},body:{'탄탄':'보통','볼륨감':'상체 볼륨형'},face:{'다정한 인상':'청순','도회적인 인상':'시크','웃는 인상':'발랄','차분한 인상':'청순'},hair:{'중간 길이':'기본 생머리','긴 머리':'기본 생머리','짧은 머리':'단발'},fashion:{'미니멀':'시크','스트릿':'스포티'},mood:{'편안함':'청순','밝음':'발랄','차분함':'도도','개성 있음':'섹시'}};
  const defaultsV17={face:'청순',hair:'기본 생머리',bangs:'시스루',hairColor:'다크브라운',eye:'둥근 눈',eyelid:'속쌍',height:'160cm',body:'보통',fashion:'캐주얼',mood:'청순'};
  function migrateModel(m,isIdeal){
    Object.keys(oldToNew).forEach(k=>{if(oldToNew[k][m[k]])m[k]=oldToNew[k][m[k]]});
    Object.entries(defaultsV17).forEach(([k,v])=>{if(m[k]===undefined||m[k]===null||m[k]==='')m[k]=v});
    if(!isIdeal) Object.keys(defaultsV17).forEach(k=>{if(m[k]==='상관없음')m[k]=defaultsV17[k]});
  }
  migrateModel(state.ideal,true); migrateModel(state.self,false);
  state.ideal.priority=(state.ideal.priority||[]).filter(k=>['face','hair','bangs','hairColor','eye','eyelid','height','body','fashion','mood'].includes(k)).slice(0,2);
  state.avatarSchemaVersion=17; save();

  // Extend the matching field source without breaking old saves.
  AVATAR_FIELDS.face=['상관없음',...femaleOptions.face];
  AVATAR_FIELDS.hair=['상관없음',...femaleOptions.hair];
  AVATAR_FIELDS.height=['상관없음',...femaleOptions.height];
  AVATAR_FIELDS.body=['상관없음',...femaleOptions.body];
  AVATAR_FIELDS.fashion=['상관없음',...femaleOptions.fashion];
  AVATAR_FIELDS.mood=['상관없음',...femaleOptions.mood];
  AVATAR_FIELDS.bangs=['상관없음',...femaleOptions.bangs];
  AVATAR_FIELDS.hairColor=['상관없음',...femaleOptions.hairColor];
  AVATAR_FIELDS.eye=['상관없음',...femaleOptions.eye];
  AVATAR_FIELDS.eyelid=['상관없음',...femaleOptions.eyelid];

  const LABEL={gender:'성별',face:'얼굴 스타일',hair:'헤어스타일',bangs:'앞머리',hairColor:'헤어 컬러',eye:'눈 모양',eyelid:'쌍꺼풀',height:'키',body:'몸매',fashion:'패션 스타일',mood:'분위기'};
  const TABS=['gender','face','hair','bangs','hairColor','eye','eyelid','height','body','fashion','mood'];
  const FALL={...defaultsV17};
  const modelFor=k=>k==='ideal'?state.ideal:state.self;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isAny=(m,f)=>m[f]==='상관없음';
  function options(kind,field){const m=modelFor(kind);const vals=field==='gender'?['여성','남성']:femaleOptions[field];return `<div class="v17-options ${field}">${vals.map(v=>`<button class="v17-option ${m[field]===v?'selected':''}" data-model="${kind}" data-field="${field}" data-value="${esc(v)}"><span class="v17-thumb" data-v17-preview="${field}:${esc(v)}"></span><b>${esc(v)}</b></button>`).join('')}</div>`}
  function controls(kind,field){if(kind!=='ideal'||field==='gender')return '';const m=state.ideal,on=state.ideal.priority.includes(field);return `<div class="v17-controls"><label><input type="checkbox" data-v17-any="${field}" ${isAny(m,field)?'checked':''}> 상관없음</label><button class="v17-priority ${on?'on':''}" data-priority="${field}" ${isAny(m,field)?'disabled':''}>★ 중요 ${on?'선택됨':state.ideal.priority.length+'/2'}</button></div>`}
  function summary(kind){const m=modelFor(kind);return TABS.filter(f=>f!=='gender').map(f=>`<span class="summary-chip ${kind==='ideal'&&state.ideal.priority.includes(f)?'important':''}">${isAny(m,f)?'∞ ':''}${esc(m[f])}</span>`).join('')}
  function visual(kind){const m=modelFor(kind);return `<div class="v17-avatar"><div class="v17-master"><div class="approved-avatar-image"></div></div><div class="v17-caption"><b>${kind==='ideal'?'MY IDEAL':'MY SELF'}</b><span>${esc(m.face)} · ${esc(m.hair)} · ${esc(m.body)}</span></div></div>`}
  function mount(kind){
    state.avatarTab=state.avatarTab||{ideal:'gender',self:'gender'};let tab=state.avatarTab[kind];if(!TABS.includes(tab))tab='gender';state.avatarTab[kind]=tab;const idx=TABS.indexOf(tab),m=modelFor(kind);
    app.innerHTML=`<main class="v17-builder"><aside class="v17-side"><div class="ref-brand">⌁ 이상형 레이더</div><div class="v17-progress"><b>${kind==='ideal'?'내 이상형':'나의 모습'}</b><span>${idx+1} / ${TABS.length}</span><i><em style="width:${((idx+1)/TABS.length)*100}%"></em></i></div>${TABS.map((t,i)=>`<button class="v17-step ${t===tab?'active':''}" data-v17-tab="${t}"><span>${i+1}</span>${LABEL[t]}</button>`).join('')}</aside><section class="v17-stage">${visual(kind)}<div class="v17-summary">${summary(kind)}</div></section><section class="v17-editor"><header><span>STEP ${idx+1}</span><h1>${LABEL[tab]}</h1><p>${kind==='ideal'?'내가 끌리는 모습을 골라주세요.':'나와 가장 가까운 모습을 골라주세요.'}</p>${controls(kind,tab)}</header>${options(kind,tab)}<footer><button class="ref-prev" data-v17-nav="prev">이전</button><button class="ref-next" data-v17-nav="next">${idx===TABS.length-1?(kind==='ideal'?'성격 진단하기':'준비 완료'):'다음'} →</button></footer></section></main>`;
    bind();
    document.querySelectorAll('[data-v17-tab]').forEach(el=>el.onclick=()=>{state.avatarTab[kind]=el.dataset.v17Tab;save();mount(kind)});
    document.querySelectorAll('[data-v17-any]').forEach(el=>el.onchange=()=>{const f=el.dataset.v17Any;if(el.checked){m[f]='상관없음';state.ideal.priority=state.ideal.priority.filter(x=>x!==f)}else m[f]=FALL[f];save();mount(kind)});
    document.querySelectorAll('[data-v17-nav]').forEach(el=>el.onclick=()=>{let n=idx+(el.dataset.v17Nav==='next'?1:-1);if(n<0)return action('back');if(n>=TABS.length)return action('avatar-next');state.avatarTab[kind]=TABS[n];save();mount(kind)});
  }
  avatarEditor=function(kind){mount(kind)};
  render();
})();