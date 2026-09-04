(() => {
  function slug(value){
    const map={'여성':'female','남성':'male','아담한 편':'petite','평균':'average','큰 편':'tall','슬림':'slim','보통':'normal','탄탄':'fit','볼륨감':'volume','다정한 인상':'warm','도회적인 인상':'urban','웃는 인상':'smile','차분한 인상':'calm','짧은 머리':'short','중간 길이':'medium','긴 머리':'long','웨이브':'wave','캐주얼':'casual','미니멀':'minimal','스트릿':'street','포멀':'formal','편안함':'soft','밝음':'bright','차분함':'quiet','개성 있음':'unique'};
    return map[value]||'default';
  }
  function visual(model,field){
    const fallback={height:'평균',body:'보통',face:'다정한 인상',hair:'중간 길이',fashion:'캐주얼',mood:'편안함'};
    return model[field]==='상관없음'?fallback[field]:model[field];
  }
  avatar=function(model,extraClass=''){
    const gender=slug(model.gender),height=slug(visual(model,'height')),body=slug(visual(model,'body')),face=slug(visual(model,'face')),hair=slug(visual(model,'hair')),fashion=slug(visual(model,'fashion')),mood=slug(visual(model,'mood'));
    const flexible=['height','body','face','hair','fashion','mood'].filter(k=>model[k]==='상관없음').length;
    return `<div class="avatar-art avatar-visual realistic-avatar mood-${mood} ${extraClass}" aria-label="${model.gender}, ${model.body}, ${model.face}, ${model.hair}">
      <div class="avatar-aura"></div>
      <div class="real-person gender-${gender} height-${height} body-${body} face-${face} hair-${hair} fashion-${fashion}">
        <div class="real-hair-back"></div>
        <div class="real-neck"></div>
        <div class="real-ear real-ear-left"></div><div class="real-ear real-ear-right"></div>
        <div class="real-head">
          <span class="real-brow brow-l"></span><span class="real-brow brow-r"></span>
          <span class="real-eye eye-l"></span><span class="real-eye eye-r"></span>
          <span class="real-nose"></span><span class="real-mouth"></span>
          <span class="real-cheek cheek-l"></span><span class="real-cheek cheek-r"></span>
        </div>
        <div class="real-hair-front"></div>
        <div class="real-shoulders"></div>
        <div class="real-upper-body"><span class="outfit-detail detail-l"></span><span class="outfit-detail detail-r"></span><span class="outfit-center"></span></div>
        <div class="real-waist"></div>
        <div class="real-hips"></div>
        <div class="real-arm arm-l"></div><div class="real-arm arm-r"></div>
        <div class="real-leg leg-l"></div><div class="real-leg leg-r"></div>
        <div class="real-shoe shoe-l"></div><div class="real-shoe shoe-r"></div>
      </div>
      ${flexible&&extraClass.includes('avatar-main')?`<span class="flexible-badge">${flexible}개 조건 열어둠</span>`:''}
    </div>`;
  };
  render();
})();
