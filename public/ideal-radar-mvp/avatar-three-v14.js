(() => {
  const MODEL_URLS={
    '여성':'https://raw.githubusercontent.com/privacypuppet/privacypuppet/main/public/mpfb_models/yuki-v2.glb',
    '남성':'https://raw.githubusercontent.com/privacypuppet/privacypuppet/main/public/mpfb_models/liam-v2.glb'
  };
  const HAIR_COLORS=['#29231f','#5a382b','#9b6547','#87271d','#d9c28f','#8e807c','#e69aac'];
  const OUTFIT_COLORS={캐주얼:'#d9d4cf',미니멀:'#c9c9ce',스트릿:'#817792',포멀:'#383339'};
  const BODY={슬림:.93,보통:1,탄탄:1.07,볼륨감:1.12};
  const DEPTH={슬림:.96,보통:1,탄탄:1.035,볼륨감:1.055};
  const HEIGHT={'아담한 편':.94,'평균':1,'큰 편':1.06,'상관없음':1};
  const STYLE={'중간 길이':'medium','긴 머리':'long','웨이브':'wave','히피펌':'hippie','짧은 머리':'bob','숏컷':'short','포니테일':'pony','똥머리':'bun','상관없음':'medium'};
  const E={mods:null,renderer:null,scene:null,camera:null,controls:null,model:null,gender:null,hair:null,host:null,raf:0};
  let wrapped=false;
  const kindNow=()=>state.screen==='self'?'self':'ideal';
  const modelFor=k=>k==='ideal'?state.ideal:state.self;
  const val=(m,k,d)=>m[k]==='상관없음'?d:m[k];
  const lookFor=k=>state.avatarLook?.[k]||{hairColor:0,bangs:'없음'};

  async function modules(){
    if(E.mods)return E.mods;
    const [THREE,l,c]=await Promise.all([
      import('https://cdn.jsdelivr.net/npm/three@0.180.0/+esm'),
      import('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js/+esm'),
      import('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js/+esm')
    ]);
    E.mods={THREE,GLTFLoader:l.GLTFLoader,OrbitControls:c.OrbitControls};return E.mods;
  }
  function initRenderer(host){
    const {THREE,OrbitControls}=E.mods;
    if(!E.renderer){
      E.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
      E.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
      E.renderer.outputColorSpace=THREE.SRGBColorSpace;E.renderer.toneMapping=THREE.ACESFilmicToneMapping;E.renderer.toneMappingExposure=1.04;
      E.renderer.shadowMap.enabled=true;E.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
      E.scene=new THREE.Scene();E.camera=new THREE.PerspectiveCamera(29,1,.01,100);E.camera.position.set(0,1.28,4.15);
      E.controls=new OrbitControls(E.camera,E.renderer.domElement);E.controls.enableDamping=true;E.controls.dampingFactor=.055;E.controls.enablePan=false;E.controls.target.set(0,1.3,0);E.controls.minDistance=2.45;E.controls.maxDistance=6.2;E.controls.minPolarAngle=.65;E.controls.maxPolarAngle=2.15;
      E.scene.add(new THREE.HemisphereLight(0xffffff,0xaeb2bc,2.45));
      const key=new THREE.DirectionalLight(0xfff8f3,4.8);key.position.set(3.2,5,4);key.castShadow=true;E.scene.add(key);
      const fill=new THREE.DirectionalLight(0xe6ecff,2.6);fill.position.set(-4,2.5,3);E.scene.add(fill);
      const rim=new THREE.DirectionalLight(0xffe9df,1.8);rim.position.set(2,3,-4);E.scene.add(rim);
      const floor=new THREE.Mesh(new THREE.CircleGeometry(2.2,64),new THREE.ShadowMaterial({color:0x46484f,opacity:.13}));floor.rotation.x=-Math.PI/2;floor.position.y=-.006;floor.receiveShadow=true;E.scene.add(floor);
      loop();
    }
    E.host=host;if(E.renderer.domElement.parentNode!==host){host.innerHTML='';host.appendChild(E.renderer.domElement)}resize();
  }
  function resize(){if(!E.host||!E.renderer)return;const r=E.host.getBoundingClientRect();if(r.width<2||r.height<2)return;E.renderer.setSize(r.width,r.height,false);E.camera.aspect=r.width/r.height;E.camera.updateProjectionMatrix()}
  function loop(){cancelAnimationFrame(E.raf);const tick=()=>{E.raf=requestAnimationFrame(tick);E.controls?.update();E.renderer?.render(E.scene,E.camera)};tick()}
  function dispose(root){if(!root)return;root.traverse(o=>{o.geometry?.dispose?.();const mats=Array.isArray(o.material)?o.material:[o.material];mats.filter(Boolean).forEach(m=>m.dispose?.())});root.removeFromParent()}

  async function getModel(gender){
    if(E.model&&E.gender===gender)return E.model;
    dispose(E.model);dispose(E.hair);E.model=null;E.hair=null;E.gender=null;
    const {THREE,GLTFLoader}=E.mods;const gltf=await new Promise((ok,no)=>new GLTFLoader().load(MODEL_URLS[gender],ok,undefined,no));const model=gltf.scene;
    model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(o.material){o.material=o.material.clone();o.userData.baseColor=o.material.color?.clone?.()}}});E.scene.add(model);
    const box=new THREE.Box3().setFromObject(model),size=new THREE.Vector3();box.getSize(size);const s=2.82/Math.max(size.y,.001);model.scale.setScalar(s);model.userData.baseScale=s;
    const b2=new THREE.Box3().setFromObject(model),c2=new THREE.Vector3();b2.getCenter(c2);model.position.x-=c2.x;model.position.z-=c2.z;model.position.y-=b2.min.y;
    E.model=model;E.gender=gender;E.camera.position.set(0,1.28,4.15);E.controls.target.set(0,1.28,0);E.controls.update();return model;
  }
  function nameOf(o){return `${o.name||''} ${o.material?.name||''}`.toLowerCase()}
  function resetMaterials(){E.model?.traverse(o=>{if(!o.isMesh||!o.material)return;const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{if(o.userData.baseColor&&m.color)m.color.copy(o.userData.baseColor);m.needsUpdate=true});o.visible=true;if(o.morphTargetInfluences)o.morphTargetInfluences.fill(0)})}
  function tint(mat,color,amount){if(!mat?.color)return;const {THREE}=E.mods;mat.color.lerp(new THREE.Color(color),amount);mat.needsUpdate=true}
  function styleModel(kind){
    if(!E.model)return;const m=modelFor(kind),base=E.model.userData.baseScale||1;const body=val(m,'body','보통'),height=val(m,'height','평균'),fashion=val(m,'fashion','캐주얼');
    E.model.scale.set(base*(BODY[body]||1),base*(HEIGHT[height]||1),base*(DEPTH[body]||1));resetMaterials();
    E.model.traverse(o=>{if(!o.isMesh||!o.material)return;const n=nameOf(o);if(/hair/.test(n)){o.visible=false;return}if(/cloth|shirt|top|pant|jean|skirt|dress|shoe|boot|sneaker|outfit|jacket/.test(n)){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(x=>tint(x,OUTFIT_COLORS[fashion]||OUTFIT_COLORS.캐주얼,.46))}if(o.morphTargetDictionary&&o.morphTargetInfluences){Object.entries(o.morphTargetDictionary).forEach(([key,idx])=>{if(/smile/i.test(key)&&m.face==='웃는 인상')o.morphTargetInfluences[idx]=.38;if(/brow.*down|frown/i.test(key)&&m.face==='도회적인 인상')o.morphTargetInfluences[idx]=.1})}});makeHair(kind);
  }
  function makeHair(kind){
    dispose(E.hair);E.hair=null;const {THREE}=E.mods,m=modelFor(kind),look=lookFor(kind),style=STYLE[val(m,'hair','중간 길이')]||'medium',body=val(m,'body','보통'),height=val(m,'height','평균');
    const mat=new THREE.MeshPhysicalMaterial({color:new THREE.Color(HAIR_COLORS[look.hairColor]||HAIR_COLORS[0]),roughness:.38,metalness:.015,clearcoat:.18,clearcoatRoughness:.7});const g=new THREE.Group();g.name='IdealRadarHair';
    const cap=new THREE.Mesh(new THREE.SphereGeometry(.205,40,30,0,Math.PI*2,0,Math.PI*.7),mat);cap.position.set(0,2.53,0);cap.scale.set(1.03,1.02,.98);g.add(cap);
    const lock=(x,y,len,rz=.05,w=1)=>{const q=new THREE.Mesh(new THREE.CapsuleGeometry(.055*w,.34+len,8,16),mat);q.position.set(x,y,.005);q.rotation.z=rz;q.scale.z=.96;g.add(q)};
    if(style==='short'){lock(.12,2.48,.06,.18,.85);lock(-.12,2.48,.06,-.18,.85)}
    if(style==='bob'){lock(.17,2.37,.3,.04,1);lock(-.17,2.37,.3,-.04,1)}
    if(style==='medium'){lock(.18,2.29,.52,.05,1);lock(-.18,2.29,.52,-.05,1);lock(.11,2.25,.46,.02,.8);lock(-.11,2.25,.46,-.02,.8)}
    if(style==='long'){lock(.19,2.13,.84,.04,1.02);lock(-.19,2.13,.84,-.04,1.02);lock(.12,2.1,.76,.02,.8);lock(-.12,2.1,.76,-.02,.8)}
    if(style==='wave'||style==='hippie'){[-.2,-.13,.13,.2].forEach((x,i)=>lock(x,2.18,style==='hippie'?.76:.66,(i<2?-1:1)*(style==='hippie'?.17:.12),style==='hippie'?1.12:1))}
    if(style==='pony'){lock(.14,2.36,.28,.08,.9);lock(-.14,2.36,.28,-.08,.9);const p=new THREE.Mesh(new THREE.CapsuleGeometry(.085,.54,10,20),mat);p.position.set(.2,2.28,-.1);p.rotation.z=-.18;g.add(p)}
    if(style==='bun'){lock(.14,2.38,.2,.08,.9);lock(-.14,2.38,.2,-.08,.9);const b=new THREE.Mesh(new THREE.SphereGeometry(.13,30,20),mat);b.position.set(0,2.76,-.02);g.add(b)}
    if(look.bangs!=='없음'){let b;if(look.bangs==='가르마'){b=new THREE.Mesh(new THREE.TorusGeometry(.13,.024,10,28,Math.PI),mat);b.rotation.z=Math.PI;b.position.set(0,2.57,.18)}else{b=new THREE.Mesh(new THREE.BoxGeometry(.32,.12,.045,4,2,1),mat);b.position.set(0,2.56,.19);b.rotation.x=-.1;if(look.bangs==='시스루')b.scale.set(.82,.75,1);if(look.bangs==='풀뱅')b.scale.y=1.22}g.add(b)}
    const bx=BODY[body]||1,hy=HEIGHT[height]||1;g.scale.set(bx,hy,bx);E.hair=g;E.scene.add(g);
  }

  function stage(host){
    const old=host.querySelector('.photo-avatar-scene');host.classList.add('three-enabled');const fallback=document.createElement('div');fallback.className='three-avatar-fallback';if(old)fallback.appendChild(old.cloneNode(true));host.innerHTML='';
    const three=document.createElement('div');three.className='three-avatar-host';const loading=document.createElement('div');loading.className='three-avatar-loading';loading.innerHTML='<i></i><span>3D 아바타 불러오는 중</span>';const zoom=document.createElement('div');zoom.className='three-avatar-zoom';zoom.innerHTML='<button type="button" data-z="in">＋</button><span></span><button type="button" data-z="out">−</button>';const note=document.createElement('div');note.className='three-avatar-note';note.textContent='드래그해서 돌려보세요';const badge=document.createElement('div');badge.className='three-avatar-badge';badge.textContent='REAL 3D';host.append(fallback,three,loading,zoom,note,badge);return{three,loading,zoom}
  }
  async function mount(kind){const host=document.querySelector('.reference-avatar');if(!host)return;const u=stage(host);try{await modules();initRenderer(u.three);await getModel(modelFor(kind).gender);styleModel(kind);resize();u.three.classList.add('ready');u.loading.remove();u.zoom.querySelector('[data-z="in"]').onclick=()=>{E.camera.position.multiplyScalar(.9);E.controls.update()};u.zoom.querySelector('[data-z="out"]').onclick=()=>{E.camera.position.multiplyScalar(1.1);E.controls.update()};window.removeEventListener('resize',resize);window.addEventListener('resize',resize,{passive:true})}catch(err){console.error(err);u.loading.className='three-avatar-error';u.loading.textContent='3D 로딩 실패 · 기본 프리뷰 사용 중'}}
  function wrap(){if(wrapped)return;wrapped=true;const prev=avatarEditor;avatarEditor=function(kind){prev(kind);setTimeout(()=>mount(kind),0)};render()}
  wrap();
})();