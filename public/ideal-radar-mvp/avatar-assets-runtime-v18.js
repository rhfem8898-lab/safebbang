(() => {
  const assets=window.IDEAL_RADAR_ASSETS||{};
  function currentKind(){return state.screen==='self'?'self':'ideal'}
  function currentModel(){return currentKind()==='self'?state.self:state.ideal}
  function apply(){
    if(!document.querySelector('.v17-builder'))return;
    const model=currentModel();
    const src=assets[model.hair];
    const hero=document.querySelector('.v17-master .approved-avatar-image');
    if(hero&&src){
      hero.style.backgroundImage=`url("${src}")`;
      hero.style.backgroundSize='contain';
      hero.style.backgroundPosition='center bottom';
      hero.style.backgroundRepeat='no-repeat';
      hero.style.width='100%';
      hero.style.height='100%';
      hero.style.left='0';
      hero.style.bottom='0';
      hero.style.transform='none';
    }
    document.querySelectorAll('.v17-option[data-field="hair"]').forEach(btn=>{
      const value=btn.dataset.value;
      const thumb=btn.querySelector('.v17-thumb');
      const img=assets[value];
      if(thumb&&img){
        thumb.style.backgroundImage=`url("${img}")`;
        thumb.style.backgroundSize='cover';
        thumb.style.backgroundPosition='center 18%';
        thumb.style.backgroundRepeat='no-repeat';
        thumb.classList.add('real-asset');
      }
    });
  }
  const observer=new MutationObserver(()=>requestAnimationFrame(apply));
  observer.observe(document.querySelector('#app'),{childList:true,subtree:true});
  window.addEventListener('load',apply);
  requestAnimationFrame(apply);
})();