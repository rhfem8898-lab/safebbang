(() => {
  const TABS=['gender','face','hair','body','fashion','mood'];
  const META={
    gender:{label:'성별',icon:'⚥'},face:{label:'얼굴',icon:'☺'},hair:{label:'헤어',icon:'♓'},
    body:{label:'몸매',icon:'♙'},fashion:{label:'패션',icon:'♧'},mood:{label:'분위기',icon:'✧'}
  };
  const HAIRS=[
    ['중간 길이','기본 생머리','hair-1'],['긴 머리','긴 생머리','hair-2'],['웨이브','웨이브','hair-3'],['히피펌','히피펌','hair-4'],
    ['짧은 머리','단발','hair-5'],['숏컷','숏컷','hair-6'],['포니테일','포니테일','hair-7'],['똥머리','똥머리','hair-8']
  ];
  const BANGS=[['없음','bang-1'],['시스루','bang-2'],['일자','bang-3'],['가르마','bang-4'],['풀뱅','bang-5']];
  const COLORS=['#29231f','#5a382b','#9b6547','#87271d','#d9c28f','#8e807c','#e69aac'];
  const ICONS={gender:'⚥',height:'♙',body:'♙',face:'☺',hair:'♓',fashion:'♧',mood:'✧'};
  const LABELS={gender:'성별',height:'키',body:'체형',face:'인상',hair:'헤어',fashion:'패션',mood:'분위기'};
  const STEP_LABELS=['기본 정보','아바타 만들기','성격·가치관','라이프스타일','이상형 우선순위','완료'];
  if(!state.avatarTab)state.avatarTab={ideal:'gender',self:'gender'};
  if(!state.avatarLook)state.avatarLook={ideal:{hairColor:0,bangs:'없음'},self:{hairColor:0,bangs:'없음'}};
  ['ideal','self'].forEach(k=>{if(!state.avatarLook[k])state.avatarLook[k]={hairColor:0,bangs:'없음'}});save();

  function activeKind(){return state.screen==='self'?'self':'ideal'}
  function modelFor(kind){return kind==='ideal'?state.ideal:state.self}
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function isAny(model,field){return model[field]==='상관없음'}
  function priorityButton(field,ideal,model){
    if(!ideal||field==='gender'||isAny(model,field))return '';
    const on=state.ideal.priority.includes(field);
    return `<button class="ref-star ${on?'on':''}" data-priority="${field}" aria-pressed="${on}">★</button>`;
  }
  function anyToggle(field,ideal,model){
    if(!ideal||field==='gender')return '';
    return `<label class="ref-any"><span>상관없음</span><input type="checkbox" data-any-field="${field}" ${isAny(model,field)?'checked':''}><i></i></label>`;
  }
  function simpleCards(kind,field,values){
    const model=modelFor(kind),ideal=kind==='ideal';
    return `<div class="ref-simple-grid">${values.filter(v=>!(v==='상관없음')).map((v,i)=>`<button class="ref-simple-card ${model[field]===v?'selected':''}" data-model="${kind}" data-field="${field}" data-value="${esc(v)}"><span class="ref-symbol ref-${field}-${i}">${ICONS[field]}</span><b>${esc(v)}</b></button>`).join('')}</div>${ideal?'<p class="ref-panel-note">★ 중요하게 보는 요소는 최대 2개까지 선택할 수 있어요.</p>':''}`;
  }
  function genderPanel(kind,model){
    return `<div class="ref-group"><h2>성별</h2><div class="ref-simple-grid two">${['여성','남성'].map((v,i)=>`<button class="ref-simple-card ${model.gender===v?'selected':''}" data-model="${kind}" data-field="gender" data-value="${v}"><span class="ref-symbol">${i?'♂':'♀'}</span><b>${v}</b></button>`).join('')}</div></div><div class="ref-group"><div class="ref-group-head"><h2>키</h2>${anyToggle('height',kind==='ideal',model)}${priorityButton('height',kind==='ideal',model)}</div>${simpleCards(kind,'height',AVATAR_FIELDS.height)}</div>`;
  }
  function hairPanel(kind,model){
    const ideal=kind==='ideal',look=state.avatarLook[kind];
    return `<div class="ref-group"><div class="ref-group-head"><h2>헤어스타일 <span class="help-dot">?</span></h2>${anyToggle('hair',ideal,model)}${priorityButton('hair',ideal,model)}</div><div class="hair-grid">${HAIRS.map(([value,label,cls])=>`<button class="hair-choice ${model.hair===value?'selected':''}" data-model="${kind}" data-field="hair" data-value="${value}"><span class="ref-sprite ${cls}"></span><b>${label}</b></button>`).join('')}</div></div><div class="ref-group"><h2>헤어 컬러</h2><div class="color-row">${COLORS.map((c,i)=>`<button aria-label="헤어 컬러 ${i+1}" class="color-choice ${look.hairColor===i?'selected':''}" style="--swatch:${c}" data-hair-color="${i}"></button>`).join('')}</div></div><div class="ref-group"><h2>앞머리</h2><div class="bang-grid">${BANGS.map(([label,cls])=>`<button class="bang-choice ${look.bangs===label?'selected':''}" data-bangs="${label}"><span class="ref-sprite ${cls}"></span><b>${label}</b></button>`).join('')}</div></div>`;
  }
  function panel(kind,active,model){
    if(active==='gender')return genderPanel(kind,model);
    if(active==='hair')return hairPanel(kind,model);
    const values=AVATAR_FIELDS[active]||[];
    return `<div class="ref-group"><div class="ref-group-head"><h2>${META[active].label}${active==='face'?'·인상':''} <span class="help-dot">?</span></h2>${anyToggle(active,kind==='ideal',model)}${priorityButton(active,kind==='ideal',model)}</div>${simpleCards(kind,active,values)}</div>${active==='body'?'<div id="ref-body-detail" class="ref-body-detail"></div>':''}`;
  }
  function summary(kind,model){
    const ideal=kind==='ideal';
    return ['gender','height','body','face','hair','fashion','mood'].map(field=>{
      const important=ideal&&state.ideal.priority.includes(field);
      return `<span class="summary-chip ${important?'important':''} ${isAny(model,field)?'any':''}"><i>${ICONS[field]}</i>${esc(model[field])}${important?' <b>★</b>':''}</span>`;
    }).join('');
  }
  function leftRail(){return `<aside class="ref-left"><div class="ref-brand"><span>♆</span> 이상형 레이더</div><ol>${STEP_LABELS.map((x,i)=>`<li class="${i===1?'active':i<1?'done':''}"><span>${i+1}</span><b>${x}</b></li>`).join('')}</ol><div class="ref-promo"><div class="promo-faces"><span class="ref-sprite promo-male"></span><span class="ref-sprite promo-female"></span></div><b>나만의 이상형을<br>3D 아바타로 만들어보세요.</b><p>더 구체적일수록<br>더 좋은 인연이 찾아와요.</p></div></aside>`}
  function centerStage(kind){return `<section class="ref-center"><div class="ideal-switch"><button class="${kind==='ideal'?'active':''}" data-builder-kind="ideal">MY IDEAL</button><button class="${kind==='self'?'active':''}" data-builder-kind="self">MY SELF</button></div><div class="reference-avatar" aria-label="3D 아바타 미리보기"></div></section>`}
  function rightPanel(kind,active,model){
    const idx=TABS.indexOf(active),last=idx===TABS.length-1;
    return `<section class="ref-right"><nav class="ref-tabs">${TABS.map(t=>`<button class="${t===active?'active':''}" data-ref-tab="${t}"><i>${META[t].icon}</i><span>${META[t].label}</span></button>`).join('')}</nav><div class="ref-editor-scroll">${panel(kind,active,model)}</div><div class="ref-actions"><button class="ref-prev" data-action="avatar-prev-field">이전</button><button class="ref-next" data-action="${last?'avatar-next':'avatar-next-field'}">${last?(kind==='ideal'?'성격 진단하기':'완료'):'다음 단계'} <span>→</span></button></div></section>`;
  }
  function mount(kind){
    const model=modelFor(kind),active=TABS.includes(state.avatarTab[kind])?state.avatarTab[kind]:'gender';state.avatarTab[kind]=active;
    app.innerHTML=`<main class="reference-builder">${leftRail()}${centerStage(kind)}${rightPanel(kind,active,model)}<footer class="ref-summary"><div class="summary-title"><b>선택한 특징</b><span class="help-dot">?</span></div><div class="summary-hint">★ = 중요하게 보는 요소 (최대 2개)</div><div class="summary-chips">${summary(kind,model)}</div></footer></main>`;
    bind();bindReference(kind);
  }
  function bindReference(kind){
    document.querySelectorAll('[data-ref-tab]').forEach(el=>el.onclick=()=>{state.avatarTab[kind]=el.dataset.refTab;save();render()});
    document.querySelectorAll('[data-builder-kind]').forEach(el=>el.onclick=()=>{const next=el.dataset.builderKind;if(next===kind)return;go(next)});
    document.querySelectorAll('[data-any-field]').forEach(el=>el.onchange=()=>{const field=el.dataset.anyField,model=modelFor(kind);if(el.checked){model[field]='상관없음';if(kind==='ideal')state.ideal.priority=state.ideal.priority.filter(x=>x!==field)}else{const fallback={height:'평균',body:'보통',face:'다정한 인상',hair:'중간 길이',fashion:'캐주얼',mood:'편안함'};model[field]=fallback[field]}save();render()});
    document.querySelectorAll('[data-hair-color]').forEach(el=>el.onclick=()=>{state.avatarLook[kind].hairColor=+el.dataset.hairColor;save();render()});
    document.querySelectorAll('[data-bangs]').forEach(el=>el.onclick=()=>{state.avatarLook[kind].bangs=el.dataset.bangs;save();render()});
    const detail=document.querySelector('#ref-body-detail');
    if(detail&&typeof BODY_PROFILES!=='undefined')detail.innerHTML='';
  }
  avatarEditor=function(kind){mount(kind)};
  const oldAction=action;
  action=function(a){
    if(a==='avatar-next-field'||a==='avatar-prev-field'){
      const kind=activeKind(),current=TABS.includes(state.avatarTab[kind])?state.avatarTab[kind]:'gender';let i=TABS.indexOf(current)+(a==='avatar-next-field'?1:-1);
      if(i<0)return oldAction('back');if(i>=TABS.length)return oldAction('avatar-next');state.avatarTab[kind]=TABS[i];save();render();return;
    }
    if(a==='avatar-next'){const kind=activeKind();state.avatarTab[kind]='gender';save();return oldAction(a)}
    return oldAction(a);
  };
  render();
})();
