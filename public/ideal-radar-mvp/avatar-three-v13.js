(() => {
  const MODEL_URLS={
    '여성':'https://raw.githubusercontent.com/privacypuppet/privacypuppet/main/public/mpfb_models/yuki-v2.glb',
    '남성':'https://raw.githubusercontent.com/privacypuppet/privacypuppet/main/public/mpfb_models/liam-v2.glb'
  };
  const HAIR_COLORS=['#29231f','#5a382b','#9b6547','#87271d','#d9c28f','#8e807c','#e69aac'];
  const OUTFIT_COLORS={캐주얼:'#d9d4cf',미니멀:'#c9c9ce',스트릿:'#817792',포멀:'#383339'};
  const BODY_SCALE={슬림:.93,보통:1,탄탄:1.07,볼륨감:1.12};
  const HEIGHT_SCALE={'아담한 편':.94,'평균':1,'큰 편':1.06,'상관없음':1};
  const HAIR_STYLE={
    '중간 길이':'medium','긴 머리':'long','웨이브':'wave','히피펌':'hippie','짧은 머리':'bob','숏컷':'short','포니테일':'pony','똥머리':'bun','상관없음':'medium'
  };
  const ENGINE={mods:null,renderer:null,scene:null,camera:null,controls:null,model:null,modelGender:null,hairGroup:null,raf:0,host:null,loading:false,fit:{height:2,centerY:1}};
  let wrapped=false;

  function currentKind(){return state.screen==='self'?'self':'ideal'}
  function currentModel(kind){return kind==='ideal'?state.ideal:state.self}
  function actual(model,field,fallback){return model[field]==='상관없음'?fallback:model[field]}
  function currentLook(kind){return state.avatarLook?.[kind]||{hairColor:0,bangs:'없음'}}

  async function loadModules(){
    if(ENGINE.mods)return ENGINE.mods;
    const [THREE,loaderMod,controlsMod]=await Promise.all([
      import('https://cdn.jsdelivr.net/npm/three@0.180.0/+esm'),
      import('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js/+esm'),
      import('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js/+esm')
    ]);
    ENGINE.mods={THREE,GLTFLoader:loaderMod.GLTFLoader,OrbitControls:controlsMod.OrbitControls};
    return ENGINE.mods;
  }

  function ensureRenderer(host){
    const {THREE,OrbitControls}=ENGINE.mods;
    if(!ENGINE.renderer){
      ENGINE.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
      ENGINE.renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
      ENGINE.renderer.outputColorSpace=THREE.SRGBColorSpace;
      ENGINE.renderer.toneMapping=THREE.ACESFilmicToneMapping;
      ENGINE.renderer.toneMappingExposure=1.02;
      ENGINE.renderer.shadowMap.enabled=true;
      ENGINE.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
      ENGINE.scene=new THREE.Scene();
      ENGINE.camera=new THREE.PerspectiveCamera(30,1,.01,100);
      ENGINE.camera.position.set(0,1.25,4.4);
      ENGINE.controls=new OrbitControls(ENGINE.camera,ENGINE.renderer.domElement);
      ENGINE.controls.enableDamping=true;
      ENGINE.controls.dampingFactor=.06;
      ENGINE.controls.enablePan=false;
      ENGINE.controls.minPolarAngle=Math.PI*.28;
      ENGINE.controls.maxPolarAngle=Math.PI*.72;
      ENGINE.controls.minDistance=2.4;
      ENGINE.controls.maxDistance=6.4;
      ENGINE.controls.target.set(0,1.08,0);
      const hemi=new THREE.HemisphereLight(0xffffff,0xb7bac1,2.35);ENGINE.scene.add(hemi);
      const key=new THREE.DirectionalLight(0xfff7f2,4.6);key.position.set(3,5,4);key.castShadow=true;ENGINE.scene.add(key);
      const fill=new THREE.DirectionalLight(0xe5ebff,2.7);fill.position.set(-4,2,3);ENGINE.scene.add(fill);
      const rim=new THREE.DirectionalLight(0xffe9e1,1.6);rim.position.set(1,3,-4);ENGINE.scene.add(rim);
      const floor=new THREE.Mesh(new THREE.CircleGeometry(2.1,64),new THREE.ShadowMaterial({color:0x4c4e55,opacity:.14}));floor.rotation.x=-Math.PI/2;floor.position.y=-.005;floor.receiveShadow=true;ENGINE.scene.add(floor);
      animate();
    }
    ENGINE.host=host;
    if(ENGINE.renderer.domElement.parentNode!==host){host.innerHTML='';host.appendChild(ENGINE.renderer.domElement)}
    resize();
  }

  function resize(){
    if(!ENGINE.host||!ENGINE.renderer)return;
    const r=ENGINE.host.getBoundingClientRect();
    if(r.width<2||r.height<2)return;
    ENGINE.renderer.setSize(r.width,r.height,false);
    ENGINE.camera.aspect=r.width/r.height;ENGINE.camera.updateProjectionMatrix();
  }

  function animate(){
    cancelAnimationFrame(ENGINE.raf);
    const tick=()=>{
      ENGINE.raf=requestAnimationFrame(tick);
      if(!ENGINE.renderer||!ENGINE.scene||!ENGINE.camera)return;
      ENGINE.controls?.update();
      ENGINE.renderer.render(ENGINE.scene,ENGINE.camera);
    };
    tick();
  }

  function disposeObject(root){
    if(!root)return;
    root.traverse(o=>{
      if(o.geometry)o.geometry.dispose?.();
      const mats=Array.isArray(o.material)?o.material:[o.material];
      mats.filter(Boolean).forEach(m=>{Object.values(m).forEach(v=>v&&v.isTexture&&v.dispose?.());m.dispose?.()});
    });
    root.removeFromParent();
  }

  async function loadAvatar(gender){
    if(ENGINE.modelGender===gender&&ENGINE.model)return ENGINE.model;
    ENGINE.loading=true;
    disposeObject(ENGINE.model);ENGINE.model=null;ENGINE.modelGender=null;
    disposeObject(ENGINE.hairGroup);ENGINE.hairGroup=null;
    const {THREE,GLTFLoader}=ENGINE.mods;
    const loader=new GLTFLoader();
    const gltf=await new Promise((resolve,reject)=>loader.load(MODEL_URLS[gender],resolve,undefined,reject));
    const model=gltf.scene;
    model.traverse(o=>{
      if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(o.material){o.material=o.material.clone();if('envMapIntensity' in o.material)o.material.envMapIntensity=.65}}
    });
    ENGINE.scene.add(model);
    const box=new THREE.Box3().setFromObject(model),size=new THREE.Vector3(),center=new THREE.Vector3();box.getSize(size);box.getCenter(center);
    const baseHeight=Math.max(size.y,.001);const targetHeight=2.82;const s=targetHeight/baseHeight;
    model.scale.setScalar(s);
    const box2=new THREE.Box3().setFromObject(model),center2=new THREE.Vector3(),size2=new THREE.Vector3();box2.getCenter(center2);box2.getSize(size2);
    model.position.x-=center2.x;model.position.z-=center2.z;model.position.y-=box2.min.y;
    ENGINE.fit={height:size2.y,centerY:size2.y*.52};
    ENGINE.model=model;ENGINE.modelGender=gender;ENGINE.loading=false;
    ENGINE.camera.position.set(0,1.25,4.15);ENGINE.controls.target.set(0,1.25,0);ENGINE.controls.update();
    return model;
  }

  function materialName(o){return `${o.name||''} ${o.material?.name||''}`.toLowerCase()}
  function setMaterialColor(mat,color,amount=.72){
    if(!mat?.color)return;const {THREE}=ENGINE.mods;const target=new THREE.Color(color);mat.color.lerp(target,amount);mat.needsUpdate=true;
  }
  function applyModelStyling(kind){
    if(!ENGINE.model)return;
    const m=currentModel(kind),look=currentLook(kind);
    const body=actual(m,'body','보통'),height=actual(m,'height','평균'),fashion=actual(m,'fashion','캐주얼');
    const bx=BODY_SCALE[body]||1,hy=HEIGHT_SCALE[height]||1;
    ENGINE.model.scale.x=Math.abs(ENGINE.model.scale.x)*bx;
    ENGINE.model.scale.z=Math.abs(ENGINE.model.scale.z)*(body==='탄탄'?1.025:body==='볼륨감'?1.04:1);
    ENGINE.model.scale.y=Math.abs(ENGINE.model.scale.y)*hy;
    const outfit=OUTFIT_COLORS[fashion]||OUTFIT_COLORS.캐주얼;
    ENGINE.model.traverse(o=>{
      if(!o.isMesh||!o.material)return;
      const name=materialName(o);
      if(/hair|brow|lash/.test(name)){o.visible=false;return}
      if(/cloth|shirt|top|pant|jean|skirt|dress|shoe|boot|sneaker|outfit|jacket/.test(name)){
        (Array.isArray(o.material)?o.material:[o.material]).forEach(mat=>setMaterialColor(mat,outfit,.42));
      }
      if(o.morphTargetDictionary&&o.morphTargetInfluences){
        Object.keys(o.morphTargetDictionary).forEach(k=>{const idx=o.morphTargetDictionary[k];if(idx==null)return;if(/smile/i.test(k))o.morphTargetInfluences[idx]=m.face==='웃는 인상'?.42:0;if(/brow.*down|frown/i.test(k))o.morphTargetInfluences[idx]=m.face==='도회적인 인상'?.12:0});
      }
    });
    createHair(kind);
  }

  function createHair(kind){
    disposeObject(ENGINE.hairGroup);ENGINE.hairGroup=null;
    const {THREE}=ENGINE.mods,m=currentModel(kind),look=currentLook(kind),style=HAIR_STYLE[actual(m,'hair','중간 길이')]||'medium';
    const color=new THREE.Color(HAIR_COLORS[look.hairColor]||HAIR_COLORS[0]);
    const mat=new THREE.MeshPhysicalMaterial({color,roughness:.42,metalness:.02,clearcoat:.15,clearcoatRoughness:.72});
    const g=new THREE.Group();g.name='IdealRadarHair';
    const y=2.53;const z=-.005;
    const cap=new THREE.Mesh(new THREE.SphereGeometry(.205,40,30,0,Math.PI*2,0,Math.PI*.68),mat);cap.scale.set(1.02,1.02,.96);cap.position.set(0,y,z);g.add(cap);
    const addLock=(x,yy,zz,rx,ry,rz,sx,sy,sz)=>{const mesh=new THREE.Mesh(new THREE.CapsuleGeometry(.055,.42,8,16),mat);mesh.position.set(x,yy,zz);mesh.rotation.set(rx,ry,rz);mesh.scale.set(sx,sy,sz);g.add(mesh)};
    if(style==='short'){addLock(.13,2.48,.01,0,0,.25,.8,.45,.75);addLock(-.13,2.48,.01,0,0,-.25,.8,.45,.75)}
    if(style==='bob'){addLock(.18,2.36,.01,0,0,.06,1,1.0,1);addLock(-.18,2.36,.01,0,0,-.06,1,1.0,1)}
    if(style==='medium'||style==='wave'||style==='hippie'){[-.2,-.13,.13,.2].forEach((x,i)=>addLock(x,2.25,.01,0,0,(i<2?-1:1)*(style==='wave'?0.18:0.06),style==='hippie'?1.15:1,style==='medium'?.95:1.25,1))}
    if(style==='long'){[-.21,-.15,.15,.21].forEach((x,i)=>addLock(x,2.08,.02,0,0,(i<2?-1:1)*.05,1.02,1.6,1))}
    if(style==='pony'){const pony=new THREE.Mesh(new THREE.CapsuleGeometry(.08,.52,10,18),mat);pony.position.set(.19,2.30,-.12);pony.rotation.z=-.18;g.add(pony);addLock(.15,2.38,.01,0,0,.1,.9,.8,.9);addLock(-.15,2.38,.01,0,0,-.1,.9,.8,.9)}
    if(style==='bun'){const bun=new THREE.Mesh(new THREE.SphereGeometry(.13,32,20),mat);bun.position.set(0,2.76,-.03);g.add(bun);addLock(.15,2.38,.01,0,0,.1,.9,.75,.9);addLock(-.15,2.38,.01,0,0,-.1,.9,.75,.9)}
    if(style==='wave'||style==='hippie')g.children.forEach((c,i)=>{if(c!==cap)c.rotation.y=(i%2?1:-1)*.13});
    if(look.bangs!=='없음'){
      const bang=new THREE.Mesh(new THREE.BoxGeometry(.32,.13,.05,4,2,1),mat);bang.position.set(0,2.55,.18);bang.rotation.x=-.12;if(look.bangs==='시스루')bang.scale.x=.82;if(look.bangs==='가르마'){bang.geometry.dispose();bang.geometry=new THREE.TorusGeometry(.13,.025,10,24,Math.PI);bang.rotation.set(0,0,Math.PI);bang.position.y=2.56}if(look.bangs==='풀뱅')bang.scale.y=1.18;g.add(bang)
    }
    ENGINE.hairGroup=g;ENGINE.scene.add(g);
  }

  function buildStage(host,kind){
    const old=host.querySelector('.photo-avatar-scene');
    host.classList.add('three-enabled');
    const fallback=document.createElement('div');fallback.className='three-avatar-fallback';if(old){fallback.appendChild(old.cloneNode(true));old.remove()}
    host.innerHTML='';
    const threeHost=document.createElement('div');threeHost.className='three-avatar-host';
    const loading=document.createElement('div');loading.className='three-avatar-loading';loading.innerHTML='<i></i><span>3D 아바타 불러오는 중</span>';
    const zoom=document.createElement('div');zoom.className='three-avatar-zoom';zoom.innerHTML='<button type="button" data-three-zoom="in">＋</button><span></span><button type="button" data-three-zoom="out">−</button>';
    const note=document.createElement('div');note.className='three-avatar-note';note.textContent='드래그해서 돌려보세요';
    const badge=document.createElement('div');badge.className='three-avatar-badge';badge.textContent='REAL 3D';
    host.append(fallback,threeHost,loading,zoom,note,badge);
    zoom.querySelector('[data-three-zoom="in"]').onclick=()=>{ENGINE.camera.position.multiplyScalar(.9);ENGINE.controls.update()};
    zoom.querySelector('[data-three-zoom="out"]').onclick=()=>{ENGINE.camera.position.multiplyScalar(1.1);ENGINE.controls.update()};
    return {threeHost,loading,fallback};
  }

  async function mount3D(kind){
    const host=document.querySelector('.reference-avatar');if(!host)return;
    const ui=buildStage(host,kind);
    try{
      await loadModules();ensureRenderer(ui.threeHost);
      await loadAvatar(currentModel(kind).gender);
      applyModelStyling(kind);resize();
      ui.threeHost.classList.add('ready');ui.loading.remove();
      window.removeEventListener('resize',resize);window.addEventListener('resize',resize,{passive:true});
    }catch(err){console.error('3D avatar failed',err);ui.loading.className='three-avatar-error';ui.loading.textContent='3D 로딩 실패 · 기본 프리뷰로 표시 중';}
  }

  function wrapAvatarEditor(){
    if(wrapped)return;wrapped=true;
    const previous=avatarEditor;
    avatarEditor=function(kind){previous(kind);setTimeout(()=>mount3D(kind),0)};
    render();
  }
  wrapAvatarEditor();
})();