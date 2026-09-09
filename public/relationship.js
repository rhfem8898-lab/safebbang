// Dugeun relationship layer: Pulse is a one-time relationship trigger, never a live location state.
let pulseState={enabled:false,has_pulse:false},mutualConnections=[];
async function loadRelationshipLayer(){
  try{pulseState=await rpc('dugeun_pulse_state')||{enabled:false,has_pulse:false}}catch{pulseState={enabled:false,has_pulse:false}}
  try{mutualConnections=await rpc('dugeun_mutual_connections')||[]}catch{mutualConnections=[]}
}
async function setPulseEnabled(enabled){
  try{await rpc('dugeun_set_pulse_enabled',{p_enabled:enabled});await loadRelationshipLayer();setNotice(enabled?'두근을 켰어요. 위치나 거리는 화면에 표시하지 않아요.':'두근을 껐어요.')}catch(e){setNotice(e.message,'error')}
}
async function setRevealConsent(other,consent){
  try{let d=await rpc('dugeun_set_reveal_consent',{p_other:other,p_consent:consent});await loadRelationshipLayer();setNotice(d?.revealed?'두 사람 모두 동의했어요. 이제 서로를 확인할 수 있어요.':consent?'내 선택을 저장했어요. 상대가 동의했는지는 알려주지 않아요.':'정체 확인 동의를 취소했어요.')}catch(e){setNotice(e.message,'error')}
}
function pulsePanel(){
  if(!status?.outgoing_count&&!status?.has_incoming&&!status?.has_mutual)return '';
  return `<div class="card"><div class="row"><div><div class="name">두근</div><div class="small">현실에서 다시 마주치는 순간만 알려줘요.<br>거리 · 방향 · 현재 위치는 보여주지 않아요.</div></div><span class="tag">${pulseState.enabled?'켜짐':'꺼짐'}</span></div>${pulseState.has_pulse?'<div class="pulse" style="margin-top:18px">♥</div><p><b>누군가의 마음이 가까워졌어요.</b></p><p class="muted">누구인지 추적할 수 있는 정보는 제공하지 않아요.</p>':`<button class="btn ${pulseState.enabled?'secondary':''}" onclick="setPulseEnabled(${!pulseState.enabled})">${pulseState.enabled?'두근 끄기':'두근 켜기'}</button>`}</div>`
}
function mutualPanel(){
  if(!status?.has_mutual)return '';
  let rows=mutualConnections.map(c=>`<div class="card"><div class="name">${c.revealed?esc(c.name):'서로의 마음이 같아요'}</div>${c.revealed?`<p class="muted">${esc(c.school)} · ${esc(c.grade)}</p><p>이제 앱보다 현실에서 이어가도 좋아요.</p>`:`<p class="muted">정체 확인은 두 사람이 각각 원할 때만 열려요.<br>상대가 동의했는지는 두 사람 모두 동의하기 전까지 알려주지 않아요.</p><button class="btn ${c.reveal_me?'secondary':''}" onclick="setRevealConsent('${c.other_user}',${!c.reveal_me})">${c.reveal_me?'정체 확인 동의 취소':'정체 확인에 동의하기'}</button>`}</div>`).join('');
  return `<div class="hero"><h1 style="font-size:22px">서로</h1></div>${rows||'<div class="card muted">서로의 마음을 확인하고 있어요.</div>'}`
}
// Extend existing refresh without changing the original MVP modules.
const baseRefresh=refresh;
refresh=async function(){await Promise.all([baseRefresh(),loadRelationshipLayer()])};
const baseHome=home;
home=function(){let original=baseHome();let insert=pulsePanel()+mutualPanel();return original.replace('<button class="btn" onclick="go(\'find\')">사람 찾기</button>',insert+'<button class="btn" onclick="go(\'find\')">사람 찾기</button>')};
const baseMe=me;
me=function(){let original=baseMe();return original.replace('<button class="btn secondary" onclick="refresh().then(render)">상태 새로고침</button>',pulsePanel()+'<button class="btn secondary" onclick="refresh().then(render)">상태 새로고침</button>')};