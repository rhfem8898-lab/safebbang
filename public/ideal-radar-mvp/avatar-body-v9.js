(() => {
  const BODY_PROFILES={
    '슬림':{shoulder:34,waist:30,hips:34,muscle:20},
    '보통':{shoulder:50,waist:48,hips:50,muscle:40},
    '탄탄':{shoulder:72,waist:38,hips:50,muscle:82},
    '볼륨감':{shoulder:54,waist:58,hips:78,muscle:36}
  };
  const labels={shoulder:['좁은 편','보통','넓은 편'],waist:['잘록한 편','보통','여유 있는 편'],hips:['슬림한 편','보통','넓은 편'],muscle:['부드러운 편','보통','탄탄한 편']};
  function ensure(){
    ['ideal','self'].forEach(kind=>{
      const m=state[kind];
      if(!m.bodyDetail||typeof m.bodyDetail!=='object')m.bodyDetail={...BODY_PROFILES[m.body]||BODY_PROFILES['보통']};
    });save();
  }
  ensure();
  const oldRender=render;
  function tier(v){return v<40?0:v<66?1:2}
  function bodyPanel(kind){
    const model=state[kind],d=model.bodyDetail||BODY_PROFILES[model.body]||BODY_PROFILES['보통'];
    return `<div class="body-detail-card"><div class="body-detail-title"><div><span>BODY DETAIL</span><b>체형을 조금 더 정확하게</b></div><small>선택 사항</small></div><p>체형 이름 하나로 부족할 때만 조절하세요. 아바타에 바로 반영돼요.</p>${[['shoulder','어깨'],['waist','허리'],['hips','골반'],['muscle','근육감']].map(([k,l])=>`<div class="body-slider-row"><div><b>${l}</b><span>${labels[k][tier(d[k])]}</span></div><input type="range" min="20" max="85" step="1" value="${d[k]}" data-body-slider="${k}" data-body-kind="${kind}"></div>`).join('')}<button class="body-reset" data-body-reset="${kind}">‘${model.body}’ 기본 비율로 되돌리기</button></div>`;
  }
  const oldAvatarEditor=avatarEditor;
  avatarEditor=function(kind){
    oldAvatarEditor(kind);
    if((state.avatarTab[kind]||'gender')!=='body')return;
    const panel=document.querySelector('.builder-panel');if(!panel)return;
    panel.insertAdjacentHTML('beforeend',bodyPanel(kind));bindBody();
  };
  function bindBody(){
    document.querySelectorAll('[data-body-slider]').forEach(el=>el.oninput=()=>{const kind=el.dataset.bodyKind,k=el.dataset.bodySlider;state[kind].bodyDetail={...(state[kind].bodyDetail||BODY_PROFILES[state[kind].body]),[k]:+el.value};save();oldRender()});
    document.querySelectorAll('[data-body-reset]').forEach(el=>el.onclick=()=>{const kind=el.dataset.bodyReset;state[kind].bodyDetail={...BODY_PROFILES[state[kind].body]};save();oldRender()});
  }
  document.addEventListener('click',e=>{const el=e.target.closest('[data-model][data-field="body"]');if(!el)return;const kind=el.dataset.model,value=el.dataset.value;if(value==='상관없음')return;setTimeout(()=>{state[kind].bodyDetail={...BODY_PROFILES[value]};save();oldRender()},0)},true);
  const baseAvatar=avatar;
  avatar=function(model,extraClass=''){
    let html=baseAvatar(model,extraClass);const d=model.bodyDetail||BODY_PROFILES[model.body]||BODY_PROFILES['보통'];
    const gender=model.gender==='남성';
    const shoulder=gender?96+d.shoulder*.68:82+d.shoulder*.58;
    const chest=gender?82+d.shoulder*.55:78+d.shoulder*.43;
    const waist=52+d.waist*.55;
    const hips=(gender?66:68)+d.hips*.62;
    const leg=22+d.hips*.19;
    const muscle=(d.muscle-50)/100;
    const style=`--shoulder:${shoulder.toFixed(1)}px;--chest:${chest.toFixed(1)}px;--waist:${waist.toFixed(1)}px;--hips:${hips.toFixed(1)}px;--leg:${leg.toFixed(1)}px;--muscle:${muscle.toFixed(2)}`;
    return html.replace('class="real-person ',`style="${style}" class="real-person body-custom `);
  };
  oldRender();
})();