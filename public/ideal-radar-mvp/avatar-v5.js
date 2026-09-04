(() => {
  const AVATAR_TABS=['gender','height','body','face','hair','fashion','mood'];
  const TAB_LABELS={gender:'성별',height:'키',body:'체형',face:'인상',hair:'헤어',fashion:'패션',mood:'분위기'};
  const TAB_HINTS={
    gender:'먼저 어떤 사람을 그리고 싶은지 골라주세요.',
    height:'키는 전체 실루엣의 느낌을 바꿔요.',
    body:'체형은 어깨와 전체 비율에 반영돼요.',
    face:'가장 끌리는 인상을 골라주세요.',
    hair:'헤어를 바꾸면 캐릭터 분위기가 크게 달라져요.',
    fashion:'평소 끌리는 스타일을 골라주세요.',
    mood:'마지막으로 전체 분위기를 정해요.'
  };
  const ICONS={
    gender:{'여성':'♀','남성':'♂'},
    height:{'상관없음':'↕','아담한 편':'S','평균':'M','큰 편':'L'},
    body:{'슬림':'◯','보통':'●','탄탄':'◆','볼륨감':'⬟'},
    face:{'다정한 인상':'☺','도회적인 인상':'◇','웃는 인상':'◡','차분한 인상':'—'},
    hair:{'짧은 머리':'✦','중간 길이':'●','긴 머리':'│','웨이브':'≈'},
    fashion:{'캐주얼':'C','미니멀':'M','스트릿':'S','포멀':'F'},
    mood:{'편안함':'☁','밝음':'☀','차분함':'◌','개성 있음':'✦'}
  };

  if(!state.avatarTab) state.avatarTab={ideal:'gender',self:'gender'};
  if(!state.avatarTab.ideal) state.avatarTab.ideal='gender';
  if(!state.avatarTab.self) state.avatarTab.self='gender';
  save();

  function slug(value){
    const map={
      '여성':'female','남성':'male','상관없음':'any','아담한 편':'petite','평균':'average','큰 편':'tall',
      '슬림':'slim','보통':'normal','탄탄':'fit','볼륨감':'volume','다정한 인상':'warm','도회적인 인상':'urban',
      '웃는 인상':'smile','차분한 인상':'calm','짧은 머리':'short','중간 길이':'medium','긴 머리':'long','웨이브':'wave',
      '캐주얼':'casual','미니멀':'minimal','스트릿':'street','포멀':'formal','편안함':'soft','밝음':'bright','차분함':'quiet','개성 있음':'unique'
    };
    return map[value]||'default';
  }

  avatar=function(model){
    const gender=slug(model.gender),height=slug(model.height),body=slug(model.body),face=slug(model.face),hair=slug(model.hair),fashion=slug(model.fashion),mood=slug(model.mood);
    return `<div class="avatar-art avatar-visual mood-${mood}" aria-label="${model.gender}, ${model.face}, ${model.hair}, ${model.fashion}">
      <div class="avatar-aura"></div>
      <div class="avatar-person gender-${gender} height-${height} body-${body} face-${face} hair-${hair} fashion-${fashion}">
        <div class="hair-back"></div>
        <div class="avatar-head">
          <span class="brow brow-left"></span><span class="brow brow-right"></span>
          <span class="eye eye-left"></span><span class="eye eye-right"></span>
          <span class="avatar-nose"></span><span class="avatar-mouth"></span>
          <span class="avatar-blush blush-left"></span><span class="avatar-blush blush-right"></span>
        </div>
        <div class="hair-front"></div>
        <div class="avatar-neck"></div>
        <div class="avatar-torso"><span class="fashion-detail detail-left"></span><span class="fashion-detail detail-right"></span></div>
      </div>
    </div>`;
  };

  function optionButton(kind,field,value,selected){
    const icon=ICONS[field]?.[value]||'•';
    return `<button class="builder-choice ${selected?'selected':''}" data-model="${kind}" data-field="${field}" data-value="${value}">
      <span class="choice-preview preview-${field} preview-${slug(value)}">${icon}</span>
      <span class="choice-label">${value}</span>
      <span class="choice-check">✓</span>
    </button>`;
  }

  function selectedSummary(model){
    return [model.height,model.face,model.hair,model.fashion].filter(Boolean).map(v=>`<span>${v}</span>`).join('');
  }

  avatarEditor=function(kind){
    const ideal=kind==='ideal',model=ideal?state.ideal:state.self;
    const active=state.avatarTab[kind]||'gender';
    const values=active==='gender'?['여성','남성']:AVATAR_FIELDS[active];
    const activeIndex=AVATAR_TABS.indexOf(active);
    const last=activeIndex===AVATAR_TABS.length-1;
    const priorityAllowed=ideal&&active!=='gender';
    const priorityOn=ideal&&state.ideal.priority.includes(active);
    const priorityCount=ideal?state.ideal.priority.length:0;
    const tabs=AVATAR_TABS.map((tab,i)=>`<button class="builder-tab ${active===tab?'active':''} ${i<activeIndex?'passed':''}" data-action="avatar-tab-${tab}"><span>${i+1}</span>${TAB_LABELS[tab]}</button>`).join('');
    const options=values.map(v=>optionButton(kind,active,v,model[active]===v)).join('');
    const nextLabel=last?(ideal?'성격 진단하기':'준비 완료'):`다음 · ${TAB_LABELS[AVATAR_TABS[activeIndex+1]]}`;
    return shell(`
      <div class="eyebrow">MAKE · ${ideal?'IDEAL':'SELF'}</div>
      <div class="builder-heading"><div><h1>${ideal?'내 이상형을 그려보세요':'나를 그려보세요'}</h1><p>${ideal?'설문에 답하는 게 아니라, 머릿속에 있는 사람을 하나씩 완성해요.':'상대의 레이더가 알아볼 수 있도록 내 모습을 같은 방식으로 만들어요.'}</p></div><span class="builder-count">${activeIndex+1}/7</span></div>
      <div class="avatar-builder-stage">
        <div class="avatar-stage-label"><span>${ideal?'MY IDEAL':'MY SELF'}</span><b>${model.gender} · ${model.face}</b></div>
        ${avatar(model)}
        <div class="avatar-summary">${selectedSummary(model)}</div>
      </div>
      <div class="builder-tabs" role="tablist">${tabs}</div>
      <section class="builder-panel">
        <div class="builder-panel-head"><div><span>STEP ${activeIndex+1}</span><h2>${TAB_LABELS[active]}</h2></div>${priorityAllowed?`<button class="priority-pill ${priorityOn?'on':''}" data-priority="${active}">★ 중요 ${priorityOn?'선택됨':`${priorityCount}/2`}</button>`:''}</div>
        <p class="builder-hint">${TAB_HINTS[active]}</p>
        <div class="builder-choice-grid ${values.length===2?'two':''}">${options}</div>
        ${priorityAllowed?'<p class="priority-help">특히 중요하게 보는 외모 요소는 최대 2개까지 표시할 수 있어요.</p>':''}
      </section>
      <div class="builder-bottom">${btn(nextLabel,last?'avatar-next':'avatar-next-field')}${btn('이전','avatar-prev-field','ghost')}</div>
    `,ideal?'1 / 3':'3 / 3');
  };

  const baseAction=action;
  action=function(a){
    if(a.startsWith('avatar-tab-')){
      const field=a.replace('avatar-tab-','');
      if(!AVATAR_TABS.includes(field))return;
      const kind=state.screen==='ideal'?'ideal':'self';state.avatarTab[kind]=field;save();render();return;
    }
    if(a==='avatar-next-field'||a==='avatar-prev-field'){
      const kind=state.screen==='ideal'?'ideal':'self';const current=state.avatarTab[kind]||'gender';let i=AVATAR_TABS.indexOf(current);
      i+=a==='avatar-next-field'?1:-1;
      if(i<0)return baseAction('back');
      if(i>=AVATAR_TABS.length)return baseAction('avatar-next');
      state.avatarTab[kind]=AVATAR_TABS[i];save();render();return;
    }
    if(a==='avatar-next'){
      const kind=state.screen==='ideal'?'ideal':'self';state.avatarTab[kind]='gender';save();return baseAction(a);
    }
    return baseAction(a);
  };

  render();
})();
